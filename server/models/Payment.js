const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'GPay QR',
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },
    screenshotUrl: {
        type: String,
        required: false,
    },
    transactionNote: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
