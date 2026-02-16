const express = require('express');
const router = express.Router();
const {
    getCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
} = require('../controllers/cartController');

router.route('/add').post(addItemToCart);
router.route('/update').put(updateCartItem);
router.route('/:userId').get(getCart);
router.route('/remove/:userId/:productId').delete(removeCartItem);

module.exports = router;
