import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCrackers = () => {
  const [crackers, setCrackers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Firecrackers',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const { getAuthHeader } = useAuthStore();

  const categories = ['Firecrackers', 'Sparklers', 'Bombs', 'Decorative', 'Premium'];

  useEffect(() => {
    fetchCrackers();
  }, []);

  const fetchCrackers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crackers');
      setCrackers(response.data.crackers);
    } catch (error) {
      console.error('Error fetching crackers:', error);
      toast.error('Failed to fetch crackers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      toast.error('Please fill all fields');
      return;
    }

    if (!editingId && !imageFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/crackers/${editingId}`,
          data,
          { headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Cracker updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/crackers', data, {
          headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Cracker added successfully');
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Firecrackers',
        stock: '',
      });
      setImageFile(null);
      setImagePreview('');
      setEditingId(null);
      setShowForm(false);
      fetchCrackers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save cracker');
    }
  };

  const handleEdit = (cracker) => {
    setFormData(cracker);
    setImagePreview(cracker.image ? `http://localhost:5000${cracker.image}` : '');
    setEditingId(cracker._id);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Cracker?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/crackers/${id}`, {
            headers: getAuthHeader(),
          });
          toast.success('Cracker deleted successfully');
          fetchCrackers();
        } catch (error) {
          toast.error('Failed to delete cracker');
        }
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">Manage Crackers</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (editingId) {
                setEditingId(null);
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  category: 'Firecrackers',
                  stock: '',
                });
                setImageFile(null);
                setImagePreview('');
              }
            }}
            className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition"
          >
            <FiPlus size={20} />
            <span>Add Cracker</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 shadow-md mb-8"
          >
            <h2 className="text-2xl font-bold text-black mb-6">
              {editingId ? 'Edit Cracker' : 'Add New Cracker'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Cracker Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                rows="4"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 transition"
                >
                  {editingId ? 'Update' : 'Add'} Cracker
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category: 'Firecrackers',
                      stock: '',
                    });
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="border border-gray-300 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Crackers Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {crackers.map((cracker) => (
                  <tr key={cracker._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-black font-medium">{cracker.name}</td>
                    <td className="px-6 py-4 text-gray-600">{cracker.category}</td>
                    <td className="px-6 py-4 text-gray-600">₹{cracker.price}</td>
                    <td className="px-6 py-4 text-gray-600">{cracker.stock}</td>
                    <td className="px-6 py-4 space-x-3 flex">
                      <button
                        onClick={() => handleEdit(cracker)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(cracker._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCrackers;
