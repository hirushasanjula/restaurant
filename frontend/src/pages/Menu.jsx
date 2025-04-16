import React from 'react';
import MenuList from '../components/MenuList';

const Menu = () => {
  return (
    <div className="bg-amber-50 min-h-screen">
      {/* Passing control fully to the MenuList component which already has its own title and layout */}
      <MenuList />
    </div>
  );
};

export default Menu;