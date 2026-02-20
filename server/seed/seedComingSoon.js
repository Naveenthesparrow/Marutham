const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const ComingSoon = require('../models/ComingSoon');

dotenv.config();

connectDB();

const items = [
    {
        name: "Cold Pressed Oils",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcdcc3a?auto=format&fit=crop&q=80&w=600",
        date: "Coming March 2026"
    },
    {
        name: "Organic Honey",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
        date: "Coming April 2026"
    },
    {
        name: "Millet Flour",
        image: "https://images.unsplash.com/photo-1574323347438-4f24d775ea00?auto=format&fit=crop&q=80&w=600",
        date: "Coming May 2026"
    }
];

const importData = async () => {
    try {
        await ComingSoon.deleteMany();
        await ComingSoon.insertMany(items);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
