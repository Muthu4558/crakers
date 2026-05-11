import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem('cart')) || [],

  addToCart: (cracker) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item._id === cracker._id);

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item._id === cracker._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      set({ cart: updatedCart });
    } else {
      const updatedCart = [...cart, { ...cracker, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      set({ cart: updatedCart });
    }
  },

  removeFromCart: (crackerId) => {
    const updatedCart = get().cart.filter(item => item._id !== crackerId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  updateQuantity: (crackerId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(crackerId);
      return;
    }

    const updatedCart = get().cart.map(item =>
      item._id === crackerId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  clearCart: () => {
    localStorage.setItem('cart', JSON.stringify([]));
    set({ cart: [] });
  },

  getTotal: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },
}));
