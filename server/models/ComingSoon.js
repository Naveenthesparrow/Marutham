const mongoose = require('mongoose');

const comingSoonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const ComingSoon = mongoose.model('ComingSoon', comingSoonSchema);

module.exports = ComingSoon;
