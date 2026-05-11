import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('week');
  const { getAuthHeader } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, chartRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/dashboard/stats', {
          headers: getAuthHeader(),
        }),
        axios.get(`http://localhost:5000/api/admin/dashboard/sales-chart?filter=${filter}`, {
          headers: getAuthHeader(),
        }),
      ]);

      setStats(statsRes.data.stats);
      setChartData(chartRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
      icon: '👥',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      color: 'bg-green-100',
      textColor: 'text-green-600',
      icon: '📦',
    },
    {
      title: 'Total Crackers',
      value: stats.totalCrackers,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
      icon: '🎆',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue}`,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      icon: '💰',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      color: 'bg-red-100',
      textColor: 'text-red-600',
      icon: '⏳',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.color} rounded-lg p-6 shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor} mt-2`}>
                    {card.value}
                  </p>
                </div>
                <div className="text-4xl">{card.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Sales Trend</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#000000" name="Sales (₹)" />
                <Bar dataKey="orders" fill="#808080" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">No sales data available</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
