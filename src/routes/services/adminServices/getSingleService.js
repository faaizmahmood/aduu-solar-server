const express = require("express");
const userMiddleware = require("../../../middlewares/userMiddleware");
const roleMiddleware = require("../../../middlewares/roleMiddleware");
const Service = require("../../../models/services/addServiceModel");

const router = express.Router();

// Get Single services
router.get(
    "/get-service/:serviceId",
    userMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {

        const { serviceId } = req.params;

        try {
            const SignleServices = await Service.findOne({ _id: serviceId });

            return res.status(200).json({
                success: true,
                message: "Services retrieved successfully.",
                services: SignleServices,
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
