import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, Lock, ArrowRight, Activity, UserPlus } from 'lucide-react';

export const LoginScreen = ({ staff, onSelectStaff, onCreateStaff }) => {
  const isSetup = staff.length === 0;
  
  // View Modes: 'login' | 'signup'
  const [viewMode, setViewMode] = useState(isSetup ? 'setup' : 'login');
  
  // Login State
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || '');
  const [password, setPassword] = useState('');
  
  // Sign Up State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (viewMode === 'setup') {
      if (!password.trim()) {
        setError('Please enter a password');
        return;
      }
      onSelectStaff('admin_setup', password.trim());
      return;
    }

    if (viewMode === 'signup') {
      if (!newName.trim() || !password.trim()) {
        setError('Please fill all required fields');
        return;
      }
      onCreateStaff({
        name: newName.trim(),
        role: newRole.trim() || 'Teacher',
        password: password.trim()
      });
      return;
    }

    // Normal Login
    const selectedStaff = staff.find(s => s.id === selectedStaffId);
    if (!selectedStaff) {
      setError('Please select a profile');
      return;
    }
    
    // Check password (simple check). If no password was ever set, it will be undefined, so allow empty string.
    const expectedPassword = selectedStaff.password || '';
    if (expectedPassword !== password) {
      setError('Incorrect password');
      return;
    }

    onSelectStaff(selectedStaff.id);
  };

  const selectedStaffInfo = staff.find(s => s.id === selectedStaffId);

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center p-6 overflow-hidden z-50">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-100/50 to-transparent"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-white relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            layout
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30 rotate-3"
          >
            {viewMode === 'setup' ? <ShieldCheck size={32} /> : viewMode === 'signup' ? <UserPlus size={32} /> : <Activity size={32} />}
          </motion.div>
          <motion.h1 layout className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {viewMode === 'setup' ? 'Setup Admin' : viewMode === 'signup' ? 'Create Profile' : 'Welcome Back'}
          </motion.h1>
          <motion.p layout className="text-sm text-gray-500 font-medium mt-2">
            {viewMode === 'setup' ? 'Create your master password' : viewMode === 'signup' ? 'Join as a new staff member' : 'Sign in to your profile'}
          </motion.p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <AnimatePresence mode="popLayout">
            
            {/* SIGN UP FIELDS */}
            {viewMode === 'signup' && (
              <motion.div 
                key="signup-form"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }} 
                className="space-y-4 overflow-hidden"
              >
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Ali Ahmad"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      value={newName}
                      onChange={(e) => { setNewName(e.target.value); setError(''); }}
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Role (Optional)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Math Teacher"
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      value={newRole}
                      onChange={(e) => { setNewRole(e.target.value); setError(''); }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* LOGIN FIELDS */}
            {viewMode === 'login' && (
              <motion.div 
                key="login-form"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }} 
                className="space-y-2 relative overflow-visible"
              >
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Select Profile</label>
                
                {/* Custom Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full pl-4 pr-11 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all flex items-center gap-3 relative"
                >
                  <User size={18} className="text-gray-400 shrink-0" />
                  <span className="flex-1 text-left truncate">
                    {selectedStaffInfo ? `${selectedStaffInfo.name} (${selectedStaffInfo.role})` : 'Select your name...'}
                  </span>
                  <div className="absolute right-4 text-gray-400">
                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </button>

                {/* Custom Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto py-2">
                    {staff.map(member => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => {
                          setSelectedStaffId(member.id);
                          setError('');
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left font-medium transition-colors flex items-center justify-between ${selectedStaffId === member.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span>{member.name}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">{member.role}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            <motion.div layout className="space-y-2 pt-2 relative z-0">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder={viewMode === 'setup' || viewMode === 'signup' ? "Create password" : "Enter password"}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                />
              </div>
            </motion.div>

          </AnimatePresence>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm font-semibold text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button 
            layout
            type="submit"
            className="w-full mt-2 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 active:scale-[0.98] transition-all relative z-0"
          >
            {viewMode === 'setup' ? 'Create Admin Account' : viewMode === 'signup' ? 'Create Profile & Login' : 'Sign In'}
            <ArrowRight size={18} />
          </motion.button>
          
        </form>

        {!isSetup && (
          <motion.div layout className="mt-6 text-center">
            {viewMode === 'login' ? (
              <button 
                type="button" 
                onClick={() => { setViewMode('signup'); setError(''); setPassword(''); }}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                New staff? Create a profile
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => { setViewMode('login'); setError(''); setPassword(''); }}
                className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Already have a profile? Sign In
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
