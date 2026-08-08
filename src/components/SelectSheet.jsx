import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export const SelectSheet = ({ value, options, onChange, placeholder = "Select option" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
      >
        <span className="truncate pr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Professional Small Dropdown Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible Backdrop to close on click outside */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Dropdown Menu */}
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto py-1">
                {options.map((opt, index) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm transition-colors hover:bg-blue-50 active:bg-blue-100
                        ${index !== options.length - 1 ? 'border-b border-gray-50' : ''}
                        ${isSelected ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}
                      `}
                    >
                      {opt.label}
                      {isSelected && <Check size={18} className="text-blue-600" />}
                    </button>
                  );
                })}
                {options.length === 0 && (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">No options available</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
