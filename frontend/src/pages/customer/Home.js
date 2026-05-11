import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import CrackerCard from '../../components/CrackerCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const Home = () => {
  const [crackers, setCrackers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCrackers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crackers?limit=8');
        setCrackers(response.data.crackers);
      } catch (error) {
        console.error('Error fetching crackers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrackers();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Light Up Your Celebrations 🎆
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Premium quality crackers and fireworks for all your festive moments
            </p>
            <div className="flex space-x-4">
              <Link
                to="/shop"
                className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
              <Link
                to="/shop"
                className="border-2 border-white px-8 py-3 rounded font-semibold hover:bg-white hover:text-black transition"
              >
                View Catalog
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-6xl text-center"
          >
            🎇 🎆 🎇
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {crackers.slice(0, 8).map((cracker) => (
                <CrackerCard key={cracker._id} cracker={cracker} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-lg shadow text-center"
            >
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping to your doorstep within 2-3 days
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-lg shadow text-center"
            >
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Multiple payment options with secure transactions
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-lg shadow text-center"
            >
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Hand-selected crackers with guaranteed quality and safety
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
