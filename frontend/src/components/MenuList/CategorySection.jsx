import React from 'react';
import MenuItemGrid from './MenuItemGrid';
import MenuItemList from './MenuItemList';

const CategorySection = ({ category, items, viewMode, onSelectItem }) => {
  return (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <div className="h-1 w-12 bg-amber-500 mr-4"></div>
        <h2 className="text-3xl font-bold capitalize text-amber-900">{category}</h2>
        <div className="flex-grow ml-4 h-px bg-amber-300"></div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <MenuItemGrid key={item._id} item={item} onSelect={onSelectItem} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <MenuItemList key={item._id} item={item} onSelect={onSelectItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;