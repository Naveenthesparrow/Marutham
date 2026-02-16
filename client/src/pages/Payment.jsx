import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Upload, CheckCircle, Clock, AlertCircle, Copy, Info, ArrowLeft, Camera } from 'lucide-react';

const Payment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [qrData, setQrData] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('none'); // none, pending, verified, rejected
    const [paymentDetails, setPaymentDetails] = useState(null);

    // Mock fetching QR data - in a real app, this would be an API call
    useEffect(() => {
        const fetchQR = async () => {
            // simulate API delay
            setTimeout(() => {
                setQrData({
                    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=marutham@upi%26pn=Marutham%20Agro%26am=5000%26cu=INR%26tn=Order" + orderId,
                    upiId: "marutham@upi",
                    merchantName: "Marutham Agro Store",
                    amount: 5000, // This should come from order details
                    transactionNote: `OrderID-${orderId}`
                });
                setLoading(false);
            }, 1000);
        };

        fetchQR();
        checkStatus();
    }, [orderId]);

    const checkStatus = async () => {
        // Search for existing payment record
        // For demo, we'll keep it as 'none'
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setScreenshot(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!screenshot) return alert('Please upload a screenshot');

        setUploading(true);
        // Simulate upload
        setTimeout(() => {
            setUploading(false);
            setPaymentStatus('pending');
        }, 2000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-nature-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stone-500 font-medium">Initializing Secure Payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-nature-bg min-h-screen pb-20">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto">

                    <Link to="/cart" className="inline-flex items-center gap-2 text-stone-500 hover:text-primary transition-colors mb-8 group font-medium">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Cart
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Payment Section */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-[2.5rem] border border-nature-border p-8 shadow-sm">
                                <h2 className="text-2xl font-display font-bold text-stone-900 mb-6 flex items-center gap-3">
                                    <QrCode className="w-6 h-6 text-primary" /> Scan & Pay
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
                                        Open GPay, PhonePe, or any UPI app to scan this QR and complete the payment of
                                        <span className="font-bold text-stone-900"> ₹{qrData.amount}</span>
                                    </p>

                                    <div className="w-full space-y-4">
                                        <div className="bg-nature-bg rounded-2xl p-4 border border-nature-border flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Merchant VPA</span>
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
                                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Reference Note</span>
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
                                    <Info className="w-4 h-4" /> Secure Payment Guard
                                </h4>
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    Your funds are secure. Post payment, please upload the transaction screenshot. Our team verifies payments every 30 minutes between 9 AM - 9 PM IST.
                                </p>
                            </div>
                        </div>

                        {/* Verification Section */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-[2.5rem] border border-nature-border p-8 shadow-sm h-full flex flex-col">
                                <h2 className="text-2xl font-display font-bold text-stone-900 mb-6 flex items-center gap-3">
                                    <Upload className="w-6 h-6 text-primary" /> Verify Payment
                                </h2>

                                {paymentStatus === 'none' ? (
                                    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                                        <p className="text-stone-600 mb-8">
                                            Once the payment is successful in your banking app, take a screenshot of the receipt and upload it here for verification.
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
                                                        <CheckCircle className="w-12 h-12 text-primary mb-4" />
                                                        <span className="text-primary font-bold">{screenshot.name}</span>
                                                        <span className="text-stone-400 text-xs mt-2">Click to change file</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                                                            <Camera className="w-8 h-8 text-stone-400" />
                                                        </div>
                                                        <span className="font-bold text-stone-700">Choose Screenshot</span>
                                                        <span className="text-stone-400 text-xs mt-2">Maximum file size: 5MB (JPG, PNG)</span>
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
                                                    Uploading...
                                                </div>
                                            ) : 'Confirm Payment Submission'}
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
                                                    <h3 className="text-2xl font-display font-bold text-stone-900 mb-3">Verification Pending</h3>
                                                    <p className="text-stone-500 mb-8 max-w-xs">
                                                        We've received your receipt. Our team is verifying the transaction with the bank.
                                                    </p>
                                                    <div className="bg-nature-bg px-4 py-2 rounded-full border border-nature-border text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                                                        Updates in ~30 mins
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
                                                    <h3 className="text-2xl font-display font-bold text-stone-900 mb-3">Payment Confirmed</h3>
                                                    <p className="text-stone-500 mb-8 max-w-xs">
                                                        Thank you! Your order has been marked as paid and sent to our fulfillment center.
                                                    </p>
                                                    <Link to="/orders" className="btn-primary w-full">View My Orders</Link>
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
