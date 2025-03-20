const express = require("express");
const router = express.Router();
const Order = require("../../../models/services/orderService");
const Project = require("../../../models/projects/Project"); // Import Project Model

router.post("/order-service", async (req, res) => {
    try {
        const { clientId, companyId, projectId, services } = req.body;

        console.log("Request body:", req.body);

        if (!services || !Array.isArray(services)) {
            return res.status(400).json({ success: false, message: "Invalid services data." });
        }

        // ✅ Check if an order already exists for the project
        const existingOrder = await Order.findOne({ projectId });
        if (existingOrder) {
            return res.status(400).json({ success: false, message: "An order for this project already exists." });
        }

        // ✅ Fetch the project and update its status to "In Progress"
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }
        project.status = "Awaiting Assignment";
        await project.save();

        // ✅ Create Order (only if no existing order found)
        const order = new Order({
            clientId,
            companyId,
            projectId,
            services,
            status: "Pending",
        });

        await order.save();
        res.status(201).json({ success: true, message: "Order created successfully.", order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;
