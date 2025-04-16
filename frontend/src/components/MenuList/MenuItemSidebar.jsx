import React, { useState } from 'react';
import { X, Heart, MinusCircle, PlusCircle, ShoppingBag, ChevronDown, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext ';

const MenuItemSidebar = ({ selectedItem, onClose }) => {
  const { addToCart } = useCart(); // Use cart context for adding items
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState([]);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!selectedItem) return null;

  // Category-specific customization options with price modifiers
  const customizationOptions = {
    appetizer: [
      { name: 'Extra Dip', price: 0.75 },
      { name: 'No Salt', price: 0.00 },
      { name: 'Spicy Seasoning', price: 0.50 },
      { name: 'Gluten-Free Crackers', price: 1.00 },
    ],
    main: [
      { name: 'Extra Sauce', price: 0.80 },
      { name: 'No Onions', price: 0.00 },
      { name: 'Medium Rare', price: 0.00 },
      { name: 'Well Done', price: 0.00 },
    ],
    dessert: [
      { name: 'Extra Whipped Cream', price: 0.60 },
      { name: 'No Nuts', price: 0.00 },
      { name: 'Chocolate Drizzle', price: 0.70 },
      { name: 'Sugar-Free', price: 0.50 },
    ],
    beverage: [
      { name: 'No Ice', price: 0.00 },
      { name: 'Extra Sugar', price: 0.30 },
      { name: 'Light Foam', price: 0.00 },
      { name: 'Decaf', price: 0.20 },
    ],
    pizza: [
      { name: 'Extra Cheese', price: 1.50 },
      { name: 'No Olives', price: 0.00 },
      { name: 'Thick Crust', price: 1.00 },
      { name: 'Spicy Pepperoni', price: 1.25 },
    ],
    burger: [
      { name: 'Extra Patty', price: 2.00 },
      { name: 'No Pickles', price: 0.00 },
      { name: 'Spicy Mayo', price: 0.60 },
      { name: 'Gluten-Free Bun', price: 1.50 },
    ],
  };

  // Select customization options based on item's category
  const availableCustomizations = customizationOptions[selectedItem.category] || [];

  // Calculate total price: base price * quantity + sum of customization prices
  const calculateTotalPrice = () => {
    const basePrice = selectedItem.price;
    const customizationCost = customizations.reduce((sum, option) => {
      const customization = availableCustomizations.find(c => c.name === option);
      return sum + (customization ? customization.price : 0);
    }, 0);
    return (basePrice + customizationCost) * quantity;
  };

  // Sample ingredients (category-specific)
  const ingredients = {
    appetizer: ['Tomatoes', 'Cheese', 'Herbs', 'Bread'],
    main: ['Beef', 'Potatoes', 'Vegetables', 'Sauce'],
    dessert: ['Sugar', 'Flour', 'Cream', 'Fruit'],
    beverage: ['Water', 'Coffee Beans', 'Milk', 'Syrup'],
    pizza: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Pepperoni'],
    burger: ['Bun', 'Patty', 'Lettuce', 'Tomato'],
  };

  const itemIngredients = ingredients[selectedItem.category] || [];

  const handleCustomize = (option) => {
    setCustomizations(prev =>
      prev.includes(option)
        ? prev.filter(i => i !== option)
        : [...prev, option]
    );
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    // Create the cart item with all necessary details
    const cartItem = {
      ...selectedItem,
      quantity,
      customizations,
      totalPrice: calculateTotalPrice(),
    };
    
    // Add to cart using context method
    addToCart(cartItem);
    
    // Close the sidebar after adding to cart
    onClose();
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    // The sidebar - removed the overlay that was hiding the background
    <div className="fixed top-0 right-0 h-full w-64 sm:w-80 z-50 bg-white shadow-lg border-l border-amber-200 flex flex-col overflow-hidden">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white shadow-md hover:bg-gray-100 p-2 rounded-full transition-colors z-50"
      >
        <X size={18} className="text-amber-900" />
      </button>
      
      {/* Header */}
      <div className="relative h-40 overflow-hidden">
        {selectedItem.image ? (
          <img
            src={selectedItem.image}
            alt={selectedItem.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-dish.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-amber-300 to-amber-500 flex items-center justify-center">
            <ShoppingBag size={48} className="text-white" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <h2 className="text-xl font-bold text-white mb-1">{selectedItem.name}</h2>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full text-xs font-medium">
              {selectedItem.category}
            </span>
            {selectedItem.subcategory && (
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
                {selectedItem.subcategory}
              </span>
            )}
          </div>
        </div>
        
        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-4 left-4 ${isFavorite ? 'bg-red-500' : 'bg-white/80 hover:bg-white'} p-1.5 rounded-full transition-colors`}
        >
          <Heart
            size={16}
            className={isFavorite ? 'text-white' : 'text-amber-900'}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Price and availability */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold text-amber-600">${calculateTotalPrice().toFixed(2)}</div>
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            selectedItem.available 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {selectedItem.available ? 'Available' : 'Sold Out'}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-amber-900 mb-1">Description</h3>
          <p className="text-sm text-amber-700">{selectedItem.description}</p>
        </div>
        
        {/* Ingredients */}
        <div className="mb-4">
          <button 
            className="flex justify-between items-center w-full text-left mb-1"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            <h3 className="text-sm font-semibold text-amber-900">Ingredients</h3>
            <ChevronDown 
              size={16} 
              className={`text-amber-600 transition-transform ${showIngredients ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {showIngredients && (
            <div className="bg-amber-50 rounded-lg p-3 grid grid-cols-1 gap-1">
              {itemIngredients.map(ingredient => (
                <div key={ingredient} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-amber-700">{ingredient}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Customizations */}
        {availableCustomizations.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">Customize Your Order</h3>
            <div className="space-y-2">
              {availableCustomizations.map(option => (
                <label 
                  key={option.name} 
                  className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                    customizations.includes(option.name)
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => handleCustomize(option.name)}
                >
                  <span className="text-xs text-amber-900">
                    {option.name} {option.price > 0 ? `(+$${option.price.toFixed(2)})` : ''}
                  </span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    customizations.includes(option.name)
                      ? 'bg-amber-500'
                      : 'bg-gray-200'
                  }`}>
                    {customizations.includes(option.name) && <Check size={10} className="text-white" />}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with add to cart - fixed at bottom on mobile */}
      <div className="border-t border-amber-100 p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-amber-900 font-medium">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={decrementQuantity}
              className="text-amber-600 hover:text-amber-800 disabled:text-amber-300"
              disabled={quantity <= 1}
            >
              <MinusCircle size={20} />
            </button>
            <span className="w-6 text-center font-semibold text-amber-900">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="text-amber-600 hover:text-amber-800"
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!selectedItem.available}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-semibold ${
            selectedItem.available
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          } transition-colors`}
        >
          <ShoppingBag size={18} />
          <span>Add to Cart - ${calculateTotalPrice().toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItemSidebar;