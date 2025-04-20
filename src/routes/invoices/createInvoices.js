const express = require("express");
const router = express.Router();
const Invoice = require("../../models/invoices/invoices");
const Order = require("../../models/services/orderService");
const Project = require("../../models/projects/Project");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

router.post("/", userMiddleware, roleMiddleware(["client"]), async (req, res) => {
    try {
        const { orderId, clientId, projectId, companyId, totalAmount, services, status, dueDate, paidAt } = req.body;

        console.log("Invoice request body:", req.body);

        // Validate request data
        if (!orderId || !clientId || !projectId || !totalAmount || !services || !Array.isArray(services)) {
            return res.status(400).json({ success: false, message: "Invalid invoice data." });
        }

        // Check if order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        // Check if an invoice already exists for this order
        const existingInvoice = await Invoice.findOne({ orderId });
        if (existingInvoice) {
            return res.status(400).json({ success: false, message: "An invoice for this order already exists." });
        }

        // Fetch project and verify existence
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        // Create a new invoice
        const invoice = new Invoice({
            orderId,
            clientId,
            projectId,
            companyId,
            totalAmount,
            services,
            status: status || "Pending Payment",
            dueDate,
            paidAt
        });

        await invoice.save();

        res.status(201).json({ success: true, message: "Invoice created successfully.", invoice });
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
