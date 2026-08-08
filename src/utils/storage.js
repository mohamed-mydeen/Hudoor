import localforage from 'localforage';

const KEYS = {
  CLASSES: 'app_classes', // [{ id, name, description }]
  STUDENTS: 'app_students', // [{ id, classId, name, rollNo, ...customData }]
  ATTENDANCE: 'app_attendance', // { classId: { date: { studentId: 'Present' | 'Absent' } } }
  CUSTOM_FIELDS: 'app_custom_fields', // [{ id, label, type }]
  TEACHER_NAME: 'app_teacher_name', // string
};

// Configure localforage to use IndexedDB
localforage.config({
  name: 'Hudoor',
  storeName: 'madrasa_store',
  description: 'Offline database for Hudoor Madrasa App'
});

export const storage = {
  getClasses: async () => {
    try {
      const data = await localforage.getItem(KEYS.CLASSES);
      return data || [];
    } catch { return []; }
  },
  
  saveClasses: async (classes) => {
    await localforage.setItem(KEYS.CLASSES, classes);
  },
  
  getStudents: async () => {
    try {
      const data = await localforage.getItem(KEYS.STUDENTS);
      return data || [];
    } catch { return []; }
  },
  
  saveStudents: async (students) => {
    await localforage.setItem(KEYS.STUDENTS, students);
  },
  
  getAttendance: async () => {
    try {
      const data = await localforage.getItem(KEYS.ATTENDANCE);
      return data || {};
    } catch { return {}; }
  },
  
  saveAttendance: async (records) => {
    await localforage.setItem(KEYS.ATTENDANCE, records);
  },

  getCustomFields: async () => {
    try {
      const data = await localforage.getItem(KEYS.CUSTOM_FIELDS);
      return data || [];
    } catch { return []; }
  },
  
  saveCustomFields: async (fields) => {
    await localforage.setItem(KEYS.CUSTOM_FIELDS, fields);
  },

  getTeacherName: async () => {
    try {
      const data = await localforage.getItem(KEYS.TEACHER_NAME);
      return data || '';
    } catch { return ''; }
  },
  
  saveTeacherName: async (name) => {
    await localforage.setItem(KEYS.TEACHER_NAME, name);
  },

  clearAllData: async () => {
    await localforage.clear();
  }
};
