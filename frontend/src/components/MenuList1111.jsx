// import React, { useState, useEffect } from 'react';
// import { getMenuItems } from '../api/api';
// import { ChevronDown, RefreshCw, Coffee, Search, Star, Clock, X } from 'lucide-react';

// const MenuList = () => {
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

//   const fetchMenuItems = async () => {
//     try {
//       setIsLoading(true);
//       const response = await getMenuItems();
//       const items = Array.isArray(response.data) ? response.data : [];
//       setMenuItems(items);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to load menu');
//     } finally {
//       setLoading(false);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMenuItems();
//   }, []);

//   // Get all unique categories from menu items
//   const categories = ['all', ...new Set(menuItems.map(item => item.category))];

//   // Filter menu items by category and search
//   const filteredItems = menuItems.filter(item => {
//     const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
//     const matchesSearch = searchTerm === '' || 
//       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.description.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   // Group menu items by category
//   const groupedItems = {};
  
//   if (activeCategory === 'all') {
//     // When showing all categories, group items by their categories
//     filteredItems.forEach(item => {
//       if (!groupedItems[item.category]) {
//         groupedItems[item.category] = [];
//       }
//       groupedItems[item.category].push(item);
//     });
//   } else {
//     // When a specific category is selected, put all filtered items under that category
//     groupedItems[activeCategory] = filteredItems;
//   }

//   const handleRefresh = () => {
//     fetchMenuItems();
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const toggleCategoryMenu = () => {
//     setIsCategoryMenuOpen(!isCategoryMenuOpen);
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-amber-50 text-amber-900">
//       <div className="flex flex-col items-center">
//         <div className="relative">
//           <Coffee size={64} className="text-amber-600" />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-10 h-10 border-t-4 border-amber-600 border-solid rounded-full animate-spin"></div>
//           </div>
//         </div>
//         <p className="text-amber-700 font-medium mt-6 text-lg">Brewing your menu experience...</p>
//       </div>
//     </div>
//   );
  
//   if (error) return (
//     <div className="min-h-screen flex items-center justify-center bg-amber-50">
//       <div className="bg-white p-8 rounded-xl border border-red-400 text-center max-w-md shadow-lg">
//         <h2 className="text-red-600 font-bold text-2xl mb-4">Menu Unavailable</h2>
//         <p className="text-amber-900 mb-6">{error}</p>
//         <button 
//           onClick={handleRefresh}
//           className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-300 flex items-center justify-center mx-auto gap-2"
//         >
//           <RefreshCw size={18} />
//           <span>Try Again</span>
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-amber-50 text-amber-900">
//       <div className="max-w-7xl mx-auto p-4">
//         <div className="mb-12 text-center pt-8">
//           <h1 className="text-4xl md:text-5xl font-bold mb-3 text-amber-900">
//             <span className="text-amber-600">Culinary</span> Collection
//           </h1>
//           <p className="text-amber-700 max-w-2xl mx-auto text-lg">Discover our artisanal creations, crafted with seasonal ingredients and culinary passion.</p>
//         </div>
        
//         <div className="mb-12 sticky top-14 backdrop-blur-lg bg-amber-50/80 pt-4 pb-6 z-10 rounded-xl shadow-xl border border-amber-200">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-6 py-4">
//             {/* Search Bar */}
//             <div className="relative w-full md:w-1/3">
//               <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
//               <input
//                 type="text"
//                 placeholder="Search our menu..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 className="pl-12 pr-12 py-3 w-full rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-amber-900 shadow-lg"
//               />
//               {searchTerm && (
//                 <button 
//                   onClick={clearSearch}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600"
//                 >
//                   <X size={18} />
//                 </button>
//               )}
//             </div>
            
//             {/* Category Dropdown for Mobile */}
//             <div className="relative w-full md:hidden">
//               <button
//                 onClick={toggleCategoryMenu}
//                 className="flex items-center justify-between w-full px-5 py-3 bg-white text-amber-900 rounded-xl border border-amber-300 hover:bg-amber-100 transition-colors duration-300"
//               >
//                 <span className="capitalize font-medium">
//                   {activeCategory === 'all' ? 'All Categories' : activeCategory}
//                 </span>
//                 <ChevronDown size={20} className={`transition-transform duration-300 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
//               </button>
              
//               {isCategoryMenuOpen && (
//                 <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-amber-300 py-2 z-20">
//                   {categories.map((category) => (
//                     <button
//                       key={category}
//                       onClick={() => {
//                         setActiveCategory(category);
//                         setIsCategoryMenuOpen(false);
//                       }}
//                       className={`w-full text-left px-5 py-3 hover:bg-amber-100 capitalize ${
//                         activeCategory === category ? 'bg-amber-100 text-amber-800 font-medium' : 'text-amber-700'
//                       }`}
//                     >
//                       {category === 'all' ? 'All Categories' : category}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             {/* View Mode Toggle */}
//             <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-amber-300">
//               <button 
//                 onClick={() => setViewMode('grid')}
//                 className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'text-amber-600 hover:text-amber-800'}`}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="3" y="3" width="7" height="7" />
//                   <rect x="14" y="3" width="7" height="7" />
//                   <rect x="3" y="14" width="7" height="7" />
//                   <rect x="14" y="14" width="7" height="7" />
//                 </svg>
//               </button>
//               <button 
//                 onClick={() => setViewMode('list')}
//                 className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-amber-600 hover:text-amber-800'}`}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <line x1="8" y1="6" x2="21" y2="6" />
//                   <line x1="8" y1="12" x2="21" y2="12" />
//                   <line x1="8" y1="18" x2="21" y2="18" />
//                   <line x1="3" y1="6" x2="3.01" y2="6" />
//                   <line x1="3" y1="12" x2="3.01" y2="12" />
//                   <line x1="3" y1="18" x2="3.01" y2="18" />
//                 </svg>
//               </button>
//             </div>
            
//             {/* Refresh Button */}
//             <button
//               onClick={handleRefresh}
//               disabled={isLoading}
//               className="flex items-center gap-2 bg-amber-500 text-white px-5 py-3 rounded-xl hover:bg-amber-600 transition-colors duration-300 font-medium shadow-lg"
//             >
//               <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : ''}`} />
//               <span>{isLoading ? 'Refreshing...' : 'Refresh Menu'}</span>
//             </button>
//           </div>
          
//           {/* Category navigation for Desktop */}
//           <div className="hidden md:flex flex-wrap gap-2 mt-6 px-6">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setActiveCategory(category)}
//                 className={`px-5 py-2 rounded-xl capitalize transition-all duration-300 ${
//                   activeCategory === category
//                     ? 'bg-amber-500 text-white shadow-lg font-medium'
//                     : 'bg-white border border-amber-300 text-amber-700 hover:bg-amber-100'
//                 }`}
//               >
//                 {category === 'all' ? 'All Categories' : category}
//               </button>
//             ))}
//           </div>
//         </div>

//         {filteredItems.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-amber-200">
//             <p className="text-amber-800 text-xl mb-6">No menu items match your criteria.</p>
//             <button 
//               onClick={() => {
//                 setActiveCategory('all');
//                 setSearchTerm('');
//               }}
//               className="text-amber-600 hover:text-amber-700 underline font-medium text-lg"
//             >
//               Clear filters
//             </button>
//           </div>
//         ) : (
//           <div>
//             {Object.keys(groupedItems).length > 0 ? (
//               Object.entries(groupedItems).map(([category, items]) => (
//                 <div key={category} className="mb-16">
//                   <div className="flex items-center mb-8">
//                     <div className="h-1 w-12 bg-amber-500 mr-4"></div>
//                     <h2 className="text-3xl font-bold capitalize text-amber-900">
//                       {category}
//                     </h2>
//                     <div className="flex-grow ml-4 h-px bg-amber-300"></div>
//                   </div>
                  
//                   {viewMode === 'grid' ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                       {items.map((item) => (
//                         <div 
//                           key={item._id} 
//                           className="bg-white rounded-xl shadow-lg overflow-hidden hover:translate-y-[-5px] hover:shadow-amber-500/20 transition-all duration-300 flex flex-col border border-amber-200 group"
//                         >
//                           <div className="h-56 overflow-hidden relative">
//                             {item.image ? (
//                               <img
//                                 src={item.image}
//                                 alt={item.name}
//                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                                 onError={(e) => {
//                                   e.target.onerror = null;
//                                   e.target.src = '/placeholder-dish.jpg';
//                                 }}
//                               />
//                             ) : (
//                               <div className="w-full h-full bg-amber-100 flex items-center justify-center">
//                                 <Coffee size={48} className="text-amber-600" />
//                               </div>
//                             )}
//                             {!item.available && (
//                               <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-lg shadow-lg">
//                                 Sold Out
//                               </div>
//                             )}
//                             {item.available && (
//                               <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 text-sm font-medium rounded-lg shadow-lg flex items-center gap-1">
//                                 <Clock size={14} />
//                                 <span>Available</span>
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="p-6 flex-grow flex flex-col">
//                             <div className="flex justify-between items-start mb-3">
//                               <h3 className="text-xl font-bold text-amber-900 group-hover:text-amber-600 transition-colors">{item.name}</h3>
//                               <span className="text-xl font-bold text-amber-600">${item.price.toFixed(2)}</span>
//                             </div>
                            
//                             <p className="text-amber-700 mb-4 flex-grow line-clamp-3">{item.description}</p>
                            
//                             <div className="flex flex-wrap gap-2 mt-2">
//                               {item.subcategory && (
//                                 <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full capitalize flex items-center">
//                                   {item.subcategory}
//                                 </span>
//                               )}
//                               <div className="flex items-center ml-auto">
//                                 {[1, 2, 3, 4, 5].map((star) => (
//                                   <Star
//                                     key={star}
//                                     size={14}
//                                     className={star <= Math.floor(3 + Math.random() * 2) ? "text-amber-500 fill-amber-500" : "text-amber-200"}
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {items.map((item) => (
//                         <div 
//                           key={item._id} 
//                           className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-amber-200 hover:border-amber-500/50 transition-all duration-300 group"
//                         >
//                           <div className="md:w-1/4 h-48 md:h-auto overflow-hidden relative">
//                             {item.image ? (
//                               <img
//                                 src={item.image}
//                                 alt={item.name}
//                                 className="w-full h-full object-scale-down transition-transform duration-700 group-hover:scale-110"
//                                 onError={(e) => {
//                                   e.target.onerror = null;
//                                   e.target.src = '/placeholder-dish.jpg';
//                                 }}
//                               />
//                             ) : (
//                               <div className="w-full h-full bg-amber-100 flex items-center justify-center">
//                                 <Coffee size={48} className="text-amber-600" />
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="p-6 flex-grow flex flex-col justify-between">
//                             <div>
//                               <div className="flex justify-between items-start mb-2">
//                                 <h3 className="text-xl font-bold text-amber-900 group-hover:text-amber-600 transition-colors">
//                                   {item.name}
//                                   {!item.available && (
//                                     <span className="ml-3 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-md">
//                                       Sold Out
//                                     </span>
//                                   )}
//                                   {item.available && (
//                                     <span className="ml-3 bg-emerald-100 text-emerald-700 px-2 py-1 text-xs font-medium rounded-md items-center gap-1 inline-flex">
//                                       <Clock size={12} />
//                                       <span>Available</span>
//                                     </span>
//                                   )}
//                                 </h3>
//                                 <span className="text-xl font-bold text-amber-600">${item.price.toFixed(2)}</span>
//                               </div>
                              
//                               <p className="text-amber-700 mb-4">{item.description}</p>
//                             </div>
                            
//                             <div className="flex flex-wrap items-center justify-between">
//                               <div className="flex flex-wrap gap-2">
//                                 {item.subcategory && (
//                                   <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full capitalize">
//                                     {item.subcategory}
//                                   </span>
//                                 )}
//                               </div>
                              
//                               <div className="flex items-center">
//                                 {[1, 2, 3, 4, 5].map((star) => (
//                                   <Star
//                                     key={star}
//                                     size={14}
//                                     className={star <= Math.floor(3 + Math.random() * 2) ? "text-amber-500 fill-amber-500" : "text-amber-200"}
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-amber-700 bg-white p-8 rounded-xl shadow-lg border border-amber-200">No items in this category.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MenuList;