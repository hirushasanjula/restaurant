import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getMenuItems } from '../api/api';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';

const AdminMenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setNotification(location.state.message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setNotification('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await getMenuItems();
        setMenuItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu items');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="p-4 text-center text-amber-900">Loading menu items...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-amber-900">Menu Items Management</h2>
          <Link
            to="/admin/menu/new"
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
          >
            Add New Item
          </Link>
        </div>

        {notification && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {notification}
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Filter by name or category..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse rounded-lg shadow">
            <thead>
              <tr className="bg-amber-100">
                <th className="text-left p-4 border-b">Image</th>
                <th className="text-left p-4 border-b">Name</th>
                <th className="text-left p-4 border-b">Category</th>
                <th className="text-left p-4 border-b">Price</th>
                <th className="text-left p-4 border-b">Available</th>
                <th className="text-left p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-amber-50 transition-colors">
                    <td className="p-4 border-b">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="p-4 border-b text-amber-900">{item.name}</td>
                    <td className="p-4 border-b capitalize text-amber-900">
                      {item.category}
                      {item.subcategory && (
                        <span className="text-gray-500 text-sm block">{item.subcategory}</span>
                      )}
                    </td>
                    <td className="p-4 border-b text-amber-900">${item.price.toFixed(2)}</td>
                    <td className="p-4 border-b">
                      <span
                        className={`px-2 py-1 rounded ${
                          item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4 border-b">
                      <Link
                        to={`/admin/menu/edit/${item._id}`}
                        className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors mr-2"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-amber-900">
                    No menu items found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMenuList;