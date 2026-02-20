const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    registerUser,
    authUser,
    googleAuth,
    getUsers,
    deleteUser,
    updateUser,
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);
router.route('/').get(protect, admin, getUsers);
router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUser);

module.exports = router;
