const express = require("express");
const Company = require("../../models/company");
const User = require("../../models/User");

const router = express.Router();

router.post("/companies-register", async (req, res) => {
    const { companyName, companyAddress, ownerId } = req.body;

    if (!companyName || !companyAddress || !ownerId) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Ensure the owner exists
        const owner = await User.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found." });
        }

        // Create Company
        const company = new Company({ companyName: companyName, address: companyAddress, ownerId });
        await company.save();

        // Update User with Company ID
        owner.companyId = company._id;
        await owner.save();

        res.status(201).json({
            message: "Company registered successfully.",
            companyId: company._id,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;
