// src/components/MenuList/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <div className="mb-12 text-center pt-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-3 text-amber-900">
        <span className="text-amber-600">Culinary</span> Collection
      </h1>
      <p className="text-amber-700 max-w-2xl mx-auto text-lg">
        Discover our artisanal creations, crafted with seasonal ingredients and culinary passion.
      </p>
    </div>
  );
};

export default Header;