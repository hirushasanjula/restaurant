import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Auth from './pages/Auth'; 
import Admin from './pages/Admin'; 
import AdminMenuList from './components/AdminMenuList';
import AdminMenuEditForm from './components/AdminMenuEditForm';
import { useAuth } from './context/AuthContext';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext '; 
import './App.css'; 
import CheckoutPage from './pages/CheckoutPage';
import AdminOrders from './pages/AdminOrders';

const App = () => {
  const { loading } = useAuth();

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <CartProvider> 
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          
          <div className="pt-20"> 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />

              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/menu" element={<AdminMenuList />} />
              <Route path="/admin/menu/edit/:id" element={<AdminMenuEditForm />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;