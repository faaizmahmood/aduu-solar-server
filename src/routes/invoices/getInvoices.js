const express = require("express");
const router = express.Router();
const Invoice = require("../../models/invoices/invoices");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const mongoose = require('mongoose');

// ✅ Get Invoices for a Client (Including Their Company Invoices)
router.get("/get-invoices/:userId", userMiddleware, roleMiddleware(["client"]), async (req, res) => {
    try {
        const { userId } = req.params;
        const user = req.user;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID." });
        }

        let query = { clientId: userId };

        if (user.companyId) {
            query = { $or: [{ clientId: userId }, { companyId: user.companyId }] };
        }

        const invoices = await Invoice.find(query).sort({ createdAt: -1 });

        if (invoices.length === 0) {
            return res.status(404).json({ success: false, message: "No invoices found." });
        }

        res.status(200).json({ success: true, invoices });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({ success: false, message: "Failed to fetch invoices." });
    }
});

// ✅ Get All Invoices for Admin
router.get("/get-invoices", userMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });

        if (invoices.length === 0) {
            return res.status(404).json({ success: false, message: "No invoices found." });
        }

        res.status(200).json({ success: true, invoices });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({ success: false, message: "Failed to fetch invoices." });
    }
});

module.exports = router;
