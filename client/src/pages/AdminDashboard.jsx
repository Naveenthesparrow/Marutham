import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold mb-8 text-primary-900">{t('admin.dashboard')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-primary-800">{t('admin.product_mgmt')}</h2>
                    <p className="text-gray-600 mb-6">{t('admin.product_info')}</p>
                    <Link
                        to="/admin/productlist"
                        className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
                    >
                        {t('admin.manage_products')}
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-primary-800">{t('admin.user_mgmt')}</h2>
                    <p className="text-gray-600 mb-6">{t('admin.user_info')}</p>
                    <Link
                        to="/admin/userlist"
                        className="inline-block bg-secondary-sea-green text-white px-6 py-2 rounded-md hover:opacity-90 transition"
                    >
                        {t('admin.manage_users')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
