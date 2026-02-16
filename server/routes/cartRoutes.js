const express = require('express');
const router = express.Router();
const {
    getCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
} = require('../controllers/cartController');

const { protect } = require('../middleware/authMiddleware');

router.route('/add').post(protect, addItemToCart);
router.route('/update').put(protect, updateCartItem);
router.route('/:userId').get(protect, getCart);
router.route('/remove/:userId/:productId').delete(protect, removeCartItem);

module.exports = router;
