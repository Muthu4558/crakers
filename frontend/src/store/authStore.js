import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,

  register: async (name, email, password, confirmPassword) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || 'Login failed';
    }
  },

  adminLogin: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || 'Admin login failed';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    set({ user: null, token: null });
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || 'Update failed';
    }
  },

  getAuthHeader: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
}));
