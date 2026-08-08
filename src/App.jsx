import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BottomNav } from './components/BottomNav';
import { Splash } from './components/Splash';
import { storage } from './utils/storage';

// Placeholder Pages
import { Home } from './pages/Home';
import { Classes } from './pages/Classes';
import { Attendance } from './pages/Attendance';
import { Settings } from './pages/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isReady, setIsReady] = useState(false);
  
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [dbClasses, dbStudents, dbAttendance, dbCustomFields, dbTeacherName] = await Promise.all([
        storage.getClasses(),
        storage.getStudents(),
        storage.getAttendance(),
        storage.getCustomFields(),
        storage.getTeacherName()
      ]);
      
      setClasses(dbClasses);
      setStudents(dbStudents);
      setAttendance(dbAttendance);
      setCustomFields(dbCustomFields);
      setTeacherName(dbTeacherName);
      setIsDbLoaded(true);
    };

    loadData();
  }, []);

  const saveAndSetClasses = (newClasses) => {
    setClasses(newClasses);
    storage.saveClasses(newClasses);
  };

  const saveAndSetStudents = (newStudents) => {
    setStudents(newStudents);
    storage.saveStudents(newStudents);
  };

  const saveAndSetAttendance = (newAtt) => {
    setAttendance(newAtt);
    storage.saveAttendance(newAtt);
  };

  const saveAndSetCustomFields = (newFields) => {
    setCustomFields(newFields);
    storage.saveCustomFields(newFields);
  };

  const saveAndSetTeacherName = (name) => {
    setTeacherName(name);
    storage.saveTeacherName(name);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home classes={classes} students={students} attendance={attendance} goToTab={setActiveTab} teacherName={teacherName} />;
      case 'classes':
        return <Classes classes={classes} setClasses={saveAndSetClasses} students={students} setStudents={saveAndSetStudents} customFields={customFields} setCustomFields={saveAndSetCustomFields} />;
      case 'attendance':
        return <Attendance classes={classes} students={students} attendance={attendance} setAttendance={saveAndSetAttendance} />;
      case 'settings':
        return <Settings teacherName={teacherName} setTeacherName={saveAndSetTeacherName} />;
      default:
        return null;
    }
  };

  // Wait for both the 3-second splash animation and the database to load
  if (!isReady || !isDbLoaded) {
    return (
      <AnimatePresence>
        <Splash key="splash" onComplete={() => setIsReady(true)} />
      </AnimatePresence>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto relative w-full no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
