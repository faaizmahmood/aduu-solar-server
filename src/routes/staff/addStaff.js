const express = require("express");
const Staff = require("../../models/staff");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

const router = express.Router();

// **POST /admin/add-staff** - Only Admins can add staff
router.post("/add-staff", userMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    const { name, email, password, workingRole, phone, status } = req.body;


    console.log(req.body)

    // **Validate Inputs**
    if (!name || !email || !password || !workingRole) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // **Check if user already exists**
        let existingUser = await Staff.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // **Create New Staff**
        const staffUser = new Staff({
            name,
            email,
            password,
            role: "staff",
            createdBy: req.user.id,
            phone,
            status
        });

        await staffUser.save();

        res.status(201).json({
            message: "Staff member added successfully.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;
