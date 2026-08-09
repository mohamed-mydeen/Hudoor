import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BottomNav } from './components/BottomNav';
import { Splash } from './components/Splash';
import { storage } from './utils/storage';

// Pages
import { Home } from './pages/Home';
import { Classes } from './pages/Classes';
import { Attendance } from './pages/Attendance';
import { Settings } from './pages/Settings';
import { Staff } from './pages/Staff';
import { StudentManagement } from './pages/StudentManagement';
import { LoginScreen } from './pages/LoginScreen';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isReady, setIsReady] = useState(false);
  
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [staff, setStaff] = useState([]);
  const [staffAttendance, setStaffAttendance] = useState({});
  const [currentStaffId, setCurrentStaffId] = useState(null);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [
        dbClasses, 
        dbStudents, 
        dbAttendance, 
        dbCustomFields, 
        dbTeacherName, 
        dbStaff, 
        dbStaffAttendance,
        dbCurrentStaffId
      ] = await Promise.all([
        storage.getClasses(),
        storage.getStudents(),
        storage.getAttendance(),
        storage.getCustomFields(),
        storage.getTeacherName(),
        storage.getStaff(),
        storage.getStaffAttendance(),
        storage.getCurrentStaffId()
      ]);
      
      setClasses(dbClasses);
      setStudents(dbStudents);
      setAttendance(dbAttendance);
      setCustomFields(dbCustomFields);
      setTeacherName(dbTeacherName);
      setStaff(dbStaff);
      setStaffAttendance(dbStaffAttendance);
      setCurrentStaffId(dbCurrentStaffId);
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

  const saveAndSetStaff = (newStaff) => {
    setStaff(newStaff);
    storage.saveStaff(newStaff);
  };

  const saveAndSetStaffAttendance = (newAtt) => {
    setStaffAttendance(newAtt);
    storage.saveStaffAttendance(newAtt);
  };

  const handleSelectStaff = (id, password) => {
    if (id === 'admin_setup') {
      // Special logic for first time setup
      const adminId = Date.now().toString();
      const newAdmin = { id: adminId, name: 'Admin', role: 'admin', password: password };
      saveAndSetStaff([newAdmin]);
      setCurrentStaffId(adminId);
      storage.saveCurrentStaffId(adminId);
      return;
    }
    setCurrentStaffId(id);
    storage.saveCurrentStaffId(id);
  };

  const handleLogout = () => {
    setCurrentStaffId(null);
    storage.saveCurrentStaffId(null);
    setActiveTab('home'); // reset tab on logout
  };

  // Wait for both the 3-second splash animation and the database to load
  if (!isReady || !isDbLoaded) {
    return (
      <AnimatePresence>
        <Splash key="splash" onComplete={() => setIsReady(true)} />
      </AnimatePresence>
    );
  }

  const handleCreateStaff = (newStaffData) => {
    const newStaffId = Date.now().toString();
    const newStaff = {
      id: newStaffId,
      ...newStaffData
    };
    saveAndSetStaff([...staff, newStaff]);
    setCurrentStaffId(newStaffId);
    storage.saveCurrentStaffId(newStaffId);
  };

  // If DB is loaded and no staff is selected, show Login Screen
  if (isDbLoaded && !currentStaffId) {
    return <LoginScreen staff={staff} onSelectStaff={handleSelectStaff} onCreateStaff={handleCreateStaff} />;
  }

  // Helper to get current staff details
  const currentStaffProfile = staff.find(s => s.id === currentStaffId);
  const isAdmin = currentStaffProfile?.role?.toLowerCase() === 'admin';

  // Filter data to only show for current staff
  const staffClasses = classes.filter(c => c.staffId === currentStaffId);
  const staffStudents = students.filter(s => s.staffId === currentStaffId);

  // We should also scope custom fields to the staff, or keep them global.
  // The plan said "keep them global", so we don't filter customFields.

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home 
                  key="home"
                  classes={staffClasses} 
                  students={staffStudents} 
                  attendance={attendance} 
                  staff={staff} 
                  staffAttendance={staffAttendance} 
                  goToTab={setActiveTab} 
                  teacherName={currentStaffProfile?.name || teacherName}
                  isAdmin={isAdmin} 
               />;
      case 'student-management':
        return <StudentManagement 
                  key="student-management"
                  students={staffStudents} 
                  setStudents={(updatedStaffStudents) => {
                    // updatedStaffStudents contains only this staff's students.
                    // We must merge them back into the global students list.
                    const otherStudents = students.filter(s => s.staffId !== currentStaffId);
                    saveAndSetStudents([...otherStudents, ...updatedStaffStudents]);
                  }} 
                  classes={staffClasses} 
                  customFields={customFields} 
                  setCustomFields={saveAndSetCustomFields} 
                  goToTab={setActiveTab} 
                  currentStaffId={currentStaffId}
               />;
      case 'staff':
        return <Staff key="staff" staff={staff} setStaff={saveAndSetStaff} currentStaffId={currentStaffId} goToTab={setActiveTab} />;
      case 'classes':
        return <Classes 
                  key="classes"
                  classes={staffClasses} 
                  setClasses={(updatedStaffClasses) => {
                    const otherClasses = classes.filter(c => c.staffId !== currentStaffId);
                    saveAndSetClasses([...otherClasses, ...updatedStaffClasses]);
                  }} 
                  students={staffStudents} 
                  setStudents={(updatedStaffStudents) => {
                    const otherStudents = students.filter(s => s.staffId !== currentStaffId);
                    saveAndSetStudents([...otherStudents, ...updatedStaffStudents]);
                  }} 
                  customFields={customFields} 
                  setCustomFields={saveAndSetCustomFields} 
                  currentStaffId={currentStaffId}
                  goToTab={setActiveTab}
               />;
      case 'attendance':
      case 'student-attendance':
        return <Attendance 
                  key="student-attendance"
                  mode="students"
                  classes={staffClasses} 
                  students={staffStudents} 
                  attendance={attendance} 
                  setAttendance={saveAndSetAttendance} 
                  staff={staff} 
                  staffAttendance={staffAttendance} 
                  setStaffAttendance={saveAndSetStaffAttendance} 
                  goToTab={setActiveTab}
               />;
      case 'staff-attendance':
        return <Attendance 
                  key="staff-attendance"
                  mode="staff"
                  classes={staffClasses} 
                  students={staffStudents} 
                  attendance={attendance} 
                  setAttendance={saveAndSetAttendance} 
                  staff={staff} 
                  staffAttendance={staffAttendance} 
                  setStaffAttendance={saveAndSetStaffAttendance} 
                  goToTab={setActiveTab}
               />;
      case 'settings':
        return <Settings 
                  key="settings"
                  teacherName={currentStaffProfile?.name || teacherName} 
                  setTeacherName={saveAndSetTeacherName} 
                  onLogout={handleLogout}
                  goToTab={setActiveTab}
               />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      <main className="flex-1 overflow-y-auto relative w-full no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />
    </div>
  );
}

export default App;
