import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderKanban, DollarSign, Calendar, Plus, Search, Filter, 
  CheckCircle2, Clock, FileText, Eye, Printer, 
  Phone, X, Shield, Trash2, Edit3, RotateCcw, 
  Globe, Sparkles, Award, MapPin, Building2, MessageCircle, 
  AlertCircle, Settings as SettingsIcon, LogOut, Check, Save,
  Layers, RefreshCw, Smartphone, KeyRound, Bell, Megaphone,
  ChevronRight, ExternalLink, UploadCloud, FileUp, Paperclip,
  Download, Cloud, CheckSquare, BarChart3, TrendingUp, PieChart,
  Wallet, ArrowUpRight, Percent, Info
} from 'lucide-react';
import { 
  CaseFile, CaseStatus, Receipt, ServiceCategory, 
  ProjectItem, ServiceItem, CaseDocument, CloudflareR2Config 
} from '../../types';
import { SERVICES_DATA, OFFICE_INFO } from '../../data/mockData';
import { 
  SystemSettings, DEFAULT_SETTINGS, 
  saveCaseToFirebase, deleteCaseFromFirebase, 
  saveProjectToFirebase, deleteProjectFromFirebase, 
  saveServiceToFirebase, deleteServiceFromFirebase, 
  saveReceiptToFirebase, saveSettingsToFirebase 
} from '../../services/firebase';
import { uploadDocument, formatFileSize, DEFAULT_R2_CONFIG } from '../../services/r2Storage';
import { tafqeetEGP } from '../../utils/tafqeet';
import { ReceiptModal } from './ReceiptModal';
import { AdminLogin } from './AdminLogin';

interface AdminDashboardProps {
  cases: CaseFile[];
  setCases: React.Dispatch<React.SetStateAction<CaseFile[]>>;
  receipts: Receipt[];
  setReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
  projects: ProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  onBackToSite: () => void;
}

