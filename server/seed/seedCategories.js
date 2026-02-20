const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const categories = [
    {
        name: "Vathal",
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=400",
        description: "Traditional dried vegetables",
        order: 1
    },
    {
        name: "Cotton",
        image: "https://images.unsplash.com/photo-1606734612379-cb6cb6e553be?auto=format&fit=crop&q=80&w=400",
        description: "Quality raw cotton",
        order: 2
    },
    {
        name: "Grains",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
        description: "Paddy, Rice, Millets & more",
        order: 3
    },
    {
        name: "Pulses",
        image: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?auto=format&fit=crop&q=80&w=400",
        description: "Lentils, Beans & Peas",
        order: 4
    },
    {
        name: "Spices",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
        description: "Pure & Aromatic spices",
        order: 5
    }
];

const seedCategories = async () => {
    try {
        await Category.deleteMany();
        await Category.insertMany(categories);
        console.log('Categories seeded!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedCategories();
