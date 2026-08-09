import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Plus, ChevronRight, ArrowLeft, Users, Trash2, X } from 'lucide-react';

export const Classes = ({ classes, setClasses, students, setStudents, customFields = [], setCustomFields, currentStaffId }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  
  // New Class Form
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // New Student Form
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentCustom, setNewStudentCustom] = useState({});
  
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newClass = { 
      id: Date.now().toString(), 
      name: newClassName.trim(),
      staffId: currentStaffId
    };
    setClasses([...classes, newClass]);
    setNewClassName('');
    setShowAddClass(false);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedClass) return;
    const newStudent = {
      id: Date.now().toString(),
      classId: selectedClass.id,
      name: newStudentName.trim(),
      rollNo: newStudentRoll.trim(),
      staffId: currentStaffId,
      ...newStudentCustom
    };
    setStudents([...students, newStudent]);
    setNewStudentName('');
    setNewStudentRoll('');
    setNewStudentCustom({});
    setShowAddStudent(false);
    setIsAddingField(false);
  };

  const handleCreateCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const id = newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (customFields.find(f => f.id === id)) return alert('Field already exists');
    setCustomFields([...customFields, { id, label: newFieldLabel.trim(), type: 'text' }]);
    setNewFieldLabel('');
    setIsAddingField(false);
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm("Delete this class and all its students?")) {
      setClasses(classes.filter(c => c.id !== classId));
      setStudents(students.filter(s => s.classId !== classId));
      setSelectedClass(null);
    }
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Remove this student?")) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  // ----- VIEW: STUDENT LIST -----
  if (selectedClass) {
    const classStudents = students.filter(s => s.classId === selectedClass.id);
    
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-full flex flex-col">
        <Header 
          title={selectedClass.name} 
          subtitle="Manage Students"
          rightElement={
            <button onClick={() => handleDeleteClass(selectedClass.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <Trash2 size={18} />
            </button>
          }
        />
        
        <div className="px-6 pb-4">
          <button onClick={() => setSelectedClass(null)} className="flex items-center text-blue-600 font-medium mb-4">
            <ArrowLeft size={18} className="mr-1" /> Back to Classes
          </button>

          {showAddStudent ? (
            <div className="bg-white p-5 rounded-2xl card-shadow mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Add New Student</h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <input 
                  type="text" placeholder="Full Name" required autoFocus
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newStudentName} onChange={e => setNewStudentName(e.target.value)}
                />
                <input 
                  type="text" placeholder="Roll No / ID (Optional)"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newStudentRoll} onChange={e => setNewStudentRoll(e.target.value)}
                />
                
                {customFields.map(field => (
                  <div key={field.id} className="relative">
                    <input 
                      type="text" placeholder={`${field.label} (Optional)`}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newStudentCustom[field.id] || ''} 
                      onChange={e => setNewStudentCustom({ ...newStudentCustom, [field.id]: e.target.value })}
                    />
                    <button 
                      type="button"
                      onClick={() => setCustomFields(customFields.filter(f => f.id !== field.id))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                {isAddingField ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Field Name (e.g. Phone)" autoFocus
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)}
                    />
                    <button type="button" onClick={handleCreateCustomField} className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl font-bold text-sm">Add</button>
                    <button type="button" onClick={() => setIsAddingField(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-xl"><X size={16}/></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setIsAddingField(true)} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                    <Plus size={16} /> Add Custom Field
                  </button>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddStudent(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">Save</button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={() => setShowAddStudent(true)} className="w-full border-2 border-dashed border-gray-200 text-gray-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mb-6 hover:bg-gray-50">
              <Plus size={20} /> Add Student
            </button>
          )}

          <div className="space-y-3">
            {classStudents.length === 0 && !showAddStudent && (
              <div className="text-center py-10 text-gray-400 font-medium">No students in this class yet.</div>
            )}
            {classStudents.map(student => (
              <div key={student.id} className="bg-white p-4 rounded-2xl card-shadow border border-gray-50 flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{student.name}</h4>
                  {student.rollNo && <p className="text-xs font-semibold text-gray-500 mt-0.5">Roll: {student.rollNo}</p>}
                  
                  {/* Render Custom Fields */}
                  {customFields.map(field => {
                    if (!student[field.id]) return null;
                    return (
                      <p key={field.id} className="text-xs font-semibold text-gray-400 mt-0.5">
                        {field.label}: {student[field.id]}
                      </p>
                    );
                  })}
                </div>
                <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-gray-300 hover:text-red-500 bg-gray-50 rounded-lg ml-4">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // ----- VIEW: CLASS LIST -----
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-full flex flex-col">
      <Header title="Classes" subtitle="Your Batches" />
      
      <div className="px-6 py-4">
        {showAddClass ? (
          <div className="bg-white p-5 rounded-2xl card-shadow mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Create New Class</h3>
            <form onSubmit={handleAddClass} className="space-y-4">
              <input 
                type="text" placeholder="e.g. 10th Grade A" required autoFocus
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newClassName} onChange={e => setNewClassName(e.target.value)}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddClass(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-white font-bold bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">Create</button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={() => setShowAddClass(true)} className="w-full border-2 border-dashed border-gray-200 text-gray-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mb-6 hover:bg-gray-50 transition-colors">
            <Plus size={20} /> Create Class
          </button>
        )}

        <div className="space-y-4">
          {classes.length === 0 && !showAddClass && (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <Users size={32} />
              </div>
              <p className="text-gray-400 font-medium">You haven't created any classes.</p>
            </div>
          )}
          
          {classes.map(cls => {
            const count = students.filter(s => s.classId === cls.id).length;
            return (
              <button 
                key={cls.id} 
                onClick={() => setSelectedClass(cls)}
                className="w-full bg-white p-5 rounded-2xl card-shadow border border-gray-50 flex items-center justify-between text-left active:scale-95 transition-transform"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{cls.name}</h3>
                  <p className="text-sm font-semibold text-gray-400 mt-1">{count} Student{count !== 1 ? 's' : ''}</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                  <ChevronRight size={20} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
