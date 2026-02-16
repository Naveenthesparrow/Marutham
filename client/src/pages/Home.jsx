import React from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Tag, ArrowRight } from 'lucide-react';

const Home = () => {
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center bg-nature-bg overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
                                Direct from the Fields
                            </span>
                            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-stone-900 leading-[1.1] mb-6">
                                From Farmers to Your <span className="text-primary italic">Business</span>
                            </h1>
                            <p className="text-xl text-stone-600 mb-10 leading-relaxed max-w-2xl">
                                Marutham connects wholesale buyers directly with regional farmers. Get premium bulk agro products including Dried Vathal, Grains, and Spices at factory-direct pricing.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/products" className="btn-primary py-4 px-8 text-lg">
                                    Shop Bulk Now <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/contact" className="btn-secondary py-4 px-8 text-lg">
                                    Partner with Us
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Hero Decorative Image */}
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[70%]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full h-full relative"
                    >
                        <div className="absolute inset-0 bg-stone-200 rounded-3xl overflow-hidden shadow-2xl rotate-3">
                            <img
                                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200"
                                alt="Farmer Field"
                                className="w-full h-full object-cover opacity-90"
                            />
                        </div>
                        <div className="absolute -top-10 -left-10 w-48 h-48 bg-white p-4 rounded-2xl shadow-xl -rotate-6 hidden xl:block">
                            <img
                                src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=300"
                                alt="Vathal"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </motion.div>
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
                            <h3 className="text-xl font-display font-bold mb-3">Farm-Direct Quality</h3>
                            <p className="text-stone-600">Eliminating middlemen to bring you the freshest produce directly from our network of verified regional farmers.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                                <Tag className="w-8 h-8 text-secondary" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-3">True Bulk Pricing</h3>
                            <p className="text-stone-600">The more you buy, the more you save. We offer structured weight-based discounts for retail and wholesale buyers.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-leaf/10 rounded-2xl flex items-center justify-center mb-6">
                                <Truck className="w-8 h-8 text-leaf" />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-3">Pan-India Logistics</h3>
                            <p className="text-stone-600">Integrated logistics tracking ensuring your heavy shipments reach your warehouse safely and on schedule.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Explorer */}
            <section className="py-24 bg-nature-bg">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-display font-extrabold text-stone-900 mb-4">Browse by Category</h2>
                            <p className="text-lg text-stone-600">Wide selection of bulk agriculture products tailored for retail businesses and processors.</p>
                        </div>
                        <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all duration-300">
                            Explore All Categories <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    to={`/products?cat=${cat.name}`}
                                    className="group bg-white p-8 rounded-2xl border border-nature-border hover:border-primary/30 text-center flex flex-col items-center transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2"
                                >
                                    <div className="text-4xl mb-6 bg-nature-bg w-20 h-20 flex items-center justify-center rounded-full group-hover:bg-primary/10 transition-colors">
                                        {cat.icon}
                                    </div>
                                    <h4 className="text-lg font-bold text-stone-800 mb-2">{cat.name}</h4>
                                    <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">{cat.description}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-4xl font-display font-extrabold text-stone-900">Featured Produce</h2>
                        <Link to="/products" className="btn-secondary px-5 py-2">View All Products</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
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
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to scale your business with bulk sourcing?</h2>
                            <p className="text-xl text-primary/10 text-white/80 mb-10">
                                Join 5,000+ businesses across India who trust Marutham for their bulk agricultural needs. Get custom quotes for orders over 1,000kg.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-stone-100 transition-colors shadow-lg">Get Custom Quote</button>
                                <button className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">Call Sales Expert</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
