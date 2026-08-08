import React from 'react';
import { Home, Users, CheckCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'classes', icon: Users, label: 'Classes' },
  { id: 'attendance', icon: CheckCircle, label: 'Track' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 pb-safe pt-2 px-6 z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex justify-between items-center shrink-0">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex flex-col items-center justify-center p-2 w-16"
          >
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute inset-0 bg-blue-50 rounded-2xl -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            )}
            <tab.icon 
              size={24} 
              strokeWidth={isActive ? 2.5 : 2}
              className={`transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} 
            />
            <span className={`text-[10px] mt-1 font-semibold transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
