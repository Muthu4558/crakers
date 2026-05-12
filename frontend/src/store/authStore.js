import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BASE_URL;

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (
      !storedUser ||
      storedUser === "undefined" ||
      storedUser === "null"
    ) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null;
  }
};

const getStoredToken = () => {
  try {
    const storedToken = localStorage.getItem("token");

    if (
      !storedToken ||
      storedToken === "undefined" ||
      storedToken === "null"
    ) {
      return null;
    }

    return storedToken;
  } catch (error) {
    console.error("Error getting stored token:", error);
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),

  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      set({
        user,
        token,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed"
      );
    }
  },

  adminLogin: async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/admin/login`,
        {
          email,
          password,
        }
      );

      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      set({
        user,
        token,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Admin login failed"
      );
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));

    set({
      user: updatedUser,
    });
  },
}));