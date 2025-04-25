const express = require("express");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const Project = require("../../models/projects/Project");
const Message = require("../../models/message/message"); // Assuming you have a Message model
const User = require("../../models/User");

const router = express.Router();

// Get projects for the user (either company-wide or individual)
router.get("/", userMiddleware, roleMiddleware(["client"]), async (req, res) => {
    try {
        const userId = req.user.id; // Authenticated user ID

        // Fetch the user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        let projects;
        if (user.companyId) {
            // If user belongs to a company, fetch projects of that company (newest first)
            projects = await Project.find({ companyId: user.companyId }).sort({ createdAt: -1 });
        } else {
            // Otherwise, fetch only projects associated with the user (newest first)
            projects = await Project.find({ clientId: userId }).sort({ createdAt: -1 });
        }


        if (!projects.length) {
            return res.status(404).json({ message: "No projects found." });
        }

        // Add unreadMessageCount and lastReadAt to each project
        const enrichedProjects = await Promise.all(projects.map(async (project) => {
            // Fetch lastReadAt time for the specific project
            const lastRead = user.lastReadMessages.find(
                (entry) => entry.projectId.toString() === project._id.toString()
            );

            // Count unread messages for the project (messages created after lastReadAt)
            const unreadMessageCount = lastRead ? await Message.countDocuments({
                projectId: project._id,
                createdAt: { $gt: lastRead.lastReadAt } // messages after the last read time
            }) : 0;

            return {
                ...project.toObject(),
                lastReadAt: lastRead ? lastRead.lastReadAt : null,
                unreadMessageCount,
            };
        }));

        res.status(200).json({ projects: enrichedProjects });

    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
