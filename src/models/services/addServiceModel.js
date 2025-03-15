const mongoose = require("mongoose");

const ServiceFieldSchema = new mongoose.Schema({
    label: { type: String, required: true },
    fieldType: { type: String, required: true },
    options: { type: String, default: null }, // Required only for select fields
    required: { type: Boolean, default: false },
});

const AddServiceSchema = new mongoose.Schema(   
    {  
        serviceName: { type: String, required: true },
        defaultPrice: { type: Number, required: true },
        serviceFields: { type: [ServiceFieldSchema], default: [] },
    },
    { timestamps: true }
);

const Service = mongoose.model("Services", AddServiceSchema);

module.exports = Service;
