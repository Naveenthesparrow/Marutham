import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const ProductList = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm(t('admin.confirm_delete_product'))) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, config);
                setProducts(products.filter((product) => product._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm(t('admin.confirm_create_product'))) {
            try {
                // Create a sample product first, then edit it
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/products`,
                    {
                        name: 'Sample Product',
                        pricePerKg: 0,
                        category: 'Spices',
                        description: 'Sample description',
                        imageUrl: '/images/sample.jpg',
                        stock: 'In Stock'
                    },
                    config
                );
                navigate(`/admin/product/${data._id}/edit`);
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary-900">{t('admin.products_title')}</h1>
                <div className="space-x-4">
                    <Link to="/admin/dashboard" className="text-primary-600 hover:underline">
                        &larr; {t('admin.back_dashboard')}
                    </Link>
                    <button
                        onClick={createProductHandler}
                        className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                    >
                        + {t('admin.create_product')}
                    </button>
                </div>
            </div>

            {loading ? (
                <p>{t('admin.loading_products')}</p>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.id')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.name')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.price_kg')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.category')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.pricePerKg}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Link
                                            to={`/admin/product/${product._id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            {t('admin.edit')}
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="text-red-600 hover:text-red-900 ml-4"
                                        >
                                            {t('admin.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductList;
