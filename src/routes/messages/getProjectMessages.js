const express = require("express");
const Message = require("../../models/message/message");
const Project = require('../../models/projects/Project');
const User = require('../../models/User');

const router = express.Router();

// GET /api/messages/:projectId
router.get("/:projectId", async (req, res) => {
    try {
        const { projectId } = req.params;

        // Fetch messages
        const messages = await Message.find({ projectId }).sort({ createdAt: 1 });

        // Fetch project details
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Fetch client user
        const user = await User.findById(project.clientId);

        // Extract assigned staff names and group members
        const groupMembers = project.assignedStaff.map(staff => staff.name);

        // Add client user to group members if user exists
        if (user) {
            groupMembers.push(user.name);
        }

        // Extract files from messages
        const files = messages
            .filter(msg => msg.file)  // Filter messages that contain a file
            .map(msg => ({
                url: msg.file,  // Assuming 'file' is the URL to the file
                uploadedAt: msg.createdAt,
                fileName: msg.fileName || "File"  // Default to "File" if no fileName is provided
            }));

        // Sort files by uploadedAt (latest first)
        const sortedFiles = files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        // Take latest 6 files
        const latestFiles = sortedFiles.slice(0, 6);

        res.status(200).json({
            messages,
            project: {
                _id: project._id,
                name: project.projectName,
                client: user ? { _id: user._id, name: user.name, email: user.email } : null,
                groupMembers
            },
            files: {
                total: files.length,
                latest: latestFiles
            }
        });

    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
