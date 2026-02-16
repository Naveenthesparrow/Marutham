import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="card-nature group h-full flex flex-col"
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                    {product.category}
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                        to={`/product/${product.id}`}
                        className="bg-white text-primary px-4 py-2 rounded-lg font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-stone-600">{product.rating}</span>
                    <span className="text-xs text-stone-400">({product.reviews})</span>
                </div>

                <h3 className="text-lg font-display font-semibold text-stone-900 group-hover:text-primary transition-colors mb-1 line-clamp-1">
                    {product.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-primary">₹{product.price}</span>
                    <span className="text-sm text-stone-500 font-medium">/ {product.unit}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-nature-border flex items-center justify-between mt-auto">
                    <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wide">
                        Min: {product.bulkOptions[0].quantity}{product.unit}
                    </div>
                    <Link
                        to={`/product/${product.id}`}
                        className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        Bulk Pricing <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
