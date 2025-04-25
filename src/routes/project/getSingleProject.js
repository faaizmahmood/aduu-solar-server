const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../../models/projects/Project");
const OrderService = require("../../models/services/orderService");
const Service = require("../../models/services/addServiceModel");
const Invoice = require("../../models/invoices/invoices");
const Staff = require("../../models/staff");
const userMiddleware = require('../../middlewares/userMiddleware');

// Get a single project by ID with its order and services
router.get("/:id", userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        // Role-based access control
        if (user.role === 'client') {
            const userId = new mongoose.Types.ObjectId(user.id);

            if (!project.clientId.equals(userId)) {
                return res.status(403).json({ success: false, message: "Unauthorized access." });
            }
        } else if (user.role === 'staff') {

            const staff = await Staff.findById(user.id);

            console.log('project.clientId:', project.clientId);
            console.log('user._id:', user.id);
            console.log('project.clientId.equals(user._id)?', project.clientId.equals(user.id));

            if (!staff || !staff.projectsAssigned.some(p => p.projectId.toString() === project._id.toString())) {
                return res.status(403).json({ success: false, message: "Unauthorized access." });
            }

        }

        // Fetch related data
        const [order, invoice, services] = await Promise.all([
            OrderService.findOne({ projectId: id }),
            Invoice.findOne({ projectId: id }),
            Service.find()
        ]);

        return res.status(200).json({
            success: true,
            message: "Project fetched successfully.",
            project: {
                ...project.toObject(),
                order: order || null,
            },
            services,
            invoice
        });

    } catch (error) {
        console.error("Error fetching single project:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
