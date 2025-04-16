// src/components/OrderForm.jsx
import React, { useState } from 'react';
import { createOrder } from '../api/api';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    customer: { name: '', email: '', phone: '' },
    items: [{ menuItem: '', quantity: 1, specialInstructions: '' }],
    totalAmount: 0,
    orderType: 'dine-in',
    deliveryAddress: { street: '', city: '', state: '', zipCode: '' },
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createOrder(formData);
      console.log('Order placed:', response.data);
      setError(null);
      setFormData({
        customer: { name: '', email: '', phone: '' },
        items: [{ menuItem: '', quantity: 1, specialInstructions: '' }],
        totalAmount: 0,
        orderType: 'dine-in',
        deliveryAddress: { street: '', city: '', state: '', zipCode: '' },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Place an Order</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <input
        type="text"
        placeholder="Name"
        value={formData.customer.name}
        onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, name: e.target.value } })}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.customer.email}
        onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, email: e.target.value } })}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.customer.phone}
        onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, phone: e.target.value } })}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        placeholder="Menu Item ID"
        value={formData.items[0].menuItem}
        onChange={(e) => setFormData({ ...formData, items: [{ ...formData.items[0], menuItem: e.target.value }] })}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={formData.items[0].quantity}
        onChange={(e) => setFormData({ ...formData, items: [{ ...formData.items[0], quantity: Number(e.target.value) }] })}
        className="w-full p-2 mb-2 border rounded"
      />
      <select
        value={formData.orderType}
        onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="dine-in">Dine-In</option>
        <option value="takeout">Takeout</option>
        <option value="delivery">Delivery</option>
      </select>
      {formData.orderType === 'delivery' && (
        <>
          <input
            type="text"
            placeholder="Street"
            value={formData.deliveryAddress.street}
            onChange={(e) => setFormData({ ...formData, deliveryAddress: { ...formData.deliveryAddress, street: e.target.value } })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="City"
            value={formData.deliveryAddress.city}
            onChange={(e) => setFormData({ ...formData, deliveryAddress: { ...formData.deliveryAddress, city: e.target.value } })}
            className="w-full p-2 mb-2 border rounded"
          />
        </>
      )}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Place Order
      </button>
    </form>
  );
};

export default OrderForm;