const express = require("express");
const Staff = require("../../models/staff");
const userMiddleware = require("../../middlewares/userMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

const router = express.Router();

// **GET /admin/all-staff** - Only Admins can get all staff members
router.get("/", userMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        // Disable caching by setting cache-control headers
        res.setHeader('Cache-Control', 'no-store');

        const staff = await Staff.find().sort({ createdAt: -1 });

        res.status(200).json({ staff });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
