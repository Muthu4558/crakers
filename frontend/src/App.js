import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminNavbar from './components/AdminNavbar';

// Customer Pages
import Home from './pages/customer/Home';
import Shop from './pages/customer/Shop';
import CrackerDetail from './pages/customer/CrackerDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import Profile from './pages/customer/Profile';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCrackers from './pages/admin/AdminCrackers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  const { user } = useAuthStore();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      {user?.role === 'admin' ? <AdminNavbar /> : <Navbar />}
      
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cracker/:id" element={<CrackerDetail />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/crackers" element={<AdminRoute><AdminCrackers /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {user?.role !== 'admin' && <Footer />}
    </Router>
  );
}

export default App;
