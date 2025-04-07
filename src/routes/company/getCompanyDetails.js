const express = require("express");
const Company = require("../../models/company");
const User = require("../../models/User");

const router = express.Router();

// GET Company Details with Associated Members and Owner Info
router.get("/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;

        // Fetch company details
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Fetch all users associated with this company
        const members = await User.find({ companyId });

        // Fetch company owner details
        const owner = await User.findById(company.ownerId).select("name email role");

        // Attach owner info to company object
        const companyWithOwner = {
            ...company.toObject(),
            owner: owner || null, // If owner not found, return null
        };

        res.status(200).json({
            company: companyWithOwner,
            members,
        });

    } catch (error) {
        console.error("Error fetching company details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
