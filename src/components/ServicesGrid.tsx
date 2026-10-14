import React, { useState, useMemo, useRef } from 'react';
import { 
  FileCheck, HardHat, Store, MapPin, Compass, Layers, Building2, 
  MessageCircle, Clock, FileText, CheckCircle, ChevronLeft, ChevronRight,
  X, FilePlus, Sparkles, CheckSquare
} from 'lucide-react';
import { SERVICES_DATA } from '../data/mockData';
import { ServiceItem } from '../types';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  reconciliation_buildings: <FileCheck className="w-5 h-5 text-[#EAA044]" />,
  building_licenses: <HardHat className="w-5 h-5 text-[#EAA044]" />,
  commercial_facilities: <Store className="w-5 h-5 text-[#EAA044]" />,
  land_regularization: <MapPin className="w-5 h-5 text-[#EAA044]" />,
  engineering_drawings: <Compass className="w-5 h-5 text-[#EAA044]" />,
  reconciliation_usage_change: <Layers className="w-5 h-5 text-[#EAA044]" />,
  syndicate_district_supervision: <Building2 className="w-5 h-5 text-[#EAA044]" />
};

const CATEGORIES = [
  { id: 'all', label: 'جميع الخدمات', count: 7 },
  { id: 'reconciliation', label: 'مصالحات وتغيير استخدام', count: 2 },
  { id: 'permits', label: 'تراخيص وإنشاءات', count: 2 },
  { id: 'commercial', label: 'محلات ومنشآت', count: 1 },
  { id: 'survey_syndicate', label: 'أراضي ورسومات', count: 2 }
];

