const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            userId,
            items,
            totalAmount,
        });

        const createdOrder = await order.save();

        // Clear cart after order
        await Cart.findOneAndDelete({ userId });

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/:userId
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
};
