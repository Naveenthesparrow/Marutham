import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShieldCheck, Truck, Scale, BadgeCheck, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ProductDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedOption, setSelectedOption] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                const data = await response.json();
                if (response.ok) {
                    const mappedProduct = {
                        id: data._id,
                        name: data.name,
                        category: data.category,
                        price: data.pricePerKg,
                        image: data.imageUrl,
                        description: data.description,
                        bulkOptions: data.bulkOptions,
                        stock: data.stock,
                        rating: 4.8,
                        reviews: 124,
                        unit: 'kg'
                    };
                    setProduct(mappedProduct);
                    setSelectedOption(mappedProduct.bulkOptions[0]);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedOption);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;

    return (
        <div className="bg-nature-bg min-h-screen pb-20">
            <div className="container mx-auto px-4 md:px-6 py-8">
                <Link to="/products" className="inline-flex items-center gap-2 text-stone-500 hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('product_detail.back_link')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-white border border-nature-border"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer shadow-sm">
                                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
                                {product.category} {t('product_detail.produce')}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-stone-900 mb-4">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                                    ))}
                                    <span className="text-sm font-bold text-stone-700 ml-2">{product.rating}</span>
                                </div>
                                <div className="h-4 w-px bg-stone-200" />
                                <span className="text-sm text-stone-500 font-medium">{product.reviews} {t('product_detail.reviews')}</span>
                            </div>
                        </div>

                        <p className="text-lg text-stone-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        <div className="bg-white rounded-2xl border border-nature-border p-6 shadow-sm mb-8">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Scale className="w-5 h-5 text-primary" /> {t('product_detail.select_bulk')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {product.bulkOptions.map((option) => (
                                    <button
                                        key={option.quantity}
                                        onClick={() => setSelectedOption(option)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedOption.quantity === option.quantity
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-stone-100 bg-nature-bg hover:border-stone-200'
                                            }`}
                                    >
                                        <span className="text-lg font-bold text-stone-900">{option.quantity}{product.unit}</span>
                                        <span className="text-sm font-semibold text-primary">₹{option.price}</span>
                                        <span className="text-[10px] text-stone-400 mt-1 uppercase">₹{Math.round(option.price / option.quantity)}/kg</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="bg-stone-900 rounded-3xl p-8 text-white shadow-xl mt-auto">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-stone-400 text-sm mb-1 uppercase tracking-widest font-bold">{t('product_detail.total_price')} {selectedOption.quantity}{product.unit}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-display font-extrabold text-white">₹{selectedOption.price * quantity}</span>
                                        <span className="text-stone-400 font-medium">{t('product_detail.incl_taxes')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center bg-white/10 rounded-2xl p-1 border border-white/20">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-12 text-center text-xl font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={added}
                                className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all ${added ? 'bg-leaf text-white' : 'bg-primary text-white hover:bg-primary-light active:scale-[0.98]'
                                    }`}
                            >
                                {added ? (
                                    <> <BadgeCheck className="w-6 h-6" /> {t('product_detail.added')} </>
                                ) : (
                                    <> <ShoppingCart className="w-6 h-6" /> {t('product_detail.add_order')} </>
                                )}
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-nature-border">
                                <Truck className="w-6 h-6 text-primary" />
                                <span className="text-sm font-bold text-stone-700 leading-tight">{t('product_detail.cargo_delivery')}</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-nature-border">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                <span className="text-sm font-bold text-stone-700 leading-tight">{t('product_detail.farmer_guarantee')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