interface ServicesGridProps {
  services?: ServiceItem[];
  onOpenRegister?: () => void;
  onOpenChecklist?: (serviceId?: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ 
  services = SERVICES_DATA, 
  onOpenRegister,
  onOpenChecklist
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const categoriesWithCounts = useMemo(() => {
    return [
      { id: 'all', label: 'جميع الخدمات', count: services.length },
      { 
        id: 'reconciliation', 
        label: 'مصالحات وتغيير استخدام', 
        count: services.filter(s => s.category === 'reconciliation' || s.id.includes('reconciliation')).length 
      },
      { 
        id: 'permits', 
        label: 'تراخيص وإنشاءات', 
        count: services.filter(s => s.category === 'building_permits' || s.category === 'syndicate_reports' || s.category === 'district_supervision' || s.id.includes('licenses') || s.id.includes('supervision')).length 
      },
      { 
        id: 'commercial', 
        label: 'محلات ومنشآت', 
        count: services.filter(s => s.category === 'commercial_licenses' || s.id.includes('commercial')).length 
      },
      { 
        id: 'survey_syndicate', 
        label: 'أراضي ورسومات', 
        count: services.filter(s => s.category === 'land_regularization' || s.category === 'drawings_survey' || s.id.includes('drawings') || s.id.includes('land')).length 
      }
    ];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      if (activeCategory === 'reconciliation') {
        return service.category === 'reconciliation' || service.id.includes('reconciliation');
      } else if (activeCategory === 'permits') {
        return service.category === 'building_permits' || service.category === 'syndicate_reports' || service.category === 'district_supervision' || service.id.includes('licenses') || service.id.includes('supervision');
      } else if (activeCategory === 'commercial') {
        return service.category === 'commercial_licenses' || service.id.includes('commercial');
      } else if (activeCategory === 'survey_syndicate') {
        return service.category === 'land_regularization' || service.category === 'drawings_survey' || service.id.includes('drawings') || service.id.includes('land');
      }
      return true;
    });
  }, [services, activeCategory]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      id="services" 
      className="relative min-h-screen flex flex-col justify-center overflow-hidden py-16 lg:py-6 bg-[#0E1015] border-b border-white/10 text-right"
    >
      {/* إضاءة خلفية هادئة */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#EAA044]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* رأس قسم الخدمات - منضبط وموجز ليبقى وان سكرين */}
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAA044]/10 border border-[#EAA044]/30 text-xs font-bold text-[#EAA044]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منظومة الخدمات السبع المعتمدة</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white">
              خدماتنا الهندسية والمحاسبية والتراخيص
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              تدقيق مالي ورفع مساحي وإشراف كامل أمام الإدارات الهندسية ولجان البت بالحي.
            </p>
          </div>

          {/* أزرار التحريك السلس للسلايدر على الشاشات */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => scrollSlider('right')}
              className="p-2.5 rounded-xl bg-[#15171E] hover:bg-[#EAA044] text-stone-300 hover:text-stone-950 border border-white/10 hover:border-[#EAA044] transition-all shadow-md active:scale-90"
              aria-label="السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider('left')}
              className="p-2.5 rounded-xl bg-[#15171E] hover:bg-[#EAA044] text-stone-300 hover:text-stone-950 border border-white/10 hover:border-[#EAA044] transition-all shadow-md active:scale-90"
              aria-label="التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* فلاتر التصنيفات الأفقية المدمجة */}
        <div className="reveal delay-100 flex items-center justify-between gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {categoriesWithCounts.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-[#EAA044] text-stone-950 border-[#EAA044] shadow-sm'
                      : 'bg-[#15171E] text-stone-300 hover:text-white border-white/10'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-black/20 text-stone-950' : 'bg-white/5 text-stone-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {onOpenChecklist && (
            <button
              onClick={() => onOpenChecklist()}
              className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 border border-[#EAA044]/40 bg-[#EAA044]/15 hover:bg-[#EAA044]/25 text-[#EAA044] transition-all flex-shrink-0 active:scale-95 shadow-sm"
              title="افتح دليل الأوراق والمستندات التفاعلي لجميع المعاملات"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">دليل المستندات التفاعلي (Checklist)</span>
              <span className="sm:hidden">الأوراق المطلوبة</span>
            </button>
          )}
        </div>

        {/* مسار الكروت الأفقي التفاعلي (One-Screen Responsive Snap Track) */}
        <div 
          ref={sliderRef}
          className="reveal-scale delay-200 flex items-stretch gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="w-[86vw] xs:w-[320px] sm:w-[340px] lg:w-[calc(33.333%-0.9rem)] shrink-0 snap-center bg-[#14161E] rounded-2xl border border-white/10 hover:border-[#EAA044]/60 transition-all duration-300 flex flex-col justify-between p-5 shadow-xl group hover:-translate-y-1"
            >
              {/* رأس الكارت ومعلومات الخدمة */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center group-hover:border-[#EAA044]/40 transition-colors">
                      {SERVICE_ICONS[service.id]}
                    </div>
                    <span className="font-mono text-xs font-bold text-[#EAA044] bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
                      {service.indexCode}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-[#EAA044] bg-[#EAA044]/10 px-2.5 py-1 rounded-lg border border-[#EAA044]/25">
                    {service.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white leading-snug group-hover:text-[#EAA044] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed font-sans line-clamp-2">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-300 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <Clock className="w-3.5 h-3.5 text-[#EAA044]" />
                    <span>{service.durationEstimate}</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 bg-black/30 px-2 py-0.5 rounded border border-white/5">
                    {service.legalCode}
                  </span>
                </div>
              </div>

              {/* أزرار الإجراء السريع بالكارت - سمبل ومباشرة */}
              <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* زر فتح ملف أونلاين */}
                  {onOpenRegister ? (
                    <button
                      onClick={onOpenRegister}
                      className="w-full py-2 px-2.5 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>فتح ملف</span>
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/201207659999?text=${encodeURIComponent(`السلام عليكم مكتب الهيبه، أود فتح ملف لمعاملة: ${service.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-2.5 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>طلب الخدمة</span>
                    </a>
                  )}

                  {/* زر التفاصيل والمستندات (مودال بدون تخريب ارتفاع الشاشة) */}
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="w-full py-2 px-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-stone-200 hover:text-white text-xs font-semibold transition-colors border border-white/10 flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#EAA044]" />
                    <span>المستندات</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* تلميح سفلي للتنقل الأفقي */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-3 px-1">
          <span>اسحب أفقياً أو استخدم الأسهم لاستعراض باقي المعاملات</span>
          <span className="font-mono text-stone-400 font-bold">{filteredServices.length} خدمات متوفرة</span>
        </div>

      </div>

      {/* المودال المنبثق للأوراق والمستندات - يحافظ على سكشن وان سكرين نقي */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#15171E] border border-[#EAA044]/40 rounded-3xl max-w-lg w-full p-6 space-y-5 text-right shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* زر الإغلاق */}
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* رأس المودال */}
            <div className="space-y-1 pr-1">
              <span className="text-[11px] font-bold text-[#EAA044] font-mono">
                {activeModalService.indexCode} • {activeModalService.badge}
              </span>
              <h3 className="font-display font-bold text-xl text-white">
                {activeModalService.title}
              </h3>
              <p className="text-xs text-stone-400">
                {activeModalService.fullDesc}
              </p>
            </div>

            {/* الأوراق المطلوبة */}
            {activeModalService.requiredDocs && activeModalService.requiredDocs.length > 0 && (
              <div className="space-y-2.5 bg-black/30 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-stone-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#EAA044]" />
                    <span>المستندات المطلوبة من العميل:</span>
                  </div>
                  {onOpenChecklist && (
                    <button
                      type="button"
                      onClick={() => {
                        const sid = activeModalService.id;
                        setActiveModalService(null);
                        onOpenChecklist(sid);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#EAA044]/15 hover:bg-[#EAA044]/25 text-[#EAA044] text-[10px] font-bold border border-[#EAA044]/30 flex items-center gap-1 transition-all active:scale-95"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>تجهيز الأوراق (Checklist)</span>
                    </button>
                  )}
                </div>
                <ul className="space-y-1.5 text-stone-300 text-xs pr-2">
                  {activeModalService.requiredDocs.map((doc: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#EAA044] mt-0.5">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ما يستلمه العميل */}
            {activeModalService.deliverables && activeModalService.deliverables.length > 0 && (
              <div className="space-y-2 bg-black/30 p-4 rounded-2xl border border-white/5">
                <div className="font-bold text-xs text-stone-200 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>ما يستلمه العميل من مكتب الهيبه:</span>
                </div>
                <ul className="space-y-1.5 text-stone-300 text-xs pr-2">
                  {activeModalService.deliverables.map((deliv: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* أزرار الإجراء بالمودال */}
            <div className="pt-2 flex items-center gap-2.5">
              {onOpenRegister ? (
                <button
                  onClick={() => {
                    setActiveModalService(null);
                    onOpenRegister();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>فتح ملف لهذه المعاملة أونلاين</span>
                </button>
              ) : (
                <a
                  href={`https://wa.me/201207659999?text=${encodeURIComponent(`السلام عليكم، أود فتح ملف لمعاملة: ${activeModalService.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل واتساب للملف</span>
                </a>
              )}

              <button
                onClick={() => setActiveModalService(null)}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold transition-colors"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
