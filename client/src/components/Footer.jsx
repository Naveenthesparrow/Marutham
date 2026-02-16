import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-primary p-2 rounded-lg">
                                <Leaf className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-display font-bold text-white tracking-tight">Marutham</span>
                        </Link>
                        <p className="text-stone-400 leading-relaxed">
                            Connecting rural farmers directly with businesses. Premium bulk agricultural products delivered across the nation with guaranteed quality.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-display font-semibold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-primary transition-colors">Bulk Products</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-display font-semibold text-lg mb-6">Categories</h4>
                        <ul className="space-y-4">
                            <li><Link to="/products?cat=Vathal" className="hover:text-primary transition-colors">Dried Vathal</Link></li>
                            <li><Link to="/products?cat=Grains" className="hover:text-primary transition-colors">Organic Grains</Link></li>
                            <li><Link to="/products?cat=Pulses" className="hover:text-primary transition-colors">Native Pulses</Link></li>
                            <li><Link to="/products?cat=Spices" className="hover:text-primary transition-colors">Direct Spices</Link></li>
                            <li><Link to="/products?cat=Cotton" className="hover:text-primary transition-colors">Raw Cotton</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-display font-semibold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span>123 Farmer's Market Street, Coimbatore, Tamil Nadu, 641001</span>
                            </li>
                            <li className="flex gap-3 text-stone-300">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>support@marutham.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
                    <p>© 2026 Marutham Agro Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-stone-300">Privacy Policy</a>
                        <a href="#" className="hover:text-stone-300">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
