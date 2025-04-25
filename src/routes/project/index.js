const express = require("express");
const router = express.Router();

// Import route handlers (clean and meaningful names)
const createProject = require("./createProject");
const getAllProjects = require("./getAllProjects");
const getSingleProject = require("./getSingleProject");
const getUserProject = require("./getUserProject");
const getStaffProject = require("./getStaffProjects");
const orderService = require("./orderService");

// Mount the routes
router.use("/create-project", createProject);        // POST /create-project
router.use("/get-projects", getAllProjects);       // GET /get-projects
router.use("/get-single-project", getSingleProject);     // GET /get-project/:id
router.use("/client-projects", getUserProject);       // GET /get-user-projects
router.use("/staff-projects", getStaffProject);       // GET /get-staff-projects
router.use("/order-service", orderService);         // POST /order-service

module.exports = router;
