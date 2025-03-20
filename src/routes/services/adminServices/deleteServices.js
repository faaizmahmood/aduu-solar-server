const express = require("express");
const mongoose = require("mongoose"); // Ensure mongoose is imported
const userMiddleware = require("../../../middlewares/userMiddleware");
const roleMiddleware = require("../../../middlewares/roleMiddleware");
const Service = require("../../../models/services/addServiceModel");

const router = express.Router();

// Delete a service
router.delete(
    "/delete-service/:serviceID",
    userMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            const { serviceID } = req.params;

            console.log("Received serviceID:", serviceID);

            // Check if serviceID is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(serviceID)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid service ID format.",
                });
            }

            const deletedService = await Service.findByIdAndDelete(serviceID);

            if (!deletedService) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Service deleted successfully.",
                deletedService,
            });

        } catch (error) {
            console.error("Error deleting service:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error. Please try again later.",
            });
        }
    }
);

module.exports = router;
