import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cartStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const CrackerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cracker, setCracker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchCracker = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/crackers/${id}`);
        setCracker(response.data.cracker);
      } catch (error) {
        console.error('Error fetching cracker:', error);
        navigate('/shop');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCracker();
  }, [id, navigate]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(cracker);
    }
    toast.success(`Added ${quantity} item(s) to cart!`);
    setQuantity(1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!cracker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Cracker not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-black hover:text-gray-600 mb-8 transition"
        >
          <FiArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-100 h-96 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <img
              src={cracker.image}
              alt={cracker.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-6 inline-block bg-black text-white px-4 py-2 rounded text-sm">
              {cracker.category}
            </div>

            <h1 className="text-4xl font-bold text-black mb-4">{cracker.name}</h1>

            <p className="text-gray-600 text-lg mb-6">{cracker.description}</p>

            {/* Price */}
            <div className="text-4xl font-bold text-black mb-6">
              ₹{cracker.price}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {cracker.stock > 0 ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-semibold">
                    In Stock ({cracker.stock} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity */}
            {cracker.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={cracker.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.min(cracker.stock, Math.max(1, parseInt(e.target.value) || 1)))
                    }
                    className="w-16 border border-gray-300 rounded px-3 py-2 text-center"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(cracker.stock, quantity + 1))}
                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={cracker.stock === 0}
              className="w-full bg-black text-white py-4 rounded font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
            >
              <FiShoppingCart size={24} />
              <span>Add to Cart</span>
            </button>

            {/* Additional Info */}
            <div className="mt-12 space-y-4 border-t border-gray-200 pt-8">
              <div>
                <h3 className="font-semibold text-black mb-2">Product Details</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Category: {cracker.category}</li>
                  <li>• Stock Available: {cracker.stock}</li>
                  <li>• Price: ₹{cracker.price}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-2">Shipping Information</h3>
                <p className="text-gray-600">
                  Free shipping on orders above ₹500. Delivery within 2-3 business days.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CrackerDetail;
