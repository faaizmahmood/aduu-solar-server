const express = require("express");
const router = express.Router();
const Project = require("../../models/projects/Project");
const OrderService = require("../../models/services/orderService");
const Service = require("../../models/services/addServiceModel");

router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        const orders = await OrderService.find();
        const services = await Service.find();

        // Merge projects with their corresponding orders
        const mergedProjects = projects.map(project => {
            const projectOrder = orders.find(order => order.projectId.toString() === project._id.toString());
            return {
                ...project.toObject(),
                order: projectOrder || null
            };
        });

        res.status(200).json({
            success: true,
            message: "Projects fetched successfully.",
            projects: mergedProjects,
            services: services,
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
