import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Download, Trash2, ShieldAlert, User, LogOut } from 'lucide-react';
import { storage } from '../utils/storage';

export const Settings = ({ teacherName, setTeacherName, onLogout, goToTab }) => {

  const handleWipeData = () => {
    if (window.confirm("Are you absolutely sure you want to wipe ALL classes and attendance data?")) {
      storage.clearAllData();
      window.location.reload();
    }
  };

  const handleExportBackup = () => {
    const data = {
      classes: storage.getClasses(),
      students: storage.getStudents(),
      attendance: storage.getAttendance()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `attendance_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-full flex flex-col pb-6 bg-gray-50">
      <Header title="Settings" subtitle="Preferences & Data" onBack={() => goToTab('home')} />
      
      <div className="px-6 py-4 space-y-6 flex-1 flex flex-col">

        {/* Teacher Profile */}
        <div className="bg-white p-5 rounded-2xl card-shadow border border-gray-50">
          <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <User size={18} className="text-blue-500" /> Current Profile
          </h3>
          <p className="text-sm font-bold text-gray-800 text-lg mb-4">{teacherName || 'Unknown Staff'}</p>
          
          <button 
            onClick={onLogout}
            className="w-full py-3 bg-gray-50 text-gray-600 font-bold rounded-xl flex items-center justify-center gap-2 border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={20} /> Switch Profile / Logout
          </button>
        </div>
        
        <div className="bg-white p-5 rounded-2xl card-shadow border border-gray-50">
          <h3 className="font-bold text-gray-900 mb-1">Backup Data</h3>
          <p className="text-sm text-gray-500 mb-4">Export a JSON file containing all your classes, students, and attendance records.</p>
          
          <button 
            onClick={handleExportBackup}
            className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Download size={20} /> Export Backup
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl card-shadow border border-gray-50">
          <h3 className="font-bold text-red-600 mb-1 flex items-center gap-2"><ShieldAlert size={18} /> Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-4">Permanently delete all data from this device. This cannot be undone.</p>
          
          <button 
            onClick={handleWipeData}
            className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Trash2 size={20} /> Erase All Data
          </button>
        </div>

        <div className="text-center pt-8 mt-auto pb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hudoor V2.0</p>
        </div>
      </div>
    </motion.div>
  );
};
