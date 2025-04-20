const express = require("express");
const Message = require("../../models/message/message");

const router = express.Router();

// GET /api/messages/:projectId
router.get("/:projectId", async (req, res) => {
    try {
        const messages = await Message.find({ projectId: req.params.projectId })
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
