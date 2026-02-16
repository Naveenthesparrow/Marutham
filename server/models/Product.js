const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Vathal', 'Cotton', 'Grains', 'Pulses', 'Spices'],
    },
    description: {
        type: String,
        required: true,
    },
    pricePerKg: {
        type: Number,
        required: true,
    },
    bulkOptions: [{
        quantity: Number,
        price: Number,
    }],
    stock: {
        type: String,
        required: true,
        default: 'In Stock',
    },
    imageUrl: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
