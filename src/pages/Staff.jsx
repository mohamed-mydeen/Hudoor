import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Plus, Trash2 } from 'lucide-react';

export const Staff = ({ staff, setStaff }) => {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffPassword.trim()) return;
    const newStaffMember = { 
      id: Date.now().toString(), 
      name: newStaffName.trim(),
      role: newStaffRole.trim() || 'Teacher',
      password: newStaffPassword.trim()
    };
    setStaff([...staff, newStaffMember]);
    setNewStaffName('');
    setNewStaffRole('');
    setNewStaffPassword('');
    setShowAddStaff(false);
  };

  const handleDeleteStaff = (staffId) => {
    if (staffId === currentStaffId) {
      alert("You cannot delete your own profile.");
      return;
    }
    
    const staffToDelete = staff.find(s => s.id === staffId);
    if (staffToDelete?.role?.toLowerCase() === 'admin') {
      const adminCount = staff.filter(s => s.role?.toLowerCase() === 'admin').length;
      if (adminCount <= 1) {
        alert("You cannot delete the last Admin account. Please create another Admin first.");
        return;
      }
    }

    if (window.confirm("Remove this staff member?")) {
      setStaff(staff.filter(s => s.id !== staffId));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-full flex flex-col">
      <Header title="Staff Members" subtitle="Manage Team" />
      
      <div className="px-6 py-4">
        {showAddStaff ? (
          <div className="bg-white p-5 rounded-2xl card-shadow mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Add Staff Member</h3>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <input 
                type="text" placeholder="Full Name" required autoFocus
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newStaffName} onChange={e => setNewStaffName(e.target.value)}
              />
              <input 
                type="text" placeholder="Role (e.g. Teacher)"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newStaffRole} onChange={e => setNewStaffRole(e.target.value)}
              />
              <input 
                type="text" placeholder="Simple Password / PIN" required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newStaffPassword} onChange={e => setNewStaffPassword(e.target.value)}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddStaff(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">Save</button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={() => setShowAddStaff(true)} className="w-full border-2 border-dashed border-gray-200 text-gray-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mb-6 hover:bg-gray-50 transition-colors">
            <Plus size={20} /> Add Staff
          </button>
        )}

        <div className="space-y-4">
          {staff.length === 0 && !showAddStaff && (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <Plus size={32} />
              </div>
              <p className="text-gray-400 font-medium">No staff members added.</p>
            </div>
          )}
          
          {staff.map(s => (
            <div key={s.id} className="w-full bg-white p-5 rounded-2xl card-shadow border border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{s.name}</h3>
                <p className="text-sm font-semibold text-gray-400 mt-1">{s.role}</p>
              </div>
              <button onClick={() => handleDeleteStaff(s.id)} className="p-2 text-gray-300 hover:text-red-500 bg-gray-50 rounded-lg ml-4">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
