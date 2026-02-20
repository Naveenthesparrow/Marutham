const ComingSoon = require('../models/ComingSoon');

// @desc    Get all coming soon items
// @route   GET /api/comingsoon
// @access  Public
const getComingSoon = async (req, res) => {
    try {
        const items = await ComingSoon.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a coming soon item
// @route   POST /api/comingsoon
// @access  Private/Admin
const createComingSoon = async (req, res) => {
    try {
        const { name, image, date } = req.body;
        const item = await ComingSoon.create({
            name,
            image,
            date,
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a coming soon item
// @route   PUT /api/comingsoon/:id
// @access  Private/Admin
const updateComingSoon = async (req, res) => {
    try {
        const { name, image, date } = req.body;
        const item = await ComingSoon.findById(req.params.id);

        if (item) {
            item.name = name || item.name;
            item.image = image || item.image;
            item.date = date || item.date;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a coming soon item
// @route   DELETE /api/comingsoon/:id
// @access  Private/Admin
const deleteComingSoon = async (req, res) => {
    try {
        const item = await ComingSoon.findById(req.params.id);

        if (item) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getComingSoon,
    createComingSoon,
    updateComingSoon,
    deleteComingSoon,
};
