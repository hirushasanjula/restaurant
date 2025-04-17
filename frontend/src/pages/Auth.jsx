import React, { useState, useEffect } from 'react'; 
import { loginUser, registerUser } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext '; 
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ChevronRight, ArrowRight, Coffee } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, pendingCartItem, setPendingCartItem } = useAuth();
  const { addToCart } = useCart(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        // After login, check for pending cart item
        if (pendingCartItem) {
          addToCart(pendingCartItem);
          setPendingCartItem(null); // Clear the pending item
        }
        navigate('/cart'); // Redirect to cart page after login
      } else {
        const response = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'user',
        });
        await login({ email: formData.email, password: formData.password });
        // After registration and login, check for pending cart item
        if (pendingCartItem) {
          addToCart(pendingCartItem);
          setPendingCartItem(null);
        }
        navigate('/cart');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
      console.error('Auth Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-md mx-auto text-center mb-8">
        <Link to="/" className="inline-block mb-3">
          <Coffee size={36} className="text-amber-600 mx-auto" />
        </Link>
        <h1 className="text-3xl font-bold text-amber-900">
          Welcome {isLogin ? 'Back' : 'to Our Restaurant'}
        </h1>
        <p className="text-amber-700 mt-2">
          {isLogin ? 'Sign in to your account to continue' : 'Create an account to get started'}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex border-b border-amber-100">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                isLogin ? 'bg-amber-100 text-amber-800 border-b-2 border-amber-500' : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                !isLogin ? 'bg-amber-100 text-amber-800 border-b-2 border-amber-500' : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-5">
                  <label htmlFor="name" className="block text-amber-800 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                      <User size={18} className="text-amber-500" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 placeholder-amber-400 text-amber-800"
                    />
                  </div>
                </div>
              )}

              <div className="mb-5">
                <label htmlFor="email" className="block text-amber-800 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={18} className="text-amber-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 placeholder-amber-400 text-amber-800"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="block text-amber-800 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-amber-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder={isLogin ? "Your password" : "Create a strong password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 placeholder-amber-400 text-amber-800"
                  />
                </div>
                {!isLogin && (
                  <p className="text-xs text-amber-600 mt-2 leading-relaxed">
                    Password must be at least 8 characters long and include one uppercase letter, 
                    one lowercase letter, one number, and one special character (@$!%*?&).
                  </p>
                )}
              </div>

              {isLogin && (
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-amber-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-amber-600 hover:text-amber-800">
                      Forgot password?
                    </Link>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors duration-300 shadow-md ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-1'
                }`}
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-amber-600">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="flex justify-center items-center py-2 px-4 border border-amber-200 rounded-lg shadow-sm bg-white hover:bg-amber-50 transition-colors"
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.545, 10.239v3.821h5.445c-0.712, 2.315-2.647, 3.972-5.445, 3.972-3.332, 0-6.033-2.701-6.033-6.032s2.701-6.032, 6.033-6.032c1.498, 0, 2.866, 0.549, 3.921, 1.453l2.814-2.814C17.503, 2.988, 15.139, 2, 12.545, 2 7.021, 2 2.543, 6.477 2.543, 12s4.478, 10, 10.002, 10c8.396, 0, 10.249-7.85, 9.426-11.748l-9.426-0.013z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center py-2 px-4 border border-amber-200 rounded-lg shadow-sm bg-white hover:bg-amber-50 transition-colors"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center py-2 px-4 border border-amber-200 rounded-lg shadow-sm bg-white hover:bg-amber-50 transition-colors"
                  >
                    <span className="sr-only">Sign in with Apple</span>
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.585 2.141c-1.836 0-3.354 1.274-4.288 1.274-.9 0-2.239-1.211-3.695-1.211C2.35 2.204.001 4.042.001 7.612c0 2.371.46 4.835 1.335 6.81.767 1.72 1.928 3.555 3.266 3.555.804 0 1.917-.978 3.398-.978 1.437 0 2.209.978 3.327.978 1.382 0 2.28-1.484 3.14-3.433.446-1.015.803-2.157.803-3.295 0-.138-.113-.252-.252-.252-1.519 0-2.628-1.264-2.628-2.79 0-1.431 1.119-2.698 2.565-2.733.002-.03.005-.059.005-.088 0-1.511-1.127-3.152-2.505-3.246-.046 0-.091.007-.135.007-.603 0-1.445.306-2.445.306z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-amber-700">
            By signing {isLogin ? 'in' : 'up'}, you agree to our{' '}
            <Link to="/terms" className="font-medium text-amber-800 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-amber-800 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-8 text-center">
        <Link to="/" className="inline-flex items-center text-amber-600 hover:text-amber-800">
          <ChevronRight size={16} className="transform rotate-180" />
          <span className="ml-1">Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default Auth;