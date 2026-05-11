import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">🎆 Crackers</h3>
            <p className="text-gray-400">
              Your trusted online store for quality crackers and festive products.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/shop" className="hover:text-white transition">Shop</a></li>
              <li><a href="/orders" className="hover:text-white transition">Orders</a></li>
              <li><a href="/profile" className="hover:text-white transition">Profile</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/shop?category=Firecrackers" className="hover:text-white transition">Firecrackers</a></li>
              <li><a href="/shop?category=Sparklers" className="hover:text-white transition">Sparklers</a></li>
              <li><a href="/shop?category=Bombs" className="hover:text-white transition">Bombs</a></li>
              <li><a href="/shop?category=Premium" className="hover:text-white transition">Premium</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="flex space-x-4 mb-4">
              <button className="hover:text-gray-300 transition">
                <FiFacebook size={20} />
              </button>
              <button className="hover:text-gray-300 transition">
                <FiTwitter size={20} />
              </button>
              <button className="hover:text-gray-300 transition">
                <FiInstagram size={20} />
              </button>
              <button className="hover:text-gray-300 transition">
                <FiMail size={20} />
              </button>
            </div>
            <p className="text-gray-400">Email: support@crackers.com</p>
            <p className="text-gray-400">Phone: +1-800-CRACKERS</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2026 Crackers. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-gray-400 text-sm">
              <button className="hover:text-white transition">Privacy Policy</button>
              <button className="hover:text-white transition">Terms of Service</button>
              <button className="hover:text-white transition">Shipping Info</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
