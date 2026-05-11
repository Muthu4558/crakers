import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const CrackerCard = ({ cracker }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(cracker);
    toast.success('Added to cart!');
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
      data-aos="fade-up"
    >
      <div className="relative overflow-hidden h-48 bg-gray-100">
        <img
          src={cracker.image}
          alt={cracker.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded text-sm">
          {cracker.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-black mb-2 line-clamp-2">
          {cracker.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {cracker.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          {cracker.stock > 0 ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              In Stock
            </span>
          ) : (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-black">
            ₹{cracker.price}
          </div>
          <Link
            to={`/cracker/${cracker._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
          >
            View
          </Link>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={cracker.stock === 0}
          className="w-full mt-3 bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <FiShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </motion.div>
  );
};

export default CrackerCard;
