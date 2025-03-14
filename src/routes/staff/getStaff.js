const express = require("express");
const Staff = require("../../models/staff");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

const router = express.Router();

// **GET /admin/all-staff** - Only Admins can get all staff members
router.get("/all-staff", userMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        // **Find all users with role "staff"**
        const staff = await Staff.find().sort({ createdAt: -1 });

        res.status(200).json({
            staff
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
