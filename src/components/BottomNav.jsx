import React from 'react';
import { Home, Users, CheckCircle, Settings, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav = ({ activeTab, setActiveTab, isAdmin }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'staff', icon: Briefcase, label: 'Staff', adminOnly: true },
    { id: 'classes', icon: Users, label: 'Classes' },
    { id: 'attendance', icon: CheckCircle, label: 'Track' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900/95 backdrop-blur-3xl border-t border-gray-800 rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.15)] z-50 px-6 pb-6 pt-5">
      <div className="flex justify-between items-center relative max-w-md mx-auto">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id || (tab.id === 'attendance' && (activeTab === 'student-attendance' || activeTab === 'staff-attendance'));
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-14 h-10"
            >
              {/* Icon Container (Moves UP when active) */}
              <motion.div 
                animate={{ y: isActive ? -12 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`relative z-10 flex items-center justify-center ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-white transition-colors'}`}
              >
                <tab.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </motion.div>
              
              {/* Text Label (Moves DOWN slightly when active) */}
              <motion.span 
                animate={{ y: isActive ? 6 : 0, opacity: isActive ? 1 : 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute -bottom-2 text-[10px] font-extrabold tracking-wide transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-gray-500'}`}
              >
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
