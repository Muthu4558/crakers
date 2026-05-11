import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
});

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-8"
        >
          <h1 className="text-4xl font-bold text-black mb-8">My Profile</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="1234567890"
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Address
                </label>
                <input
                  {...register('address')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  City
                </label>
                <input
                  {...register('city')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  State
                </label>
                <input
                  {...register('state')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="NY"
                />
                {errors.state && (
                  <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Zip Code
                </label>
                <input
                  {...register('zipCode')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="10001"
                />
                {errors.zipCode && (
                  <p className="text-red-600 text-sm mt-1">{errors.zipCode.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
