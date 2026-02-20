import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const ProductEdit = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [name, setName] = useState('');
    const [pricePerKg, setPricePerKg] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('In Stock');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                setName(data.name);
                setPricePerKg(data.pricePerKg);
                setImageUrl(data.imageUrl);
                setCategory(data.category);
                setDescription(data.description);
                setStock(data.stock);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/products/${id}`,
                {
                    name,
                    pricePerKg,
                    imageUrl,
                    category,
                    description,
                    stock,
                },
                config
            );
            navigate('/admin/productlist');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const uploadConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, uploadConfig);

            setImageUrl(data);
            setUploading(false);
        } catch (err) {
            console.error(err);
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/admin/productlist" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
                &larr; {t('admin.go_back')}
            </Link>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-primary-900">{t('admin.edit_product_title')}</h1>

                {loading ? (
                    <p>{t('admin.loading')}</p>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">{t('admin.name')}</label>
                            <input
                                type="text"
                                placeholder={t('admin.enter_name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">{t('admin.price_kg')}</label>
                            <input
                                type="number"
                                placeholder={t('admin.enter_price')}
                                value={pricePerKg}
                                onChange={(e) => setPricePerKg(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">{t('admin.image_url')}</label>
                            <input
                                type="text"
                                placeholder={t('admin.enter_image_url')}
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">{t('admin.category')}</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">{t('admin.select_category')}</option>
                                <option value="Vathal">Vathal</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Grains">Grains</option>
                                <option value="Pulses">Pulses</option>
                                <option value="Spices">Spices</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">{t('admin.stock_status')}</label>
                            <select
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="In Stock">{t('admin.in_stock')}</option>
                                <option value="Out of Stock">{t('admin.out_of_stock')}</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">{t('admin.description')}</label>
                            <textarea
                                placeholder={t('admin.enter_description')}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            {t('admin.update_product')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductEdit;
