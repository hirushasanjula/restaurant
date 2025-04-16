// src/components/MenuList/FilterBar.jsx
import React, { useState } from 'react';
import { RefreshCw, Search, ChevronDown, X } from 'lucide-react';

const FilterBar = ({ 
  categories, 
  activeCategory, 
  setActiveCategory, 
  searchTerm, 
  setSearchTerm, 
  viewMode, 
  setViewMode, 
  isLoading, 
  onRefresh 
}) => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  return (
    <div className="mb-12 sticky top-14 backdrop-blur-lg bg-amber-50/80 pt-4 pb-6 z-10 rounded-xl shadow-xl border border-amber-200">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
          <input
            type="text"
            placeholder="Search our menu..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-12 pr-12 py-3 w-full rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-amber-900 shadow-lg"
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Category Dropdown for Mobile */}
        <div className="relative w-full md:hidden">
          <button
            onClick={toggleCategoryMenu}
            className="flex items-center justify-between w-full px-5 py-3 bg-white text-amber-900 rounded-xl border border-amber-300 hover:bg-amber-100 transition-colors duration-300"
          >
            <span className="capitalize font-medium">
              {activeCategory === 'all' ? 'All Categories' : activeCategory}
            </span>
            <ChevronDown size={20} className={`transition-transform duration-300 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isCategoryMenuOpen && (
            <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-amber-300 py-2 z-20">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setIsCategoryMenuOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 hover:bg-amber-100 capitalize ${
                    activeCategory === category ? 'bg-amber-100 text-amber-800 font-medium' : 'text-amber-700'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* View Mode Toggle */}
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 bg-amber-500 text-white px-5 py-3 rounded-xl hover:bg-amber-600 transition-colors duration-300 font-medium shadow-lg"
        >
          <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh Menu'}</span>
        </button>
      </div>
      
      {/* Category navigation for Desktop */}
      <div className="hidden md:flex flex-wrap gap-2 mt-6 px-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-xl capitalize transition-all duration-300 ${
              activeCategory === category
                ? 'bg-amber-500 text-white shadow-lg font-medium'
                : 'bg-white border border-amber-300 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>
    </div>
  );
};

const ViewModeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-amber-300">
      <button 
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'text-amber-600 hover:text-amber-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>
      <button 
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-amber-600 hover:text-amber-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default FilterBar;