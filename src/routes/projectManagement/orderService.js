const express = require("express");
const multer = require("multer");
const path = require("path");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const Order = require("../../models/order");
const Project = require("../../models/projects/Project");

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Create an order and upload files
router.post(
    "/order-service",
    userMiddleware,
    roleMiddleware(["client"]),
    upload.fields([
        { name: "planSet", maxCount: 1 },
        { name: "siteSurvey", maxCount: 1 },
        { name: "proposal", maxCount: 1 },
        { name: "shadeReport", maxCount: 1 },
        { name: "siteAssessment", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { projectId, selectedServices, ...formData } = req.body;
            const clientId = req.user.id;

            // Validate required fields
            if (!projectId || !selectedServices) {
                return res.status(400).json({ message: "Project ID and selected services are required." });
            }

            // Check if the project exists
            const project = await Project.findOne({ _id: projectId, clientId });

            if (!project) {
                return res.status(404).json({ message: "Project not found or not authorized." });
            }

            // Extract file paths
            const files = req.files;
            const fileUrls = {
                planSet: files.planSet ? `/uploads/${files.planSet[0].filename}` : null,
                siteSurvey: files.siteSurvey ? `/uploads/${files.siteSurvey[0].filename}` : null,
                proposal: files.proposal ? `/uploads/${files.proposal[0].filename}` : null,
                shadeReport: files.shadeReport ? `/uploads/${files.shadeReport[0].filename}` : null,
                siteAssessment: files.siteAssessment ? `/uploads/${files.siteAssessment[0].filename}` : null
            };

            // Create a new order
            const newOrder = new Order({
                projectId,
                clientId,
                selectedServices,
                formData,
                fileUrls,
            });

            await newOrder.save();

            // ✅ Update Project Status to "In Progress"
            await Project.findByIdAndUpdate(projectId, { status: "In Progress" });

            res.status(200).json({ message: "Order created successfully", order: newOrder });
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
);

module.exports = router;
