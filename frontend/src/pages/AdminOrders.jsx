// src/pages/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllOrders } from '../api/api';
import AdminLayout from '../components/AdminLayout';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!user || user.role !== 'admin') {
        navigate('/');
      }
    }, [user, navigate]);
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await getAllOrders();
          setOrders(response.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to load orders');
          setLoading(false);
          console.error('Fetch Orders Error:', err);
        }
      };
  
      fetchOrders();
    }, []);
  
    if (loading) {
      return <div className="p-4 text-center text-amber-900">Loading orders...</div>;
    }
  
    if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
    }
  
    return (
      <AdminLayout>
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-6">All Orders</h2>
          {orders.length === 0 ? (
            <p className="text-amber-900">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse rounded-lg shadow">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="text-left p-4 border-b">Order ID</th>
                    <th className="text-left p-4 border-b">User</th>
                    <th className="text-left p-4 border-b">Items</th>
                    <th className="text-left p-4 border-b">Delivery Address</th>
                    <th className="text-left p-4 border-b">Total</th>
                    <th className="text-left p-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-amber-50 transition-colors">
                      <td className="p-4 border-b text-amber-900">{order._id}</td>
                      <td className="p-4 border-b text-amber-900">
                        {order.user ? (
                          <>
                            <p>{order.user.name}</p>
                            <p className="text-sm text-gray-500">{order.user.email}</p>
                          </>
                        ) : (
                          'Unknown User'
                        )}
                      </td>
                      <td className="p-4 border-b text-amber-900">
                        <ul className="list-disc pl-4">
                          {order.items.map((item, index) => (
                            <li key={index}>
                              {item.menuItem?.name || 'Unknown Item'} (x{item.quantity}) - $
                              {item.totalPrice.toFixed(2)}
                              {item.customizations?.length > 0 && (
                                <span className="block text-sm text-gray-500">
                                  Customizations: {item.customizations.join(', ')}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 border-b text-amber-900">
                        <p>{order.deliveryAddress}</p>
                        {order.deliveryInstructions && (
                          <p className="text-sm text-gray-500">
                            Instructions: {order.deliveryInstructions}
                          </p>
                        )}
                      </td>
                      <td className="p-4 border-b text-amber-900">${order.total.toFixed(2)}</td>
                      <td className="p-4 border-b">
                        <span
                          className={`px-2 py-1 rounded ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  };
  
  export default AdminOrders;