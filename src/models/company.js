const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: [true, "Company name is required"],
            trim: true
        },
        address: {
            type: String,
            required: [true, "Company address is required"],
            trim: true
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;
