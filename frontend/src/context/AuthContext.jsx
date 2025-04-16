// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getUserProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Profile fetch error:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials); // Line ~28
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return response; // Return for downstream handling if needed
    } catch (error) {
      console.error('Login failed:', error); // Debug
      throw error; // Re-throw to be caught in Auth.jsx
    }
  };

  const register = async (data) => {
    await registerUser(data);
    // Optionally auto-login after registration
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);