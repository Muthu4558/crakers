import { create } from "zustand";

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

  login: (userData, token) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      set({
        user: userData,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  },

  logout: () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  updateUser: (updatedUser) => {
    try {
      localStorage.setItem("user", JSON.stringify(updatedUser));

      set({
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update user error:", error);
    }
  },
}));