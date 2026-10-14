import React from 'react';
import { Phone, MessageCircle, MapPin, Search, CheckCircle2, ShieldCheck, FilePlus } from 'lucide-react';
import { OFFICE_INFO } from '../data/mockData';

interface HeroProps {
  onOpenTracker: () => void;
  onOpenContact: () => void;
  onOpenRegister?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTracker, onOpenContact, onOpenRegister }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20 sm:pt-24 pb-16 sm:pb-20">
      
      {/* صورة المكتب الحقيقية مع تمويه خفيف لعمق واقعي */}
      <img
        src="/hero-bg.jpg"
        alt="مكتب المحاسب منصور هيبه"
        className="absolute inset-0 w-full h-full object-cover object-center filter blur-[1.5px] scale-105 transform pointer-events-none"
      />

      {/* التظليل المتدرج لحماية قراءة النصوص */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/60 sm:to-black/50" />
      <div className="absolute inset-0 bg-black/30" />

      {/* التذويب اللوني السفلي الذي يدمج الهيرو بسلاسة مطلقة مع القسم التالي */}
      <div className="absolute bottom-0 inset-x-0 h-44 sm:h-64 bg-gradient-to-t from-[#0C0D10] via-[#0C0D10]/85 to-transparent pointer-events-none z-10" />

      {/* محتوى الهيرو المتجاوب بالكامل مع الموبايل والشاشات الكبيرة */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl text-right space-y-5 sm:space-y-6">
          
          {/* شارة المقر الرسمي الدقيق */}
          <div className="reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15171E]/90 backdrop-blur-md border border-[#EAA044]/40 text-xs text-stone-200 font-sans shadow-md">
            <MapPin className="w-4 h-4 text-[#EAA044] flex-shrink-0" />
            <span className="font-semibold">{OFFICE_INFO.address}</span>
          </div>

          {/* العنوان الرئيسي واسم المكتب والمدير */}
          <div className="reveal delay-100 space-y-2">
            <h1 className="font-bold text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.25] tracking-tight">
              <span>مكتب</span> <span className="text-[#EAA044] font-fayonka font-bold inline-block pr-1 text-[1.22em] drop-shadow-sm">الهيبه</span>
              <span className="block text-2xl xs:text-3xl sm:text-4xl text-stone-100 font-medium mt-1 font-sans">
                للمحاسبة والأعمال الهندسية
              </span>
            </h1>
            
            <div className="flex items-center gap-2 text-base sm:text-2xl text-stone-200 pt-1">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#EAA044] flex-shrink-0" />
              <span>إدارة: <strong className="text-[#EAA044] font-fayonka text-lg sm:text-2xl">المحاسب / منصور هيبه</strong></span>
            </div>
          </div>

          {/* الوصف المباشر والمفهوم بدون حشو */}
          <p className="reveal delay-200 text-xs sm:text-base md:text-lg text-stone-200 leading-relaxed font-sans max-w-2xl">
            شريكك المعتمد لإنهاء ملفات <strong>التصالح في مخالفات البناء</strong>، <strong>تراخيص البناء والهدم والتشطيب</strong>، <strong>رخص تشغيل المحلات والمنشآت التجارية</strong>، و<strong>تقنين أراضي الدولة</strong> أمام الإدارات الهندسية ولجان البت بالحي.
          </p>

          {/* أزرار الإجراءات - هوية بصرية موحدة ومنضبطة بدون تشتت ألوان */}
          <div className="reveal delay-200 space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* الزر الرئيسي - فتح ملف إلكتروني في الصفحة المنفصلة */}
              <button
                onClick={onOpenRegister}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-sm sm:text-base shadow-lg shadow-[#EAA044]/20 transition-all active:scale-95"
              >
                <FilePlus className="w-5 h-5 flex-shrink-0" />
                <span>فتح ملف معاملة جديد أونلاين</span>
              </button>

              {/* الزر الثانوي - أسود فاخر بحدود ذهبية متناسقة */}
              <button
                onClick={onOpenTracker}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#15171E]/90 hover:bg-[#1C1F28] text-stone-100 border border-[#EAA044]/50 hover:border-[#EAA044] font-bold text-sm sm:text-base transition-all active:scale-95 shadow-md"
              >
                <Search className="w-4 h-4 text-[#EAA044] flex-shrink-0" />
                <span>تتبع حالة معاملتك بالرقم</span>
              </button>
            </div>

            {/* شريط الاتصال السريع */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-300">
              <span className="text-stone-400">للاتصال الهاتفي المباشر:</span>
              <a
                href="tel:01207659999"
                className="font-mono font-bold text-stone-200 hover:text-[#EAA044] transition-colors inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10"
                dir="ltr"
              >
                <Phone className="w-3 h-3 text-[#EAA044]" />
                <span>01207659999</span>
              </a>
              <a
                href="tel:01044744686"
                className="font-mono font-bold text-stone-200 hover:text-[#EAA044] transition-colors inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10"
                dir="ltr"
              >
                <Phone className="w-3 h-3 text-[#EAA044]" />
                <span>01044744686</span>
              </a>
            </div>
          </div>

          {/* شريط الميزات السريعة أسفل الهيرو */}
          <div className="reveal delay-300 pt-5 sm:pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-stone-200 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#EAA044] flex-shrink-0" />
              <span>مصالحات مباني ونموذج 8</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#EAA044] flex-shrink-0" />
              <span>رخص تشغيل محلات قانون 154</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#EAA044] flex-shrink-0" />
              <span>تقنين أراضي أملاك الدولة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#EAA044] flex-shrink-0" />
              <span>رسومات معتمدة بنقابة المهندسين</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
