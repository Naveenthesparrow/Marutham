import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                login(data, data.token);
                navigate('/');
            } else {
                setError(data.message || t('common.error_generic'));
            }
        } catch (err) {
            setError(t('cart.error_network'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-nature-bg px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-nature-border">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-stone-900">{t('auth.join_title')}</h1>
                        <p className="text-stone-500 mt-2">{t('auth.join_subtitle')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest px-1">{t('auth.fullname')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-nature pl-12 py-3.5"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest px-1">{t('auth.email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-nature pl-12 py-3.5"
                                    placeholder={t('auth.email_placeholder')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest px-1">{t('auth.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-nature pl-12 py-3.5"
                                    placeholder={t('auth.password_placeholder')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest px-1">{t('auth.merchant_address')}</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input-nature pl-12 py-3.5"
                                    placeholder={t('auth.address_placeholder')}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 rounded-2xl text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>{t('auth.register_btn')} <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-stone-500">
                        {t('auth.has_account')} <Link to="/login" className="text-primary font-bold hover:underline">{t('nav.login')}</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
