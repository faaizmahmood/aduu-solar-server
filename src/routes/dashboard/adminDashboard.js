const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const Company = require('../../models/company');
const Project = require('../../models/projects/Project');
const Order = require('../../models/services/orderService');

router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1); // Start from last April

        // Stat Cards
        const totalClients = await User.countDocuments({ role: 'client' });
        const totalCompanies = await Company.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Fetch relevant orders
        const orders = await Order.find({ createdAt: { $gte: lastYear } });

        // Monthly Service Orders
        const monthlyServiceMap = {};
        const topServiceMap = {};

        orders.forEach(order => {
            const orderMonth = new Date(order.createdAt).toLocaleString('default', { month: 'short' });

            if (!monthlyServiceMap[orderMonth]) {
                monthlyServiceMap[orderMonth] = 0;
            }

            order.services.forEach(service => {
                const count = service.formResponses.length || 0;

                // Monthly count (all responses)
                monthlyServiceMap[orderMonth] += count;

                // Top services count
                if (!topServiceMap[service.serviceName]) {
                    topServiceMap[service.serviceName] = 0;
                }
                topServiceMap[service.serviceName] += count;
            });
        });

        // Ensure consistent month ordering (last 12 months)
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(d.toLocaleString('default', { month: 'short' }));
        }

        const monthlyServiceData = months.map(month => ({
            month,
            orders: monthlyServiceMap[month] || 0
        }));

        // Top services sorted
        const topServicesData = Object.entries(topServiceMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        res.json({
            stats: {
                totalClients,
                totalCompanies,
                totalProjects,
                totalOrders
            },
            monthlyServiceData,
            topServicesData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error loading dashboard data' });
    }
});

module.exports = router;
