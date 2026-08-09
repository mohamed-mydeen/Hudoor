import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Play, TrendingUp, TrendingDown, Users, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Home = ({ classes, students, attendance, staff = [], staffAttendance = {}, goToTab, teacherName, isAdmin }) => {
  const [mode, setMode] = useState('students');
  const getLocalDateString = (date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  };
  const today = getLocalDateString(new Date());

  // Removed isAdmin check to allow all staff to view staff attendance

  const studentAnalytics = useMemo(() => {
    let totalMarkedAllTime = 0;
    let totalPresentAllTime = 0;
    let todayPresent = 0;
    let todayAbsent = 0;

    const classStats = {}; 
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });
      trendData.push({ dateStr, day: shortDay, presents: 0, marked: 0, percentage: 0 });
    }

    Object.entries(attendance).forEach(([classId, datesObj]) => {
      if (!classStats[classId]) classStats[classId] = { presents: 0, marked: 0, name: classes.find(c => c.id === classId)?.name || 'Unknown' };

      Object.entries(datesObj).forEach(([dateStr, studentRecords]) => {
        const records = Object.values(studentRecords);
        const presents = records.filter(s => s === 'Present').length;
        const absents = records.filter(s => s === 'Absent').length;
        const total = presents + absents;

        totalMarkedAllTime += total;
        totalPresentAllTime += presents;

        classStats[classId].presents += presents;
        classStats[classId].marked += total;

        if (dateStr === today) {
          todayPresent += presents;
          todayAbsent += absents;
        }

        const trendDay = trendData.find(t => t.dateStr === dateStr);
        if (trendDay) {
          trendDay.presents += presents;
          trendDay.marked += total;
        }
      });
    });

    trendData.forEach(t => {
      t.percentage = t.marked > 0 ? Math.round((t.presents / t.marked) * 100) : null;
    });

    const overallPercentage = totalMarkedAllTime > 0 ? Math.round((totalPresentAllTime / totalMarkedAllTime) * 100) : 0;
    
    const validClasses = Object.values(classStats).filter(c => c.marked > 0);
    validClasses.forEach(c => c.percentage = Math.round((c.presents / c.marked) * 100));
    validClasses.sort((a, b) => b.percentage - a.percentage);

    return {
      overallPercentage,
      todayPresent,
      todayAbsent,
      trendData,
      topClass: validClasses[0],
      bottomClass: validClasses[validClasses.length - 1]
    };
  }, [attendance, classes, today]);

  const staffAnalytics = useMemo(() => {
    let totalMarkedAllTime = 0;
    let totalPresentAllTime = 0;
    let todayPresent = 0;
    let todayAbsent = 0;

    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });
      trendData.push({ dateStr, day: shortDay, presents: 0, marked: 0, percentage: 0 });
    }

    Object.entries(staffAttendance).forEach(([dateStr, staffRecords]) => {
      const records = Object.values(staffRecords);
      const presents = records.filter(s => s === 'Present').length;
      const absents = records.filter(s => s === 'Absent').length;
      const total = presents + absents;

      totalMarkedAllTime += total;
      totalPresentAllTime += presents;

      if (dateStr === today) {
        todayPresent += presents;
        todayAbsent += absents;
      }

      const trendDay = trendData.find(t => t.dateStr === dateStr);
      if (trendDay) {
        trendDay.presents += presents;
        trendDay.marked += total;
      }
    });

    trendData.forEach(t => {
      t.percentage = t.marked > 0 ? Math.round((t.presents / t.marked) * 100) : null;
    });

    const overallPercentage = totalMarkedAllTime > 0 ? Math.round((totalPresentAllTime / totalMarkedAllTime) * 100) : 0;

    return {
      overallPercentage,
      todayPresent,
      todayAbsent,
      trendData
    };
  }, [staffAttendance, today]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0].value !== null) {
      return (
        <div className="bg-gray-900 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-xl">
          {payload[0].value}% Attendance
        </div>
      );
    }
    return null;
  };

  const currentAnalytics = mode === 'students' ? studentAnalytics : staffAnalytics;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-full pb-6">
      <Header 
        title={teacherName ? `Welcome, ${teacherName}` : "Dashboard"} 
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} 
      />
      
      <div className="px-6 pt-2 pb-4 space-y-6">
        
        {/* Toggle Mode */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setMode('students')}
            className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg font-bold text-sm transition-all ${mode === 'students' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            <Users size={16} /> Students
          </button>
          <button 
            onClick={() => setMode('staff')}
            className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg font-bold text-sm transition-all ${mode === 'staff' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
          >
            <Briefcase size={16} /> Staff
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Student Management System Card (Only in Students Mode) */}
            {mode === 'students' && (
              <button 
                onClick={() => goToTab('student-management')}
                className="w-full bg-white rounded-3xl p-6 text-left border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-blue-100 transition-colors"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                      <Users size={24} />
                      <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-3">Manage student information and records</p>
                    <div className="inline-flex items-center text-blue-600 text-sm font-bold group-hover:gap-2 transition-all gap-1">
                      Tap to open <span>→</span>
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Attendance Text Navigation */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => goToTab('student-attendance')}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-gray-700 font-semibold group-hover:text-blue-600 transition-colors">Student Attendance</span>
                  <span className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">→</span>
                </button>
                <div className="h-px w-full bg-gray-100"></div>
                <button 
                  onClick={() => goToTab('staff-attendance')}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-gray-700 font-semibold group-hover:text-blue-600 transition-colors">Staff Attendance</span>
                  <span className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">→</span>
                </button>
              </div>
            </div>

            {/* Overall & Today */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-50 flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">All-Time Average</p>
                <div className="flex items-end gap-2">
                  <h4 className={`text-4xl font-extrabold ${mode === 'students' ? 'text-blue-600' : 'text-purple-600'}`}>{currentAnalytics.overallPercentage}%</h4>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-50 flex flex-col justify-center space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Snapshot</p>
                <div className="flex items-center justify-between text-sm font-bold text-gray-700">
                  <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500" /> Present</span>
                  <span>{currentAnalytics.todayPresent}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-gray-700">
                  <span className="flex items-center gap-1"><XCircle size={14} className="text-red-500" /> Absent</span>
                  <span>{currentAnalytics.todayAbsent}</span>
                </div>
              </div>
            </div>

            {/* Weekly Trend Chart */}
            <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-50">
              <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp size={18} className={mode === 'students' ? 'text-blue-500' : 'text-purple-500'} /> 7-Day Attendance Trend
              </h3>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentAnalytics.trendData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f3f4f6', strokeWidth: 20, strokeOpacity: 0.5 }} />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke={mode === 'students' ? "#3b82f6" : "#a855f7"} 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: mode === 'students' ? "#3b82f6" : "#a855f7", strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: mode === 'students' ? "#1d4ed8" : "#7e22ce", stroke: '#fff', strokeWidth: 3 }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leaderboard - Only for Students */}
            {mode === 'students' && (currentAnalytics.topClass || currentAnalytics.bottomClass) && (
              <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-50 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Batch Performance</h3>
                
                {currentAnalytics.topClass && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">#1</div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{currentAnalytics.topClass.name}</p>
                        <p className="text-xs text-gray-500 font-medium">Highest Attendance</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-green-700">{currentAnalytics.topClass.percentage}%</span>
                  </div>
                )}

                {currentAnalytics.bottomClass && currentAnalytics.bottomClass.name !== currentAnalytics.topClass?.name && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs"><TrendingDown size={14}/></div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{currentAnalytics.bottomClass.name}</p>
                        <p className="text-xs text-gray-500 font-medium">Needs Attention</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-red-700">{currentAnalytics.bottomClass.percentage}%</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
