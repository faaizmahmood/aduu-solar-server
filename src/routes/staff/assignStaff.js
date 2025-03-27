const express = require("express");
const router = express.Router();
const Project = require("../../models/projects/Project");
const Staff = require("../../models/staff");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

// Assign multiple staff members to a project
router.post("/assign-staff", userMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        const { projectId, staffIds } = req.body;

        // Validate request
        if (!projectId || !Array.isArray(staffIds) || staffIds.length === 0) {
            return res.status(400).json({ message: "Project ID and staff IDs are required." });
        }

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        // Get already assigned staff
        const alreadyAssignedStaff = new Set(project.assignedStaff.map(id => id.toString()));

        // Filter out staff who are already assigned
        const newStaffIds = staffIds.filter(id => !alreadyAssignedStaff.has(id));

        if (newStaffIds.length === 0) {
            return res.status(400).json({ message: "Selected staff already assigned." });
        }

        // Fetch valid staff members who are active
        const staffMembers = await Staff.find({ _id: { $in: newStaffIds }, status: "Active" });

        if (staffMembers.length === 0) {
            return res.status(400).json({ message: "No valid active staff members found." });
        }

        const assignedStaffData = staffMembers.map(staff => ({
            _id: staff._id,
            name: staff.name, // Ensure name is stored
        }));

        project.assignedStaff.push(...assignedStaffData);

        project.status = "In Progress"; // Update status to In Progress

        await project.save();

        // ✅ Update each staff member's assigned projects array
        const projectDetails = { projectId: project._id, projectName: project.projectName };

        await Promise.all(
            staffMembers.map(async (staff) => {
                if (!staff.projectsAssigned) {
                    staff.projectsAssigned = [];
                }

                const alreadyAssigned = staff.projectsAssigned.some(p => p.projectId.toString() === projectId);
                if (!alreadyAssigned) {
                    staff.projectsAssigned.push(projectDetails);

                    // ✅ Increment totalProjects count
            staff.totalProjects += 1;

                    // ✅ Update staff status based on assigned projects count
                    if (staff.projectsAssigned.length >= 3) {
                        staff.status = "Busy";
                    } else {
                        staff.status = "Active";
                    }

                    await staff.save();
                }
            })
        );

        return res.status(200).json({
            message: "Staff assigned successfully!",
            assignedStaff: project.assignedStaff,
        });
    } catch (error) {
        console.error("Error assigning staff:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
