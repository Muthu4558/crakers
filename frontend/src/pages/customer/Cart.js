import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-black hover:text-gray-600 mb-8 transition"
        >
          <FiArrowLeft size={20} />
          <span>Back</span>
        </button>

        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600 mb-8">Your cart is empty</p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-black mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        ₹{item.price} each
                      </p>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, Math.max(1, item.quantity - 1))
                          }
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item._id, parseInt(e.target.value) || 1)
                          }
                          className="w-12 border border-gray-300 rounded px-2 py-1 text-center"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-lg text-black mb-4">
                        ₹{item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 border-b border-gray-200 pb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{getTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{Math.round(getTotal() * 0.18)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-black mb-6">
                  <span>Total</span>
                  <span>₹{getTotal() + Math.round(getTotal() * 0.18)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition mb-3"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/shop"
                  className="block text-center text-black border border-black py-3 rounded font-semibold hover:bg-black hover:text-white transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
