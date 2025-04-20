const express = require("express");
const userMiddleware = require("../../../middlewares/userMiddleware");
const roleMiddleware = require("../../../middlewares/roleMiddleware");
const Service = require("../../../models/services/addServiceModel");

const router = express.Router();

// Get all services
router.get(
    "/",
    userMiddleware,
    roleMiddleware(["admin", "client"]),
    async (req, res) => {
        try {
            const allServices = await Service.find();

            return res.status(200).json({
                success: true,
                message: "Services retrieved successfully.",
                services: allServices,
            });

        } catch (error) {
            console.error("Error fetching services:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error. Please try again later.",
            });
        }
    }
);

module.exports = router;