const STATUS_CONFIG: Record<CaseStatus, { label: string; color: string; bg: string }> = {
  docs_received: { label: 'استلام المستندات', color: 'text-stone-300', bg: 'bg-stone-800 border-stone-700' },
  surveying: { label: 'الرفع المساحي', color: 'text-blue-300', bg: 'bg-blue-900/60 border-blue-700' },
  drawings_prep: { label: 'إعداد المخططات', color: 'text-purple-300', bg: 'bg-purple-900/60 border-purple-700' },
  submitted_gov: { label: 'التقديم بالحي', color: 'text-amber-300', bg: 'bg-amber-900/60 border-amber-700' },
  committee_review: { label: 'لجان البت والفحص', color: 'text-orange-300', bg: 'bg-orange-900/60 border-orange-700' },
  approved_issued: { label: 'معتمد ومنتهي', color: 'text-emerald-300', bg: 'bg-emerald-900/60 border-emerald-700' }
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cases,
  setCases,
  receipts,
  setReceipts,
  projects,
  setProjects,
  services,
  setServices,
  settings,
  setSettings,
  onBackToSite
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('heba_admin_auth') === 'true' || 
           sessionStorage.getItem('heba_admin_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'cases' | 'projects' | 'services' | 'finance' | 'settings'>('cases');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'website' | 'manual'>('all');
  const [toastMsg, setToastMsg] = useState<string>('');

  // Modals state
  const [editingCase, setEditingCase] = useState<CaseFile | null>(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [managingDocsCase, setManagingDocsCase] = useState<CaseFile | null>(null);
  const [managingDocsProject, setManagingDocsProject] = useState<ProjectItem | null>(null);

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [activeReceiptModal, setActiveReceiptModal] = useState<Receipt | null>(null);
  const [showNewReceiptModal, setShowNewReceiptModal] = useState(false);

  // Forms State
  const [newCaseClientName, setNewCaseClientName] = useState('');
  const [newCaseClientPhone, setNewCaseClientPhone] = useState('');
  const [newCaseNationalId, setNewCaseNationalId] = useState('');
  const [newCaseCategory, setNewCaseCategory] = useState<ServiceCategory>('reconciliation');
  const [newCaseAddress, setNewCaseAddress] = useState('');
  const [newCaseDistrict, setNewCaseDistrict] = useState('حي العامرية أول');
  const [newCaseOfficeFees, setNewCaseOfficeFees] = useState<number | string>(15000);
  const [newCaseNotes, setNewCaseNotes] = useState('');
  const [newCaseSource, setNewCaseSource] = useState<'manual' | 'website'>('manual');

  // Document Upload State
  const [uploadDocTitle, setUploadDocTitle] = useState('');
  const [uploadDocNote, setUploadDocNote] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('مصالحات مباني');
  const [newProjLocation, setNewProjLocation] = useState('العامرية — الإسكندرية');
  const [newProjBadge, setNewProjBadge] = useState('نموذج 8 معتمد');
  const [newProjOutcome, setNewProjOutcome] = useState('');
  const [newProjYear, setNewProjYear] = useState('2026');

  const [newServTitle, setNewServTitle] = useState('');
  const [newServBadge, setNewServBadge] = useState('معتمد رسمياً');
  const [newServLegalCode, setNewServLegalCode] = useState('قانون البناء والتصالح');
  const [newServDuration, setNewServDuration] = useState('15 - 30 يوم عمل');
  const [newServCategory, setNewServCategory] = useState<ServiceCategory>('reconciliation');
  const [newServShortDesc, setNewServShortDesc] = useState('');
  const [newServFullDesc, setNewServFullDesc] = useState('');
  const [newServDocsText, setNewServDocsText] = useState('صورة بطاقة الرقم القومي\nصورة سند الملكية أو العقد المشهر');
  const [newServDeliverablesText, setNewServDeliverablesText] = useState('إعداد الملف الهندسي والمحاسبي\nالمتابعة أمام الحي المختص');

  // Receipt form state
  const [receiptClientName, setReceiptClientName] = useState('');
  const [receiptCaseCode, setReceiptCaseCode] = useState('');
  const [receiptCaseId, setReceiptCaseId] = useState('');
  const [receiptAmount, setReceiptAmount] = useState<number>(5000);
  const [receiptWords, setReceiptWords] = useState('خمسة آلاف جنيه مصري فقط لا غير');
  const [receiptPaymentMethod, setReceiptPaymentMethod] = useState<'كاش' | 'تحويل بنكي' | 'إنستاباي / فودافون كاش'>('كاش');
  const [receiptCategory, setReceiptCategory] = useState('دفعة أتعاب');
  const [receiptNotes, setReceiptNotes] = useState('');

  // Settings local edit form
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Online/Offline tracking (Offline-First)
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('تم الاتصال بالإنترنت! تتم المزامنة السحابية تلقائياً.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('وضع أوفلاين نشط. يتم الحفظ محلياً على جهازك.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('heba_admin_auth');
    sessionStorage.removeItem('heba_admin_auth');
    setIsAuthenticated(false);
  };

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <AdminLogin
        settings={settings}
        onLoginSuccess={() => setIsAuthenticated(true)}
        onBackToSite={onBackToSite}
      />
    );
  }

  // Filtered Cases (supports search, status, and source: website vs manual)
  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientPhone.includes(searchQuery) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || 
      (sourceFilter === 'website' ? c.source === 'website' : c.source !== 'website');

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Source counts
  const websiteCasesCount = cases.filter(c => c.source === 'website').length;
  const manualCasesCount = cases.filter(c => c.source !== 'website').length;

  // Select a case for payment receipt and auto-populate all data & tafqeet
  const handleSelectCaseForReceipt = (caseId: string) => {
    const selected = cases.find(c => c.id === caseId);
    if (!selected) {
      setReceiptCaseId('');
      setReceiptCaseCode('');
      setReceiptClientName('');
      setReceiptCategory('دفعة أتعاب');
      return;
    }
    setReceiptCaseId(selected.id);
    setReceiptCaseCode(selected.code);
    setReceiptClientName(selected.clientName);
    setReceiptCategory(`دفعة أتعاب - ${selected.serviceTitle}`);

    const remaining = (selected.officeFees && selected.officeFees > 0)
      ? Math.max(0, selected.officeFees - (selected.paidAmount || 0))
      : 0;

    const defaultAmount = remaining > 0 ? remaining : 1000;
    setReceiptAmount(defaultAmount);
    setReceiptWords(tafqeetEGP(defaultAmount));
  };

  // Open "سداد دفعة" modal pre-linked to a specific case
  const handleOpenReceiptForCase = (c: CaseFile) => {
    handleSelectCaseForReceipt(c.id);
    setShowNewReceiptModal(true);
  };

  // Open blank receipt modal
  const handleOpenNewReceiptBlank = () => {
    setReceiptCaseId('');
    setReceiptCaseCode('');
    setReceiptClientName('');
    setReceiptCategory('دفعة أتعاب');
    setReceiptAmount(1000);
    setReceiptWords(tafqeetEGP(1000));
    setShowNewReceiptModal(true);
  };

  // Handle receipt amount input with live Tafqeet
  const handleReceiptAmountChange = (val: number) => {
    const num = Math.max(0, val);
    setReceiptAmount(num);
    setReceiptWords(tafqeetEGP(num));
  };

  // Actions
  const handleUpdateStatus = async (caseId: string, newStatus: CaseStatus) => {
    const updated = cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    });
    setCases(updated);
    const target = updated.find(c => c.id === caseId);
    if (target) {
      await saveCaseToFirebase(target);
      showToast(`تم تحديث حالة المعاملة (${target.code}) في فايربيز.`);
    }
  };

  const handleDeleteCase = async (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف معاملة العميل: "${name}" من فايربيز؟`)) {
      setCases(prev => prev.filter(c => c.id !== id));
      await deleteCaseFromFirebase(id);
      showToast('تم حذف المعاملة من فايربيز بنجاح.');
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseClientName.trim() || !newCaseClientPhone.trim()) {
      alert('يرجى كتابة اسم العميل ورقم هاتفه');
      return;
    }
    const randomCode = `HB-2026-${Math.floor(100 + Math.random() * 900)}`;
    const matchedService = services.find(s => s.category === newCaseCategory) || services[0] || SERVICES_DATA[0];

    const feesVal = newCaseSource === 'website' ? 0 : (Number(newCaseOfficeFees) || 0);

    const created: CaseFile = {
      id: `case-${Date.now()}`,
      code: randomCode,
      source: newCaseSource,
      clientName: newCaseClientName.trim(),
      clientPhone: newCaseClientPhone.trim(),
      nationalId: newCaseNationalId.trim() || undefined,
      category: newCaseCategory,
      serviceTitle: matchedService.title,
      propertyAddress: newCaseAddress.trim() || 'العامرية - الإسكندرية',
      district: newCaseDistrict,
      status: 'docs_received',
      statusNotes: newCaseNotes.trim() || (newCaseSource === 'website' ? 'طلب وارد من الموقع الإلكتروني.' : 'تم فتح الملف بمكتب الهيبه.'),
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      officeFees: feesVal,
      paidAmount: 0,
      govFees: 0,
      isFullyPaid: false,
      documents: []
    };

    setCases([created, ...cases]);
    await saveCaseToFirebase(created);
    setShowNewCaseModal(false);
    setNewCaseClientName('');
    setNewCaseClientPhone('');
    setNewCaseNationalId('');
    setNewCaseAddress('');
    setNewCaseNotes('');
    showToast(`تم حفظ المعاملة بكود ${randomCode} في فايربيز.`);
  };

  const handleSaveEditedCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;
    const updated = {
      ...editingCase,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    await saveCaseToFirebase(updated);
    setEditingCase(null);
    showToast('تم حفظ تعديلات المعاملة في فايربيز.');
  };

  // Upload document for a case
  const handleUploadCaseDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingDocsCase || !selectedFile) {
      alert('يرجى اختيار ملف لرفعه');
      return;
    }
    setUploadingDoc(true);
    try {
      const newDoc = await uploadDocument(selectedFile, {
        title: uploadDocTitle || selectedFile.name,
        notes: uploadDocNote,
        caseCode: managingDocsCase.code,
        r2Config: settings.r2Config
      });

      const updatedCase: CaseFile = {
        ...managingDocsCase,
        documents: [...(managingDocsCase.documents || []), newDoc],
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
      await saveCaseToFirebase(updatedCase);
      setManagingDocsCase(updatedCase);
      setSelectedFile(null);
      setUploadDocTitle('');
      setUploadDocNote('');
      showToast('تم رفع وحفظ المستند بنجاح!');
    } catch (err) {
      alert('حدث خطأ أثناء رفع المستند');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteCaseDocument = async (docId: string) => {
    if (!managingDocsCase) return;
    if (window.confirm('هل أنت متأكد من حذف هذا المستند؟')) {
      const updatedCase: CaseFile = {
        ...managingDocsCase,
        documents: (managingDocsCase.documents || []).filter(d => d.id !== docId),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
      await saveCaseToFirebase(updatedCase);
      setManagingDocsCase(updatedCase);
      showToast('تم حذف المستند بنجاح.');
    }
  };

  // Projects CRUD
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) {
      alert('يرجى كتابة عنوان المشروع');
      return;
    }
    const created: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProjTitle.trim(),
      category: newProjCategory.trim(),
      location: newProjLocation.trim(),
      badge: newProjBadge.trim(),
      outcome: newProjOutcome.trim() || 'تم إنهاء كافة الإجراءات واعتماد الملف رسمياً من الإدارة المختصة.',
      year: newProjYear.trim(),
      documents: []
    };
    setProjects([created, ...projects]);
    await saveProjectToFirebase(created);
    setShowNewProjectModal(false);
    setNewProjTitle('');
    setNewProjOutcome('');
    showToast('تم حفظ ونشر المشروع في فايربيز.');
  };

  const handleSaveEditedProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setProjects(prev => prev.map(p => p.id === editingProject.id ? editingProject : p));
    await saveProjectToFirebase(editingProject);
    setEditingProject(null);
    showToast('تم حفظ تعديلات المشروع في فايربيز.');
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المشروع: "${title}"؟`)) {
      setProjects(prev => prev.filter(p => p.id !== id));
      await deleteProjectFromFirebase(id);
      showToast('تم حذف المشروع من فايربيز.');
    }
  };

  // Services CRUD
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServTitle.trim()) {
      alert('يرجى كتابة اسم الخدمة');
      return;
    }
    const created: ServiceItem = {
      id: `service_${Date.now()}`,
      indexCode: `0${services.length + 1}`,
      title: newServTitle.trim(),
      category: newServCategory,
      badge: newServBadge.trim() || 'معتمد رسمياً',
      legalCode: newServLegalCode.trim() || 'قوانين البناء والتصالح',
      durationEstimate: newServDuration.trim(),
      shortDesc: newServShortDesc.trim() || 'خدمة هندسية ومحاسبية متكاملة لدى مكتب الهيبه.',
      fullDesc: newServFullDesc.trim() || 'نتولى إنهاء كافة المتطلبات الهندسية والمستندية والتمثيل الرسمي أمام اللجان المختصة.',
      iconName: 'FileCheck',
      requiredDocs: newServDocsText.split('\n').map(s => s.trim()).filter(Boolean),
      deliverables: newServDeliverablesText.split('\n').map(s => s.trim()).filter(Boolean)
    };
    setServices([...services, created]);
    await saveServiceToFirebase(created);
    setShowNewServiceModal(false);
    setNewServTitle('');
    showToast('تمت إضافة الخدمة وحفظها في فايربيز.');
  };

  const handleSaveEditedService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
    await saveServiceToFirebase(editingService);
    setEditingService(null);
    showToast('تم حفظ تعديلات الخدمة في فايربيز.');
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف خدمة: "${title}"؟`)) {
      setServices(prev => prev.filter(s => s.id !== id));
      await deleteServiceFromFirebase(id);
      showToast('تم حذف الخدمة من فايربيز.');
    }
  };

  // Receipts / Invoices
  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptCaseId) {
      alert('يرجى اختيار المعاملة أو طلب العميل المرتبط أولاً');
      return;
    }
    if (!receiptAmount || receiptAmount <= 0) {
      alert('يرجى إدخال مبلغ صحيح للدفعة');
      return;
    }

    const recNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const matchedCase = cases.find(c => c.id === receiptCaseId) || cases.find(c => c.code === receiptCaseCode);

    const finalWords = receiptWords.trim() ? receiptWords : tafqeetEGP(Number(receiptAmount) || 0);

    const newRec: Receipt = {
      id: `rec-${Date.now()}`,
      receiptNumber: recNumber,
      caseId: matchedCase?.id || receiptCaseId,
      caseCode: matchedCase?.code || receiptCaseCode,
      clientName: matchedCase?.clientName || receiptClientName,
      clientPhone: matchedCase?.clientPhone || '',
      amount: Number(receiptAmount) || 0,
      amountInWords: finalWords,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: receiptPaymentMethod,
      category: receiptCategory || `دفعة أتعاب - ${matchedCase?.serviceTitle || ''}`,
      receivedBy: settings.directorName || OFFICE_INFO.director,
      notes: receiptNotes
    };

    if (matchedCase) {
      const newPaid = (matchedCase.paidAmount || 0) + Number(receiptAmount);
      const isPaidFull = Boolean(matchedCase.officeFees && matchedCase.officeFees > 0 && newPaid >= matchedCase.officeFees);
      const updatedC: CaseFile = {
        ...matchedCase,
        paidAmount: newPaid,
        isFullyPaid: isPaidFull,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      const updatedCases = cases.map(c => c.id === updatedC.id ? updatedC : c);
      setCases(updatedCases);
      await saveCaseToFirebase(updatedC);
    }

    setReceipts([newRec, ...receipts]);
    await saveReceiptToFirebase(newRec);
    setShowNewReceiptModal(false);
    setActiveReceiptModal(newRec);
    setReceiptClientName('');
    setReceiptCaseCode('');
    setReceiptCaseId('');
    setReceiptNotes('');
    showToast(`تم تسجيل دفعة بقيمة ${Number(receiptAmount).toLocaleString()} ج.م وخصمها من الملف.`);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(localSettings);
    await saveSettingsToFirebase(localSettings);
    showToast('تم حفظ جميع الإعدادات وسحابة R2 بنجاح!');
  };

  const handleClearFakeData = async () => {
    if (window.confirm('هل تريد مسح المعاملات وسندات القبض وتفريغ السجلات للبدء على نظافة تامة؟')) {
      for (const c of cases) {
        await deleteCaseFromFirebase(c.id);
      }
      setCases([]);
      setReceipts([]);
      showToast('تم تنظيف كافة البيانات بنجاح.');
    }
  };

  // ==========================================
  // Real Financial Analytics Calculations (100% Dynamic)
  // ==========================================
  const analytics = useMemo(() => {
    const totalCollected = receipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    const totalOfficeFeesExpected = cases.reduce((sum, c) => sum + (Number(c.officeFees) || 0), 0);
    const totalOutstanding = Math.max(0, totalOfficeFeesExpected - totalCollected);
    const collectionRate = totalOfficeFeesExpected > 0 
      ? Math.min(100, Math.round((totalCollected / totalOfficeFeesExpected) * 100))
      : (totalCollected > 0 ? 100 : 0);

    const fullyPaidCount = cases.filter(c => c.isFullyPaid || (c.officeFees && c.officeFees > 0 && (c.paidAmount || 0) >= c.officeFees)).length;
    const partialPaidCount = cases.filter(c => (c.paidAmount || 0) > 0 && (!c.officeFees || (c.paidAmount || 0) < c.officeFees)).length;
    const unspecifiedCount = cases.filter(c => !c.officeFees || c.officeFees === 0).length;
    const unpaidCount = cases.filter(c => (c.paidAmount || 0) === 0 && (c.officeFees || 0) > 0).length;

    // Real dynamic monthly revenue from real receipts
    const arabicMonthNames = [
      'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const today = new Date();
    const dynamicMonthlyData: { monthKey: string; label: string; year: number; total: number; count: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const monthPrefix = `${yr}-${String(mIdx + 1).padStart(2, '0')}`;
      const label = arabicMonthNames[mIdx];

      const matchingReceipts = receipts.filter(r => r.date && r.date.startsWith(monthPrefix));
      const monthTotal = matchingReceipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

      dynamicMonthlyData.push({
        monthKey: monthPrefix,
        label,
        year: yr,
        total: monthTotal,
        count: matchingReceipts.length
      });
    }

    const maxMonthVal = Math.max(...dynamicMonthlyData.map(m => m.total), 1000);

    // Receipts breakdown by payment method
    const cashTotal = receipts.filter(r => r.paymentMethod === 'كاش').reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const instapayTotal = receipts.filter(r => r.paymentMethod?.includes('إنستاباي') || r.paymentMethod?.includes('فودافون')).reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const bankTotal = receipts.filter(r => r.paymentMethod === 'تحويل بنكي').reduce((s, r) => s + (Number(r.amount) || 0), 0);

    return {
      totalCollected,
      totalOfficeFeesExpected,
      totalOutstanding,
      collectionRate,
      fullyPaidCount,
      partialPaidCount,
      unspecifiedCount,
      unpaidCount,
      dynamicMonthlyData,
      maxMonthVal,
      cashTotal,
      instapayTotal,
      bankTotal
    };
  }, [cases, receipts]);

  return (
    <div className="min-h-screen bg-[#090A0E] text-stone-100 flex flex-col md:flex-row font-sans selection:bg-[#EAA044] selection:text-black">
      
      {/* إشعار عائم (Toast) */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* ترويسة الموبايل الذكية (Mobile Header) */}
      {/* ======================================================== */}
      <div className="md:hidden bg-[#10121A] border-b border-white/10 px-4 py-3 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EAA044]/15 border border-[#EAA044]/30 flex items-center justify-center">
            <img src="/emblem.png" alt="لوجو" className="h-4 w-auto object-contain" />
          </div>
          <span className="font-bold text-xs text-white">لوحة الإدارة</span>
        </div>

        {/* مؤشر أوفلاين/أونلاين على الموبايل */}
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
            isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isOnline ? 'أونلاين' : 'أوفلاين'}</span>
          </span>

          <button
            onClick={onBackToSite}
            className="px-2 py-1 rounded-lg bg-white/5 text-stone-300 text-[11px] font-bold border border-white/5"
          >
            الموقع
          </button>

          <button
            onClick={handleLogout}
            className="p-1 rounded-lg text-red-400 hover:bg-red-500/10"
            title="خروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* الشريط الجانبي للشاشات الكبيرة (Desktop Sidebar) */}
      {/* ======================================================== */}
      <aside className="hidden md:flex md:w-64 bg-[#10121A] border-l border-white/10 flex-shrink-0 flex-col justify-between p-4 z-20">
        <div className="space-y-6">
          
          {/* الشعار واسم المكتب ومؤشر الاتصال */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EAA044]/15 border border-[#EAA044]/30 flex items-center justify-center">
                <img src="/emblem.png" alt="لوجو" className="h-6 w-auto object-contain" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">مكتب <span className="text-[#EAA044]">الهيبه</span></div>
                <div className="text-[10px] text-stone-400 font-sans">بوابة التحكم الإدارية</div>
              </div>
            </div>

            <span 
              className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'}`} 
              title={isOnline ? 'متصل سحابياً (Realtime)' : 'أوفلاين - حفظ محلي فوري'} 
            />
          </div>

          {/* روابط التبويبات */}
          <nav className="space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('cases')}
              className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between gap-2 ${
                activeTab === 'cases'
                  ? 'bg-[#EAA044] text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                <span>الطلبات والمعاملات</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                activeTab === 'cases' ? 'bg-black/20 text-stone-950' : 'bg-white/5 text-stone-400'
              }`}>
                {cases.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between gap-2 ${
                activeTab === 'projects'
                  ? 'bg-[#EAA044] text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>المشاريع المنفذة</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                activeTab === 'projects' ? 'bg-black/20 text-stone-950' : 'bg-white/5 text-stone-400'
              }`}>
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between gap-2 ${
                activeTab === 'services'
                  ? 'bg-[#EAA044] text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>دليل الخدمات</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                activeTab === 'services' ? 'bg-black/20 text-stone-950' : 'bg-white/5 text-stone-400'
              }`}>
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between gap-2 ${
                activeTab === 'finance'
                  ? 'bg-[#EAA044] text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>الحسابات والتحليلات</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                activeTab === 'finance' ? 'bg-black/20 text-stone-950' : 'bg-white/5 text-stone-400'
              }`}>
                {receipts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between gap-2 ${
                activeTab === 'settings'
                  ? 'bg-[#EAA044] text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                <span>إعدادات النظام و R2</span>
              </div>
            </button>
          </nav>
        </div>

        {/* أسفل الشريط الجانبي: زر الموقع وتسجيل الخروج */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/5"
          >
            <Globe className="w-3.5 h-3.5 text-[#EAA044]" />
            <span>عرض الموقع كزائر</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* المساحة الرئيسية للمحتوى (Main Content Area) */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        
        {/* الشريط العلوي (Topbar) */}
        <header className="h-16 px-6 border-b border-white/10 bg-[#0E1017]/80 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-base text-white">
              {activeTab === 'cases' && 'إدارة طلبات ومعاملات المواطنين'}
              {activeTab === 'projects' && 'إدارة المشاريع المنشورة على الرئيسية'}
              {activeTab === 'services' && 'إدارة دليل الخدمات والتراخيص'}
              {activeTab === 'finance' && 'لوحة الإدارة المالية والتحليلات'}
              {activeTab === 'settings' && 'إعدادات المكتب والموقع وسحابة R2'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === 'cases' && (
              <button
                onClick={() => {
                  setNewCaseSource('manual');
                  setShowNewCaseModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>معاملة جديدة</span>
              </button>
            )}

            {activeTab === 'projects' && (
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>مشروع جديد</span>
              </button>
            )}

            {activeTab === 'services' && (
              <button
                onClick={() => setShowNewServiceModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>خدمة جديدة</span>
              </button>
            )}

            {activeTab === 'finance' && (
              <button
                onClick={handleOpenNewReceiptBlank}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>سداد دفعة جديدة</span>
              </button>
            )}

            {/* مؤشر حالة الاتصال السحابي والأوفلاين */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isOnline 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isOnline ? 'سحابي أونلاين' : 'أوفلاين محلي'}</span>
            </span>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-r border-white/10 pr-3">
              <span className="text-xs font-bold text-stone-300">
                {settings.directorName || OFFICE_INFO.director}
              </span>
            </div>
          </div>
        </header>

        {/* جسم الصفحة */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 pb-24 md:pb-6">

          {/* ======================================================== */}
          {/* تبويب المعاملات مع تمييز طلبات الموقع وفصلها */}
          {/* ======================================================== */}
          {activeTab === 'cases' && (
            <div className="space-y-4">
              
              {/* شريط الفلاتر والبحث وفصل أنواع الطلبات */}
              <div className="p-3.5 rounded-2xl bg-[#12141D] border border-white/10 space-y-3">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ابحث بالاسم، التليفون، كود HB، أو الحي..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-9 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#EAA044]"
                    />
                  </div>

                  {/* تصفية بحسب مصدر الطلب (موقع أونلاين vs مكتب يدوي) */}
                  <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-bold w-full md:w-auto">
                    <button
                      onClick={() => setSourceFilter('all')}
                      className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition-all ${
                        sourceFilter === 'all' ? 'bg-[#EAA044] text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      الكل ({cases.length})
                    </button>
                    <button
                      onClick={() => setSourceFilter('website')}
                      className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        sourceFilter === 'website' ? 'bg-cyan-500 text-stone-950 shadow-sm' : 'text-cyan-400 hover:text-cyan-300'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>طلبات الموقع أونلاين ({websiteCasesCount})</span>
                    </button>
                    <button
                      onClick={() => setSourceFilter('manual')}
                      className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        sourceFilter === 'manual' ? 'bg-stone-200 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>معاملات المكتب ({manualCasesCount})</span>
                    </button>
                  </div>
                </div>

                {/* فلترة المراحل التنفيذية */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 text-xs font-bold border-t border-white/5">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      statusFilter === 'all' ? 'bg-white text-black' : 'bg-black/30 text-stone-400 hover:text-white'
                    }`}
                  >
                    كل الحالات
                  </button>
                  {(Object.keys(STATUS_CONFIG) as CaseStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg border whitespace-nowrap ${
                        statusFilter === st ? `${STATUS_CONFIG[st].bg} ${STATUS_CONFIG[st].color}` : 'border-white/5 bg-black/20 text-stone-400'
                      }`}
                    >
                      {STATUS_CONFIG[st].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* بطاقات المعاملات مع تمييز المصدر وتحديد الأتعاب */}
              {filteredCases.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#12141D] border border-dashed border-white/15 space-y-3">
                  <FolderKanban className="w-10 h-10 text-stone-600 mx-auto" />
                  <div className="text-sm font-bold text-stone-300">لا توجد أي معاملات مطابقة</div>
                  <p className="text-xs text-stone-500">جرب تغيير الفلتر أو اضغط على «معاملة جديدة» لإضافة ملف</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCases.map(c => {
                    const st = STATUS_CONFIG[c.status];
                    const isWebsite = c.source === 'website';
                    const hasUnspecifiedFees = !c.officeFees || c.officeFees === 0;
                    const remaining = hasUnspecifiedFees ? 0 : ((c.officeFees || 0) - (c.paidAmount || 0));

                    return (
                      <div
                        key={c.id}
                        className={`p-4 rounded-2xl bg-[#12141D] border transition-all space-y-3 flex flex-col justify-between shadow-lg ${
                          isWebsite 
                            ? 'border-cyan-500/30 hover:border-cyan-500/60 shadow-cyan-950/20' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="space-y-2.5">
                          
                          {/* ترويسة الكارت: كود المعاملة + شارة المصدر + حالة المعاملة */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-[#EAA044] bg-[#EAA044]/10 px-2 py-0.5 rounded border border-[#EAA044]/30">
                                {c.code}
                              </span>

                              {/* تمييز طلب الموقع عن اليدوي بوضوح */}
                              {isWebsite ? (
                                <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  <span>طلب أونلاين</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-stone-800 border border-stone-700 text-stone-400 text-[10px] font-bold flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  <span>يدوي مكتب</span>
                                </span>
                              )}
                            </div>

                            <select
                              value={c.status}
                              onChange={(e) => handleUpdateStatus(c.id, e.target.value as CaseStatus)}
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border focus:outline-none cursor-pointer ${st.bg} ${st.color}`}
                            >
                              {(Object.keys(STATUS_CONFIG) as CaseStatus[]).map(k => (
                                <option key={k} value={k} className="bg-stone-900 text-stone-100">
                                  {STATUS_CONFIG[k].label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <h3 className="font-bold text-base text-white">{c.clientName}</h3>
                            <div className="text-xs text-[#EAA044] mt-0.5">{c.serviceTitle}</div>
                          </div>

                          <div className="text-xs text-stone-400 space-y-1 bg-black/30 p-2 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{c.district} — {c.propertyAddress}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-white/5">
                              <a href={`tel:${c.clientPhone}`} className="font-mono text-stone-200" dir="ltr">
                                {c.clientPhone}
                              </a>
                              <a
                                href={`https://wa.me/2${c.clientPhone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:underline text-[11px] flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>مراسلة</span>
                              </a>
                            </div>
                          </div>

                          {/* الموقف المالي: إذا كان من الموقع ولم تُحدد أتعابه تُكتب "غير محدد" */}
                          <div className="flex items-center justify-between text-xs font-mono bg-white/5 p-2 rounded-xl">
                            <div>
                              <span className="text-stone-400 text-[10px] block">الأتعاب:</span>
                              {hasUnspecifiedFees ? (
                                <span className="text-amber-300 font-bold text-[11px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                  غير محدد
                                </span>
                              ) : (
                                <span className="font-bold text-stone-200">{c.officeFees?.toLocaleString()} ج.م</span>
                              )}
                            </div>
                            <div>
                              <span className="text-stone-400 text-[10px] block">المسدد:</span>
                              <span className="font-bold text-emerald-400">{(c.paidAmount || 0).toLocaleString()} ج.م</span>
                            </div>
                            <div>
                              <span className="text-stone-400 text-[10px] block">المتبقي:</span>
                              {hasUnspecifiedFees ? (
                                <span className="text-stone-500 text-[11px] font-sans">بانتظار المعاينة</span>
                              ) : (
                                <span className={`font-bold ${remaining > 0 ? 'text-amber-400' : 'text-stone-500'}`}>
                                  {remaining.toLocaleString()} ج.م
                                </span>
                              )}
                            </div>
                          </div>

                          {/* إشارة المستندات المرفوعة */}
                          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                            <span className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3 text-[#EAA044]" />
                              <span>{c.documents?.length || 0} مستندات مرفوعة</span>
                            </span>
                            <span className="text-stone-500">{c.createdAt}</span>
                          </div>
                        </div>

                        {/* أزرار الإجراءات على الملف مع زر "سداد دفعة" الواضح جداً */}
                        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                          
                          {/* زر سداد دفعة بارز وكبير */}
                          <button
                            onClick={() => handleOpenReceiptForCase(c)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                            title="إصدار سند دفع رسمي للعميل"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>سداد دفعة</span>
                          </button>

                          <div className="flex items-center gap-1">
                            {/* زر إدارة المستندات ورفعها */}
                            <button
                              onClick={() => setManagingDocsCase(c)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold flex items-center gap-1"
                              title="رفع وإدارة المستندات لـ Cloudflare R2"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-[#EAA044]" />
                            </button>

                            <button
                              onClick={() => setEditingCase(c)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold"
                              title="تعديل التفاصيل والأتعاب"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-stone-300" />
                            </button>

                            <button
                              onClick={() => handleDeleteCase(c.id, c.clientName)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* تبويب الحسابات والتحليلات المالية والرسومات البيانية */}
          {/* ======================================================== */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              
              {/* كروت المؤشرات المالية الكبرى */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#12141D] border border-white/10 space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>إجمالي الإيرادات المحصلة</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
                    {analytics.totalCollected.toLocaleString()} <span className="text-xs font-sans">ج.م</span>
                  </div>
                  <div className="text-[10px] text-stone-500">{receipts.length} سندات دفع رسمية</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#12141D] border border-white/10 space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>مستحقات مؤكدة متبقية</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400">
                    {analytics.totalOutstanding.toLocaleString()} <span className="text-xs font-sans">ج.م</span>
                  </div>
                  <div className="text-[10px] text-stone-500">دفعات استلام نهائية</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#12141D] border border-white/10 space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>نسبة التحصيل الإجمالية</span>
                    <Percent className="w-4 h-4 text-[#EAA044]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#EAA044]">
                    %{analytics.collectionRate}
                  </div>
                  <div className="text-[10px] text-stone-500">من إجمالي الأتعاب المحددة</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#12141D] border border-white/10 space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>معاملات مسددة بالكامل</span>
                    <CheckSquare className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-blue-400">
                    {analytics.fullyPaidCount} <span className="text-xs font-sans">معاملة</span>
                  </div>
                  <div className="text-[10px] text-stone-500">خالصة السداد والأتعاب</div>
                </div>
              </div>

              {/* الرسومات البيانية والتحليلات البصرية (Interactive Charts) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* رسم بياني 1: الإيرادات الشهرية (SVG Bar Chart) */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-[#12141D] border border-white/10 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <BarChart3 className="w-4 h-4 text-[#EAA044]" />
                      <span>رسم بياني للإيرادات والتحصيلات الفعلية</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {receipts.length} سند مسجل
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">إحصاءات حية</span>
                    </div>
                  </div>

                  {/* أعمدة الرسم البياني التفاعلي المحسوبة لحظياً من واقع السندات */}
                  <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
                    {analytics.dynamicMonthlyData.map((m) => {
                      const heightPercent = m.total > 0
                        ? Math.max(12, Math.min(100, (m.total / analytics.maxMonthVal) * 100))
                        : 4;

                      return (
                        <div key={m.monthKey} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                          <span className="text-[10px] font-mono font-bold text-stone-400 group-hover:text-[#EAA044] transition-colors">
                            {m.total > 0 ? (m.total >= 1000 ? `${(m.total / 1000).toFixed(1)}k` : `${m.total}`) : '0'}
                          </span>

                          <div 
                            className="w-full max-w-[42px] bg-black/40 rounded-t-xl overflow-hidden h-full flex items-end p-0.5 border border-white/5 group-hover:border-[#EAA044]/50 transition-all cursor-pointer"
                            title={`${m.label}: ${m.total.toLocaleString()} ج.م (${m.count} سندات)`}
                          >
                            <div 
                              className={`w-full rounded-t-lg transition-all duration-300 shadow-lg ${
                                m.total > 0 
                                  ? 'bg-gradient-to-t from-[#B8741D] to-[#EAA044] group-hover:from-[#EAA044] group-hover:to-[#F7B85F]' 
                                  : 'bg-stone-800/40'
                              }`}
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>

                          <div className="text-center">
                            <span className="text-xs font-bold text-stone-300 block">{m.label}</span>
                            <span className="text-[9px] text-stone-500 font-mono">{m.total > 0 ? `${m.total.toLocaleString()} ج` : '0 ج'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {analytics.totalCollected === 0 && (
                    <div className="text-center py-2 text-[11px] text-amber-400/80 bg-amber-400/10 rounded-xl border border-amber-400/20">
                      ⚡ لا توجد دفعات محصلة حتى الآن — الرسم البياني مربوط بالكامل بقاعدة البيانات ويُحدث تلقائياً بمجرد تسجيل أي دفعة.
                    </div>
                  )}
                </div>

                {/* رسم بياني 2: تحليل حالة السداد والمعاملات */}
                <div className="p-5 rounded-2xl bg-[#12141D] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <PieChart className="w-4 h-4 text-emerald-400" />
                      <span>توزيع حالات التحصيل</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-emerald-400">خالص السداد بالكامل</span>
                        <span>{analytics.fullyPaidCount} ملف</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(analytics.fullyPaidCount / (cases.length || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-blue-400">مسدد دفعات جزئية</span>
                        <span>{analytics.partialPaidCount} ملف</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(analytics.partialPaidCount / (cases.length || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-amber-400">طلبات موقع (غير محدد)</span>
                        <span>{analytics.unspecifiedCount} ملف</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${(analytics.unspecifiedCount / (cases.length || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-stone-400">بانتظار سداد الدفعة الأولى</span>
                        <span>{analytics.unpaidCount} ملف</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                        <div 
                          className="h-full bg-stone-600 rounded-full"
                          style={{ width: `${(analytics.unpaidCount / (cases.length || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ملخص طرق الدفع */}
                  <div className="pt-3 border-t border-white/10 text-[11px] text-stone-400 flex items-center justify-between">
                    <span>كاش: <strong className="text-stone-200">{analytics.cashTotal.toLocaleString()}</strong></span>
                    <span>إنستاباي: <strong className="text-stone-200">{analytics.instapayTotal.toLocaleString()}</strong></span>
                    <span>بنكي: <strong className="text-stone-200">{analytics.bankTotal.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>

              {/* سجل الفواتير وسندات القبض المربوطة بالعملاء */}
              <div className="p-4 rounded-2xl bg-[#12141D] border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-white">سجل الفواتير وسندات الدفع الرسمية</h3>
                    <p className="text-[11px] text-stone-400">كل سند مربوط مباشرة بملف العميل وكود المعاملة</p>
                  </div>

                  <button
                    onClick={handleOpenNewReceiptBlank}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>سداد دفعة جديدة</span>
                  </button>
                </div>

                {receipts.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 text-xs">لا توجد سندات أو فواتير مسجلة بعد.</div>
                ) : (
                  <div className="space-y-2">
                    {receipts.map(rec => (
                      <div
                        key={rec.id}
                        className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#EAA044] bg-[#EAA044]/10 px-2 py-0.5 rounded border border-[#EAA044]/30">
                              {rec.receiptNumber}
                            </span>
                            {rec.caseCode && (
                              <span className="font-mono text-xs text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                                {rec.caseCode}
                              </span>
                            )}
                            <span className="text-xs text-stone-400 font-mono">{rec.date}</span>
                          </div>

                          <div className="font-bold text-sm text-white">{rec.clientName}</div>
                          <div className="text-[11px] text-stone-400">
                            {rec.category} — طريقة السداد: <strong className="text-stone-200">{rec.paymentMethod}</strong>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="text-left sm:text-right">
                            <div className="font-mono text-base sm:text-lg font-bold text-emerald-400">
                              {rec.amount?.toLocaleString()} <span className="text-xs font-sans">ج.م</span>
                            </div>
                            <div className="text-[10px] text-stone-500">{rec.amountInWords}</div>
                          </div>

                          <button
                            onClick={() => setActiveReceiptModal(rec)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#EAA044]" />
                            <span>طباعة الفاتورة</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* تبويب المشاريع */}
          {/* ======================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#12141D] border border-white/10 flex items-center justify-between text-xs">
                <span className="text-stone-300">
                  المشاريع المنشورة حالياً: <strong className="text-[#EAA044]">{projects.length}</strong> مشاريع.
                  {projects.length === 0 && ' (قسم المشاريع مخفي تلقائياً من الصفحة الرئيسية).'}
                </span>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#EAA044] text-stone-950 font-bold"
                >
                  + إضافة مشروع جديد
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#12141D] border border-dashed border-white/15 space-y-2">
                  <Award className="w-10 h-10 text-stone-600 mx-auto" />
                  <div className="text-sm font-bold text-stone-300">لا توجد أي مشاريع منشورة</div>
                  <p className="text-xs text-stone-500">قسم المشاريع مخفي بالكامل من الموقع حتى تقوم بإضافة أي مشروع هنا.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map(p => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-[#12141D] border border-white/10 hover:border-white/20 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-lg bg-[#EAA044]/15 border border-[#EAA044]/30 text-[#EAA044] text-xs font-bold">
                            {p.badge}
                          </span>
                          <span className="text-xs font-mono text-stone-400">{p.year}</span>
                        </div>

                        <div className="text-[11px] text-stone-400">{p.category}</div>
                        <h3 className="font-bold text-base text-white">{p.title}</h3>
                        <div className="text-xs text-stone-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#EAA044]" />
                          <span>{p.location}</span>
                        </div>

                        <p className="text-xs text-stone-300 bg-black/30 p-2.5 rounded-xl border border-white/5 line-clamp-3">
                          {p.outcome}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                        <button
                          onClick={() => setEditingProject(p)}
                          className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-[#EAA044]" />
                          <span>تعديل</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProject(p.id, p.title)}
                          className="p-1 text-stone-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* تبويب الخدمات */}
          {/* ======================================================== */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#12141D] border border-white/10 flex items-center justify-between text-xs">
                <span className="text-stone-300">
                  الخدمات المعروضة بالموقع: <strong className="text-[#EAA044]">{services.length}</strong> خدمات رسمية.
                </span>
                <button
                  onClick={() => setShowNewServiceModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#EAA044] text-stone-950 font-bold"
                >
                  + إضافة خدمة جديدة
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(s => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-[#12141D] border border-white/10 hover:border-white/20 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#EAA044] bg-[#EAA044]/15 px-2 py-0.5 rounded border border-[#EAA044]/30">
                          {s.indexCode}
                        </span>
                        <span className="text-xs text-stone-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          {s.badge}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#EAA044]">{s.legalCode}</div>
                      <h3 className="font-bold text-base text-white">{s.title}</h3>
                      <p className="text-xs text-stone-400 line-clamp-2">{s.shortDesc}</p>

                      <div className="text-[11px] text-stone-400 bg-black/30 p-2 rounded-xl border border-white/5 space-y-1">
                        <div className="flex justify-between">
                          <span>المدة:</span>
                          <span className="text-stone-200">{s.durationEstimate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>المستندات المطلوبة:</span>
                          <span className="text-[#EAA044]">{s.requiredDocs?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                      <button
                        onClick={() => setEditingService(s)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-[#EAA044]" />
                        <span>تعديل</span>
                      </button>

                      <button
                        onClick={() => handleDeleteService(s.id, s.title)}
                        className="p-1 text-stone-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* تبويب إعدادات النظام وسحابة Cloudflare R2 */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
              
              {/* كارت إعدادات Cloudflare R2 لتخزين مستندات العملاء */}
              <div className="p-5 rounded-2xl bg-[#12141D] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                    <Cloud className="w-5 h-5" />
                    <span>إعدادات سحابة Cloudflare R2 لتخزين مستندات العملاء والمشاريع</span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                    <input
                      type="checkbox"
                      checked={localSettings.r2Config?.enabled ?? false}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        r2Config: {
                          ...(localSettings.r2Config || DEFAULT_R2_CONFIG),
                          enabled: e.target.checked
                        }
                      })}
                      className="rounded bg-black/40 border-white/20 text-cyan-400 focus:ring-0 cursor-pointer"
                    />
                    <span>تفعيل الربط المباشر مع R2</span>
                  </label>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  تم تجهيز نظام رفع وتخزين المستندات ليتصل بسحابة <strong>Cloudflare R2</strong> بمجرد إدخال بيانات الـ Bucket الخاصة بك هنا. في حالة عدم تفعيلها يتم تخزين المستندات محلياً وسحابياً بـ Firebase.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">Cloudflare Account ID</label>
                    <input
                      type="text"
                      placeholder="أدخل معرّف الحساب في كلاود فلير"
                      value={localSettings.r2Config?.accountId || ''}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        r2Config: {
                          ...(localSettings.r2Config || DEFAULT_R2_CONFIG),
                          accountId: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">R2 Bucket Name</label>
                    <input
                      type="text"
                      placeholder="مثال: heba-documents"
                      value={localSettings.r2Config?.bucketName || ''}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        r2Config: {
                          ...(localSettings.r2Config || DEFAULT_R2_CONFIG),
                          bucketName: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">R2 Access Key ID</label>
                    <input
                      type="text"
                      placeholder="مفتاح الوصول"
                      value={localSettings.r2Config?.accessKeyId || ''}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        r2Config: {
                          ...(localSettings.r2Config || DEFAULT_R2_CONFIG),
                          accessKeyId: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">R2 Secret Access Key</label>
                    <input
                      type="password"
                      placeholder="المفتاح السري"
                      value={localSettings.r2Config?.secretAccessKey || ''}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        r2Config: {
                          ...(localSettings.r2Config || DEFAULT_R2_CONFIG),
                          secretAccessKey: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-stone-300 font-bold block">R2 Public URL / Custom Domain (اختياري)</label>
                    <input
                      type="text"
                      placeholder="مثال: https://files.heba-consultant.com"
                      value={localSettings.r2Config?.publicUrl || ''}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        r2Config: {
                          ...(localSettings.r2Config || DEFAULT_R2_CONFIG),
                          publicUrl: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* كارت بيانات وهوية المكتب */}
              <div className="p-5 rounded-2xl bg-[#12141D] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#EAA044] border-b border-white/10 pb-3">
                  <Building2 className="w-4 h-4" />
                  <span>بيانات وهوية المكتب الأساسية</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">اسم المكتب الرسمي</label>
                    <input
                      type="text"
                      value={localSettings.officeName}
                      onChange={(e) => setLocalSettings({ ...localSettings, officeName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">اسم المدير المسؤول</label>
                    <input
                      type="text"
                      value={localSettings.directorName}
                      onChange={(e) => setLocalSettings({ ...localSettings, directorName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-stone-300 font-bold block">العنوان والمقر التفصيلي</label>
                    <input
                      type="text"
                      value={localSettings.address}
                      onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-stone-300 font-bold block">مواعيد وساعات العمل الرسمية</label>
                    <input
                      type="text"
                      value={localSettings.workHours}
                      onChange={(e) => setLocalSettings({ ...localSettings, workHours: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* كارت أرقام الهواتف والتواصل المباشر */}
              <div className="p-5 rounded-2xl bg-[#12141D] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#EAA044] border-b border-white/10 pb-3">
                  <Smartphone className="w-4 h-4" />
                  <span>أرقام الهواتف والواتساب للتواصل المباشر</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">رقم الهاتف الأساسي (مدير المكتب)</label>
                    <input
                      type="text"
                      value={localSettings.primaryPhone}
                      onChange={(e) => setLocalSettings({ ...localSettings, primaryPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">رقم الواتساب الرسمي (بدون علامة +)</label>
                    <input
                      type="text"
                      value={localSettings.whatsappNumber}
                      onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">رقم هاتف إضافي 2</label>
                    <input
                      type="text"
                      value={localSettings.secondPhone}
                      onChange={(e) => setLocalSettings({ ...localSettings, secondPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">رقم هاتف إضافي 3</label>
                    <input
                      type="text"
                      value={localSettings.thirdPhone}
                      onChange={(e) => setLocalSettings({ ...localSettings, thirdPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* كارت أمان وتسجيل دخول لوحة الإدارة */}
              <div className="p-5 rounded-2xl bg-[#12141D] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#EAA044] border-b border-white/10 pb-3">
                  <KeyRound className="w-4 h-4" />
                  <span>بيانات تسجيل الدخول للوحة التحكم</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">اسم مستخدم الأدمن</label>
                    <input
                      type="text"
                      value={localSettings.adminUsername}
                      onChange={(e) => setLocalSettings({ ...localSettings, adminUsername: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-300 font-bold block">كلمة مرور لوحة التحكم</label>
                    <input
                      type="text"
                      value={localSettings.adminPasswordHash}
                      onChange={(e) => setLocalSettings({ ...localSettings, adminPasswordHash: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* كارت إدارة وتنظيف البيانات */}
              <div className="p-5 rounded-2xl bg-[#12141D] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-red-400 border-b border-white/10 pb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>تنظيف وتصفير البيانات</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="text-stone-400">
                    مسح كافة المعاملات وسندات الدفع للبدء بسجل نظيف بالكامل.
                  </div>

                  <button
                    type="button"
                    onClick={handleClearFakeData}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold whitespace-nowrap active:scale-95"
                  >
                    مسح وتصفير السجلات
                  </button>
                </div>
              </div>

              {/* زر حفظ الإعدادات الرئيسي */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ وتطبيق جميع الإعدادات وسحابة R2</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      {/* ======================================================== */}
      {/* مودال إدارة ورفع المستندات (Cloudflare R2 Ready) */}
      {/* ======================================================== */}
      {managingDocsCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#14161E] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-base text-white">
                    مستندات المعاملة: <span className="font-mono text-[#EAA044]">{managingDocsCase.code}</span>
                  </h3>
                </div>
                <div className="text-xs text-stone-400">
                  العميل: <strong className="text-stone-200">{managingDocsCase.clientName}</strong> — تخزين سحابي محمي (R2 Ready)
                </div>
              </div>
              <button onClick={() => setManagingDocsCase(null)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* فورم رفع مستند جديد */}
            <form onSubmit={handleUploadCaseDocument} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
              <div className="font-bold text-xs text-[#EAA044] flex items-center gap-1.5">
                <FileUp className="w-4 h-4" />
                <span>رفع مستند جديد للعميل</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 font-bold block">عنوان / وصف المستند *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: صورة بطاقة الرقم القومي، عقد الملكية، نموذج 3..."
                    value={uploadDocTitle}
                    onChange={(e) => setUploadDocTitle(e.target.value)}
                    className="w-full p-2 rounded-xl bg-stone-900 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 font-bold block">ملاحظة على المستند</label>
                  <input
                    type="text"
                    placeholder="مثال: أصل معتمد ومختوم، ساري حتى 2028..."
                    value={uploadDocNote}
                    onChange={(e) => setUploadDocNote(e.target.value)}
                    className="w-full p-2 rounded-xl bg-stone-900 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-bold block">اختر الملف من جهازك (PDF، صورة، مخطط) *</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-stone-300 file:mr-0 file:ml-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={uploadingDoc || !selectedFile}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all active:scale-95"
                >
                  {uploadingDoc ? (
                    <span>جاري الرفع...</span>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>رفع المستند وتخزينه</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* قائمة المستندات المحفوظة */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>المستندات المحفوظة للملف:</span>
                <span className="text-cyan-400 font-mono">{managingDocsCase.documents?.length || 0} مستندات</span>
              </div>

              {(!managingDocsCase.documents || managingDocsCase.documents.length === 0) ? (
                <div className="p-6 text-center text-xs text-stone-500 bg-black/20 rounded-2xl border border-dashed border-white/10">
                  لا توجد مستندات مرفوعة لهذا الملف بعد. استخدم الفورم أعلاه لرفع أول مستند.
                </div>
              ) : (
                <div className="space-y-2">
                  {managingDocsCase.documents.map((docItem) => (
                    <div
                      key={docItem.id}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="font-bold text-white flex items-center gap-2 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">{docItem.title}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-3">
                          <span className="font-mono text-stone-500">{docItem.fileName} ({docItem.fileSize})</span>
                          <span className="font-mono text-stone-500">تاريخ الرفع: {docItem.uploadDate}</span>
                        </div>
                        {docItem.notes && (
                          <div className="text-[11px] text-[#EAA044] italic">
                            ملاحظة: "{docItem.notes}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {docItem.fileUrl && (
                          <a
                            href={docItem.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={docItem.fileName}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-cyan-300 hover:text-white transition-all flex items-center gap-1"
                            title="معاينة وتحميل المستند"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => handleDeleteCaseDocument(docItem.id)}
                          className="p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="حذف المستند"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end border-t border-white/10">
              <button
                type="button"
                onClick={() => setManagingDocsCase(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودال فتح معاملة جديدة */}
      {/* ======================================================== */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#14161E] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">فتح ملف معاملة جديدة</h3>
              <button onClick={() => setShowNewCaseModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5 text-xs">
              
              {/* اختيار نوع مصدر المعاملة */}
              <div className="space-y-1">
                <label className="text-stone-300 font-bold block mb-1">مصدر المعاملة</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCaseSource('manual')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      newCaseSource === 'manual' ? 'bg-[#EAA044] text-stone-950 border-[#EAA044]' : 'bg-black/30 border-white/10 text-stone-400'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>معاملة مكتبية يدوية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCaseSource('website')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      newCaseSource === 'website' ? 'bg-cyan-500 text-stone-950 border-cyan-500' : 'bg-black/30 border-white/10 text-stone-400'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>طلب أونلاين من الموقع</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">اسم العميل *</label>
                <input
                  type="text"
                  required
                  placeholder="الاسم ثلاثي أو رباعي"
                  value={newCaseClientName}
                  onChange={(e) => setNewCaseClientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">رقم التليفون *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01207659999"
                    value={newCaseClientPhone}
                    onChange={(e) => setNewCaseClientPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">الرقم القومي (اختياري)</label>
                  <input
                    type="text"
                    placeholder="14 رقم"
                    value={newCaseNationalId}
                    onChange={(e) => setNewCaseNationalId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">نوع المعاملة</label>
                  <select
                    value={newCaseCategory}
                    onChange={(e) => setNewCaseCategory(e.target.value as ServiceCategory)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  >
                    <option value="reconciliation">مصالحات مباني وتصالح</option>
                    <option value="building_permits">تراخيص بناء وإنشاءات</option>
                    <option value="commercial_licenses">تراخيص منشآت ومحلات</option>
                    <option value="land_regularization">تقنين أراضي أملاك الدولة</option>
                    <option value="drawings_survey">رفع مساحي ورسومات</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">الحي</label>
                  <input
                    type="text"
                    value={newCaseDistrict}
                    onChange={(e) => setNewCaseDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">عنوان العقار</label>
                <input
                  type="text"
                  placeholder="مثال: الناصرية القديمة - عمارة البنا"
                  value={newCaseAddress}
                  onChange={(e) => setNewCaseAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              {newCaseSource === 'manual' ? (
                <div>
                  <label className="text-stone-300 font-bold block mb-1">أتعاب المكتب المقدرة (ج.م)</label>
                  <input
                    type="number"
                    value={newCaseOfficeFees}
                    onChange={(e) => setNewCaseOfficeFees(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                  />
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30 text-cyan-300 text-[11px] flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>الطلبات الواردة من الموقع تُسجل الأتعاب فيها كـ <strong>"غير محدد"</strong> لحين المعاينة والاتفاق.</span>
                </div>
              )}

              <div>
                <label className="text-stone-300 font-bold block mb-1">ملاحظات وموقف الملف الأولي</label>
                <textarea
                  rows={2}
                  value={newCaseNotes}
                  onChange={(e) => setNewCaseNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-stone-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EAA044] text-stone-950 font-bold"
                >
                  حفظ المعاملة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودال تعديل المعاملة وعرض فواتيرها وسجل دفعاتها */}
      {/* ======================================================== */}
      {editingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#14161E] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">تعديل ملف {editingCase.code}</h3>
                  {editingCase.source === 'website' ? (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                      طلب أونلاين
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-400 text-[10px] font-bold">
                      معاملة مكتبية
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-400">العميل: {editingCase.clientName}</div>
              </div>
              <button onClick={() => setEditingCase(null)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedCase} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">اسم العميل</label>
                  <input
                    type="text"
                    value={editingCase.clientName}
                    onChange={(e) => setEditingCase({ ...editingCase, clientName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">رقم التليفون</label>
                  <input
                    type="tel"
                    value={editingCase.clientPhone}
                    onChange={(e) => setEditingCase({ ...editingCase, clientPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">المرحلة الحالية</label>
                  <select
                    value={editingCase.status}
                    onChange={(e) => setEditingCase({ ...editingCase, status: e.target.value as CaseStatus })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  >
                    {(Object.keys(STATUS_CONFIG) as CaseStatus[]).map(st => (
                      <option key={st} value={st} className="bg-stone-900">
                        {STATUS_CONFIG[st].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">الحي</label>
                  <input
                    type="text"
                    value={editingCase.district}
                    onChange={(e) => setEditingCase({ ...editingCase, district: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">عنوان العقار</label>
                <input
                  type="text"
                  value={editingCase.propertyAddress}
                  onChange={(e) => setEditingCase({ ...editingCase, propertyAddress: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">أتعاب المكتب المقدرة (ج.م)</label>
                  <input
                    type="number"
                    placeholder="اكتب 0 إذا كانت غير محددة"
                    value={editingCase.officeFees || 0}
                    onChange={(e) => setEditingCase({ ...editingCase, officeFees: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">إذا كانت 0 تظهر للعميل كـ "غير محدد"</span>
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">المسدد حتى الآن (ج.م)</label>
                  <input
                    type="number"
                    value={editingCase.paidAmount || 0}
                    onChange={(e) => setEditingCase({ ...editingCase, paidAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">ملاحظات تظهر للعميل عند الاستعلام برقم هاتفه</label>
                <textarea
                  rows={3}
                  value={editingCase.statusNotes}
                  onChange={(e) => setEditingCase({ ...editingCase, statusNotes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              {/* سجل الفواتير والدفعات المرتبطة بهذه المعاملة */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>سجل الدفعات والفواتير الصادرة لهذا الملف</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingCase(null);
                      handleOpenReceiptForCase(editingCase);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-[11px]"
                  >
                    + سداد دفعة جديدة
                  </button>
                </div>

                {receipts.filter(r => r.caseCode === editingCase.code || r.caseId === editingCase.id).length === 0 ? (
                  <div className="text-[11px] text-stone-500 italic py-1">لا توجد دفعات أو سندات مسجلة لهذا الملف حتى الآن.</div>
                ) : (
                  <div className="space-y-1.5">
                    {receipts.filter(r => r.caseCode === editingCase.code || r.caseId === editingCase.id).map(r => (
                      <div key={r.id} className="p-2 rounded-xl bg-white/5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-mono text-[#EAA044] font-bold ml-2">{r.receiptNumber}</span>
                          <span className="text-stone-300">{r.date} — {r.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400">{r.amount.toLocaleString()} ج.م</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCase(null);
                              setActiveReceiptModal(r);
                            }}
                            className="p-1 text-stone-400 hover:text-white"
                            title="طباعة"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-stone-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EAA044] text-stone-950 font-bold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودال إضافة مشروع جديد */}
      {/* ======================================================== */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#14161E] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">إضافة مشروع جديد</h3>
              <button onClick={() => setShowNewProjectModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">عنوان المشروع *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تصالح عقار سكني واستخراج نموذج (8) نهائي"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">التصنيف</label>
                  <input
                    type="text"
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">الموقع / الحي</label>
                  <input
                    type="text"
                    value={newProjLocation}
                    onChange={(e) => setNewProjLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">الشارة</label>
                  <input
                    type="text"
                    value={newProjBadge}
                    onChange={(e) => setNewProjBadge(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">السنة</label>
                  <input
                    type="text"
                    value={newProjYear}
                    onChange={(e) => setNewProjYear(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">تفاصيل النتيجة والإنجاز</label>
                <textarea
                  rows={3}
                  value={newProjOutcome}
                  onChange={(e) => setNewProjOutcome(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-stone-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EAA044] text-stone-950 font-bold"
                >
                  نشر بالفايربيز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودال تعديل مشروع */}
      {/* ======================================================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#14161E] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">تعديل المشروع</h3>
              <button onClick={() => setEditingProject(null)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProject} className="space-y-3.5 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">عنوان المشروع</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">التصنيف</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">الموقع</label>
                  <input
                    type="text"
                    value={editingProject.location}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">الشارة</label>
                  <input
                    type="text"
                    value={editingProject.badge}
                    onChange={(e) => setEditingProject({ ...editingProject, badge: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">السنة</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">تفاصيل النتيجة</label>
                <textarea
                  rows={3}
                  value={editingProject.outcome}
                  onChange={(e) => setEditingProject({ ...editingProject, outcome: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-stone-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EAA044] text-stone-950 font-bold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودال تعديل الخدمة */}
      {/* ======================================================== */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#14161E] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">تعديل خدمة {editingService.title}</h3>
              <button onClick={() => setEditingService(null)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedService} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">اسم الخدمة</label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">الشارة</label>
                  <input
                    type="text"
                    value={editingService.badge}
                    onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">السند القانوني</label>
                  <input
                    type="text"
                    value={editingService.legalCode}
                    onChange={(e) => setEditingService({ ...editingService, legalCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">المدة المتوقعة</label>
                  <input
                    type="text"
                    value={editingService.durationEstimate}
                    onChange={(e) => setEditingService({ ...editingService, durationEstimate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">الوصف المختصر</label>
                <textarea
                  rows={2}
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">الوصف التفصيلي</label>
                <textarea
                  rows={3}
                  value={editingService.fullDesc}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">المستندات المطلوبة (سطر لكل مستند)</label>
                <textarea
                  rows={3}
                  value={editingService.requiredDocs?.join('\n') || ''}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    requiredDocs: e.target.value.split('\n').map(x => x.trim()).filter(Boolean)
                  })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">المخرجات والتسليمات (سطر لكل بند)</label>
                <textarea
                  rows={3}
                  value={editingService.deliverables?.join('\n') || ''}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    deliverables: e.target.value.split('\n').map(x => x.trim()).filter(Boolean)
                  })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-stone-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EAA044] text-stone-950 font-bold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودال إضافة خدمة جديدة */}
      {/* ======================================================== */}
      {showNewServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#14161E] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">إضافة خدمة جديدة</h3>
              <button onClick={() => setShowNewServiceModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">اسم الخدمة *</label>
                  <input
                    type="text"
                    required
                    value={newServTitle}
                    onChange={(e) => setNewServTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">الشارة</label>
                  <input
                    type="text"
                    value={newServBadge}
                    onChange={(e) => setNewServBadge(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">السند القانوني</label>
                  <input
                    type="text"
                    value={newServLegalCode}
                    onChange={(e) => setNewServLegalCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">المدة</label>
                  <input
                    type="text"
                    value={newServDuration}
                    onChange={(e) => setNewServDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">الوصف المختصر</label>
                <textarea
                  rows={2}
                  value={newServShortDesc}
                  onChange={(e) => setNewServShortDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">المستندات المطلوبة (سطر لكل مستند)</label>
                <textarea
                  rows={3}
                  value={newServDocsText}
                  onChange={(e) => setNewServDocsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#EAA044] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewServiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-stone-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EAA044] text-stone-950 font-bold"
                >
                  إضافة وحفظ بالفايربيز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودال سداد دفعة وإصدار سند رسمي مربوط بالعميل */}
      {/* ======================================================== */}
      {showNewReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#14161E] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-white">سداد دفعة وإصدار سند رسمي</h3>
                <p className="text-xs text-stone-400">يُحفظ السند في سجل الفواتير ويُخصم من مستحقات العميل</p>
              </div>
              <button onClick={() => setShowNewReceiptModal(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReceipt} className="space-y-3.5 text-xs">
              {/* اختيار المعاملة المرتبطة */}
              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  اختر المعاملة أو طلب العميل المرتبط بالدفعة *
                </label>
                <select
                  required
                  value={receiptCaseId}
                  onChange={(e) => handleSelectCaseForReceipt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="">-- اضغط لاختيار المعاملة / العميل --</option>
                  {cases.map((c) => {
                    const remaining = (c.officeFees && c.officeFees > 0)
                      ? Math.max(0, c.officeFees - (c.paidAmount || 0))
                      : null;
                    const remainingText = remaining !== null ? `المتبقي: ${remaining.toLocaleString()} ج.م` : 'الأتعاب غير محددة';
                    return (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.clientName} — {c.serviceTitle} ({remainingText})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* بطاقة تفاصيل المعاملة والرصيد المالي المتبقي */}
              {receiptCaseId && (() => {
                const activeCase = cases.find(c => c.id === receiptCaseId);
                if (!activeCase) return null;
                const remaining = (activeCase.officeFees && activeCase.officeFees > 0)
                  ? Math.max(0, activeCase.officeFees - (activeCase.paidAmount || 0))
                  : null;

                return (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          {activeCase.code}
                        </span>
                        <span className="font-bold text-white text-sm">{activeCase.clientName}</span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">{activeCase.clientPhone}</span>
                    </div>

                    <div className="text-stone-300 text-[11px] flex items-center gap-1.5">
                      <span>الخدمة:</span>
                      <strong className="text-stone-100">{activeCase.serviceTitle}</strong>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-emerald-500/20 text-center text-[11px] font-mono">
                      <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                        <div className="text-stone-400 text-[10px]">إجمالي الأتعاب</div>
                        <div className="font-bold text-white mt-0.5">
                          {activeCase.officeFees && activeCase.officeFees > 0 ? `${activeCase.officeFees.toLocaleString()} ج` : 'غير محدد'}
                        </div>
                      </div>
                      <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                        <div className="text-stone-400 text-[10px]">المسدد سابقاً</div>
                        <div className="font-bold text-emerald-400 mt-0.5">
                          {(activeCase.paidAmount || 0).toLocaleString()} ج
                        </div>
                      </div>
                      <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                        <div className="text-stone-400 text-[10px]">المتبقي المطلوب</div>
                        <div className="font-bold text-amber-400 mt-0.5">
                          {remaining !== null ? `${remaining.toLocaleString()} ج` : 'غير محدد'}
                        </div>
                      </div>
                    </div>

                    {remaining !== null && remaining > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] text-stone-400">سداد سريع:</span>
                        <button
                          type="button"
                          onClick={() => handleReceiptAmountChange(remaining)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold hover:bg-emerald-500/30 transition-all active:scale-95"
                        >
                          سداد كامل المتبقي ({remaining.toLocaleString()} ج.م)
                        </button>
                        {remaining > 1000 && (
                          <button
                            type="button"
                            onClick={() => handleReceiptAmountChange(Math.round(remaining / 2))}
                            className="px-2.5 py-1 rounded-lg bg-white/5 text-stone-300 border border-white/10 text-[10px] hover:bg-white/10 transition-all active:scale-95"
                          >
                            نصف المتبقي ({Math.round(remaining / 2).toLocaleString()} ج.م)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">مبلغ الدفعة المسدد الآن (ج.م) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={receiptAmount || ''}
                    onChange={(e) => handleReceiptAmountChange(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/15 text-emerald-400 font-mono font-bold text-base focus:border-emerald-400 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">طريقة السداد</label>
                  <select
                    value={receiptPaymentMethod}
                    onChange={(e) => setReceiptPaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="كاش">كاش نقداً بالمكتب</option>
                    <option value="إنستاباي / فودافون كاش">إنستاباي / فودافون كاش</option>
                    <option value="تحويل بنكي">تحويل بنكي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">المبلغ تفقيطاً باللغة العربية (تلقائي) *</label>
                <input
                  type="text"
                  required
                  value={receiptWords}
                  onChange={(e) => setReceiptWords(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/15 text-stone-200 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">بند الدفعة</label>
                  <input
                    type="text"
                    value={receiptCategory}
                    onChange={(e) => setReceiptCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">ملاحظات على السند (اختياري)</label>
                  <input
                    type="text"
                    value={receiptNotes}
                    onChange={(e) => setReceiptNotes(e.target.value)}
                    placeholder="مثال: استلام أصل عقد أو دفعة أعمال الرفع المساحي..."
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewReceiptModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-stone-300 font-bold hover:bg-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!receiptCaseId || !receiptAmount}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-stone-950 font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد تسجيل السداد وطباعة الفاتورة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* مودال معاينة السند الرسمي للطباعة */}
      {/* ======================================================== */}
      {activeReceiptModal && (
        <ReceiptModal
          receipt={activeReceiptModal}
          onClose={() => setActiveReceiptModal(null)}
        />
      )}

      {/* ======================================================== */}
      {/* شريط التنقل السفلي للهواتف الذكية (Mobile Bottom Bar) */}
      {/* ======================================================== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#10121A]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('cases')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'cases' ? 'text-[#EAA044]' : 'text-stone-400 hover:text-white'
          }`}
        >
          <FolderKanban className="w-5 h-5" />
          <span className="text-[10px] font-bold">المعاملات</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'projects' ? 'text-[#EAA044]' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] font-bold">المشاريع</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'services' ? 'text-[#EAA044]' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold">الخدمات</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'finance' ? 'text-emerald-400 font-bold' : 'text-stone-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-bold">الحسابات</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'settings' ? 'text-[#EAA044]' : 'text-stone-400 hover:text-white'
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold">الإعدادات</span>
        </button>
      </nav>

    </div>
  );
};
