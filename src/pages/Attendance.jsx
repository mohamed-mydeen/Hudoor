import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { SelectSheet } from '../components/SelectSheet';
import { Check, X, Calendar } from 'lucide-react';

export const Attendance = ({ classes, students, attendance, setAttendance }) => {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleMark = (studentId, status) => {
    if (!selectedClassId) return;
    
    setAttendance({
      ...attendance,
      [selectedClassId]: {
        ...(attendance[selectedClassId] || {}),
        [date]: {
          ...(attendance[selectedClassId]?.[date] || {}),
          [studentId]: status
        }
      }
    });
  };

  const selectedClassStudents = students.filter(s => s.classId === selectedClassId);
  const currentAttendance = attendance[selectedClassId]?.[date] || {};
  const markedCount = Object.keys(currentAttendance).length;
  const totalCount = selectedClassStudents.length;

  if (classes.length === 0) {
    return (
      <div className="min-h-full flex flex-col">
        <Header title="Attendance" subtitle="Track Records" />
        <div className="p-6 text-center text-gray-400 mt-10">
          <p className="font-medium">Please create a class first.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-full flex flex-col">
      <Header title="Attendance" subtitle="Daily Tracking" />
      
      <div className="px-6 pb-2 sticky top-[100px] bg-white bg-opacity-95 backdrop-blur-md z-30 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <SelectSheet 
              value={selectedClassId}
              options={classes.map(c => ({ value: c.id, label: c.name }))}
              onChange={(val) => setSelectedClassId(val)}
              placeholder="Select Class"
            />
          </div>
          
          <div className="relative w-1/3">
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              className="w-full bg-blue-50 text-blue-700 border border-blue-100 rounded-xl pl-10 pr-2 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
          </div>
        </div>

        {totalCount > 0 && (
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-gray-500">
            <span>Marked: {markedCount}/{totalCount}</span>
            <div className="w-1/2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(markedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 flex-1">
        {totalCount === 0 ? (
          <div className="text-center py-10 text-gray-400 font-medium">No students in this class.</div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {selectedClassStudents.map(student => {
                const status = currentAttendance[student.id]; // 'Present' | 'Absent'
                return (
                  <motion.div 
                    key={student.id} 
                    layout 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                      status === 'Present' ? 'bg-green-50 border-green-100' :
                      status === 'Absent' ? 'bg-red-50 border-red-100' :
                      'bg-white border-gray-100 card-shadow'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-gray-900">{student.name}</h4>
                      {student.rollNo && <p className="text-xs font-semibold text-gray-400 mt-0.5">Roll: {student.rollNo}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleMark(student.id, 'Absent')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          status === 'Absent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
                        }`}
                      >
                        <X size={24} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => handleMark(student.id, 'Present')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          status === 'Present' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500'
                        }`}
                      >
                        <Check size={24} strokeWidth={3} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};
