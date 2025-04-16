import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenuItem, updateMenuItem, deleteMenuItem } from '../api/api';
import { useAuth } from '../context/AuthContext';

const AdminMenuEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    image: null,
    currentImage: '',
    available: true,
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Check for admin role
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    // Fetch menu item data
    const fetchMenuItem = async () => {
      try {
        const response = await getMenuItem(id);
        const item = response.data;
        
        setFormData({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          subcategory: item.subcategory || '',
          image: null,
          currentImage: item.image || '',
          available: item.available,
        });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load menu item data');
        setIsLoading(false);
      }
    };
    
    fetchMenuItem();
  }, [id, user, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', Number(formData.price));
    data.append('category', formData.category);
    data.append('subcategory', formData.subcategory);
    if (formData.image) {
      data.append('image', formData.image);
    }
    data.append('available', formData.available);
    // Don't send currentImage to the server - the server will keep the existing image
    // if no new image is provided
  
    try {
      await updateMenuItem(id, data);
      setSuccess('Menu item updated successfully!');
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update menu item');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      await deleteMenuItem(id);
      navigate('/admin/menu', { state: { message: 'Menu item deleted successfully' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete menu item');
      setDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading menu item data...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Menu Item</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          step="0.01"
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Category</option>
          <option value="appetizer">Appetizer</option>
          <option value="main">Main</option>
          <option value="pizza">Pizza</option>
          <option value="burger">Burger</option>
          <option value="dessert">Dessert</option>
          <option value="beverage">Beverage</option>
        </select>
        <select
          value={formData.subcategory}
          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Subcategory (optional)</option>
          <option value="vegie">Vegie</option>
          <option value="chicken">Chicken</option>
          <option value="beef">Beef</option>
          <option value="spicy">Spicy</option>
          <option value="soft drink">Soft Drink</option>
          <option value="dessert special">Dessert Special</option>
        </select>
        
        {formData.currentImage && (
          <div className="mb-2">
            <p className="text-sm mb-1">Current Image:</p>
            <img 
              src={formData.currentImage} 
              alt={formData.name} 
              className="h-32 w-auto mb-2 rounded object-cover"
            />
          </div>
        )}
        
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 mb-2 border rounded"
        />
        <p className="text-sm text-gray-500 mb-2">
          {formData.image ? 'New image selected' : 'Leave empty to keep current image'}
        </p>
        
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            className="mr-2"
          />
          Available
        </label>
        
        <div className="flex space-x-2">
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded flex-1 hover:bg-blue-600"
          >
            Update Item
          </button>
          
          <button 
            type="button" 
            onClick={handleDelete}
            className={`p-2 rounded flex-1 ${
              deleteConfirm 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            {deleteConfirm ? 'Confirm Delete' : 'Delete Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminMenuEditForm;