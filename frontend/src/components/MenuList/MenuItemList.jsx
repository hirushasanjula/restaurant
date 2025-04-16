import React from 'react';
import { Coffee, Clock, Star } from 'lucide-react';
import RatingStars from './RatingStars';

const MenuItemList = ({ items, onSelect }) => {
  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-row sm:flex-col border border-amber-200 hover:border-amber-500/50 transition-all duration-300 group cursor-pointer"
          onClick={() => onSelect(item)}
        >
          <div className="h-24 w-24 sm:w-full sm:h-40 overflow-hidden relative flex-shrink-0">
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
                <Coffee size={32} className="text-amber-600" />
              </div>
            )}
          </div>
          
          <div className="p-3 flex-grow flex flex-col justify-between">
            <div>
              <div className="flex flex-col gap-1 mb-2">
                <h3 className="text-base font-bold text-amber-900 group-hover:text-amber-600 transition-colors truncate">
                  {item.name}
                </h3>
                <span className="text-lg font-bold text-amber-600">${item.price.toFixed(2)}</span>
              </div>
              
              <p className="text-amber-700 text-sm mb-2 line-clamp-2 hidden sm:block">{item.description}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                {!item.available ? (
                  <span className="bg-red-500 text-white px-2 py-0.5 text-xs font-medium rounded-md">
                    Sold Out
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-medium rounded-md inline-flex items-center gap-1">
                    <Clock size={10} />
                    <span>Available</span>
                  </span>
                )}
                
                {item.subcategory && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full capitalize truncate">
                    {item.subcategory}
                  </span>
                )}
              </div>
              
              <div className="flex justify-center sm:mt-1">
                <RatingStars size="small" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemList;