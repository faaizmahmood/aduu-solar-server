// src/routes/dashboard/dashboard.js

const express = require('express');
const router = express.Router();

const userMiddleware = require('../../middlewares/userMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

// Import individual dashboard routes
const adminRouter = require('./adminDashboard');   // Path: src/routes/dashboard/admin.js
const clientRouter = require('./clinetDashboard'); // Path: src/routes/dashboard/client.js
const staffRouter = require('./staffDashboard');   // Path: src/routes/dashboard/staff.js

// All dashboard routes require authentication
router.use(userMiddleware);

// Combine all dashboard routes under one parent route
// Role-based routes
router.use('/admin', roleMiddleware('admin'), adminRouter);
router.use('/client', roleMiddleware('client'), clientRouter);
router.use('/staff', roleMiddleware('staff'), staffRouter);

module.exports = router;
