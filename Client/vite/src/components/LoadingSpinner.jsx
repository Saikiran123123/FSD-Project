import React from 'react';

const LoadingSpinner = ({ text = 'Loading cinema experience...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-[#e50914]/20 border-t-[#e50914] rounded-full animate-spin"></div>
        <div className="w-8 h-8 rounded-full bg-[#e50914]/30 animate-pulse"></div>
      </div>
      {text && <p className="mt-4 text-[#aaaacc] text-sm tracking-wide animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
