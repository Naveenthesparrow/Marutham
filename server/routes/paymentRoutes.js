const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    createPaymentIntent,
    uploadScreenshot,
    verifyPayment,
    getPaymentStatus
} = require('../controllers/paymentController');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/payments/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.orderId || 'payment'}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Only images (JPEG/JPG/PNG) are allowed!');
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});

const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create', protect, createPaymentIntent);
router.post('/upload', protect, upload.single('screenshot'), uploadScreenshot);
router.get('/status/:orderId', protect, getPaymentStatus);
router.put('/verify/:paymentId', protect, admin, verifyPayment);

module.exports = router;
