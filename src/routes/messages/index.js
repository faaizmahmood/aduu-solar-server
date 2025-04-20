const express = require("express");
const router = express.Router();

// Import individual invoice route handlers
const getProjectMessages = require("./getProjectMessages");

// Use them under desired paths
router.use("/", getProjectMessages);

module.exports = router;