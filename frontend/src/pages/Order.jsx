import React from 'react';
import OrderForm from '../components/OrderForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Order = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Place Your Order</h1>
      <OrderForm />
    </div>
  );
};

export default Order;