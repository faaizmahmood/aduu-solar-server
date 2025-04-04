const cron = require("node-cron");
const mongoose = require("mongoose");
const Invoice = require("../models/invoices/invoices"); // Adjust path if necessary

// Schedule the task to run every day at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("Checking for overdue invoices...");

    try {
        const now = new Date();
        // Find invoices where due date is past and status is still "Pending Payment"
        const overdueInvoices = await Invoice.find({
            dueDate: { $lt: now }, // Due date is in the past
            status: "Pending Payment",
        });

        if (overdueInvoices.length > 0) {
            await Invoice.updateMany(
                { _id: { $in: overdueInvoices.map(inv => inv._id) } },
                { $set: { status: "Overdue" } }
            );
            console.log(`Updated ${overdueInvoices.length} invoices to "Overdue" status.`);
        } else {
            console.log("No overdue invoices found.");
        }
    } catch (error) {
        console.error("Error updating overdue invoices:", error);
    }
});

