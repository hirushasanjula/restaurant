// src/components/MenuList/LoadingState.jsx
import React from 'react';
import { Coffee } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 text-amber-900">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Coffee size={64} className="text-amber-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-t-4 border-amber-600 border-solid rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-amber-700 font-medium mt-6 text-lg">Brewing your menu experience...</p>
      </div>
    </div>
  );
};

export default LoadingState;