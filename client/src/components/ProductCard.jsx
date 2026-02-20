import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, Edit2, X, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product, onDelete, onUpdate }) => {
    const { t } = useTranslation();
    const { isAdmin, token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: product.name,
        pricePerKg: product.price,
        stock: product.stock,
        imageUrl: product.image,
        description: product.description,
        category: product.category
    });

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                const updatedData = await res.json();
                const mappedProduct = {
                    id: updatedData._id,
                    name: updatedData.name,
                    category: updatedData.category,
                    price: updatedData.pricePerKg,
                    image: updatedData.imageUrl,
                    description: updatedData.description,
                    bulkOptions: updatedData.bulkOptions,
                    stock: updatedData.stock
                };
                if (onUpdate) onUpdate(mappedProduct);
                setIsEditing(false);
            } else {
                alert(t('product.error_update'));
            }
        } catch (err) {
            console.error(err);
            alert(t('product.error_generic'));
        }
    };

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm(t('product.alert_delete'))) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    if (onDelete) onDelete(product.id);
                } else {
                    const errorData = await res.json();
                    alert(`${t('product.error_delete')}: ${errorData.message || t('common.error')}`);
                }
            } catch (err) {
                console.error(err);
                alert(t('product.error_generic'));
            }
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -10 }}
                className="card-nature group h-full flex flex-col relative"
            >
                {isAdmin && (
                    <div className="absolute top-2 right-2 z-30 flex gap-2">
                        <button
                            onClick={handleEditClick}
                            className="bg-white p-2 rounded-full shadow-md text-stone-600 hover:text-primary hover:bg-stone-50 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="bg-white p-2 rounded-full shadow-md text-stone-600 hover:text-red-500 hover:bg-stone-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary border border-primary/20">
                        {product.category}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Link
                            to={`/product/${product.id}`}
                            className="bg-white text-primary px-4 py-2 rounded-lg font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl"
                        >
                            {t('product.view_details')}
                        </Link>
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-stone-600">{product.rating}</span>
                        <span className="text-xs text-stone-400">({product.reviews})</span>
                    </div>

                    <h3 className="text-lg font-display font-semibold text-stone-900 group-hover:text-primary transition-colors mb-1 line-clamp-1 leading-snug">
                        {product.name}
                    </h3>

                    <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xl font-bold text-primary">₹{product.price}</span>
                        <span className="text-sm text-stone-500 font-medium">/ {product.unit}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-nature-border flex items-center justify-between mt-auto">
                        <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                            {t('product.min_order')}: {product.bulkOptions && product.bulkOptions[0] ? product.bulkOptions[0].quantity : '1'}{product.unit}
                        </div>
                        <Link
                            to={`/product/${product.id}`}
                            className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            {t('product.bulk_pricing')} <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-stone-900">{t('modals.edit_product')}</h3>
                                <button
                                    onClick={() => setIsEditing(false)}
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
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="input-nature w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('modals.label_price')}</label>
                                    <input
                                        type="number"
                                        value={editForm.pricePerKg}
                                        onChange={(e) => setEditForm({ ...editForm, pricePerKg: e.target.value })}
                                        className="input-nature w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('modals.label_stock')}</label>
                                    <input
                                        type="number"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                        className="input-nature w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('modals.label_image_url')}</label>
                                    <input
                                        type="text"
                                        value={editForm.imageUrl}
                                        onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                        className="input-nature w-full"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-3 font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        onClick={handleUpdate}
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
        </>
    );
};

export default ProductCard;
