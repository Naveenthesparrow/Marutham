import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const UserList = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, config);
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const deleteHandler = async (id) => {
        if (window.confirm(t('admin.confirm_delete_user'))) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, config);
                setUsers(users.filter((user) => user._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    const makeAdminHandler = async (id, currentRole) => {
        if (window.confirm(t('admin.confirm_role_change'))) {
            try {
                // Determine new role: flip it
                const newRole = currentRole === 'admin' ? 'buyer' : 'admin';

                await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${id}`, { role: newRole }, config);

                // Update local state
                setUsers(users.map(user =>
                    user._id === id ? { ...user, role: newRole } : user
                ));
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary-900">{t('admin.users_title')}</h1>
                <Link to="/admin/dashboard" className="text-primary-600 hover:underline">
                    &larr; {t('admin.back_dashboard')}
                </Link>
            </div>

            {loading ? (
                <p>{t('admin.loading')}</p>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.email')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.admin_status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role === 'admin' ? t('admin.yes') : t('admin.no')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => makeAdminHandler(user._id, user.role)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            {user.role === 'admin' ? t('admin.remove_admin') : t('admin.make_admin')}
                                        </button>
                                        <button
                                            onClick={() => deleteHandler(user._id)}
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

export default UserList;
