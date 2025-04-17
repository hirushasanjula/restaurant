// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [pendingCartItem, setPendingCartItem] = useState(null); // New state for pending cart item

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await getUserProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Fetch User Error:', error);
      logout();
    }
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setPendingCartItem, pendingCartItem }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);