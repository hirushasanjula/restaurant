import React from 'react';
import { Coffee, Clock, Star } from 'lucide-react';
import RatingStars from './RatingStars';

const MenuItemGrid = ({ item, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:translate-y-[-5px] hover:shadow-amber-500/20 transition-all duration-300 flex flex-col border border-amber-200 group"
      onClick={() => onSelect(item)} // Trigger sidebar
    >
      <div className="h-56 overflow-hidden relative">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-dish.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-amber-100 flex items-center justify-center">
            <Coffee size={48} className="text-amber-600" />
          </div>
        )}
        {!item.available && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-lg shadow-lg">
            Sold Out
          </div>
        )}
        {item.available && (
          <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 text-sm font-medium rounded-lg shadow-lg flex items-center gap-1">
            <Clock size={14} />
            <span>Available</span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-amber-900 group-hover:text-amber-600 transition-colors">{item.name}</h3>
          <span className="text-xl font-bold text-amber-600">${item.price.toFixed(2)}</span>
        </div>
        
        <p className="text-amber-700 mb-4 flex-grow line-clamp-3">{item.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {item.subcategory && (
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full capitalize flex items-center">
              {item.subcategory}
            </span>
          )}
          <div className="flex items-center ml-auto">
            <RatingStars />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemGrid;