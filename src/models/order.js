const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    selectedServices: {
        type: [String], // Stores the names of selected services
        required: true
    },
    formData: {
        type: Map, // Dynamic key-value pair for storing additional form fields
        of: String
    },
    fileUrls: {
        type: Map, // Dynamic key-value pair for storing file paths
        of: String
    },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
