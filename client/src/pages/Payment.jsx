import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { QrCode, Upload, CheckCircle, Clock, AlertCircle, Copy, Info, ArrowLeft, Camera } from 'lucide-react';

const Payment = () => {
    const { t } = useTranslation();
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [qrData, setQrData] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('none'); // none, pending, verified, rejected
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQR = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ orderId, amount: 5000 }) // Amount should be dynamic in real app
                });
                const data = await response.json();
                if (response.ok) {
                    setQrData(data);
                } else {
                    setError(data.message || t('payment.error_qr'));
                }
            } catch (err) {
                setError(t('payment.error_qr'));
            } finally {
                setLoading(false);
            }
        };

        const checkStatus = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/status/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setPaymentStatus(data.paymentStatus);
                }
            } catch (err) {
                // Silent fail for status check
            }
        };

        if (token) {
            fetchQR();
            checkStatus();
        }
    }, [orderId, token, t]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setScreenshot(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!screenshot) return alert(t('payment.error_upload'));

        setUploading(true);
        const formData = new FormData();
        formData.append('screenshot', screenshot);
        formData.append('orderId', orderId);
        formData.append('userId', user._id);
        formData.append('amount', qrData.amount);
        formData.append('transactionNote', qrData.transactionNote);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setPaymentStatus('pending');
            } else {
                const data = await response.json();
                alert(data.message || t('cart.error_place'));
            }
        } catch (err) {
            alert(t('cart.error_network'));
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert(t('payment.copied'));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-nature-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stone-500 font-medium">{t('payment.initializing')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-nature-bg min-h-screen pb-20">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto">

                    <Link to="/cart" className="inline-flex items-center gap-2 text-stone-500 hover:text-primary transition-colors mb-8 group font-medium">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('payment.back_to_cart')}
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Payment Section */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-[2.5rem] border border-nature-border p-8 shadow-sm">
                                <h2 className="text-2xl font-display font-bold text-stone-900 mb-6 flex items-center gap-3">
                                    <QrCode className="w-6 h-6 text-primary" /> {t('payment.scan_pay')}
                                </h2>

                                <div className="flex flex-col items-center">
                                    <div className="bg-nature-bg p-6 rounded-3xl border border-nature-border mb-6">
                                        <img
                                            src={qrData.qrCode}
                                            alt="Payment QR Code"
                                            className="w-64 h-64 object-contain mix-blend-multiply"
                                        />
                                    </div>

                                    <p className="text-stone-500 text-sm mb-8 text-center px-4">
                                        {t('payment.scan_info')}
                                        <span className="font-bold text-stone-900"> ₹{qrData.amount}</span>
                                    </p>

                                    <div className="w-full space-y-4">
                                        <div className="bg-nature-bg rounded-2xl p-4 border border-nature-border flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{t('payment.merchant_vpa')}</span>
                                                <span className="font-bold text-stone-700">{qrData.upiId}</span>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(qrData.upiId)}
                                                className="p-2 hover:bg-white rounded-xl transition-colors text-primary"
                                            >
                                                <Copy className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="bg-nature-bg rounded-2xl p-4 border border-nature-border flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{t('payment.ref_note')}</span>
                                                <span className="font-bold text-stone-700">{qrData.transactionNote}</span>
                                            </div>
                                            <div className="p-2 text-stone-300">
                                                <Info className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                                    <Info className="w-4 h-4" /> {t('payment.guard_title')}
                                </h4>
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    {t('payment.guard_text')}
                                </p>
                            </div>
                        </div>

                        {/* Verification Section */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-[2.5rem] border border-nature-border p-8 shadow-sm h-full flex flex-col">
                                <h2 className="text-2xl font-display font-bold text-stone-900 mb-6 flex items-center gap-3">
                                    <Upload className="w-6 h-6 text-primary" /> {t('payment.verify_title')}
                                </h2>

                                {paymentStatus === 'none' ? (
                                    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                                        <p className="text-stone-600 mb-8">
                                            {t('payment.verify_text')}
                                        </p>

                                        <div className="relative group flex-grow mb-8">
                                            <input
                                                type="file"
                                                id="screenshot"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="screenshot"
                                                className={`w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${screenshot ? 'border-primary bg-primary/5' : 'border-stone-200 hover:border-primary/50 bg-nature-bg'
                                                    }`}
                                            >
                                                {screenshot ? (
                                                    <div className="flex flex-col items-center">
                                                        <CheckCircle className="w-12 h-12 text-leaf mb-4" />
                                                        <span className="text-primary font-bold">{screenshot.name}</span>
                                                        <span className="text-stone-400 text-xs mt-2">{t('payment.click_change')}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                                                            <Camera className="w-8 h-8 text-stone-400" />
                                                        </div>
                                                        <span className="font-bold text-stone-700">{t('payment.choose_screenshot')}</span>
                                                        <span className="text-stone-400 text-xs mt-2">{t('payment.max_size')}</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!screenshot || uploading}
                                            className="w-full btn-primary py-5 rounded-2xl text-xl shadow-xl shadow-primary/20 disabled:bg-stone-200 disabled:shadow-none transition-all"
                                        >
                                            {uploading ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    {t('payment.uploading')}
                                                </div>
                                            ) : t('payment.confirm_btn')}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                                        <AnimatePresence mode='wait'>
                                            {paymentStatus === 'pending' && (
                                                <motion.div
                                                    key="pending"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100">
                                                        <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
                                                    </div>
                                                    <h3 className="text-2xl font-display font-bold text-stone-900 mb-3">{t('payment.pending_title')}</h3>
                                                    <p className="text-stone-500 mb-8 max-w-xs">
                                                        {t('payment.pending_text')}
                                                    </p>
                                                    <div className="bg-nature-bg px-4 py-2 rounded-full border border-nature-border text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                                                        {t('payment.updates_info')}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {paymentStatus === 'verified' && (
                                                <motion.div
                                                    key="verified"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div className="w-24 h-24 bg-leaf/10 rounded-full flex items-center justify-center mb-6 border border-leaf/20">
                                                        <CheckCircle className="w-12 h-12 text-leaf" />
                                                    </div>
                                                    <h3 className="text-2xl font-display font-bold text-stone-900 mb-3">{t('payment.verified_title')}</h3>
                                                    <p className="text-stone-500 mb-8 max-w-xs">
                                                        {t('payment.verified_text')}
                                                    </p>
                                                    <Link to="/orders" className="btn-primary w-full">{t('nav.view_orders')}</Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
