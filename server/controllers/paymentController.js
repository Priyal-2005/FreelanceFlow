const Payment = require('../models/Payment');
const Project = require('../models/Project');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user.id }).populate('projectId', 'title');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
    const { projectId, amount, dueDate, status, paidDate } = req.body;

    if (!projectId || !amount || !dueDate) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to add payment to this project' });
        }

        const payment = await Payment.create({
            userId: req.user.id,
            projectId,
            amount,
            dueDate,
            status,
            paidDate: status === 'Paid' ? (paidDate || Date.now()) : undefined,
        });
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a payment
// @route   PATCH /api/payments/:id
// @access  Private
const updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the payment user
        if (payment.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // If status is being updated to Paid, set paidDate if not provided
        if (req.body.status === 'Paid' && !req.body.paidDate && payment.status !== 'Paid') {
            req.body.paidDate = Date.now();
        } else if (req.body.status === 'Unpaid') {
            req.body.paidDate = undefined; // Clear paidDate if set back to Unpaid
        }


        const updatedPayment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private
const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the payment user
        if (payment.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await payment.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment
};
