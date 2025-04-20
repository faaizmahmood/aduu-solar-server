const express = require("express");
const router = express.Router();

// Import all admin and user service routers
const addService = require("./admin/addService");
const deleteService = require("./admin/deleteServices");
const editService = require("./admin/editService");
const getService = require("./admin/getServices");
const getSingleService = require("./admin/getSingleService");

const orderService = require("./user/orderService");

// Grouping: Mount admin services under /admin
router.use("/add-service", addService);
router.use("/delete-service", deleteService);
router.use("/update-service", editService);
router.use("/get-service", getService);
router.use("/get-service", getSingleService);

// Grouping: Mount user services under /user
router.use("/order-service", orderService);

module.exports = router;
