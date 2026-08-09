import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const Header = ({ title, subtitle, rightElement, onBack }) => {
  return (
    <header className="bg-white px-6 pt-10 pb-4 sticky top-0 z-40 bg-opacity-95 backdrop-blur-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            {subtitle && <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-0">{subtitle}</p>}
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
          </div>
        </div>
        {rightElement && (
          <div>{rightElement}</div>
        )}
      </div>
    </header>
  );
};
