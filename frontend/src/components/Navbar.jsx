import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext '; 
import { Menu, X, ShoppingBag, Calendar, Home, User, LogOut, Settings, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-gradient-to-r from-amber-900 to-amber-700 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo - Visible on all screens */}
          <Link
            to="/"
            className={`font-bold text-2xl flex items-center ${
              scrolled ? 'text-amber-800' : 'text-white'
            }`}
          >
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-2 shadow-lg">
              <span className="text-white">C</span>
            </div>
            <span className="hidden sm:block">Culinary</span>
          </Link>
          
          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" text="Home" icon={<Home size={18} />} isActive={isActive('/')} scrolled={scrolled} />
            <NavLink to="/menu" text="Menu" icon={<ShoppingBag size={18} />} isActive={isActive('/menu')} scrolled={scrolled} />
            <NavLink to="/order" text="Order" icon={<ShoppingBag size={18} />} isActive={isActive('/order')} scrolled={scrolled} />
            <NavLink to="/reservation" text="Reservation" icon={<Calendar size={18} />} isActive={isActive('/reservation')} scrolled={scrolled} />

            <Link
              to="/cart"
              className={`relative flex items-center px-3 py-2 rounded-lg font-medium transition-colors duration-300 mx-1 ${
                isActive('/cart')
                  ? scrolled
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-amber-800 text-amber-100'
                  : scrolled
                    ? 'text-amber-800 hover:bg-amber-100'
                    : 'text-white hover:bg-amber-800'
              }`}
            >
              <ShoppingCart size={18} className="mr-1" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </div>
              )}
            </Link>

            {user ? (
              <div className="relative group ml-2">
                <div
                  className={`flex items-center gap-2 cursor-pointer rounded-full p-2 ${
                    scrolled ? 'hover:bg-amber-100' : 'hover:bg-amber-800'
                  } transition-colors duration-200`}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className={scrolled ? 'text-amber-900' : 'text-white'}>
                    {user.name || 'User'}
                  </span>
                </div>

                <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-xl py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                  <Link to="/account" className="flex px-4 py-2 text-amber-900 hover:bg-amber-100 transition-colors items-center gap-2">
                    <User size={16} />
                    <span>My Account</span>
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin/menu" className="flex px-4 py-2 text-amber-900 hover:bg-amber-100 transition-colors items-center gap-2">
                        <Settings size={16} />
                        <span>Admin Panel</span>
                      </Link>
                      <Link to="/admin/orders" className="flex px-4 py-2 text-amber-900 hover:bg-amber-100 transition-colors items-center gap-2">
                        <Settings size={16} />
                        <span>Orders</span>
                      </Link>
                    </>
                  )}
                  <div className="h-px bg-amber-200 my-2"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`ml-3 px-5 py-2 rounded-full font-medium transition-colors duration-300 ${
                  scrolled
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-white text-amber-800 hover:bg-amber-100'
                }`}
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Top Bar - Always visible on mobile */}
          <div className="md:hidden flex items-center">
            {/* Always visible navigation icons on mobile */}
            <div className="flex items-center space-x-4 mr-4">
              <Link to="/" className={`${isActive('/') ? 'opacity-100' : 'opacity-70'} ${scrolled ? 'text-amber-800' : 'text-white'}`}>
                <Home size={22} />
              </Link>
              <Link to="/menu" className={`${isActive('/menu') ? 'opacity-100' : 'opacity-70'} ${scrolled ? 'text-amber-800' : 'text-white'}`}>
                <ShoppingBag size={22} />
              </Link>
              <Link to="/cart" className="relative">
                <ShoppingCart size={22} className={`${isActive('/cart') ? 'opacity-100' : 'opacity-70'} ${scrolled ? 'text-amber-800' : 'text-white'}`} />
                {cartItemCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </div>
                )}
              </Link>
            </div>

            {/* Username display on mobile (condensed) */}
            {user && (
              <div className="mr-3">
                <div className={`w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white ${scrolled ? 'border-2 border-amber-800' : 'border-2 border-white'}`}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className={`${
                scrolled ? 'text-amber-800' : 'text-white'
              } hover:opacity-75 transition-opacity duration-300`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-amber-900 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        {/* Mobile Menu Header with Close Button */}
        <div className="flex justify-between items-center p-4 border-b border-amber-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <span>C</span>
            </div>
            <span className="text-white text-xl font-bold">Culinary</span>
          </div>
          <button 
            onClick={toggleMenu}
            className="text-white hover:text-amber-300"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>

        {/* User Profile Section - Prominently displayed at the top */}
        {user && (
          <div className="p-4 bg-amber-800 border-b border-amber-700">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-amber-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-white text-lg font-medium">{user.name || 'User'}</p>
                <p className="text-amber-300 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Links - Higher emphasis on core navigation items */}
        <div className="p-4">
          {/* Home, Menu, and Cart with emphasized styling */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <Link
              to="/"
              onClick={toggleMenu}
              className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                isActive('/') ? 'bg-amber-800' : 'hover:bg-amber-800'
              } transition-colors`}
            >
              <Home size={28} className="text-white mb-1" />
              <span className="text-white text-sm font-medium">Home</span>
            </Link>
            
            <Link
              to="/menu"
              onClick={toggleMenu}
              className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                isActive('/menu') ? 'bg-amber-800' : 'hover:bg-amber-800'
              } transition-colors`}
            >
              <ShoppingBag size={28} className="text-white mb-1" />
              <span className="text-white text-sm font-medium">Menu</span>
            </Link>
            
            <Link
              to="/cart"
              onClick={toggleMenu}
              className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                isActive('/cart') ? 'bg-amber-800' : 'hover:bg-amber-800'
              } transition-colors relative`}
            >
              <ShoppingCart size={28} className="text-white mb-1" />
              <span className="text-white text-sm font-medium">Cart</span>
              {cartItemCount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </div>
              )}
            </Link>
          </div>

          {/* Other navigation links */}
          <div className="border-t border-amber-800 pt-4">
            <MobileNavLink to="/order" text="Order Now" icon={<ShoppingBag size={20} />} onClick={toggleMenu} />
            <MobileNavLink to="/reservation" text="Make Reservation" icon={<Calendar size={20} />} onClick={toggleMenu} />
            <MobileNavLink to="/account" text="My Account" icon={<User size={20} />} onClick={toggleMenu} />
          
            {user && user.role === 'admin' && (
              <div className="border-t border-amber-800 mt-4 pt-4">
                <h3 className="text-amber-300 px-4 mb-2 text-sm font-medium">ADMIN CONTROLS</h3>
                <MobileNavLink to="/admin/menu" text="Admin Panel" icon={<Settings size={20} />} onClick={toggleMenu} />
                <MobileNavLink to="/admin/orders" text="Orders" icon={<Settings size={20} />} onClick={toggleMenu} />
              </div>
            )}
          </div>

          {/* Authentication buttons */}
          <div className="mt-6 pt-4 border-t border-amber-800">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={toggleMenu}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-amber-800 rounded-lg font-medium hover:bg-amber-100 transition-colors"
              >
                <User size={20} />
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, text, icon, isActive, scrolled }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors duration-300 mx-1 ${
      isActive
        ? scrolled
          ? 'bg-amber-100 text-amber-700'
          : 'bg-amber-800 text-amber-100'
        : scrolled
          ? 'text-amber-800 hover:bg-amber-100'
          : 'text-white hover:bg-amber-800'
    }`}
  >
    <span className="mr-1">{icon}</span>
    {text}
  </Link>
);

const MobileNavLink = ({ to, text, icon, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-amber-800 rounded-lg mb-2 transition-colors"
  >
    {icon}
    {text}
  </Link>
);

export default Navbar;