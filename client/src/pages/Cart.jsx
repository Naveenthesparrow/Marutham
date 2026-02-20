import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Cart = () => {
    const { t } = useTranslation();
    const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        const hasMockData = cart.some(item => typeof item.id === 'number' || !item.id.toString().match(/^[0-9a-fA-F]{24}$/));
        if (hasMockData) {
            const confirmClear = window.confirm(t('cart.outdated_alert'));
            if (confirmClear) {
                clearCart();
                alert(t('cart.cleared_msg'));
            }
            return;
        }

        const orderData = {
            items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                quantityKg: item.selectedOption.quantity * item.quantity,
                price: item.selectedOption.price * item.quantity,
                image: item.image
            })),
            totalAmount: cartTotal + 99
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                clearCart();
                navigate(`/payment/${data._id}`);
            } else {
                alert(data.message || t('cart.error_place'));
            }
        } catch (err) {
            alert(t('cart.error_network'));
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-nature-bg flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl border border-nature-border">
                    <ShoppingCart className="w-10 h-10 text-stone-300" />
                </div>
                <h2 className="text-3xl font-display font-bold text-stone-900 mb-4">{t('cart.empty_title')}</h2>
                <p className="text-lg text-stone-500 mb-10 max-w-md">{t('cart.empty_text')}</p>
                <Link to="/products" className="btn-primary py-4 px-10 rounded-2xl text-lg">
                    {t('cart.start_sourcing')} <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-nature-bg min-h-screen pb-20">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <h1 className="text-4xl font-display font-extrabold text-stone-900 mb-12">{t('cart.title')}</h1>

                <div className="flex flex-col xl:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="flex-grow space-y-6">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div
                                    key={`${item.id}-${item.selectedOption.quantity}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="bg-white rounded-3xl p-6 border border-nature-border shadow-sm flex flex-col md:flex-row items-center gap-6"
                                >
                                    <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-nature-border">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-grow space-y-2 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <h3 className="text-xl font-display font-bold text-stone-900">{item.name}</h3>
                                            <span className="text-primary font-bold bg-primary/5 px-3 py-1 rounded-full text-sm">
                                                {item.selectedOption.quantity}{item.unit} {t('cart.pack')}
                                            </span>
                                        </div>
                                        <p className="text-stone-500 text-sm line-clamp-1">{item.description}</p>
                                        <div className="text-lg font-bold text-primary mt-2">
                                            ₹{item.selectedOption.price} / {t('cart.per_pack')}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                                        <div className="flex items-center bg-nature-bg rounded-xl border border-nature-border p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.selectedOption.quantity, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 rounded-lg transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.selectedOption.quantity, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 rounded-lg transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xl font-extrabold text-stone-900">
                                            ₹{item.selectedOption.price * item.quantity}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.selectedOption.quantity)}
                                            className="text-red-500 hover:text-red-600 transition-colors p-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            onClick={clearCart}
                            className="text-stone-400 hover:text-stone-600 font-medium text-sm flex items-center gap-2 mt-4"
                        >
                            {t('cart.clear_all')}
                        </button>
                    </div>

                    {/* Summary */}
                    <aside className="w-full xl:w-96 shrink-0">
                        <div className="bg-white rounded-[2.5rem] border border-nature-border p-8 shadow-xl sticky top-28">
                            <h3 className="text-2xl font-display font-bold text-stone-900 mb-8 border-b border-nature-border pb-6">{t('cart.summary')}</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-stone-600">
                                    <span>{t('cart.subtotal')}</span>
                                    <span className="font-bold text-stone-900">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-stone-600">
                                    <span>{t('cart.shipping')}</span>
                                    <span className="text-leaf font-bold">{t('cart.shipping_calc')}</span>
                                </div>
                                <div className="flex justify-between text-stone-600">
                                    <span>{t('cart.platform_fee')}</span>
                                    <span className="font-bold text-stone-900">₹99</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-nature-border mb-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-stone-900">{t('cart.estimated_total')}</span>
                                    <span className="text-4xl font-display font-extrabold text-primary">₹{cartTotal + 99}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full btn-primary py-5 rounded-2xl text-xl mb-6 shadow-xl shadow-primary/20"
                            >
                                {t('cart.checkout_btn')} <ArrowRight className="w-6 h-6" />
                            </button>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                                    <Truck className="w-4 h-4 text-primary" /> {t('cart.free_cargo')}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                                    <CreditCard className="w-4 h-4 text-primary" /> {t('cart.secure_gateway')}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                                    <ShieldCheck className="w-4 h-4 text-primary" /> {t('cart.inspection_report')}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Cart;
