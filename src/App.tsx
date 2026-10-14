import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesGrid } from './components/ServicesGrid';
import { DirectorProfile } from './components/DirectorProfile';
import { LiveTracker } from './components/LiveTracker';
import { ContactSection } from './components/ContactSection';
import { RegistrationPage } from './components/RegistrationPage';
import { ProjectsSection } from './components/ProjectsSection';
import { Footer } from './components/Footer';
import { FaqSection } from './components/FaqSection';
import { DocChecklistModal } from './components/DocChecklistModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CaseFile, Receipt, ProjectItem, ServiceItem } from './types';
import { SERVICES_DATA, OFFICE_INFO } from './data/mockData';
import { 
  casesCollection, projectsCollection, servicesCollection, 
  receiptsCollection, settingsDocRef, SystemSettings, DEFAULT_SETTINGS,
  saveCaseToFirebase
} from './services/firebase';
import { onSnapshot } from 'firebase/firestore';

const isPathOrHashAdmin = () => {
  const path = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  return path === '/admin' || hash === '#/admin' || hash === '#admin';
};

const isPathOrHashRegister = () => {
  const hash = window.location.hash.toLowerCase();
  return hash === '#/register' || hash === '#register';
};

export function App() {
  const [currentView, setCurrentView] = useState<'public' | 'register' | 'admin'>(() => {
    if (isPathOrHashAdmin()) return 'admin';
    if (isPathOrHashRegister()) return 'register';
    return 'public';
  });

  const [cases, setCases] = useState<CaseFile[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [checklistServiceId, setChecklistServiceId] = useState<string | null>(null);

  // Real-time Firebase Sync
  useEffect(() => {
    // 1. Cases Listener
    const unsubCases = onSnapshot(casesCollection, (snapshot) => {
      const list: CaseFile[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as CaseFile);
      });
      // Sort newest first
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setCases(list);
    }, (err) => console.warn('Firestore cases listener:', err));

    // 2. Projects Listener
    const unsubProjects = onSnapshot(projectsCollection, (snapshot) => {
      const list: ProjectItem[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as ProjectItem);
      });
      setProjects(list);
    }, (err) => console.warn('Firestore projects listener:', err));

    // 3. Services Listener
    const unsubServices = onSnapshot(servicesCollection, (snapshot) => {
      if (!snapshot.empty) {
        const list: ServiceItem[] = [];
        snapshot.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() } as ServiceItem);
        });
        list.sort((a, b) => (a.indexCode || '').localeCompare(b.indexCode || ''));
        setServices(list);
      }
    }, (err) => console.warn('Firestore services listener:', err));

    // 4. Receipts Listener
    const unsubReceipts = onSnapshot(receiptsCollection, (snapshot) => {
      const list: Receipt[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as Receipt);
      });
      list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setReceipts(list);
    }, (err) => console.warn('Firestore receipts listener:', err));

    // 5. Settings Listener
    const unsubSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() } as SystemSettings);
      }
    }, (err) => console.warn('Firestore settings listener:', err));

    return () => {
      unsubCases();
      unsubProjects();
      unsubServices();
      unsubReceipts();
      unsubSettings();
    };
  }, []);

  // Handle URL change (Direct routing via /admin or #/admin)
  useEffect(() => {
    const handleLocationChange = () => {
      if (isPathOrHashAdmin()) {
        setCurrentView('admin');
      } else if (isPathOrHashRegister()) {
        setCurrentView('register');
      } else if (window.location.pathname !== '/admin' && !window.location.hash.includes('admin')) {
        setCurrentView('public');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigate = (view: 'public' | 'register' | 'admin') => {
    setCurrentView(view);
    if (view === 'admin') {
      window.history.pushState(null, '', '#/admin');
    } else if (view === 'register') {
      window.history.pushState(null, '', '#/register');
    } else {
      if (window.location.pathname === '/admin') {
        window.history.pushState(null, '', '/');
      } else {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  };

  // Scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Scroll reveal animation observer
  useEffect(() => {
    if (currentView === 'admin') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentView, projects, services]);

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'public') {
      handleNavigate('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddNewCase = async (newCase: CaseFile) => {
    setCases(prev => [newCase, ...prev]);
    await saveCaseToFirebase(newCase);
  };

  // ========================================================
  // فصل كامل للوحة التحكم عن الموقع (لا نافبار، لا فوتر، لا واتساب)
  // ========================================================
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        cases={cases}
        setCases={setCases}
        receipts={receipts}
        setReceipts={setReceipts}
        projects={projects}
        setProjects={setProjects}
        services={services}
        setServices={setServices}
        settings={settings}
        setSettings={setSettings}
        onBackToSite={() => handleNavigate('public')}
      />
    );
  }

  // ========================================================
  // واجهة الموقع العامة (Public Site / Register)
  // ========================================================
  return (
    <div className="min-h-screen bg-[#0C0D10] text-[#EDEDEF] font-sans antialiased selection:bg-[#EAA044] selection:text-black">
      
      {/* الترويسة الرئيسية للموقع */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleNavigate}
        onOpenTracker={() => scrollToSection('tracker')}
        onOpenContact={() => scrollToSection('contact')}
        onOpenRegister={() => handleNavigate('register')}
      />

      {/* المحتوى بحسب وضع العرض */}
      <main>
        {currentView === 'public' ? (
          <>
            <Hero
              onOpenTracker={() => scrollToSection('tracker')}
              onOpenContact={() => scrollToSection('contact')}
              onOpenRegister={() => handleNavigate('register')}
            />
            <ServicesGrid 
              services={services}
              onOpenRegister={() => handleNavigate('register')}
              onOpenChecklist={(sId) => setChecklistServiceId(sId || 'reconciliation_buildings')}
            />
            <ProjectsSection
              projects={projects}
              onOpenRegister={() => handleNavigate('register')}
            />
            <DirectorProfile />
            <LiveTracker cases={cases} />
            <FaqSection />
            <ContactSection onOpenRegister={() => handleNavigate('register')} />
          </>
        ) : (
          <RegistrationPage
            services={services}
            onBackToHome={() => handleNavigate('public')}
            onAddNewCase={handleAddNewCase}
          />
        )}
      </main>

      {/* مودال دليل المستندات والأوراق التفاعلي */}
      {checklistServiceId !== null && (
        <DocChecklistModal
          initialServiceId={checklistServiceId}
          onClose={() => setChecklistServiceId(null)}
          onOpenRegister={() => {
            setChecklistServiceId(null);
            handleNavigate('register');
          }}
        />
      )}

      {/* زر واتساب السريع العائم لسهولة التواصل الفوري */}
      <a
        href={`https://wa.me/${settings.whatsappNumber || '201207659999'}?text=${encodeURIComponent('السلام عليكم مكتب الهيبه، أود استشارة مباشرة بخصوص معاملة')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 group border border-white/20"
        aria-label="تواصل واتساب مباشر مع المحاسب منصور هيبه"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="hidden sm:inline font-bold text-xs">استشارة فورية واتساب</span>
      </a>

      {/* التذييل المشترك للموقع */}
      <Footer />

    </div>
  );
}

export default App;
