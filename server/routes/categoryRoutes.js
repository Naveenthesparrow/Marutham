const express = require('express');
const router = express.Router();
const { getCategories, updateCategory, createCategory } = require('../controllers/categoryController');
// Check if you have auth middlewares
// For now, I'll assume you might have an 'authMiddleware.js' or similar. 
// I'll check the directory first, but usually standard PROTECT/ADMIN middleware is needed.
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getCategories).post(protect, admin, createCategory);
router.route('/:id').put(protect, admin, updateCategory);

module.exports = router;
