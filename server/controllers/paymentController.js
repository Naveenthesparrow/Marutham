const Payment = require('../models/Payment');
const Order = require('../models/Order');
const QRCode = require('qrcode');

// @desc    Generate UPI QR Code
// @route   POST /api/payment/create
// @access  Private
const createPaymentIntent = async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        // Check if order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Merchant Details
        const upiId = 'marutham@upi';
        const merchantName = 'Marutham Agro Store';
        const transactionNote = `OrderID-${orderId}`;

        // UPI Deep Link Format
        // upi://pay?pa=address&pn=name&am=amount&cu=currency&tn=note
        const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

        // Generate QR Code as Data URL
        const qrCodeDataUrl = await QRCode.toDataURL(upiLink);

        res.json({
            qrCode: qrCodeDataUrl,
            upiId,
            merchantName,
            amount,
            transactionNote
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload Payment Screenshot
// @route   POST /api/payment/upload
// @access  Private
const uploadScreenshot = async (req, res) => {
    try {
        const { orderId, userId, amount, transactionNote } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a screenshot' });
        }

        const screenshotUrl = `/uploads/payments/${req.file.filename}`;

        const payment = await Payment.create({
            orderId,
            userId,
            amount,
            transactionNote,
            screenshotUrl,
            paymentStatus: 'pending'
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Payment (Admin)
// @route   PUT /api/payment/verify/:paymentId
// @access  Private/Admin
const verifyPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);

        if (payment) {
            payment.paymentStatus = req.body.status || 'verified';
            const updatedPayment = await payment.save();

            // If verified, update order status to 'paid' (or handled in order logic)
            if (payment.paymentStatus === 'verified') {
                const order = await Order.findById(payment.orderId);
                if (order) {
                    order.orderStatus = 'paid'; // Or whatever status represents paid
                    await order.save();
                }
            }

            res.json(updatedPayment);
        } else {
            res.status(404).json({ message: 'Payment record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Payment Status
// @route   GET /api/payment/status/:orderId
// @access  Private
const getPaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId }).sort({ createdAt: -1 });
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Payment record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPaymentIntent,
    uploadScreenshot,
    verifyPayment,
    getPaymentStatus
};
