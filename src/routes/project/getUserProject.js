const express = require("express");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const Project = require("../../models/projects/Project");
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
            // If user belongs to a company, fetch projects of that company
            projects = await Project.find({ companyId: user.companyId });
        } else {
            // Otherwise, fetch only projects associated with the user
            projects = await Project.find({ clientId: userId });
        }

        if (!projects.length) {
            return res.status(404).json({ message: "No projects found." });
        }

        res.status(200).json({ projects });

    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
