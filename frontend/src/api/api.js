import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://restaurant-backend-yr2k.onrender.com/api'
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const getMenuItems = () => api.get('/menu');
export const getMenuItem = (id) => api.get(`/menu/${id}`);
export const createMenuItem = (data) => {
  return api.post('/menu', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateMenuItem = (id, data) => {
  return api.put(`/menu/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteMenuItem = (id) => {
  return api.delete(`/menu/${id}`);
};
export const createOrder = (data) => api.post('/orders', data);
export const createReservation = (data) => api.post('/reservations', data);
export const loginUser = (data) => api.post('/users/login', data);
export const registerUser = (data) => api.post('/users/register', data);
export const getUserProfile = () => api.get('/users/profile');
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/add', data);
export const updateCartItem = (data) => api.put('/cart/update', data);
export const removeFromCart = (itemId) => api.delete(`/cart/remove/${itemId}`);
export const clearCart = () => api.delete('/cart/clear');
export const getAllOrders = () => api.get('/orders/admin');

export default api;