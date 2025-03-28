const express = require("express");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const Project = require("../../models/projects/Project");

const router = express.Router();

// Create a new project
router.post("/create-project", userMiddleware, roleMiddleware(["client"]), async (req, res) => {
    try {
        const { projectName, siteAddress, siteOwner, description, companyId } = req.body;
        const clientId = req.user.id; // Extract client ID from authenticated user

        if (!projectName || !siteAddress || !siteOwner) {
            return res.status(400).json({ message: "Project name, site address, and site owner are required." });
        }

        const newProject = new Project({
            projectName,
            siteAddress,
            siteOwner,
            companyId: companyId || null, // If user has a company, link it
            clientId,
            description,
            status: "Pending",
            assignedStaff: [],
        });

        await newProject.save();

        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
