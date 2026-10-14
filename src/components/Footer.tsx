import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ArrowUp } from 'lucide-react';
import { OFFICE_INFO, SERVICES_DATA } from '../data/mockData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0C0D10] text-stone-400 pt-14 pb-8 border-t border-white/10 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          
          {/* العمود الأول: الهوية */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/emblem.png" alt="شعار مكتب الهيبه" className="h-10 w-auto object-contain" />
              <div>
                <div className="font-bold text-lg text-white">
                  مكتب <span className="text-[#EAA044] font-fayonka font-bold text-xl">الهيبه</span>
                </div>
                <div className="text-xs text-stone-400">للمحاسبة والأعمال الهندسية</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              إدارة <strong>المحاسب / منصور هيبه</strong> — شريكك المعتمد لإنهاء ملفات التصالح وتراخيص البناء وتشغيل المحلات وتقنين الأراضي بمدينة العامرية وكافة أحياء الإسكندرية.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#EAA044] font-medium">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{OFFICE_INFO.address}</span>
            </div>
          </div>

          {/* العمود الثاني: الخدمات السبعة */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-sm text-white">الخدمات المعتمدة:</h4>
            <ul className="space-y-1.5 text-xs">
              {SERVICES_DATA.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-[#EAA044] transition-colors">
                    • {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الثالث: الهواتف والمواعيد */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-white">اتصل بنا مباشرة:</h4>
            
            <div className="space-y-2 text-xs">
              <div className="space-y-1 font-mono" dir="ltr">
                {OFFICE_INFO.phones.map((p, idx) => (
                  <div key={idx}>
                    <a href={`tel:${p.number}`} className="text-stone-200 hover:text-[#EAA044] font-bold">
                      {p.display}
                    </a>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-stone-400 text-[11px]">
                {OFFICE_INFO.workHours}
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/201207659999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>محادثة واتساب</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* الحقوق وزر العودة لأعلى */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} مكتب الهيبه — المحاسب منصور هيبه (مدينة العامرية، الإسكندرية).
          </div>

          <button
            onClick={scrollToTop}
            className="text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>أعلى الصفحة</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
