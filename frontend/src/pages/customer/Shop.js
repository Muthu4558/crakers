import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CrackerCard from '../../components/CrackerCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const Shop = () => {
  const [crackers, setCrackers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Firecrackers', 'Sparklers', 'Bombs', 'Decorative', 'Premium'];

  useEffect(() => {
    const fetchCrackers = async () => {
      try {
        setIsLoading(true);
        let url = 'http://localhost:5000/api/crackers';
        const params = [];

        if (selectedCategory) {
          params.push(`category=${selectedCategory}`);
        }

        if (searchTerm) {
          params.push(`search=${searchTerm}`);
        }

        if (params.length > 0) {
          url += '?' + params.join('&');
        }

        const response = await axios.get(url);
        setCrackers(response.data.crackers);
      } catch (error) {
        console.error('Error fetching crackers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrackers();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shop Crackers</h1>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:space-x-4">
          <input
            type="text"
            placeholder="Search crackers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : crackers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {crackers.map((cracker) => (
              <CrackerCard key={cracker._id} cracker={cracker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600">No crackers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
