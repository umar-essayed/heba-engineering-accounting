import React from 'react';
import { Phone, MapPin, ShieldCheck, Scale, Building2, Calendar } from 'lucide-react';
import { OFFICE_INFO } from '../data/mockData';

export const DirectorProfile: React.FC = () => {
  return (
    <section 
      id="about" 
      className="py-12 sm:py-16 bg-[#0C0D10] border-b border-white/10 text-right"
    >
      {/* ========================================================
          1. عرض الهاتف والتابلت (صورة واضحة بالكامل مع دمج لطيف للأطراف فقط)
         ======================================================== */}
      <div className="lg:hidden flex flex-col justify-center w-full">
        {/* الصورة واضحة بالكامل مع دمج خفيف جداً للأطراف الخارجية فقط */}
        <div className="relative w-full aspect-[16/10] max-h-[320px] overflow-hidden select-none">
          <img
            src="/mansour-office.jpg"
            alt="المحاسب منصور هيبه العزومى في مكتبه"
            className="w-full h-full object-cover object-[center_18%] filter contrast-[1.02] brightness-[0.98]"
          />

          {/* دمج خفيف جداً للأطراف الخارجية فقط (16-20px) دون أن يأكل الصورة أبداً */}
          <div className="absolute top-0 inset-x-0 h-4 sm:h-5 bg-gradient-to-b from-[#0C0D10] to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-5 sm:h-6 bg-gradient-to-t from-[#0C0D10] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-4 sm:w-5 bg-gradient-to-r from-[#0C0D10] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-4 sm:w-5 bg-gradient-to-l from-[#0C0D10] to-transparent pointer-events-none" />
        </div>

        {/* النص تحت الصورة مباشرة للهاتف */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 w-full mt-4 space-y-4">
          {/* شارة الختم الرسمي */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#EAA044]/30 text-xs font-bold text-[#EAA044] shadow-md">
              <div className="w-4 h-4 rounded-full overflow-hidden border border-[#EAA044] flex-shrink-0">
                <img src="/mansour-seal.jpg" alt="ختم مكتب الهيبه" className="w-full h-full object-cover" />
              </div>
              <span>المسؤولية والاعتماد المهني المباشر</span>
            </div>
          </div>

          {/* الاسم والصفة */}
          <div className="space-y-1">
            <h2 className="font-bold text-2xl xs:text-3xl text-white leading-tight">
              المحاسب / منصور <span className="text-[#EAA044] font-fayonka font-bold inline-block pr-1 text-[1.22em] drop-shadow-sm">هيبه</span> العزومى
            </h2>
            <p className="text-xs sm:text-sm text-[#EAA044] font-semibold">
              صاحب ومدير مكتب <span className="font-fayonka font-bold text-sm sm:text-lg">الهيبه</span> للمحاسبة والأعمال الهندسية
            </p>
          </div>

          {/* التعهد المهني الصريح */}
          <div className="border-r-4 border-[#EAA044] pr-3.5 py-1.5 bg-white/[0.02] rounded-l-xl">
            <p className="font-display font-medium text-xs sm:text-sm text-stone-200 leading-relaxed">
              "المسؤولية عندنا تبدأ من التدقيق المالي لحمايتك من الرسوم الجزافية، وتستمر ميدانياً في الأحياء ولجان البت حتى تسليم رخصتك أو نموذجك المعتمد في يدك."
            </p>
          </div>

          {/* الركائز الثلاث */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-stone-300">
            <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#EAA044]" />
              <span>تدقيق مالي لجدية التصالح</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#EAA044]" />
              <span>مخططات ورفع مساحي معتمد</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EAA044]" />
              <span>متابعة لجان البت بالأحياء</span>
            </div>
          </div>

          {/* أزرار الإجراء السريع للموبايل */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/201207659999?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D8%B3%D8%A8%20%D9%85%D9%86%D8%B5%D9%88%D8%B1%20%D9%87%D9%8A%D8%A8%D9%87%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AD%D8%AC%D8%B2%20%D9%85%D9%88%D8%B9%D8%AF%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D8%A8%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>حجز موعد استشارة مع المدير</span>
              </a>

              <a
                href="tel:01207659999"
                className="py-2.5 px-3 rounded-xl bg-white/5 text-stone-200 border border-white/10 font-mono text-xs font-bold flex items-center gap-1.5"
                dir="ltr"
              >
                <Phone className="w-3.5 h-3.5 text-[#EAA044]" />
                <span>01207659999</span>
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#EAA044] flex-shrink-0" />
              <span>المقر: {OFFICE_INFO.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. عرض الكمبيوتر (صورة واضحة المعالم مع دمج خفيف للأطراف فقط)
         ======================================================== */}
      <div className="hidden lg:grid grid-cols-12 items-center gap-10 xl:gap-14 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        
        {/* الجانب الأيمن (النص والبيانات والأزرار للكمبيوتر) */}
        <div className="reveal-right col-span-7 space-y-5">
          
          {/* شارة الختم الرسمي */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#EAA044]/35 text-xs font-bold text-[#EAA044] shadow-lg">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-[#EAA044] flex-shrink-0">
              <img src="/mansour-seal.jpg" alt="ختم مكتب الهيبه" className="w-full h-full object-cover" />
            </div>
            <span>المسؤولية والاعتماد المهني المباشر</span>
          </div>

          {/* الاسم الكامل واللقب */}
          <div className="space-y-1.5">
            <h2 className="font-bold text-3xl xl:text-5xl text-white leading-tight tracking-tight">
              المحاسب / منصور <span className="text-[#EAA044] font-fayonka font-bold inline-block pr-1 text-[1.22em] drop-shadow-sm">هيبه</span>
              <span className="block text-2xl xl:text-3xl text-stone-200 font-semibold mt-1">
                العزومى
              </span>
            </h2>
            <p className="text-base text-[#EAA044] font-bold">
              صاحب ومدير مكتب <span className="font-fayonka font-bold text-xl">الهيبه</span> للمحاسبة والأعمال الهندسية
            </p>
          </div>

          {/* التعهد المهني التنفيذي الصريح */}
          <div className="border-r-4 border-[#EAA044] pr-4 py-2.5 bg-white/[0.02] rounded-l-2xl border-y border-l border-white/5">
            <p className="font-display font-medium text-base text-stone-200 leading-relaxed">
              "المسؤولية عندنا تبدأ من التدقيق المالي لحمايتك من الرسوم الجزافية، وتستمر ميدانياً في الأحياء ولجان البت حتى تسليم رخصتك أو نموذجك المعتمد في يدك."
            </p>
          </div>

          {/* الركائز الثلاث بأناقة وتنسيق أفقي */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <Scale className="w-4 h-4 text-[#EAA044]" />
              <div className="font-bold text-xs text-white">تدقيق مالي</div>
              <p className="text-[11px] text-stone-400">حساب دقيق لجدية التصالح ورسوم التراخيص.</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <Building2 className="w-4 h-4 text-[#EAA044]" />
              <div className="font-bold text-xs text-white">اعتماد هندسي</div>
              <p className="text-[11px] text-stone-400">مخططات معمارية وإنشائية ورفع مساحي معتمد.</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#EAA044]" />
              <div className="font-bold text-xs text-white">لجان البت</div>
              <p className="text-[11px] text-stone-400">تمثيل كامل ومتابعة بالأحياء حتى استلام الورق.</p>
            </div>
          </div>

          {/* أزرار الإجراء السريع وبيانات الاتصال */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/201207659999?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D8%B3%D8%A8%20%D9%85%D9%86%D8%B5%D9%88%D8%B1%20%D9%87%D9%8A%D8%A8%D9%87%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AD%D8%AC%D8%B2%20%D9%85%D9%88%D8%B9%D8%AF%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D8%A8%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>حجز موعد استشارة مع المدير</span>
              </a>

              <a
                href="tel:01207659999"
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 font-mono text-xs font-bold flex items-center gap-2 transition-colors"
                dir="ltr"
              >
                <Phone className="w-3.5 h-3.5 text-[#EAA044]" />
                <span>01207659999</span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <MapPin className="w-4 h-4 text-[#EAA044] flex-shrink-0" />
              <span>{OFFICE_INFO.address}</span>
            </div>
          </div>

        </div>

        {/* الجانب الأيسر: صورة المحاسب واضحة بالكامل مع دمج حواف خفيف جداً */}
        <div className="reveal-left delay-100 col-span-5 relative aspect-[4/3] max-h-[420px] rounded-2xl overflow-hidden select-none">
          <img
            src="/mansour-office.jpg"
            alt="المحاسب منصور هيبه العزومى في مكتبه"
            className="w-full h-full object-cover object-[center_18%] filter contrast-[1.02] brightness-[0.98]"
          />

          {/* دمج أطراف خفيف جداً (16-20px) فقط حتى لا يكون هناك حد قاطع، بدون أكل أي جزء من ملامح الصورة */}
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#0C0D10] to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-[#0C0D10] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#0C0D10] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#0C0D10] to-transparent pointer-events-none" />
        </div>

      </div>

    </section>
  );
};
