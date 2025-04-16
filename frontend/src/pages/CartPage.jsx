// src/pages/CartPage.jsx
import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext ';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();

  // Fetch cart only on mount
  useEffect(() => {
    if (cart === null) { // Only fetch if cart hasn’t loaded yet
      fetchCart();
    }
  }, [fetchCart, cart]); // Add cart to dependencies to avoid redundant fetches

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.totalPrice || item.menuItem.price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleClearCart = () => {
    if (window.confirm('Clear your cart?')) {
      clearCart(); // Call context’s clearCart
    }
  };

  if (cart === null) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Your Cart</h1>
      {(!cart || cart.items.length === 0) ? (
        <div className="text-center p-8 bg-white rounded shadow">
          <p className="text-amber-700">Your cart is empty.</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 bg-amber-600 text-white p-2 rounded hover:bg-amber-700"
          >
            Back to Menu
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          {cart.items.map(item => (
            <div key={item._id} className="flex justify-between items-center py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold text-amber-900">{item.menuItem.name}</h2>
                <p className="text-amber-700">
                  ${item.totalPrice ? (item.totalPrice / item.quantity).toFixed(2) : item.menuItem.price.toFixed(2)} x {item.quantity}
                </p>
                {item.customizations.length > 0 && (
                  <p className="text-sm text-amber-600">{item.customizations.join(', ')}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="text-amber-600"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="text-amber-600"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold text-amber-900">Total: ${calculateTotal()}</p>
            <div>
              <button
                onClick={handleClearCart}
                className="mr-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-amber-600 text-white p-2 rounded hover:bg-amber-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;