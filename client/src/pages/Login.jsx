import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
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

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const { email, name, picture } = decoded;

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name,
                    googleId: decoded.sub,
                    photo: picture
                }),
            });

            const data = await res.json();
            if (res.ok) {
                login(data, data.token);
                navigate('/');
            } else {
                setError(data.message || t('common.error_generic'));
            }
        } catch (err) {
            console.error(err);
            setError(t('common.error_generic'));
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-nature-bg px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-nature-border">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <LogIn className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-stone-900">{t('auth.welcome_back')}</h1>
                        <p className="text-stone-500 mt-2">{t('auth.login_info')}</p>
                    </div>

                    <div className="mb-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                setError(t('common.error_generic'));
                            }}
                            useOneTap
                        />
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">{t('auth.google_login')}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest px-1">{t('auth.email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-nature pl-12 py-4"
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
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-nature pl-12 py-4"
                                    placeholder={t('auth.password_placeholder')}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 rounded-2xl text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>{t('auth.login_btn')} <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-stone-500">
                        {t('auth.no_account')} <Link to="/register" className="text-primary font-bold hover:underline">{t('nav.register')}</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
