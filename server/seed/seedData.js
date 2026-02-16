const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const products = [
    {
        name: "Sundakkai Vathal (Dried Turkey Berry)",
        category: "Vathal",
        description: "Traditional sun-dried turkey berries, highly nutritious and medicinal. Perfect for vathal kuzhambu.",
        pricePerKg: 450,
        bulkOptions: [
            { quantity: 10, price: 4400 },
            { quantity: 50, price: 21000 },
            { quantity: 100, price: 40000 }
        ],
        stock: "In Stock",
        imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Manathakkali Vathal (Dried Black Nightshade)",
        category: "Vathal",
        description: "Sun-dried black nightshade berries. Effective for stomach ulcers and traditional South Indian sides.",
        pricePerKg: 380,
        bulkOptions: [
            { quantity: 10, price: 3700 },
            { quantity: 50, price: 18000 },
            { quantity: 100, price: 35000 }
        ],
        stock: "In Stock",
        imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Raw Organic Cotton (Paruthi)",
        category: "Cotton",
        description: "High-quality long staple raw cotton. Sourced from sustainable organic farms for textile industries.",
        pricePerKg: 120,
        bulkOptions: [
            { quantity: 50, price: 5800 },
            { quantity: 100, price: 11000 },
            { quantity: 500, price: 50000 }
        ],
        stock: "In Stock",
        imageUrl: "https://images.unsplash.com/photo-1620050809829-459141f6ac53?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Premium Ponni Rice",
        category: "Grains",
        description: "Fine quality aged Ponni rice. Lightweight and non-sticky, perfect for daily meals.",
        pricePerKg: 60,
        bulkOptions: [
            { quantity: 25, price: 1450 },
            { quantity: 50, price: 2800 },
            { quantity: 100, price: 5500 }
        ],
        stock: "In Stock",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Unpolished Toor Dal",
        category: "Pulses",
        description: "Natural and protein-rich Toor Dal. Processed without polishing to retain all nutrients.",
        pricePerKg: 180,
        bulkOptions: [
            { quantity: 10, price: 1750 },
            { quantity: 50, price: 8500 },
            { quantity: 100, price: 16500 }
        ],
        stock: "In Stock",
        imageUrl: "https://images.unsplash.com/photo-1585996853881-bd6201242d3c?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Turmeric Fingers (Viral Manjal)",
        category: "Spices",
        description: "Hand-picked high curcumin turmeric fingers. Pure and aromatic, ideal for grinding.",
        pricePerKg: 280,
        bulkOptions: [
            { quantity: 10, price: 2700 },
            { quantity: 50, price: 13000 },
            { quantity: 100, price: 25000 }
        ],
        stock: "In Stock",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
    }
];

const seedData = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Dummy Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
