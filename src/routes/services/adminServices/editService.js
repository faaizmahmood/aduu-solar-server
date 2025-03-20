const express = require("express");
const userMiddleware = require("../../../middlewares/userMiddleware");
const roleMiddleware = require("../../../middlewares/roleMiddleware");
const Service = require("../../../models/services/addServiceModel");

const router = express.Router();

// Update service
router.put(
    "/update-service/:serviceId",
    userMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        const { serviceId } = req.params;
        const { serviceName, defaultPrice, intakeForm } = req.body;

        try {
            // Find the existing service by ID
            const existingService = await Service.findById({ _id: serviceId });

            if (!existingService) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found.",
                });
            }

            // Update fields
            existingService.serviceName = serviceName || existingService.serviceName;
            existingService.defaultPrice = defaultPrice || existingService.defaultPrice;
            existingService.intakeForm = intakeForm || existingService.intakeForm;

            // Save updated service
            const updatedService = await existingService.save();

            return res.status(200).json({
                success: true,
                message: "Service updated successfully.",
                service: updatedService,
            });

        } catch (error) {
            console.error("Error updating service:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error. Please try again later.",
            });
        }
    }
);

module.exports = router;
