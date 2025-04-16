// src/components/ReservationForm.jsx
import React, { useState } from 'react';
import { createReservation } from '../api/api';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    customer: { name: '', email: '', phone: '' },
    date: '',
    partySize: 1,
    specialRequests: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createReservation(formData);
      setSuccess('Reservation created successfully!');
      setError(null);
      setFormData({
        customer: { name: '', email: '', phone: '' },
        date: '',
        partySize: 1,
        specialRequests: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
      setSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Make a Reservation</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <input
        type="text"
        placeholder="Name"
        value={formData.customer.name}
        onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, name: e.target.value } })}
        className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.customer.email}
        onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, email: e.target.value } })}
        className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.customer.phone}
        onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, phone: e.target.value } })}
        className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="datetime-local"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Party Size"
        value={formData.partySize}
        onChange={(e) => setFormData({ ...formData, partySize: Number(e.target.value) })}
        min="1"
        className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Special Requests"
        value={formData.specialRequests}
        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
        className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
        Book Reservation
      </button>
    </form>
  );
};

export default ReservationForm;