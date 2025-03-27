const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        projectName: { type: String, required: true },
        siteAddress: { type: String, required: true },
        siteOwner: { type: String, required: true },
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null }, // If the user belongs to a company
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to the client creating it
        status: { type: String, enum: ["Pending", "Awaiting Assignment", "In Progress", "Completed"], default: "Pending" },
        description: { type: String, default: "" },
        assignedStaff: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, ref: "staff" },
                name: { type: String, required: true } // Store staff name
            }
        ],
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
