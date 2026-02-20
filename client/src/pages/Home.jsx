import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ShieldCheck, Tag, ArrowRight, Edit2, X, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin, token } = useAuth();


    // Edit Mode State
    const [editingCategory, setEditingCategory] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', description: '', image: '' });

    // Coming Soon State
    const [editingComingSoon, setEditingComingSoon] = useState(null); // null = no modal, 'new' = add mode, object = edit mode
    const [comingSoonForm, setComingSoonForm] = useState({ name: '', image: '', date: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes, comingRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/products`),
                    fetch(`${import.meta.env.VITE_API_URL}/api/categories`),
                    fetch(`${import.meta.env.VITE_API_URL}/api/comingsoon`)
                ]);

                const prodData = await prodRes.json();
                const catData = await catRes.json();
                const comingData = await comingRes.json();

                if (prodRes.ok) {
                    const mappedData = prodData.map(p => ({
                        id: p._id,
                        name: p.name,
                        category: p.category,
                        price: p.pricePerKg,
                        image: p.imageUrl,
                        description: p.description,
                        bulkOptions: p.bulkOptions,
                        stock: p.stock,
                        rating: 4.8,
                        reviews: 124,
                        unit: 'kg'
                    }));
                    setProducts(mappedData);
                }

                if (catRes.ok) {
                    setCategories(catData);
                }

                if (comingRes.ok) {
                    setComingSoon(comingData);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEditClick = (e, category) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        setEditingCategory(category);
        setEditForm({ name: category.name, description: category.description, image: category.image });
    };

    const handleUpdateCategory = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${editingCategory._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                const updatedCat = await res.json();
                setCategories(categories.map(c => c._id === updatedCat._id ? updatedCat : c));
                setEditingCategory(null);
            } else {
                alert(t('common.error'));
            }
        } catch (err) {
            console.error(err);
            alert(t('common.error'));
        }
    };

    // Coming Soon Handlers
    const handleSaveComingSoon = async () => {
        try {
            const url = editingComingSoon === 'new'
                ? `${import.meta.env.VITE_API_URL}/api/comingsoon`
                : `${import.meta.env.VITE_API_URL}/api/comingsoon/${editingComingSoon._id}`;
            const method = editingComingSoon === 'new' ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(comingSoonForm)
            });

            if (res.ok) {
                const data = await res.json();
                if (editingComingSoon === 'new') {
                    setComingSoon([...comingSoon, data]);
                } else {
                    setComingSoon(comingSoon.map(item => item._id === data._id ? data : item));
                }
                setEditingComingSoon(null);
            } else {
                alert(t('common.error'));
            }
        } catch (err) {
            console.error(err);
            alert(t('common.error'));
        }
    };

    const handleDeleteComingSoon = async (id) => {
        if (window.confirm(t('common.confirm_delete_user'))) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comingsoon/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    setComingSoon(comingSoon.filter(item => item._id !== id));
                } else {
                    alert(t('common.error'));
                }
            } catch (err) {
                console.error(err);
                alert(t('common.error'));
            }
        }
    };

    const handleProductDelete = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const handleProductUpdate = (updatedProduct) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const featuredProducts = products.slice(0, 4);

    return (
        <div className="flex flex-col w-full relative">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center bg-nature-bg overflow-hidden py-20 lg:py-0">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

                <div className={`container mx-auto px-4 md:px-6 relative z-10 ${i18n.language === 'ta' ? 'pt-10' : ''}`}>
                    <div className={`grid lg:grid-cols-2 items-center ${i18n.language === 'ta' ? 'gap-16 lg:gap-24' : 'gap-12 lg:gap-8'}`}>
                        {/* Text Content */}
                        <div className={i18n.language === 'ta' ? 'max-w-sm' : 'max-w-2xl'}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
                                    {t('hero.badge')}
                                </span>
                                <h1 className={`font-display text-stone-900 leading-tight mb-6 ${i18n.language === 'ta'
                                    ? 'text-2xl md:text-3xl font-bold'
                                    : 'text-5xl md:text-7xl font-extrabold'}`}>
                                    {t('hero.title_part1')} {i18n.language === 'ta' && <br />} <span className="text-primary italic">{t('hero.title_italic')}</span>
                                </h1>
                                <p className="text-xl text-stone-600 mb-10 leading-relaxed max-w-lg">
                                    {t('hero.description')}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/products" className="btn-primary py-4 px-8 text-lg">
                                        {t('hero.cta_shop')} <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link to="/contact" className="btn-secondary py-4 px-8 text-lg">
                                        {t('hero.cta_partner')}
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Hero Image */}
                        <div className="hidden lg:block relative h-[600px] w-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="w-full h-full relative flex items-center justify-center"
                            >
                                <div className="relative w-full h-[85%] bg-stone-200 rounded-3xl overflow-hidden shadow-2xl rotate-3">
                                    <img
                                        src="https://thumbs.dreamstime.com/b/madurai-tamilnadu-india-may-indian-farmers-working-rice-fields-editorial-image-indian-farmers-working-rice-fields-124652695.jpg?auto=format&fit=crop&q=80&w=1200"
                                        alt="Farmer Field"
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                </div>
                                <div className="absolute top-10 -right-6 w-48 h-48 bg-white p-4 rounded-2xl shadow-xl rotate-6 hidden xl:block">
                                    <img
                                        src="https://research.euro.savills.co.uk/_images/feeding-nation.jpg?auto=format&fit=crop&q=80&w=300"
                                        alt="Vathal"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white border-y border-nature-border">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-3">{t('benefits.quality_title')}</h3>
                            <p className="text-stone-600">{t('benefits.quality_desc')}</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                                <Tag className="w-8 h-8 text-secondary" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-3">{t('benefits.pricing_title')}</h3>
                            <p className="text-stone-600">{t('benefits.pricing_desc')}</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-leaf/10 rounded-2xl flex items-center justify-center mb-6">
                                <Truck className="w-8 h-8 text-leaf" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-3">{t('benefits.logistics_title')}</h3>
                            <p className="text-stone-600">{t('benefits.logistics_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Explorer */}
            <section className="py-24 bg-nature-bg">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-display font-extrabold text-stone-900 mb-4">{t('categories.title')}</h2>
                            <p className="text-lg text-stone-600">{t('categories.subtitle')}</p>
                        </div>
                        <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all duration-300">
                            {t('categories.explore_all')} <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat._id || cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <Link
                                    to={`/products?cat=${cat.name}`}
                                    className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-[300px]"
                                >
                                    {/* Image Background */}
                                    <div className="absolute inset-x-0 top-0 h-3/4 overflow-hidden">
                                        <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors z-10" />
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-white flex flex-col items-center justify-center p-4 border-t border-stone-100 rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
                                        <h4 className="text-xl font-bold text-stone-900 group-hover:text-primary transition-colors">{cat.name}</h4>
                                        <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mt-1 text-center line-clamp-1">{cat.description}</p>
                                    </div>
                                </Link>

                                {isAdmin && (
                                    <button
                                        onClick={(e) => handleEditClick(e, cat)}
                                        className="absolute top-2 right-2 z-30 bg-white p-2 rounded-full shadow-md text-stone-600 hover:text-primary hover:bg-stone-50 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Soon Section */}
            <section className="py-20 bg-white border-y border-nature-border">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 relative">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">{t('coming_soon.badge')}</span>
                        <h2 className="text-4xl font-display font-extrabold text-stone-900 mb-6">{t('coming_soon.title')}</h2>
                        <p className="text-lg text-stone-600">
                            {t('coming_soon.description')}
                        </p>
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setEditingComingSoon('new');
                                    setComingSoonForm({ name: '', image: '', date: '' });
                                }}
                                className="absolute right-0 top-0 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-primary-dark transition-colors"
                            >
                                {t('coming_soon.add_new')}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {comingSoon.map((item, idx) => (
                            <motion.div
                                key={item._id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative overflow-hidden rounded-3xl aspect-[4/3]"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/20 transition-colors" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium border border-white/30">
                                        {item.date}
                                    </span>
                                </div>
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 z-30 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingComingSoon(item);
                                                setComingSoonForm({ name: item.name, image: item.image, date: item.date });
                                            }}
                                            className="bg-white p-2 rounded-full shadow-md text-stone-600 hover:text-primary hover:bg-stone-50 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteComingSoon(item._id);
                                            }}
                                            className="bg-white p-2 rounded-full shadow-md text-stone-600 hover:text-red-500 hover:bg-stone-50 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-4xl font-display font-extrabold text-stone-900">{t('featured.title')}</h2>
                        <Link to="/products" className="btn-secondary px-5 py-2">{t('featured.view_all')}</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onDelete={handleProductDelete}
                                onUpdate={handleProductUpdate}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="relative bg-primary rounded-[2.5rem] overflow-hidden p-12 md:p-20">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 -skew-x-12 translate-x-1/2" />
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">{t('cta.title')}</h2>
                            <p className="text-xl text-primary/10 text-white/80 mb-10">
                                {t('cta.description')}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-stone-100 transition-colors shadow-lg">{t('cta.button_quote')}</button>
                                <button className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">{t('cta.button_sales')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Edit Category Modal */}
            <AnimatePresence>
                {editingCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-stone-900">{t('modals.edit_category')}</h3>
                                <button
                                    onClick={() => setEditingCategory(null)}
                                    className="p-2 hover:bg-stone-100 rounded-full text-stone-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('admin.name')}</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="input-nature w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('admin.description')}</label>
                                    <input
                                        type="text"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="input-nature w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('admin.image_url')}</label>
                                    <input
                                        type="text"
                                        value={editForm.image}
                                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                        className="input-nature w-full"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setEditingCategory(null)}
                                        className="flex-1 py-3 font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        onClick={handleUpdateCategory}
                                        className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" /> {t('common.save')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Coming Soon Modal */}
            <AnimatePresence>
                {editingComingSoon && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-stone-900">
                                    {editingComingSoon === 'new' ? t('modals.add_coming_soon') : t('modals.edit_coming_soon')}
                                </h3>
                                <button
                                    onClick={() => setEditingComingSoon(null)}
                                    className="p-2 hover:bg-stone-100 rounded-full text-stone-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('modals.label_name')}</label>
                                    <input
                                        type="text"
                                        value={comingSoonForm.name}
                                        onChange={(e) => setComingSoonForm({ ...comingSoonForm, name: e.target.value })}
                                        className="input-nature w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('modals.label_date')}</label>
                                    <input
                                        type="text"
                                        value={comingSoonForm.date}
                                        onChange={(e) => setComingSoonForm({ ...comingSoonForm, date: e.target.value })}
                                        className="input-nature w-full"
                                        placeholder="e.g. Coming March 2026"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('modals.label_image_url')}</label>
                                    <input
                                        type="text"
                                        value={comingSoonForm.image}
                                        onChange={(e) => setComingSoonForm({ ...comingSoonForm, image: e.target.value })}
                                        className="input-nature w-full"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setEditingComingSoon(null)}
                                        className="flex-1 py-3 font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        onClick={handleSaveComingSoon}
                                        className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" /> {t('common.save')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
