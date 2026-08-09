import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Helper to get from firestore
const getCloudItem = async (key, defaultVal) => {
  try {
    const docRef = doc(db, 'hudoor_data', key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().value;
    }
    return defaultVal;
  } catch (error) {
    console.error(`Error getting ${key} from Firestore:`, error);
    return defaultVal;
  }
};

// Helper to set to firestore
const setCloudItem = async (key, value) => {
  try {
    const docRef = doc(db, 'hudoor_data', key);
    await setDoc(docRef, { value });
  } catch (error) {
    console.error(`Error setting ${key} in Firestore:`, error);
  }
};

export const storage = {
  getClasses: async () => getCloudItem('app_classes', []),
  saveClasses: async (classes) => setCloudItem('app_classes', classes),
  
  getStudents: async () => getCloudItem('app_students', []),
  saveStudents: async (students) => setCloudItem('app_students', students),
  
  getAttendance: async () => getCloudItem('app_attendance', {}),
  saveAttendance: async (records) => setCloudItem('app_attendance', records),

  getCustomFields: async () => getCloudItem('app_custom_fields', []),
  saveCustomFields: async (fields) => setCloudItem('app_custom_fields', fields),

  getTeacherName: async () => getCloudItem('app_teacher_name', ''),
  saveTeacherName: async (name) => setCloudItem('app_teacher_name', name),

  getStaff: async () => getCloudItem('app_staff', []),
  saveStaff: async (staff) => setCloudItem('app_staff', staff),

  getStaffAttendance: async () => getCloudItem('app_staff_attendance', {}),
  saveStaffAttendance: async (records) => setCloudItem('app_staff_attendance', records),

  getCurrentStaffId: async () => {
    // Current Staff ID is a local session token.
    return localStorage.getItem('app_current_staff_id');
  },
  
  saveCurrentStaffId: async (id) => {
    if (id === null) {
      localStorage.removeItem('app_current_staff_id');
    } else {
      localStorage.setItem('app_current_staff_id', id);
    }
  },

  clearAllData: async () => {
    await setCloudItem('app_classes', []);
    await setCloudItem('app_students', []);
    await setCloudItem('app_attendance', {});
    await setCloudItem('app_custom_fields', []);
    await setCloudItem('app_teacher_name', '');
    await setCloudItem('app_staff', []);
    await setCloudItem('app_staff_attendance', {});
    localStorage.removeItem('app_current_staff_id');
  }
};
