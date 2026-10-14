import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Globe, FilePlus, Home } from 'lucide-react';
import { OFFICE_INFO } from '../data/mockData';

interface NavbarProps {
  currentView: 'public' | 'register' | 'admin';
  setCurrentView: (view: 'public' | 'register' | 'admin') => void;
  onOpenTracker: () => void;
  onOpenContact: () => void;
  onOpenRegister?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenTracker,
  onOpenContact,
  onOpenRegister
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      }

      setScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#0C0D11]/95 backdrop-blur-md shadow-lg border-b border-white/10'
        : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent'
    }`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* الشعار الموزون هندسياً والاسم */}
          <button 
            onClick={() => setCurrentView('public')} 
            className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group text-right cursor-pointer"
          >
            <img 
              src="/emblem.png" 
              alt="شعار مكتب الهيبه" 
              className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-[0_1px_4px_rgba(234,160,68,0.4)] group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo.png";
              }}
            />
            <div className="text-right">
              <div className="font-bold text-base sm:text-lg text-white leading-none flex items-center gap-1">
                <span>مكتب</span> <span className="text-[#EAA044] font-fayonka font-bold text-xl sm:text-2xl">الهيبه</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-400 font-sans mt-0.5">
                للمحاسبة والأعمال الهندسية
              </div>
            </div>
          </button>

          {/* روابط الموقع للشاشات الكبيرة */}
          {currentView === 'public' && (
            <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-semibold text-stone-300">
              <a href="#hero" className="hover:text-[#EAA044] transition-colors">الرئيسية</a>
              <a href="#services" className="hover:text-[#EAA044] transition-colors">الخدمات</a>
              <a href="#projects" className="hover:text-[#EAA044] transition-colors">المشاريع</a>
              <a href="#about" className="hover:text-[#EAA044] transition-colors">عن المكتب</a>
              <a href="#tracker" className="hover:text-[#EAA044] transition-colors">تتبع المعاملة</a>
              <a href="#faq" className="hover:text-[#EAA044] transition-colors">الأسئلة الشائعة</a>
              <a href="#contact" className="hover:text-[#EAA044] transition-colors">المقر والاتصال</a>
            </nav>
          )}

          {/* إذا كنا في صفحة التسجيل أو الإدارة، زر للعودة للرئيسية */}
          {currentView !== 'public' && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
              <span>أنت الآن في:</span>
              <span className="text-[#EAA044] font-bold">
                {currentView === 'register' ? 'بوابة فتح ملف أونلاين' : 'لوحة إدارة المكتب'}
              </span>
            </div>
          )}

          {/* الأزرار المباشرة بحجم متناسق */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* زر فتح ملف أونلاين للشاشات المتوسطة والكبيرة */}
            {currentView === 'public' && onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAA044]/15 hover:bg-[#EAA044]/25 text-[#EAA044] border border-[#EAA044]/40 text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>فتح ملف أونلاين</span>
              </button>
            )}

            {currentView !== 'public' && (
              <button
                onClick={() => setCurrentView('public')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all active:scale-95"
              >
                <Home className="w-3.5 h-3.5 text-[#EAA044]" />
                <span>الرئيسية</span>
              </button>
            )}

            {/* رقم هاتف مباشر */}
            <a
              href="tel:01207659999"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-bold font-mono transition-colors border border-white/10"
              dir="ltr"
            >
              <Phone className="w-3 h-3 text-[#EAA044]" />
              <span>01207659999</span>
            </a>

            {/* زر واتساب رسمي */}
            <a
              href={`https://wa.me/201207659999?text=${encodeURIComponent('السلام عليكم مكتب الهيبه، أود الاستفسار عن استشارة وفتح ملف معاملة')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-lg bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>واتساب</span>
            </a>

            {/* زر لوحة تحكم المكتب يظهر فقط إذا كنا داخل لوحة الإدارة للعودة للموقع */}
            {currentView === 'admin' && (
              <button
                onClick={() => {
                  setCurrentView('public');
                  if (window.location.hash.includes('admin')) {
                    window.location.hash = '';
                  }
                  if (window.location.pathname === '/admin') {
                    window.history.pushState(null, '', '/');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg bg-[#EAA044]/15 hover:bg-[#EAA044]/25 text-[#EAA044] border border-[#EAA044]/40 text-xs font-bold transition-all active:scale-95 shadow-sm"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>العودة للموقع</span>
              </button>
            )}

            {/* زر القائمة للشاشات الصغيرة */}
            {currentView === 'public' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg lg:hidden text-stone-200 hover:bg-white/10"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* شريط التقدم الذهبي السفلي */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/10 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-l from-[#EAA044] via-[#F7B85F] to-[#EAA044] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* قائمة الموبايل */}
      {mobileMenuOpen && currentView === 'public' && (
        <div className="lg:hidden bg-[#0C0D11]/98 backdrop-blur-xl border-t border-white/10 px-5 py-4 space-y-3 text-sm font-bold text-stone-200 text-right shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {onOpenRegister && (
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }} 
              className="w-full py-2.5 px-3 rounded-xl bg-[#EAA044] text-stone-950 font-bold flex items-center justify-center gap-2 shadow-lg mb-2"
            >
              <FilePlus className="w-4 h-4" />
              <span>فتح ملف أونلاين الآن</span>
            </button>
          )}
          <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/5 hover:text-[#EAA044]">الرئيسية</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/5 hover:text-[#EAA044]">الخدمات السبعة</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/5 hover:text-[#EAA044]">المشاريع المنجزة</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/5 hover:text-[#EAA044]">عن المكتب والإدارة</a>
          <a href="#tracker" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/5 text-[#EAA044]">تتبع المعاملة</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-white/5 hover:text-[#EAA044]">الأسئلة الشائعة</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#EAA044]">المقر والاتصال</a>
          
          <div className="pt-2.5 border-t border-white/10 flex flex-col gap-2 font-mono text-xs" dir="ltr">
            <a href="tel:01207659999" className="flex items-center gap-2 text-stone-200 bg-white/5 p-2 rounded-lg">
              <Phone className="w-3.5 h-3.5 text-[#EAA044]" /> 01207659999
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
