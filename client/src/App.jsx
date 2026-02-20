import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import UserList from './pages/UserList';
import ProductList from './pages/ProductList';
import ProductEdit from './pages/ProductEdit';

import { useTranslation } from 'react-i18next';

function App() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Update document language and class for styling
  useEffect(() => {
    const lang = i18n.language || 'en';
    document.documentElement.lang = lang;
    if (lang === 'ta') {
      document.documentElement.classList.add('lang-ta');
    } else {
      document.documentElement.classList.remove('lang-ta');
    }
  }, [i18n.language]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment/:orderId" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/userlist" element={
            <AdminRoute>
              <UserList />
            </AdminRoute>
          } />
          <Route path="/admin/productlist" element={
            <AdminRoute>
              <ProductList />
            </AdminRoute>
          } />
          <Route path="/admin/product/:id/edit" element={
            <AdminRoute>
              <ProductEdit />
            </AdminRoute>
          } />
          <Route path="/contact" element={<div className="container mx-auto px-4 py-20 text-center text-4xl font-display font-bold">{t('contact.coming_soon')}</div>} />
        </Routes>
      </main>
      {pathname === '/' && <Footer />}
    </div>
  );
}

export default App;
