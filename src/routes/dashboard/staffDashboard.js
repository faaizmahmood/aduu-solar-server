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

    // Calculate stats
    const totalProjects = assignedProjects.length;
    const activeProjects = assignedProjects.filter(p => p.status === 'In Progress').length;
    const completedProjects = assignedProjects.filter(p => p.status === 'Completed').length;

    // Recent Activity: last 5 updated
    const recentActivities = assignedProjects
      .slice(0, 5)
      .map(p => ({
        type: 'Project',
        name: p.projectName,
        status: p.status,
        updatedAt: p.updatedAt
      }));

    // Send the response
    res.json({
      stats: {
        allTimeProjects: totalProjects,
        activeProjects,
        completedProjects
      },
      assignedProjects: assignedProjects.map(p => ({
        id: p._id.toString(),
        name: p.projectName,
        status: p.status,
        assignedAt: p.assignedAt,
        updatedAt: p.updatedAt
      })),
      recentActivities
    });

  } catch (err) {
    console.error('Staff Dashboard Error:', err);
    res.status(500).json({ message: 'Error loading staff dashboard data' });
  }
});

module.exports = router;
