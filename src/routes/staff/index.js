const express = require("express");
const router = express.Router();

// Import routes
const addStaffRoutes = require("./addStaff");
const assignStaffRouter = require("./assignStaff");
const getStaffRouter = require("./getStaff");

router.use("/add-staff", addStaffRoutes);
router.use("/assign-staff", assignStaffRouter);
router.use("/all-staff", getStaffRouter);

module.exports = router;
