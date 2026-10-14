import React, { useRef } from 'react';
import { 
  Building2, MapPin, CheckCircle2, Award, ChevronLeft, ChevronRight, FilePlus, Sparkles 
} from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectsSectionProps {
  projects?: ProjectItem[];
  onOpenRegister?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects = [], onOpenRegister }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // إذا لم تكن هناك أي مشاريع، لا يظهر القسم مطلقاً كما طلب العميل تماماً
  if (!projects || projects.length === 0) {
    return null;
  }

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
      id="projects" 
      className="py-12 sm:py-16 bg-[#0E1015] border-b border-white/10 text-right relative overflow-hidden"
    >
      {/* هالة إضاءة ذهبية خافتة */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#EAA044]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* رأس القسم */}
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAA044]/10 border border-[#EAA044]/30 text-xs font-bold text-[#EAA044]">
              <Award className="w-3.5 h-3.5" />
              <span>أعمال ونماذج منجزة رسمياً</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white">
              معاملات ومشاريع تم إنهاؤها بالمكتب
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              نماذج واقعية لملفات تم تسليم رخصها ونماذجها النهائية للمواطنين تحت إشراف المحاسب منصور هيبه
            </p>
          </div>

          {/* أزرار السلايدر */}
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

        {/* مسار كروت المشاريع (Snap Slider للموبايل والديسكتوب) */}
        <div 
          ref={sliderRef}
          className="reveal-scale delay-100 flex items-stretch gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-[86vw] xs:w-[310px] sm:w-[330px] lg:w-[calc(25%-1.2rem)] shrink-0 snap-center bg-[#14161E] rounded-2xl border border-white/10 hover:border-[#EAA044]/60 transition-all duration-300 p-5 shadow-xl flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-3.5">
                {/* رأس الكارت: التصنيف والسنة */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#EAA044] bg-[#EAA044]/10 px-2.5 py-1 rounded-lg border border-[#EAA044]/25">
                    {project.category}
                  </span>
                  <span className="font-mono text-xs text-stone-400 font-bold bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    {project.year}
                  </span>
                </div>

                {/* عنوان المشروع */}
                <h3 className="font-display font-bold text-sm sm:text-base text-white leading-snug group-hover:text-[#EAA044] transition-colors">
                  {project.title}
                </h3>

                {/* الموقع الجغرافي */}
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-[#EAA044] flex-shrink-0" />
                  <span className="line-clamp-1">{project.location}</span>
                </div>

                {/* النتيجة المعتمدة المتحققة */}
                <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>النتيجة المعتمدة:</span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                    {project.outcome}
                  </p>
                </div>
              </div>

              {/* شارة التوثيق أسفل الكارت */}
              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-[#EAA044] font-semibold">{project.badge}</span>
                <span className="text-stone-500 font-mono text-[10px]">مكتب الهيبه</span>
              </div>
            </div>
          ))}
        </div>

        {/* دعوة للإجراء السريع */}
        {onOpenRegister && (
          <div className="mt-8 text-center">
            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <FilePlus className="w-4 h-4" />
              <span>بدء معاملتك وفتح ملف جديد الآن</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
