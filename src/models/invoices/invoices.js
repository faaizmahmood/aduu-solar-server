const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
        services: [
            {
                serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
                serviceName: { type: String, required: true },
                price: { type: Number, required: true }
            }
        ],
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ["Pending Payment", "Paid", "Overdue"], default: "Pending Payment" },
        dueDate: { type: Date, required: true }, // Invoice due date
        paidAt: { type: Date, default: null }, // Date of payment
    },
    { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;
