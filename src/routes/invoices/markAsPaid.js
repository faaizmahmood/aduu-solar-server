const express = require("express");
const router = express.Router();
const Invoice = require("../../models/invoices/invoices");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const userMiddleware = require("../../middlewares/userMiddleware");

// Route to mark an invoice as paid (Admin only)
router.put("/:invoiceId", userMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        const { invoiceId } = req.params;

        // Find the invoice by ID
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found." });
        }

        // Check if invoice is already paid
        if (invoice.status === "Paid") {
            return res.status(400).json({ success: false, message: "Invoice is already marked as Paid." });
        }

        // Update invoice status to Paid
        invoice.status = "Paid";
        invoice.paidAt = new Date();
        await invoice.save();

        res.status(200).json({ success: true, message: "Invoice marked as Paid successfully.", invoice });
    } catch (error) {
        console.error("Error marking invoice as paid:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;