const Payment = require('../models/Payment');
const Project = require('../models/Project');
const Client = require('../models/Client');

// @desc    Get dashboard analytics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // aggregate payments for revenue and pending amount
        const payments = await Payment.find({ userId });

        const totalRevenue = payments
            .filter((p) => p.status === 'Paid')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const pendingAmount = payments
            .filter((p) => p.status === 'Unpaid')
            .reduce((acc, curr) => acc + curr.amount, 0);

        // count active projects
        const activeProjectsCount = await Project.countDocuments({
            userId,
            status: 'Active',
        });

        // count total clients
        const totalClientsCount = await Client.countDocuments({ userId });

        res.status(200).json({
            totalRevenue,
            pendingAmount,
            activeProjectsCount,
            totalClientsCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
