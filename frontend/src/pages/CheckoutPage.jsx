// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext ';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/api';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // State for checkout form
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('Standard');
  const [scheduledTime, setScheduledTime] = useState('');
  const [paymentMethod] = useState('Cash on Delivery'); // Default for simplicity
  const [order, setOrder] = useState(null); // State to store the placed order
  const [error, setError] = useState(null); // State to store any errors

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + (item.totalPrice || item.menuItem.price * item.quantity),
      0
    );
  };

  const deliveryFees = {
    Priority: 129.00,
    Standard: 39.00,
    Schedule: 39.00,
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = deliveryFees[deliveryOption] || 39.00;
    const taxesAndFees = subtotal * 0.23; // 23% tax
    return (subtotal + deliveryFee + taxesAndFees).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!deliveryAddress) {
      setError('Please enter a delivery address.');
      return;
    }

    try {
      const orderData = {
        deliveryAddress,
        deliveryInstructions,
        deliveryOption,
        scheduledTime: deliveryOption === 'Schedule' ? scheduledTime : null,
        paymentMethod,
      };

      const response = await createOrder(orderData);
      await clearCart(); // Clear cart after order
      setOrder(response.data); // Set the order to display confirmation
      setError(null); // Clear any previous errors
    } catch (error) {
      setError('Failed to place order: ' + (error.response?.data?.message || error.message));
    }
  };

  // Render confirmation if order is placed
  if (order) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Checkout</h1>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-amber-900">Thank you for your order!</h2>
          <p className="text-amber-700 mt-2">Order ID: {order._id}</p>
          <p className="text-amber-700">Delivery Address: {order.deliveryAddress}</p>
          <p className="text-amber-700">Delivery Option: {order.deliveryOption}</p>
          <p className="text-amber-700">Total: LKR {order.total.toFixed(2)}</p>
          <p className="text-amber-700 mt-2">We’ll deliver your order soon!</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 bg-amber-600 text-white p-2 rounded hover:bg-amber-700"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Render checkout form if no order is placed yet
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-amber-700">Your cart is empty.</p>
        <button
          onClick={() => navigate('/menu')}
          className="mt-4 bg-amber-600 text-white p-2 rounded hover:bg-amber-700"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Checkout</h1>
      <div className="bg-white p-6 rounded shadow">
        {/* Display error if any */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Delivery Address */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Delivery Address</h3>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter delivery address"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Delivery Instructions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Delivery Instructions</h3>
          <textarea
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            placeholder="E.g., Meet at my door"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Delivery Options */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Delivery Options</h3>
          <div className="space-y-2">
            <label className="flex items-center p-2 border rounded">
              <input
                type="radio"
                name="deliveryOption"
                value="Priority"
                checked={deliveryOption === 'Priority'}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="mr-2"
              />
              <span>Priority (10-25 min) - LKR 129.00</span>
            </label>
            <label className="flex items-center p-2 border rounded">
              <input
                type="radio"
                name="deliveryOption"
                value="Standard"
                checked={deliveryOption === 'Standard'}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="mr-2"
              />
              <span>Standard (15-30 min) - LKR 39.00</span>
            </label>
            <label className="flex items-center p-2 border rounded">
              <input
                type="radio"
                name="deliveryOption"
                value="Schedule"
                checked={deliveryOption === 'Schedule'}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="mr-2"
              />
              <span>Schedule - Choose a time</span>
            </label>
            {deliveryOption === 'Schedule' && (
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full p-2 border rounded mt-2"
              />
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Payment Method</h3>
          <p className="text-amber-700">Cash on Delivery</p>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Order Summary</h3>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>LKR {calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>LKR {deliveryFees[deliveryOption].toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & Other Fees</span>
            <span>LKR {(calculateSubtotal() * 0.23).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-amber-900 mt-2">
            <span>Total</span>
            <span>LKR {calculateTotal()}</span>
          </div>
        </div>

        {/* Order and Pay Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-amber-600 text-white p-2 rounded hover:bg-amber-700"
        >
          Order and Pay
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;