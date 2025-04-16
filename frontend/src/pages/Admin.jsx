// src/pages/Admin.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminMenuForm from '../components/AdminMenuForm';

const Admin = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Panel</h1>
      <p className="text-gray-600 text-center mb-6">Welcome, {user.name}! Add new menu items below.</p>
      <AdminMenuForm />
    </div>
  );
};

export default Admin;