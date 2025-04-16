import React, { useState, useEffect } from 'react';
import { createMenuItem, getMenuItems } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Coffee, 
  PlusCircle, 
  Camera, 
  Tag, 
  Trash2, 
  DollarSign, 
  AlignLeft, 
  CheckCircle, 
  XCircle, 
  Image, 
  FileText, 
  Clock, 
  AlertTriangle
} from 'lucide-react';

const AdminMenuForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    image: null,
    available: true,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [additionalCategories, setAdditionalCategories] = useState([]);
  const [additionalSubcategories, setAdditionalSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Default categories and subcategories
  const defaultCategories = ['appetizer', 'main', 'pizza', 'burger', 'dessert', 'beverage'];
  const defaultSubcategories = ['vegie', 'chicken', 'beef', 'spicy', 'soft drink', 'dessert special'];

  useEffect(() => {
    // Fetch menu items to extract additional categories
    const fetchCategories = async () => {
      try {
        const response = await getMenuItems();
        const items = response.data;
        
        // Find categories that are not in the default list
        const uniqueCategories = [...new Set(items.map(item => item.category))];
        const newCategories = uniqueCategories.filter(
          category => category && !defaultCategories.includes(category.toLowerCase())
        );
        setAdditionalCategories(newCategories);
        
        // Find subcategories that are not in the default list
        const uniqueSubcategories = [...new Set(items.map(item => item.subcategory).filter(Boolean))];
        const newSubcategories = uniqueSubcategories.filter(
          subcategory => subcategory && !defaultSubcategories.includes(subcategory.toLowerCase())
        );
        setAdditionalSubcategories(newSubcategories);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load additional categories');
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    // Create preview URL for the selected image
    if (formData.image) {
      const objectUrl = URL.createObjectURL(formData.image);
      setPreviewUrl(objectUrl);
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

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

    try {
      await createMenuItem(data);
      setSuccess('Menu item created successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        image: null,
        available: true,
      });
      setPreviewUrl(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create menu item');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to capitalize first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Form Preview Section */}
          <div className="md:w-2/5 bg-amber-600 p-6 text-white">
            <div className="h-full flex flex-col">
              <div className="mb-6 flex items-center">
                <Coffee className="mr-2" size={24} />
                <h2 className="text-2xl font-bold">Menu Manager</h2>
              </div>
              
              <div className="flex-grow flex flex-col items-center justify-center p-4 bg-amber-700/30 rounded-xl">
                {previewUrl ? (
                  <div className="relative w-full aspect-square mb-4 bg-amber-800/20 rounded-lg overflow-hidden">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full aspect-square mb-4 bg-amber-800/20 rounded-lg flex items-center justify-center">
                    <Camera size={48} className="text-amber-200/60" />
                  </div>
                )}

                <div className="w-full space-y-3 text-center">
                  <h3 className="font-bold text-xl mb-2 line-clamp-1 overflow-ellipsis">
                    {formData.name || "New Menu Item"}
                  </h3>
                  
                  <p className="text-amber-100 line-clamp-3 text-sm">
                    {formData.description || "This item doesn't have a description yet."}
                  </p>
                  
                  <div className="flex items-center justify-center mt-2 space-x-2">
                    {formData.price && (
                      <span className="bg-amber-800/40 px-3 py-1 rounded-full text-amber-100 flex items-center">
                        <DollarSign size={14} className="mr-1" />
                        {formData.price}
                      </span>
                    )}
                    
                    {formData.category && formData.category !== 'new-category' && (
                      <span className="bg-amber-800/40 px-3 py-1 rounded-full text-amber-100 flex items-center">
                        <Tag size={14} className="mr-1" />
                        {capitalize(formData.category)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center mt-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${formData.available ? 'bg-green-600' : 'bg-red-600'}`}>
                      {formData.available ? (
                        <>
                          <CheckCircle size={14} className="mr-1" />
                          Available
                        </>
                      ) : (
                        <>
                          <XCircle size={14} className="mr-1" />
                          Not Available
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-amber-100 text-sm">
                <p className="font-medium">Tips:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Add appealing descriptions to entice customers</li>
                  <li>High-quality images can increase sales</li>
                  <li>Keep pricing consistent with similar items</li>
                </ul>
              </div>
            </div>
          </div>
      
          {/* Form Input Section */}
          <div className="md:w-3/5 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-900 flex items-center">
              <PlusCircle size={24} className="mr-2 text-amber-600" />
              Add New Menu Item
            </h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
                <AlertTriangle size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start">
                <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-green-800">{success}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-800 flex items-center">
                  <FileText size={16} className="mr-2 text-amber-600" />
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Espresso Macchiato"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all bg-amber-50/50"
                  required
                />
              </div>
              
              {/* Description Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-800 flex items-center">
                  <AlignLeft size={16} className="mr-2 text-amber-600" />
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe your menu item in a way that makes customers want to try it..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all bg-amber-50/50"
                  required
                />
              </div>
              
              {/* Price Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-800 flex items-center">
                  <DollarSign size={16} className="mr-2 text-amber-600" />
                  Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="text-amber-600">$</span>
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    step="0.01"
                    min="0"
                    className="w-full pl-10 px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all bg-amber-50/50"
                    required
                  />
                </div>
              </div>
              
              {/* Categories Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-800 flex items-center">
                    <Tag size={16} className="mr-2 text-amber-600" />
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all bg-amber-50/50 appearance-none"
                    required
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23d97706' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                  >
                    <option value="">Select Category</option>
                    
                    {/* Default categories group */}
                    <optgroup label="Default Categories">
                      {defaultCategories.map((category, index) => (
                        <option key={`default-${index}`} value={category}>{capitalize(category)}</option>
                      ))}
                    </optgroup>
                    
                    {/* Additional categories from database */}
                    {!loading && additionalCategories.length > 0 && (
                      <optgroup label="Additional Categories">
                        {additionalCategories.map((category, index) => (
                          <option key={`additional-${index}`} value={category}>{capitalize(category)}</option>
                        ))}
                      </optgroup>
                    )}
                    
                    {/* Option to add a new category */}
                    <option value="new-category">+ Add New Category</option>
                  </select>
                  
                  {/* Show input field for new category if "Add New Category" is selected */}
                  {formData.category === 'new-category' && (
                    <input
                      type="text"
                      placeholder="Enter new category name"
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all bg-amber-50/50"
                      required
                    />
                  )}
                </div>
                
                {/* Subcategory Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-800 flex items-center">
                    <Tag size={16} className="mr-2 text-amber-600" />
                    Subcategory (Optional)
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all bg-amber-50/50 appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23d97706' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                  >
                    <option value="">Select Subcategory</option>
                    
                    {/* Default subcategories group */}
                    <optgroup label="Default Subcategories">
                      {defaultSubcategories.map((subcategory, index) => (
                        <option key={`default-sub-${index}`} value={subcategory}>{capitalize(subcategory)}</option>
                      ))}
                    </optgroup>
                    
                    {/* Additional subcategories from database */}
                    {!loading && additionalSubcategories.length > 0 && (
                      <optgroup label="Additional Subcategories">
                        {additionalSubcategories.map((subcategory, index) => (
                          <option key={`additional-sub-${index}`} value={subcategory}>{capitalize(subcategory)}</option>
                        ))}
                      </optgroup>
                    )}
                    
                    {/* Option to add a new subcategory */}
                    <option value="new-subcategory">+ Add New Subcategory</option>
                  </select>
                  
                  {/* Show input field for new subcategory if "Add New Subcategory" is selected */}
                  {formData.subcategory === 'new-subcategory' && (
                    <input
                      type="text"
                      placeholder="Enter new subcategory name"
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full px-4 py-3 mt-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all bg-amber-50/50"
                    />
                  )}
                </div>
              </div>
              
              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-800 flex items-center">
                  <Image size={16} className="mr-2 text-amber-600" />
                  Item Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-amber-300 border-dashed hover:bg-amber-50 hover:border-amber-500 rounded-lg cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <Camera className="w-8 h-8 text-amber-500" />
                      <p className="pt-1 text-sm tracking-wider text-amber-700">
                        {formData.image ? formData.image.name : "Upload a photo"}
                      </p>
                      <p className="text-xs text-amber-500 mt-1">
                        JPEG, PNG, or GIF up to 5MB
                      </p>
                    </div>
                    <input 
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="opacity-0"
                    />
                  </label>
                </div>
              </div>
              
              {/* Availability Toggle */}
              <div className="flex items-center space-x-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  <span className="ml-3 text-sm font-medium text-amber-800 flex items-center">
                    <Clock size={16} className="mr-2 text-amber-600" />
                    Available Now
                  </span>
                </label>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`w-full py-3 px-4 bg-amber-600 text-white font-medium rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <PlusCircle size={18} className="mr-2" />
                      Add Menu Item
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenuForm;