const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
            name: { type: String, required: true },
            quantityKg: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'verified', 'failed'],
        default: 'pending',
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['placed', 'processing', 'shipped', 'delivered'],
        default: 'placed',
    },
    trackingSteps: [
        {
            step: { type: String, required: true },
            completed: { type: Boolean, default: false },
            date: { type: Date },
        },
    ],
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
