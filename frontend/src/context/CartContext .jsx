// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../api/api';

// Create context
const CartContext = createContext();

// Create provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch initial cart from backend
  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Fetch Cart Error:', error);
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    fetchCart();
  }, []); // Empty dependency array: only runs on mount

  // Update item count whenever cart changes
  useEffect(() => {
    if (cart && cart.items) {
      const count = cart.items.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    } else {
      setCartItemCount(0);
    }
  }, [cart]); // Only depends on cart

  const addToCart = async (item) => {
    try {
      const cartItem = {
        menuItemId: item._id,
        quantity: item.quantity,
        customizations: item.customizations,
        totalPrice: item.totalPrice,
      };
      const response = await apiAddToCart(cartItem);
      setCart(response.data);
    } catch (error) {
      console.error('Add to Cart Error:', error);
      alert('Failed to add to cart: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await updateCartItem({ itemId, quantity });
      setCart(response.data);
    } catch (error) {
      console.error('Update Quantity Error:', error);
      alert('Failed to update quantity: ' + (error.response?.data?.message || error.message));
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      console.log('Attempting to remove item:', itemId); // Debug
      const response = await apiRemoveFromCart(itemId);
      console.log('Remove from Cart Response:', response); // Debug
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      setCart(response.data);
    } catch (error) {
      console.error('Remove from Cart Error:', error);
      setCart(prevCart => {
        if (prevCart && prevCart.items) {
          return {
            ...prevCart,
            items: prevCart.items.filter(item => item._id !== itemId),
          };
        }
        return prevCart;
      });
      alert('Failed to remove item: ' + (error.response?.data?.message || error.message));
    }
  };

  const clearCart = async () => {
    try {
      await apiClearCart(); // Call backend to clear cart
      setCart({ items: [] }); // Update local state
    } catch (error) {
      console.error('Clear Cart Error:', error);
      alert('Failed to clear cart: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartItemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;