const mongoose = require("mongoose");

const FormResponseSchema = new mongoose.Schema({
    fieldName: { type: String, required: true }, // Name of the form field
    fieldValue: { type: String, required: true } // Value submitted for the field
});

const ServiceResponseSchema = new mongoose.Schema({
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Services", required: true },
    serviceName: { type: String, required: true },
    formResponses: { type: [FormResponseSchema], default: [] } // Array of form responses
});

const OrderSchema = new mongoose.Schema(
    {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        companyId: { type: String, default: null },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Projects", required: true },
        services: { type: [ServiceResponseSchema], required: true } // Store selected services and form responses
    },
    { timestamps: true }
);

const OrderService = mongoose.model("Orders", OrderSchema);

module.exports = OrderService;
