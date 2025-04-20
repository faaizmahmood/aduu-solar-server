const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const Project = require('../../models/projects/Project');
const Order = require('../../models/services/orderService');
const Invoice = require('../../models/invoices/invoices');
const userMiddleware = require('../../middlewares/userMiddleware');

router.get('/', userMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let filter = {};
    let label = '';

    if (user.companyId) {
      filter = { companyId: user.companyId };
      label = 'company';
    } else {
      filter = { clientId: user._id };
      label = 'individual';
    }

    // Fetch stats and recent projects
    const [totalProjects, activeProjects, invoices, pendingApproval, projects] = await Promise.all([
      Project.countDocuments(filter),
      Project.countDocuments({ ...filter, status: 'In Progress' }),
      Invoice.countDocuments(filter),
      Order.countDocuments({ ...filter, status: 'Pending' }),
      Project.find(filter)
        .sort({ createdAt: -1 })
        .limit(10)
        .select('projectName status createdAt')
    ]);

    // Fetch recent activities from Projects, Orders, and Invoices
    const recentProjectUpdates = await Project.find(filter)
      .sort({ updatedAt: -1 }) // Sort by latest update time
      .limit(5) // Limit to 5 most recent
      .select('projectName status updatedAt');

    const recentOrderUpdates = await Order.find(filter)
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('service status updatedAt');

    const recentInvoiceUpdates = await Invoice.find(filter)
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('invoiceNumber status updatedAt');

    // Combine results
    const recentActivities = [
      ...recentProjectUpdates.map(item => ({
        type: 'Project',
        name: item.name,
        status: item.status,
        updatedAt: item.updatedAt,
      })),
      ...recentOrderUpdates.map(item => ({
        type: 'Order',
        name: item.service,
        status: item.status,
        updatedAt: item.updatedAt,
      })),
      ...recentInvoiceUpdates.map(item => ({
        type: 'Invoice',
        name: item.invoiceNumber,
        status: item.status,
        updatedAt: item.updatedAt,
      })),
    ];

    // Sort combined activities by updatedAt (most recent first)
    recentActivities.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Limit to 5 most recent activities
    const limitedActivities = recentActivities.slice(0, 5);

    res.json({
      userType: label,
      stats: {
        totalProjects,
        activeProjects,
        invoices,
        pendingApproval
      },
      projects,
      recentActivities: limitedActivities
    });

  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).json({ message: 'Error loading dashboard data' });
  }
});

module.exports = router;
