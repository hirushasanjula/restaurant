// src/components/MenuList/EmptyState.jsx
import React from 'react';

const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-amber-200">
      <p className="text-amber-800 text-xl mb-6">No menu items match your criteria.</p>
      <button 
        onClick={onClearFilters}
        className="text-amber-600 hover:text-amber-700 underline font-medium text-lg"
      >
        Clear filters
      </button>
    </div>
  );
};

export default EmptyState;