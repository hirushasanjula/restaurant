import React, { useState, useEffect } from 'react';
import { getMenuItems, getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../../api/api';
import Header from './Header';
import FilterBar from './FilterBar';
import EmptyState from './EmptyState';
import CategorySection from './CategorySection';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import MenuItemSidebar from './MenuItemSidebar';

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState(null);

  // Add this state to track if the body should be fixed when modal is open
  const [bodyLocked, setBodyLocked] = useState(false);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await getMenuItems();
      setMenuItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load menu');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (err) {
      console.error('Cart Fetch Error:', err);
      setCart({ items: [] }); // Fallback for unauthenticated users
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCart();
  }, []);

  // Handle body scroll lock when sidebar is open
  useEffect(() => {
    if (selectedItem) {
      // Lock body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
      setBodyLocked(true);
    } else {
      // Restore body scroll when sidebar is closed
      document.body.style.overflow = '';
      setBodyLocked(false);
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedItem]);

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedItems = {};
  if (activeCategory === 'all') {
    filteredItems.forEach(item => {
      if (!groupedItems[item.category]) groupedItems[item.category] = [];
      groupedItems[item.category].push(item);
    });
  } else {
    groupedItems[activeCategory] = filteredItems;
  }

  const handleRefresh = () => fetchMenuItems();
  const handleClearFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item === selectedItem ? null : { ...item, customizations: [] });
  };

  const handleAddToCart = async (itemWithDetails) => {
    try {
      const cartItem = {
        menuItemId: itemWithDetails._id,
        quantity: itemWithDetails.quantity || 1,
        customizations: itemWithDetails.customizations || [],
        totalPrice: itemWithDetails.totalPrice,
      };
      const response = await addToCart(cartItem);
      setCart(response.data);
      setSelectedItem(null);
      // Use non-blocking notification instead of alert
      // Create a toast notification element
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = `${itemWithDetails.name} added to cart!`;
      document.body.appendChild(toast);
      
      // Remove the toast after 3 seconds
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 3000);
    } catch (err) {
      // Use non-blocking notification instead of alert
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg z-50';
      errorToast.textContent = 'Failed to add to cart: ' + (err.response?.data?.message || err.message);
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        if (errorToast.parentNode) {
          document.body.removeChild(errorToast);
        }
      }, 3000);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      const response = await updateCartItem({ itemId, quantity });
      setCart(response.data);
    } catch (err) {
      // Use non-blocking notification
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg z-50';
      errorToast.textContent = 'Failed to update quantity: ' + (err.response?.data?.message || err.message);
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        if (errorToast.parentNode) {
          document.body.removeChild(errorToast);
        }
      }, 3000);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      const response = await removeFromCart(itemId);
      setCart(response.data);
    } catch (err) {
      // Use non-blocking notification
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg z-50';
      errorToast.textContent = 'Failed to remove item: ' + (err.response?.data?.message || err.message);
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        if (errorToast.parentNode) {
          document.body.removeChild(errorToast);
        }
      }, 3000);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear your cart?')) {
      try {
        await clearCart();
        setCart({ items: [] });
      } catch (err) {
        // Use non-blocking notification
        const errorToast = document.createElement('div');
        errorToast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg z-50';
        errorToast.textContent = 'Failed to clear cart: ' + (err.response?.data?.message || err.message);
        document.body.appendChild(errorToast);
        
        setTimeout(() => {
          if (errorToast.parentNode) {
            document.body.removeChild(errorToast);
          }
        }, 3000);
      }
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={handleRefresh} />;

  return (
    <div className="min-h-screen bg-amber-50 text-amber-900">
      {/* Main content */}
      <div className={`transition-all duration-300 ${selectedItem ? 'sm:mr-80' : ''}`}>
        <div className="max-w-7xl mx-auto p-4">
          <Header />
          <FilterBar 
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
          {filteredItems.length === 0 ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <div>
              {Object.keys(groupedItems).length > 0 ? (
                Object.entries(groupedItems).map(([category, items]) => (
                  <CategorySection 
                    key={category}
                    category={category}
                    items={items}
                    viewMode={viewMode}
                    onSelectItem={handleSelectItem}
                  />
                ))
              ) : (
                <p className="text-center text-amber-700 bg-white p-8 rounded-xl shadow-lg border border-amber-200">
                  No items in this category.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Sidebar for selected item */}
      {selectedItem && (
        <MenuItemSidebar
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart overlay - responsive positioning */}
      {cart && cart.items?.length > 0 && (
        <div className={`fixed bottom-4 z-40 transition-all duration-300 ${
          selectedItem ? 'sm:right-80' : 'right-4'
        } ${bodyLocked ? 'sm:mr-0' : ''}`}>
          <div className="bg-amber-100 p-4 rounded shadow w-full sm:w-80 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-amber-900">Cart ({cart.items.length})</h3>
            {cart.items.map(item => (
              <div key={item._id} className="mt-2 flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="truncate">{item.menuItem.name} x{item.quantity}</p>
                  {item.customizations.length > 0 && (
                    <p className="text-xs text-amber-700 truncate">{item.customizations.join(', ')}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    className="text-amber-600 p-1"
                  >
                    -
                  </button>
                  <span className="w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    className="text-amber-600 p-1"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="text-red-500 ml-1 p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => alert('Proceed to checkout not implemented yet!')}
              className="mt-4 w-full bg-amber-600 text-white p-2 rounded hover:bg-amber-700"
            >
              Checkout
            </button>
            <button
              onClick={handleClearCart}
              className="mt-2 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;