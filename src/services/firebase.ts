import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, getFirestore, persistentLocalCache, 
  persistentMultipleTabManager, collection, doc, getDocs, 
  getDoc, setDoc, deleteDoc, onSnapshot 
} from 'firebase/firestore';
import { CaseFile, ProjectItem, ServiceItem, Receipt, CloudflareR2Config } from '../types';
import { SERVICES_DATA, OFFICE_INFO } from '../data/mockData';
import { DEFAULT_R2_CONFIG } from './r2Storage';

export const firebaseConfig = {
  apiKey: "AIzaSyAvqQBN-F1Bdgncd064q-6p3vQUz8zP5mg",
  authDomain: "heba-consultant.firebaseapp.com",
  projectId: "heba-consultant",
  storageBucket: "heba-consultant.firebasestorage.app",
  messagingSenderId: "424730797717",
  appId: "1:424730797717:web:5f9a6ecf255370c26b1d9c"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with Offline-First Persistent IndexedDB Cache
export const db = (() => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch (e) {
    return getFirestore(app);
  }
})();

// Collection References
export const casesCollection = collection(db, 'cases');
export const projectsCollection = collection(db, 'projects');
export const servicesCollection = collection(db, 'services');
export const receiptsCollection = collection(db, 'receipts');
export const settingsDocRef = doc(db, 'settings', 'general');

// Default initial settings
export interface SystemSettings {
  officeName: string;
  directorName: string;
  primaryPhone: string;
  secondPhone: string;
  thirdPhone: string;
  whatsappNumber: string;
  address: string;
  workHours: string;
  adminUsername: string;
  adminPasswordHash: string;
  announcementText: string;
  showAnnouncement: boolean;
  r2Config?: CloudflareR2Config;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  officeName: "مكتب الهيبه للمحاسبة والأعمال الهندسية",
  directorName: "المحاسب / منصور هيبه",
  primaryPhone: "01207659999",
  secondPhone: "01113362545",
  thirdPhone: "01044744686",
  whatsappNumber: "201207659999",
  address: "الإسكندرية - العامرية - الناصرية القديمة - عمارة البنا الجديدة",
  workHours: "السبت إلى الخميس: 10:00 صباحاً – 10:00 مساءً",
  adminUsername: "admin",
  adminPasswordHash: "heba2026",
  announcementText: "",
  showAnnouncement: false,
  r2Config: DEFAULT_R2_CONFIG
};

