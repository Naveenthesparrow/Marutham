const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const fixAdmin = async () => {
    try {
        const user = await User.findOne({ email: 'ranadheerapandiyan07@gmail.com' });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log('User ranadheerapandiyan07@gmail.com is now an admin');
        } else {
            console.log('User not found');
        }

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

fixAdmin();
