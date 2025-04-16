// src/components/AdminLayout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="max-w-7xl mx-auto p-4 flex">
      {/* Sidebar */}
      <div className="w-64 bg-amber-50 p-4 rounded-lg mr-4">
        <h3 className="text-lg font-bold text-amber-900 mb-4">Admin Panel</h3>
        <Link
          to="/admin/menu"
          className={`block p-2 rounded ${
            isActive('/admin/menu') ? 'bg-amber-200 text-amber-900' : 'hover:bg-amber-100'
          }`}
        >
          Menu Items
        </Link>
        <Link
          to="/admin/orders"
          className={`block p-2 rounded ${
            isActive('/admin/orders') ? 'bg-amber-200 text-amber-900' : 'hover:bg-amber-100'
          }`}
        >
          Orders
        </Link>
      </div>
      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AdminLayout;