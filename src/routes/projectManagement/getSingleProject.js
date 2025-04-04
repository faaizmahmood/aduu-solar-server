const express = require("express");
const router = express.Router();
const Project = require("../../models/projects/Project");
const OrderService = require("../../models/services/orderService");
const Service = require("../../models/services/addServiceModel");
const Invoice = require("../../models/invoices/invoices");

// Get a single project by ID with its order and services
router.get("/get-single-project/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the project by ID
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        // Find the order associated with this project
        const order = await OrderService.findOne({ projectId: id });

        // Find the Invoice associated with this project
        const invocie = await Invoice.findOne({ projectId: id });

        // Fetch all available services (optional, depends on requirement)
        const services = await Service.find();

        res.status(200).json({
            success: true,
            message: "Project fetched successfully.",
            project: {
                ...project.toObject(),
                order: order || null,
            },
            services: services,
            invocie: invocie
        });
    } catch (error) {
        console.error("Error fetching single project:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
