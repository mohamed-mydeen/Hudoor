import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Play, TrendingUp, TrendingDown, Users, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

export const Home = ({ classes, students, attendance, goToTab, teacherName }) => {
  const today = new Date().toISOString().split('T')[0];

  const analytics = useMemo(() => {
    let totalMarkedAllTime = 0;
    let totalPresentAllTime = 0;
    
    let todayPresent = 0;
    let todayAbsent = 0;

    const classStats = {}; // { classId: { presents: 0, marked: 0 } }

    // Prepare last 7 days array
    const last7Days = [];
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push(dateStr);
      trendData.push({ dateStr, day: shortDay, presents: 0, marked: 0, percentage: 0 });
    }

    // Parse all attendance data
    Object.entries(attendance).forEach(([classId, datesObj]) => {
      if (!classStats[classId]) classStats[classId] = { presents: 0, marked: 0, name: classes.find(c => c.id === classId)?.name || 'Unknown' };

      Object.entries(datesObj).forEach(([dateStr, studentRecords]) => {
        const records = Object.values(studentRecords);
        const presents = records.filter(s => s === 'Present').length;
        const absents = records.filter(s => s === 'Absent').length;
        const total = presents + absents;

        // All Time
        totalMarkedAllTime += total;
        totalPresentAllTime += presents;

        // Class Stats
        classStats[classId].presents += presents;
        classStats[classId].marked += total;

        // Today
        if (dateStr === today) {
          todayPresent += presents;
          todayAbsent += absents;
        }

        // Trends
        const trendDay = trendData.find(t => t.dateStr === dateStr);
        if (trendDay) {
          trendDay.presents += presents;
          trendDay.marked += total;
        }
      });
    });

    // Finalize Trend Percentages
    trendData.forEach(t => {
      t.percentage = t.marked > 0 ? Math.round((t.presents / t.marked) * 100) : null;
    });

    const overallPercentage = totalMarkedAllTime > 0 ? Math.round((totalPresentAllTime / totalMarkedAllTime) * 100) : 0;
    
    // Leaderboard
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

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-full pb-6">
      <Header 
        title={teacherName ? `Welcome, ${teacherName}` : "Dashboard"} 
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} 
      />
      
      <div className="px-6 py-4 space-y-6">
        
        {/* Quick Action */}
        <button 
          onClick={() => goToTab('attendance')}
          className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-left shadow-lg shadow-blue-500/30 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Take Attendance</h2>
              <p className="text-blue-100 text-sm opacity-90">Mark presence for today.</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
              <Play fill="currentColor" size={20} className="ml-1" />
            </div>
          </div>
        </button>

        {/* Overall & Today */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-50 flex flex-col justify-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">All-Time Average</p>
            <div className="flex items-end gap-2">
              <h4 className="text-4xl font-extrabold text-blue-600">{analytics.overallPercentage}%</h4>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-50 flex flex-col justify-center space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Snapshot</p>
            <div className="flex items-center justify-between text-sm font-bold text-gray-700">
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500" /> Present</span>
              <span>{analytics.todayPresent}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-gray-700">
              <span className="flex items-center gap-1"><XCircle size={14} className="text-red-500" /> Absent</span>
              <span>{analytics.todayAbsent}</span>
            </div>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-50">
          <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" /> 7-Day Attendance Trend
          </h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.trendData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f3f4f6', strokeWidth: 20, strokeOpacity: 0.5 }} />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 3 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard */}
        {(analytics.topClass || analytics.bottomClass) && (
          <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-50 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Batch Performance</h3>
            
            {analytics.topClass && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">#1</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{analytics.topClass.name}</p>
                    <p className="text-xs text-gray-500 font-medium">Highest Attendance</p>
                  </div>
                </div>
                <span className="font-extrabold text-green-700">{analytics.topClass.percentage}%</span>
              </div>
            )}

            {analytics.bottomClass && analytics.bottomClass.name !== analytics.topClass?.name && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs"><TrendingDown size={14}/></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{analytics.bottomClass.name}</p>
                    <p className="text-xs text-gray-500 font-medium">Needs Attention</p>
                  </div>
                </div>
                <span className="font-extrabold text-red-700">{analytics.bottomClass.percentage}%</span>
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
};
