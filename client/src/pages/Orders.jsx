import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Package,
    ChevronRight,
    Clock,
    CheckCircle2,
    Truck,
    MapPin,
    CreditCard,
    Search,
    ArrowRight,
    ExternalLink
} from 'lucide-react';

const Orders = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/my`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                }
            } catch (err) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return order.paymentStatus === 'pending';
        if (activeTab === 'processing') return order.orderStatus === 'processing' || order.orderStatus === 'placed';
        if (activeTab === 'shipped') return order.orderStatus === 'shipped';
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'text-leaf bg-leaf/10 border-leaf/20';
            case 'shipped': return 'text-primary bg-primary/10 border-primary/20';
            case 'processing': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-stone-500 bg-stone-100 border-stone-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-nature-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stone-500 font-medium">{t('orders.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-nature-bg min-h-screen pb-20">
            <div className="container mx-auto px-4 md:px-6 py-12">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-extrabold text-stone-900 mb-2">{t('orders.title')}</h1>
                        <p className="text-stone-500">{t('orders.subtitle')}</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl border border-nature-border shadow-sm">
                        {['all', 'pending', 'processing', 'shipped'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-stone-400 hover:text-stone-600'
                                    }`}
                            >
                                {t(`orders.tabs.${tab}`)}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-nature-border shadow-sm">
                        <div className="w-20 h-20 bg-nature-bg rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-stone-300" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-stone-900 mb-4">{t('orders.no_orders_title')}</h3>
                        <p className="text-stone-500 mb-8 max-w-sm mx-auto">
                            {t('orders.no_orders_text')}
                        </p>
                        <Link to="/products" className="btn-primary inline-flex">
                            {t('orders.browse_products')} <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredOrders.map((order) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2.5rem] border border-nature-border shadow-sm overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-6 md:p-8 border-b border-nature-border bg-stone-50/50 flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex flex-wrap gap-x-12 gap-y-4">
                                        <div>
                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block mb-1">{t('orders.order_id')}</span>
                                            <span className="font-mono font-bold text-stone-700">#{order._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block mb-1">{t('orders.date_placed')}</span>
                                            <span className="font-bold text-stone-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block mb-1">{t('orders.total_amount')}</span>
                                            <span className="font-bold text-primary">₹{order.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                                            {t(`orders.status.${order.orderStatus}`)}
                                        </div>
                                        <Link
                                            to={`/payment/${order._id}`}
                                            className="p-2 bg-white rounded-full border border-nature-border text-stone-400 hover:text-primary transition-colors shadow-sm"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

                                    {/* Items List */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            <Package className="w-4 h-4" /> {t('orders.contents')}
                                        </h4>
                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-nature-bg border border-nature-border/50">
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                                    <div className="flex-grow">
                                                        <h5 className="font-bold text-stone-800">{item.name}</h5>
                                                        <p className="text-stone-500 text-sm">{item.quantityKg}kg {t('orders.bulk_pack')}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-bold text-stone-900">₹{item.price}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tracking Timeline */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            <Truck className="w-4 h-4" /> {t('orders.tracking')}
                                        </h4>

                                        <div className="relative pl-8 space-y-8">
                                            {/* Vertical Line */}
                                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-100" />

                                            {order.trackingSteps.map((step, idx) => (
                                                <div key={idx} className="relative">
                                                    {/* Indicator */}
                                                    <div className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white border-2 border-stone-100 text-stone-300'
                                                        }`}>
                                                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className={`font-bold text-sm ${step.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                                                            {step.step}
                                                        </span>
                                                        {step.date && (
                                                            <span className="text-[10px] text-stone-500 font-medium">
                                                                {new Date(step.date).toLocaleDateString()} at {new Date(step.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-nature-border">
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                    <CreditCard className={`w-5 h-5 ${order.paymentStatus === 'verified' ? 'text-leaf' : 'text-amber-500'}`} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">{t('orders.payment_status')}</span>
                                                    <span className={`font-bold text-sm capitalize ${order.paymentStatus === 'verified' ? 'text-leaf' : 'text-amber-500'}`}>
                                                        {order.paymentStatus === 'verified' ? t('orders.payment_verified') : t('orders.awaiting_confirmation')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
