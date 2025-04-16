// src/components/MenuList/ErrorState.jsx
import React from 'react';
import { RefreshCw } from 'lucide-react';

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white p-8 rounded-xl border border-red-400 text-center max-w-md shadow-lg">
        <h2 className="text-red-600 font-bold text-2xl mb-4">Menu Unavailable</h2>
        <p className="text-amber-900 mb-6">{error}</p>
        <button 
          onClick={onRetry}
          className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-300 flex items-center justify-center mx-auto gap-2"
        >
          <RefreshCw size={18} />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorState;