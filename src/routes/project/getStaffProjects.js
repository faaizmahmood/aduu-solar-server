const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Project = require('../../models/projects/Project');
const userMiddleware = require('../../middlewares/userMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

// GET /staff/dashboard
router.get('/', userMiddleware, roleMiddleware(['staff']), async (req, res) => {
    try {
        // Convert userId string to ObjectId
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Find projects where the staff _id is in the assignedStaff array (embedded objects)
        const assignedProjects = await Project.find({ 'assignedStaff._id': userId })
            .sort({ updatedAt: -1 });


        // Send the response
        res.json({
            assignedProjects: assignedProjects
        });

    } catch (err) {
        console.error('Staff Dashboard Error:', err);
        res.status(500).json({ message: 'Error loading staff dashboard data' });
    }
});

module.exports = router;
