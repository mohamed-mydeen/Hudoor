import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Calendar, Download } from 'lucide-react';
import { SelectSheet } from '../components/SelectSheet';

export const Attendance = ({ mode, classes, students, attendance, setAttendance, staff = [], staffAttendance = {}, setStaffAttendance, goToTab }) => {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const d = new Date();
  const today = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  // ===================== DATA EXTRACTION =====================
  const isStudents = mode === 'students';
  
  // Rows
  const rows = useMemo(() => {
    if (isStudents) {
      return students.filter(s => s.classId === selectedClassId);
    } else {
      return staff;
    }
  }, [mode, selectedClassId, students, staff, isStudents]);

  // Columns (Dates)
  const columns = useMemo(() => {
    let dates = [];
    if (isStudents) {
      dates = Object.keys(attendance[selectedClassId] || {});
    } else {
      dates = Object.keys(staffAttendance || {});
    }
    return dates.sort(); // Ascending order
  }, [mode, selectedClassId, attendance, staffAttendance, isStudents]);

  // ===================== ACTIONS =====================

  const handleAddDate = (e) => {
    const newDate = e.target.value;
    if (!newDate) return;
    
    setShowDatePicker(false);
    
    if (isStudents) {
      if (!selectedClassId) return;
      setAttendance({
        ...attendance,
        [selectedClassId]: {
          ...(attendance[selectedClassId] || {}),
          [newDate]: attendance[selectedClassId]?.[newDate] || {}
        }
      });
    } else {
      setStaffAttendance({
        ...staffAttendance,
        [newDate]: staffAttendance[newDate] || {}
      });
    }
  };

  const handleToggleCell = (rowId, date) => {
    let currentStatus;
    if (isStudents) {
      currentStatus = attendance[selectedClassId]?.[date]?.[rowId];
    } else {
      currentStatus = staffAttendance[date]?.[rowId];
    }

    // Cycle: undefined -> 'Present' -> 'Absent' -> undefined
    let nextStatus = 'Present';
    if (currentStatus === 'Present') nextStatus = 'Absent';
    else if (currentStatus === 'Absent') nextStatus = undefined;

    if (isStudents) {
      const classData = attendance[selectedClassId] || {};
      const dateData = classData[date] || {};
      const newDateData = { ...dateData };
      
      if (nextStatus) {
        newDateData[rowId] = nextStatus;
      } else {
        delete newDateData[rowId];
      }

      setAttendance({
        ...attendance,
        [selectedClassId]: {
          ...classData,
          [date]: newDateData
        }
      });
    } else {
      const dateData = staffAttendance[date] || {};
      const newDateData = { ...dateData };
      
      if (nextStatus) {
        newDateData[rowId] = nextStatus;
      } else {
        delete newDateData[rowId];
      }

      setStaffAttendance({
        ...staffAttendance,
        [date]: newDateData
      });
    }
  };

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  };

  const getTotals = (rowId) => {
    let p = 0; let a = 0;
    columns.forEach(date => {
      let status;
      if (isStudents) status = attendance[selectedClassId]?.[date]?.[rowId];
      else status = staffAttendance[date]?.[rowId];
      if (status === 'Present') p++;
      else if (status === 'Absent') a++;
    });
    return { p, a };
  };

  const handleExportCSV = () => {
    if (rows.length === 0 || columns.length === 0) {
      alert("No attendance data to export");
      return;
    }
    
    const headers = ['Name', 'Total Present', 'Total Absent', ...columns.map(formatDateLabel)];
    const csvRows = [headers.join(',')];
    
    rows.forEach(row => {
      const { p, a } = getTotals(row.id);
      const rowData = [ 
        `"${(row.name || '').replace(/"/g, '""')}"`,
        p,
        a
      ];
      columns.forEach(date => {
        let status;
        if (isStudents) {
          status = attendance[selectedClassId]?.[date]?.[row.id] || '-';
        } else {
          status = staffAttendance[date]?.[row.id] || '-';
        }
        rowData.push(`"${status}"`);
      });
      csvRows.push(rowData.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${isStudents ? 'student' : 'staff'}_attendance.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-full flex flex-col bg-gray-50 pb-6">
      
      {/* HEADER */}
      <div className="bg-white px-6 pt-10 pb-4 sticky top-0 z-40 bg-opacity-95 backdrop-blur-md shadow-sm border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => goToTab('home')}
            className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 truncate">
            {isStudents ? 'Student Attendance' : 'Staff Attendance'}
          </h1>
        </div>
        <div className="text-sm font-bold text-gray-400">
          {rows.length} {isStudents ? 'Students' : 'Staff'}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 max-w-full overflow-hidden">
        
        {/* Controls */}
        <div className="flex items-center justify-between gap-3 mb-4">
          {isStudents ? (
            <div className="flex-1 max-w-[200px]">
              <SelectSheet 
                value={selectedClassId}
                options={classes.map(c => ({ value: c.id, label: c.name }))}
                onChange={(val) => setSelectedClassId(val)}
                placeholder="Select Class"
              />
            </div>
          ) : (
            <div className="flex-1 font-bold text-gray-700 bg-white px-4 py-3.5 rounded-xl border border-gray-200">
              All Staff
            </div>
          )}

          <div className="flex gap-2 shrink-0 relative">
            <button 
              onClick={handleExportCSV}
              className="bg-green-50 text-green-600 flex items-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            >
              <Download size={16} /> Export
            </button>
            {showDatePicker ? (
              <input 
                type="date" 
                autoFocus
                onChange={handleAddDate}
                onBlur={() => setShowDatePicker(false)}
                className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-3 py-3 text-sm font-bold focus:outline-none"
              />
            ) : (
              <button 
                onClick={() => setShowDatePicker(true)}
                className="bg-gray-900 text-white flex items-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-gray-900/20 active:scale-95 transition-transform"
              >
                <Plus size={16} /> Add Date
              </button>
            )}
          </div>
        </div>

        {/* EXCEL STYLE TABLE */}
        <div className="flex-1 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col relative">
          
          {rows.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-medium py-20">
              <p>No {isStudents ? 'students in this class' : 'staff added'} yet.</p>
            </div>
          ) : columns.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-medium py-20">
              <Calendar size={48} className="text-gray-200 mb-4" />
              <p>No attendance dates recorded.</p>
              <p className="text-sm mt-1">Click "Add Date" to start.</p>
            </div>
          ) : (
            <div className="overflow-auto w-full h-full relative" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="sticky top-0 left-0 z-30 bg-gray-50 border-b border-r border-gray-200 p-3 shadow-[1px_1px_0_0_#e5e7eb] font-extrabold text-gray-500 uppercase tracking-wider text-xs">
                      Name
                    </th>
                    <th className="sticky top-0 z-20 bg-green-50 border-b border-r border-green-100 p-3 font-extrabold text-green-700 text-center min-w-[70px] uppercase tracking-wider text-xs">
                      P
                    </th>
                    <th className="sticky top-0 z-20 bg-red-50 border-b border-r border-red-100 p-3 font-extrabold text-red-700 text-center min-w-[70px] uppercase tracking-wider text-xs">
                      A
                    </th>
                    {columns.map(date => (
                      <th key={date} className="sticky top-0 z-20 bg-gray-50 border-b border-r border-gray-100 p-3 font-extrabold text-gray-600 text-center min-w-[70px]">
                        {formatDateLabel(date)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className={`sticky left-0 z-10 bg-white border-r border-gray-200 p-3 font-bold text-gray-800 shadow-[1px_0_0_0_#e5e7eb] max-w-[150px] truncate ${index !== rows.length - 1 ? 'border-b' : ''}`}>
                        {row.name}
                      </td>
                      {(() => {
                        const { p, a } = getTotals(row.id);
                        return (
                          <>
                            <td className={`border-r border-gray-100 p-3 text-center font-bold text-green-600 bg-green-50/30 ${index !== rows.length - 1 ? 'border-b' : ''}`}>{p}</td>
                            <td className={`border-r border-gray-100 p-3 text-center font-bold text-red-600 bg-red-50/30 ${index !== rows.length - 1 ? 'border-b' : ''}`}>{a}</td>
                          </>
                        );
                      })()}
                      {columns.map(date => {
                        let status;
                        if (isStudents) status = attendance[selectedClassId]?.[date]?.[row.id];
                        else status = staffAttendance[date]?.[row.id];
                        
                        let cellContent = '-';
                        let cellClass = 'text-gray-300';
                        if (status === 'Present') {
                          cellContent = 'P';
                          cellClass = 'text-green-600 font-extrabold bg-green-50/50';
                        } else if (status === 'Absent') {
                          cellContent = 'A';
                          cellClass = 'text-red-600 font-extrabold bg-red-50/50';
                        }

                        return (
                          <td 
                            key={date}
                            onClick={() => handleToggleCell(row.id, date)}
                            className={`border-r border-gray-100 p-3 text-center cursor-pointer select-none transition-colors active:bg-gray-100 ${cellClass} ${index !== rows.length - 1 ? 'border-b' : ''}`}
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
