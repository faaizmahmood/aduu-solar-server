const express = require("express");
const router = express.Router();

// Import individual invoice route handlers
const createInvoiceRoute = require("./createInvoices");
const getInvoicesRoute = require("./getInvoices");
const markAsPaidRoute = require("./markAsPaid");

// Use them under desired paths
router.use("/create-invoice", createInvoiceRoute);     // POST /create-invoice
router.use("/", getInvoicesRoute);       // GET /get-invoices
router.use("/mark-as-paid", markAsPaidRoute);        // PUT /mark-as-paid/:invoiceId

module.exports = router;