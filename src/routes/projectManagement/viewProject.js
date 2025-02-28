const express = require("express");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const Project = require("../../models/Project");

const router = express.Router();

// Get projects created by the authenticated user
router.get("/client-projects", userMiddleware, roleMiddleware(["client"]), async (req, res) => {
    try {
        const clientId = req.user.id; // Extract client ID from authenticated user

        const projects = await Project.find({ clientId });

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
