const express = require("express");
const router = express.Router();
const Project = require("../../models/projects/Project"); // Import Project Model

router.get("/get-projects", async (req, res) => {
    try {

        const projects = await Project.find();

        res.status(200).json({
            success: true,
            message: "Order created successfully.",
            projects: projects
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;
