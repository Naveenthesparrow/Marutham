const express = require('express');
const router = express.Router();
const {
    getComingSoon,
    createComingSoon,
    updateComingSoon,
    deleteComingSoon,
} = require('../controllers/comingSoonController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getComingSoon).post(protect, admin, createComingSoon);
router
    .route('/:id')
    .put(protect, admin, updateComingSoon)
    .delete(protect, admin, deleteComingSoon);

module.exports = router;
