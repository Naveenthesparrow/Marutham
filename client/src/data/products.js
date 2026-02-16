export const products = [
    {
        id: 1,
        name: "Dry Red Vathal (Dried Chilli)",
        category: "Vathal",
        price: 350,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800",
        description: "Premium quality sun-dried red chillies, perfect for long-term storage and traditional South Indian cooking. Sourced directly from local farmers.",
        bulkOptions: [
            { quantity: 10, price: 3400 },
            { quantity: 50, price: 16500 },
            { quantity: 100, price: 32000 }
        ],
        rating: 4.8,
        reviews: 124,
        stock: "In Stock"
    },
    {
        id: 2,
        name: "Premium Sona Masuri Rice",
        category: "Grains",
        price: 65,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
        description: "Aromatic and lightweight Sona Masuri rice. Aged for 12 months to ensure perfect texture and taste in every grain.",
        bulkOptions: [
            { quantity: 25, price: 1550 },
            { quantity: 50, price: 3000 },
            { quantity: 100, price: 5800 }
        ],
        rating: 4.9,
        reviews: 210,
        stock: "In Stock"
    },
    {
        id: 3,
        name: "Yellow Toor Dal (Pigeon Peas)",
        category: "Pulses",
        price: 180,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1585996853881-bd6201242d3c?auto=format&fit=crop&q=80&w=800",
        description: "Unpolished and natural Toor Dal. Rich in protein and fiber. Processed traditionally to retain all nutritional values.",
        bulkOptions: [
            { quantity: 10, price: 1750 },
            { quantity: 50, price: 8500 },
            { quantity: 100, price: 16500 }
        ],
        rating: 4.7,
        reviews: 89,
        stock: "In Stock"
    },
    {
        id: 4,
        name: "Organic Black Pepper",
        category: "Spices",
        price: 850,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1532433575922-39ca35458741?auto=format&fit=crop&q=80&w=800",
        description: "Bold and pungent black pepper corn from the hills. Hand-picked and sun-dried to maintain therapeutic properties.",
        bulkOptions: [
            { quantity: 5, price: 4100 },
            { quantity: 10, price: 8000 },
            { quantity: 25, price: 19500 }
        ],
        rating: 4.9,
        reviews: 56,
        stock: "Limited Stock"
    },
    {
        id: 5,
        name: "Raw Organic Cotton",
        category: "Cotton",
        price: 120,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1620050809829-459141f6ac53?auto=format&fit=crop&q=80&w=800",
        description: "High-quality long staple raw cotton. Cleaned and processed for industrial use. Sourced from sustainable farms.",
        bulkOptions: [
            { quantity: 50, price: 5800 },
            { quantity: 100, price: 11000 },
            { quantity: 500, price: 50000 }
        ],
        rating: 4.5,
        reviews: 34,
        stock: "In Stock"
    },
    {
        id: 6,
        name: "Green Cardamom (Elachi)",
        category: "Spices",
        price: 2200,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1599484055977-628d3bd8728d?auto=format&fit=crop&q=80&w=800",
        description: "Premium 8mm bold green cardamom. Intense aroma and vibrant color. Perfect for flavoring desserts and savory dishes.",
        bulkOptions: [
            { quantity: 2, price: 4200 },
            { quantity: 5, price: 10000 },
            { quantity: 10, price: 19500 }
        ],
        rating: 5.0,
        reviews: 12,
        stock: "In Stock"
    }
];

export const categories = [
    { name: "Vathal", icon: "🌶️", description: "Traditional dried vegetables" },
    { name: "Grains", icon: "🌾", description: "Paddy, Rice, Millets & more" },
    { name: "Pulses", icon: "🥣", description: "Lentils, Beans & Peas" },
    { name: "Spices", icon: "🌿", description: "Pure & Aromatic spices" },
    { name: "Cotton", icon: "☁️", description: "Quality raw cotton" }
];
