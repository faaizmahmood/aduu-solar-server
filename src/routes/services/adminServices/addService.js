const express = require("express");
const userMiddleware = require("../../../middlewares/userMiddleware");
const roleMiddleware = require("../../../middlewares/roleMiddleware");
const Service = require("../../../models/services/addServiceModel");

const router = express.Router();

// Add a new service
router.post(
    "/add-service",
    userMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            const { serviceName, defaultPrice, intakeForm } = req.body;

            // Validate request body
            if (!serviceName || !defaultPrice || !intakeForm || !Array.isArray(intakeForm) || intakeForm.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required, and intakeForm must contain at least one field.",
                });
            }

            // Create a new service
            const newService = new Service({
                serviceName,
                defaultPrice,
                intakeForm,
            });

            await newService.save();

            return res.status(201).json({
                success: true,
                message: "Service added successfully.",
                data: newService,
            });

        } catch (error) {
            console.error("Error adding service:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error. Please try again later.",
            });
        }
    }
);

module.exports = router;