// ==========================================
// Offline-First Helpers (LocalStorage Dual-Write)
// ==========================================
const getLocal = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(`offline_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = (key: string, data: any) => {
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify(data));
  } catch {
    // quota exceeded or private mode
  }
};

// ==========================================
// Cases API (Offline-First)
// ==========================================
export async function fetchCasesFromFirebase(): Promise<CaseFile[]> {
  const cached = getLocal<CaseFile[]>('cases', []);
  try {
    const snap = await getDocs(casesCollection);
    const list: CaseFile[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as CaseFile);
    });
    setLocal('cases', list);
    return list.length > 0 ? list : cached;
  } catch (error) {
    console.warn('Using offline cached cases:', error);
    return cached;
  }
}

export async function saveCaseToFirebase(caseItem: CaseFile): Promise<string> {
  const caseId = caseItem.id || `case-${Date.now()}`;
  const fullCase = { ...caseItem, id: caseId };
  
  // 1. Update local storage immediately for 0ms latency offline
  const current = getLocal<CaseFile[]>('cases', []);
  const existingIdx = current.findIndex(c => c.id === caseId);
  if (existingIdx >= 0) {
    current[existingIdx] = fullCase;
  } else {
    current.unshift(fullCase);
  }
  setLocal('cases', current);

  // 2. Commit to Firestore (IndexedDB cache handles queueing if offline)
  try {
    const caseRef = doc(db, 'cases', caseId);
    await setDoc(caseRef, fullCase);
  } catch (err) {
    console.warn('Queued case save offline:', err);
  }

  return caseId;
}

export async function deleteCaseFromFirebase(caseId: string): Promise<void> {
  const current = getLocal<CaseFile[]>('cases', []).filter(c => c.id !== caseId);
  setLocal('cases', current);

  try {
    const caseRef = doc(db, 'cases', caseId);
    await deleteDoc(caseRef);
  } catch (err) {
    console.warn('Queued case delete offline:', err);
  }
}

// ==========================================
// Projects API (Offline-First)
// ==========================================
export async function fetchProjectsFromFirebase(): Promise<ProjectItem[]> {
  const cached = getLocal<ProjectItem[]>('projects', []);
  try {
    const snap = await getDocs(projectsCollection);
    const list: ProjectItem[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as ProjectItem);
    });
    setLocal('projects', list);
    return list.length > 0 ? list : cached;
  } catch (error) {
    console.warn('Using offline cached projects:', error);
    return cached;
  }
}

export async function saveProjectToFirebase(project: ProjectItem): Promise<string> {
  const projId = project.id || `proj-${Date.now()}`;
  const fullProj = { ...project, id: projId };

  const current = getLocal<ProjectItem[]>('projects', []);
  const idx = current.findIndex(p => p.id === projId);
  if (idx >= 0) {
    current[idx] = fullProj;
  } else {
    current.push(fullProj);
  }
  setLocal('projects', current);

  try {
    const projRef = doc(db, 'projects', projId);
    await setDoc(projRef, fullProj);
  } catch (err) {
    console.warn('Queued project save offline:', err);
  }

  return projId;
}

export async function deleteProjectFromFirebase(projectId: string): Promise<void> {
  const current = getLocal<ProjectItem[]>('projects', []).filter(p => p.id !== projectId);
  setLocal('projects', current);

  try {
    const projRef = doc(db, 'projects', projectId);
    await deleteDoc(projRef);
  } catch (err) {
    console.warn('Queued project delete offline:', err);
  }
}

// ==========================================
// Services API (Offline-First)
// ==========================================
export async function fetchServicesFromFirebase(): Promise<ServiceItem[]> {
  const cached = getLocal<ServiceItem[]>('services', SERVICES_DATA);
  try {
    const snap = await getDocs(servicesCollection);
    if (snap.empty) {
      return cached;
    }
    const list: ServiceItem[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as ServiceItem);
    });
    list.sort((a, b) => (a.indexCode || '').localeCompare(b.indexCode || ''));
    setLocal('services', list);
    return list;
  } catch (error) {
    console.warn('Using offline cached services:', error);
    return cached;
  }
}

export async function saveServiceToFirebase(service: ServiceItem): Promise<string> {
  const servId = service.id || `serv_${Date.now()}`;
  const fullServ = { ...service, id: servId };

  const current = getLocal<ServiceItem[]>('services', SERVICES_DATA);
  const idx = current.findIndex(s => s.id === servId);
  if (idx >= 0) {
    current[idx] = fullServ;
  } else {
    current.push(fullServ);
  }
  setLocal('services', current);

  try {
    const servRef = doc(db, 'services', servId);
    await setDoc(servRef, fullServ);
  } catch (err) {
    console.warn('Queued service save offline:', err);
  }

  return servId;
}

export async function deleteServiceFromFirebase(serviceId: string): Promise<void> {
  const current = getLocal<ServiceItem[]>('services', SERVICES_DATA).filter(s => s.id !== serviceId);
  setLocal('services', current);

  try {
    const servRef = doc(db, 'services', serviceId);
    await deleteDoc(servRef);
  } catch (err) {
    console.warn('Queued service delete offline:', err);
  }
}

// ==========================================
// Receipts API (Offline-First)
// ==========================================
export async function fetchReceiptsFromFirebase(): Promise<Receipt[]> {
  const cached = getLocal<Receipt[]>('receipts', []);
  try {
    const snap = await getDocs(receiptsCollection);
    const list: Receipt[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Receipt);
    });
    setLocal('receipts', list);
    return list.length > 0 ? list : cached;
  } catch (error) {
    console.warn('Using offline cached receipts:', error);
    return cached;
  }
}

export async function saveReceiptToFirebase(receipt: Receipt): Promise<string> {
  const recId = receipt.id || `rec-${Date.now()}`;
  const fullRec = { ...receipt, id: recId };

  const current = getLocal<Receipt[]>('receipts', []);
  current.unshift(fullRec);
  setLocal('receipts', current);

  try {
    const recRef = doc(db, 'receipts', recId);
    await setDoc(recRef, fullRec);
  } catch (err) {
    console.warn('Queued receipt save offline:', err);
  }

  return recId;
}

// ==========================================
// Settings API (Offline-First)
// ==========================================
export async function fetchSettingsFromFirebase(): Promise<SystemSettings> {
  const cached = getLocal<SystemSettings>('settings', DEFAULT_SETTINGS);
  try {
    const snap = await getDoc(settingsDocRef);
    if (snap.exists()) {
      const merged = { ...DEFAULT_SETTINGS, ...snap.data() } as SystemSettings;
      setLocal('settings', merged);
      return merged;
    }
  } catch (error) {
    console.warn('Using offline cached settings:', error);
  }
  return cached;
}

export async function saveSettingsToFirebase(settings: SystemSettings): Promise<void> {
  setLocal('settings', settings);
  try {
    await setDoc(settingsDocRef, settings, { merge: true });
  } catch (err) {
    console.warn('Queued settings save offline:', err);
  }
}
