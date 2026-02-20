import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Products = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('cat') || 'All';
    const initialSearchTerm = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [sortBy, setSortBy] = useState(t('products.sort_featured'));
    const [showFilters, setShowFilters] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: "Vathal" },
        { name: "Grains" },
        { name: "Pulses" },
        { name: "Spices" },
        { name: "Cotton" }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                const data = await response.json();
                if (response.ok) {
                    const mappedData = data.map(p => ({
                        id: p._id,
                        name: p.name,
                        category: p.category,
                        price: p.pricePerKg,
                        image: p.imageUrl,
                        description: p.description,
                        bulkOptions: p.bulkOptions,
                        stock: p.stock
                    }));
                    setProducts(mappedData);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === t('products.sort_price_asc')) return a.price - b.price;
        if (sortBy === t('products.sort_price_desc')) return b.price - a.price;
        return 0; // Featured/Default
    });

    const handleProductDelete = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const handleProductUpdate = (updatedProduct) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;

    return (
        <div className="bg-nature-bg min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-nature-border pt-12 pb-16">
                <div className="container mx-auto px-4 md:px-6">
                    <h1 className="text-4xl font-display font-extrabold text-stone-900 mb-4">{t('products.title')}</h1>
                    <p className="text-stone-600 max-w-2xl">{t('products.subtitle')}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 mt-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-28 space-y-8">
                            <div>
                                <h3 className="text-lg font-display font-bold text-stone-900 mb-4">{t('categories.title')}</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSearchParams({ cat: 'All' })}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${categoryFilter === 'All' ? 'bg-primary text-white shadow-md' : 'text-stone-600 hover:bg-white border border-transparent'
                                            }`}
                                    >
                                        {t('products.all_categories')}
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.name}
                                            onClick={() => setSearchParams({ cat: cat.name })}
                                            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${categoryFilter === cat.name ? 'bg-primary text-white shadow-md' : 'text-stone-600 hover:bg-white border border-transparent'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-display font-bold text-stone-900 mb-4">{t('products.sidebar_pricing')}</h3>
                                <div className="space-y-3">
                                    {[t('products.retail'), t('products.wholesale'), t('products.distributor')].map(type => (
                                        <label key={type} className="flex items-center gap-2 group cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary" />
                                            <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-grow">
                        {/* Search and Sort Toolbar */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="flex-grow relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder={t('products.search_placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-nature-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-stone-700 transition-all shadow-sm"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-nature-border rounded-xl font-medium text-stone-600"
                                >
                                    <Filter className="w-5 h-5" /> {t('products.filter_btn')}
                                </button>
                                <div className="relative inline-block">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none pl-4 pr-10 py-3 bg-white border border-nature-border rounded-xl focus:border-primary outline-none text-stone-700 shadow-sm cursor-pointer font-medium"
                                    >
                                        <option value={t('products.sort_featured')}>{t('products.sort_featured')}</option>
                                        <option value={t('products.sort_price_asc')}>{t('products.sort_price_asc')}</option>
                                        <option value={t('products.sort_price_desc')}>{t('products.sort_price_desc')}</option>
                                        <option value={t('products.sort_newest')}>{t('products.sort_newest')}</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {sortedProducts.length > 0 ? (
                                sortedProducts.map((product, idx) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <ProductCard
                                            product={product}
                                            onDelete={handleProductDelete}
                                            onUpdate={handleProductUpdate}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-display font-bold text-stone-800 mb-2">{t('products.no_results_title')}</h3>
                                    <p className="text-stone-500">{t('products.no_results_text')}</p>
                                    <button
                                        onClick={() => { setSearchTerm(''); setSearchParams({ cat: 'All' }) }}
                                        className="mt-6 text-primary font-bold underline"
                                    >
                                        {t('products.clear_filters')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[70] shadow-2xl p-6 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-8 border-b border-nature-border pb-4">
                                <h2 className="text-xl font-display font-bold">{t('products.filter_btn')}</h2>
                                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-stone-100 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-bold text-stone-900 mb-4 uppercase tracking-widest text-xs">{t('categories.title')}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['All', ...categories.map(c => c.name)].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => { setSearchParams({ cat: cat }); setShowFilters(false); }}
                                                className={`px-3 py-2 rounded-lg text-sm transition-all border ${categoryFilter === cat ? 'bg-primary border-primary text-white font-bold' : 'bg-stone-50 border-stone-200 text-stone-600'
                                                    }`}
                                            >
                                                {cat === 'All' ? t('products.all_categories') : cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="w-full btn-primary mt-12"
                                >
                                    {t('products.show_results')}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;
