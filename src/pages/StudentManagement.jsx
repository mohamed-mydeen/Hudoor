import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Plus, Trash2, Edit2, Eye, User, Users, Phone, X, Save } from 'lucide-react';
import { Header } from '../components/Header';

export const StudentManagement = ({ students, setStudents, classes, customFields, setCustomFields, goToTab, currentStaffId }) => {
  // Routing state within Student Management
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'add' | 'view' | 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);

  // List View State
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Form State
  const [formData, setFormData] = useState({});
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');

  // Search Logic
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(student => {
      // Search across all student properties
      return Object.values(student).some(val => 
        val && String(val).toLowerCase().includes(query)
      );
    });
  }, [students, searchQuery]);

  // Handle Form Input
  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  // Handle Create Custom Field
  const handleCreateCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const id = newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (customFields.find(f => f.id === id)) {
      alert('Field already exists');
      return;
    }
    setCustomFields([...customFields, { id, label: newFieldLabel.trim(), type: 'text' }]);
    setNewFieldLabel('');
    setIsAddingField(false);
  };

  const handleDeleteCustomField = (fieldId) => {
    if (window.confirm("Remove this field for all students?")) {
      setCustomFields(customFields.filter(f => f.id !== fieldId));
    }
  };

  // Navigate to Add
  const openAdd = () => {
    setFormData({
      name: '',
      phone: '',
      age: '',
      registerNumber: '',
      classId: classes[0]?.id || ''
    });
    setCurrentView('add');
  };

  // Navigate to View
  const openView = (student) => {
    setSelectedStudent(student);
    setCurrentView('view');
  };

  // Navigate to Edit
  const openEdit = (student) => {
    setSelectedStudent(student);
    setFormData({ ...student });
    setCurrentView('edit');
  };

  // Save Add/Edit
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert("Name is required");
      return;
    }

    if (currentView === 'add') {
      const newStudent = {
        id: Date.now().toString(),
        staffId: currentStaffId,
        ...formData
      };
      setStudents([...students, newStudent]);
      // The prompt requests "Student updated successfully" / added. We can use an alert or a toast.
      // Alert is simplest for immediate feedback without extra libs.
      alert('Student added successfully');
    } else if (currentView === 'edit') {
      const updatedStudents = students.map(s => s.id === selectedStudent.id ? { ...formData } : s);
      setStudents(updatedStudents);
      alert('Student updated successfully');
    }
    setCurrentView('list');
  };

  // Delete
  const handleDelete = (studentId) => {
    if (window.confirm("Delete Student?\n\nAre you sure you want to delete this student?\n\nThis action cannot be undone.")) {
      setStudents(students.filter(s => s.id !== studentId));
      alert('Student deleted successfully');
      setCurrentView('list');
    }
  };


  // ======== SUB-RENDERERS ========

  const renderHeader = (title, showBackToList = false) => (
    <div className="bg-white px-6 pt-10 pb-4 sticky top-0 z-40 bg-opacity-95 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => showBackToList ? setCurrentView('list') : goToTab('home')}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">{title}</h1>
          {!showBackToList && <p className="text-sm font-semibold text-gray-400">{students.length} Students</p>}
        </div>
      </div>
    </div>
  );

  const renderList = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col pb-24">
      {renderHeader("Student Management System")}
      
      <div className="px-6 py-4 space-y-6">
        {/* Search & Add */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <button 
          onClick={openAdd}
          className="w-full bg-blue-600 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-transform"
        >
          <Plus size={20} /> Add Student
        </button>

        {/* List */}
        <div className="space-y-4">
          {students.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4 card-shadow">
                <Users size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No students added yet</h3>
              <p className="text-gray-500 font-medium text-sm max-w-[200px] mx-auto">
                Add your first student to start managing student information.
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-gray-500 font-medium">No students found</div>
          ) : (
            filteredStudents.map(student => (
              <div key={student.id} className="bg-white p-5 rounded-2xl card-shadow border border-gray-50">
                <h3 className="font-bold text-gray-900 text-lg mb-3">{student.name}</h3>
                
                <div className="space-y-1.5 mb-5">
                  {student.phone && <p className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Phone size={14}/> {student.phone}</p>}
                  {student.age && <p className="text-sm font-semibold text-gray-500">Age: {student.age}</p>}
                  {student.registerNumber && <p className="text-sm font-semibold text-gray-500">Reg No: {student.registerNumber}</p>}
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => openView(student)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm flex items-center justify-center gap-1"><Eye size={16}/> View</button>
                  <button onClick={() => openEdit(student)} className="flex-1 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-sm flex items-center justify-center gap-1"><Edit2 size={16}/> Edit</button>
                  <button onClick={() => handleDelete(student.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-1"><Trash2 size={16}/> Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderForm = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col pb-24">
      {renderHeader(currentView === 'add' ? "Add Student" : "Edit Student", true)}
      
      <div className="px-6 py-4">
        <form onSubmit={handleSave} className="space-y-4">
          
          <div className="bg-white p-5 rounded-2xl card-shadow border border-gray-50 space-y-4">
            <h3 className="font-bold text-gray-900 mb-2">Basic Details</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Full Name</label>
              <input type="text" required value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Mohamed Mydeen" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Phone Number</label>
                <input type="tel" value={formData.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Age</label>
                <input type="number" value={formData.age || ''} onChange={e => handleInputChange('age', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="21" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Register Number</label>
              <input type="text" value={formData.registerNumber || ''} onChange={e => handleInputChange('registerNumber', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="23CS001" />
            </div>

            {/* Optional Class Assignment */}
            {classes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Assign Class (Optional)</label>
                <select value={formData.classId || ''} onChange={e => handleInputChange('classId', e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">No Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl card-shadow border border-gray-50 space-y-4">
            <h3 className="font-bold text-gray-900 mb-2">Additional Fields</h3>
            
            {customFields.map(field => (
              <div key={field.id} className="relative group">
                <label className="block text-xs font-bold text-gray-400 mb-1">{field.label}</label>
                <input 
                  type="text" 
                  value={formData[field.id] || ''} 
                  onChange={e => handleInputChange(field.id, e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder={`Enter ${field.label}`} 
                />
                <button type="button" onClick={() => handleDeleteCustomField(field.id)} className="absolute right-0 top-0 text-gray-300 hover:text-red-500 p-1">
                  <X size={14}/>
                </button>
              </div>
            ))}

            {isAddingField ? (
              <div className="flex gap-2 mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <input 
                  type="text" placeholder="Field Name (e.g. Department)" autoFocus
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500"
                  value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)}
                />
                <button type="button" onClick={handleCreateCustomField} className="px-3 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">Add</button>
                <button type="button" onClick={() => setIsAddingField(false)} className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg"><X size={16}/></button>
              </div>
            ) : (
              <button type="button" onClick={() => setIsAddingField(true)} className="w-full border-2 border-dashed border-gray-200 text-gray-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mt-4">
                <Plus size={18} /> Add Field
              </button>
            )}
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-transform">
            <Save size={20} /> Save Student
          </button>
        </form>
      </div>
    </motion.div>
  );

  const renderViewDetails = () => {
    if (!selectedStudent) return null;
    
    // Determine which fields have values
    const basicFields = [
      { label: 'Name', value: selectedStudent.name },
      { label: 'Phone', value: selectedStudent.phone },
      { label: 'Age', value: selectedStudent.age },
      { label: 'Register Number', value: selectedStudent.registerNumber }
    ].filter(f => f.value);

    const extraFields = customFields
      .map(cf => ({ label: cf.label, value: selectedStudent[cf.id] }))
      .filter(f => f.value);
      
    // Include class name if applicable
    if (selectedStudent.classId) {
      const cls = classes.find(c => c.id === selectedStudent.classId);
      if (cls) extraFields.unshift({ label: 'Class/Batch', value: cls.name });
    }

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col pb-24">
        {renderHeader("Student Details", true)}
        
        <div className="px-6 py-4 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-50">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} />
            </div>
            
            <div className="space-y-4">
              {basicFields.map((f, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{f.label}</p>
                  <p className="font-bold text-gray-900 text-lg">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {extraFields.length > 0 && (
            <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-50">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Additional Information</h3>
              <div className="space-y-4">
                {extraFields.map((f, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{f.label}</p>
                    <p className="font-bold text-gray-900">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => openEdit(selectedStudent)} className="flex-1 bg-orange-50 text-orange-600 font-bold rounded-2xl py-4 flex items-center justify-center gap-2">
              <Edit2 size={18} /> Edit Student
            </button>
            <button onClick={() => handleDelete(selectedStudent.id)} className="flex-1 bg-red-50 text-red-600 font-bold rounded-2xl py-4 flex items-center justify-center gap-2">
              <Trash2 size={18} /> Delete Student
            </button>
          </div>
          
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'list' && renderList()}
      {(currentView === 'add' || currentView === 'edit') && renderForm()}
      {currentView === 'view' && renderViewDetails()}
    </AnimatePresence>
  );
};
