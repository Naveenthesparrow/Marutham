const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart/:userId
// @access  Private
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addItemToCart = async (req, res) => {
    try {
        const { userId, productId, quantityKg, price } = req.body;
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Check if product already in cart
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantityKg += quantityKg;
                cart.items[itemIndex].price = price;
            } else {
                cart.items.push({ productId, quantityKg, price });
            }
            cart = await cart.save();
        } else {
            cart = await Cart.create({
                userId,
                items: [{ productId, quantityKg, price }],
            });
        }

        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantityKg } = req.body;
        const cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantityKg = quantityKg;
                await cart.save();
                res.json(cart);
            } else {
                res.status(404).json({ message: 'Product not found in cart' });
            }
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:userId/:productId
// @access  Private
const removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
};
