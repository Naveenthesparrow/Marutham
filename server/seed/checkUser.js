const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const checkUser = async () => {
    try {
        const user = await User.findOne({ email: 'ranadheerapandiyan07@gmail.com' });

        if (user) {
            console.log(`User found: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
        } else {
            console.log('User not found');
        }

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

checkUser();
