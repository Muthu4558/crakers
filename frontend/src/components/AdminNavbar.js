import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const AdminNavbar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">🎆 Admin Panel</div>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/admin/dashboard"
              className="text-white hover:text-gray-300 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/crackers"
              className="text-white hover:text-gray-300 transition"
            >
              Crackers
            </Link>
            <Link
              to="/admin/orders"
              className="text-white hover:text-gray-300 transition"
            >
              Orders
            </Link>
            <Link
              to="/admin/users"
              className="text-white hover:text-gray-300 transition"
            >
              Users
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
