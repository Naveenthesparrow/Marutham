import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Leaf, User, LogOut, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'My Orders', path: '/orders' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-nature-border">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                            <Leaf className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-display font-bold text-primary tracking-tight">Marutham</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-stone-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center bg-nature-bg px-4 py-2 rounded-full border border-nature-border focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Search className="w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search bulk products..."
                                className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-stone-700"
                            />
                        </div>

                        {user ? (
                            <div className="hidden lg:flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-nature-bg px-3 py-1.5 rounded-full border border-nature-border">
                                    <User className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-bold text-stone-700 max-w-[100px] truncate">{user.name}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link to="/login" className="text-sm font-bold text-stone-600 hover:text-primary px-4 py-2">Sign In</Link>
                                <Link to="/register" className="btn-primary text-xs py-2 px-4 rounded-full">Register</Link>
                            </div>
                        )}

                        <Link to="/cart" className="relative p-2 text-stone-600 hover:text-primary transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            className="md:hidden p-2 text-stone-600"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-nature-border overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-lg font-medium ${location.pathname === link.path ? 'text-primary' : 'text-stone-600'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="border-t border-nature-border pt-4 mt-2">
                                {user ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-stone-900 font-bold">{user.name}</span>
                                                <Link to="/orders" onClick={() => setIsOpen(false)} className="text-primary text-xs font-bold hover:underline">View My Orders</Link>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { logout(); setIsOpen(false); }}
                                            className="flex items-center gap-3 text-stone-600 hover:text-red-500 font-medium px-2 py-2"
                                        >
                                            <LogOut className="w-5 h-5" /> Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 text-stone-600 font-medium px-2 py-2"
                                        >
                                            <LogIn className="w-5 h-5" /> Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="btn-primary w-full text-center py-3 rounded-xl"
                                        >
                                            Create Account
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center bg-nature-bg px-4 py-3 rounded-xl border border-nature-border mt-2">
                                <Search className="w-5 h-5 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="bg-transparent border-none outline-none text-base ml-2 w-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
