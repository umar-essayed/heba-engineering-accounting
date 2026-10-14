import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, FilePlus, ExternalLink } from 'lucide-react';
import { OFFICE_INFO } from '../data/mockData';

interface ContactSectionProps {
  onOpenRegister: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenRegister }) => {
  return (
    <section id="contact" className="py-10 sm:py-14 bg-[#0D0E12] border-b border-white/10 text-right">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* عنوان بسيط وواضح بدون أي فلسفة أو حشو */}
        <div className="reveal text-center max-w-xl mx-auto mb-8 space-y-1.5">
          <h2 className="font-bold text-2xl sm:text-3xl text-white">
            تواصل مع مكتب <span className="text-[#EAA044] font-fayonka">الهيبه</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            يسعدنا استقبالكم في مقر المكتب أو خدمتكم هاتفياً وإلكترونياً
          </p>
        </div>

        {/* 3 كروت مباشرة ومفهومة بنقرة واحدة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          
          {/* كارت 1: العنوان والمقر */}
          <div className="reveal delay-100 bg-[#14161E] rounded-2xl border border-white/10 p-5 flex flex-col justify-between space-y-4 hover:border-[#EAA044]/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[#EAA044]">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#EAA044]" />
                </div>
                <span className="font-bold text-sm text-white">مقر المكتب</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-semibold">
                {OFFICE_INFO.address}
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('الناصرية القديمة العامرية الاسكندرية')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#EAA044] hover:underline font-bold pt-2 border-t border-white/5"
            >
              <span>الاتجاهات على خرائط Google</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* كارت 2: أرقام الهواتف والواتساب */}
          <div className="reveal delay-200 bg-[#14161E] rounded-2xl border border-white/10 p-5 flex flex-col justify-between space-y-4 hover:border-[#EAA044]/40 transition-colors">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-[#EAA044]">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#EAA044]" />
                </div>
                <span className="font-bold text-sm text-white">أرقام الاتصال</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {OFFICE_INFO.phones.map((p, idx) => (
                  <a
                    key={idx}
                    href={`tel:${p.number}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/30 hover:bg-black/50 text-stone-200 hover:text-[#EAA044] border border-white/5 transition-colors"
                    dir="ltr"
                  >
                    <span>{p.display}</span>
                    <Phone className="w-3 h-3 text-[#EAA044]" />
                  </a>
                ))}
              </div>
            </div>

            <a
              href={`https://wa.me/201207659999?text=${encodeURIComponent('السلام عليكم مكتب الهيبه، أود الاستفسار عن معاملة')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>محادثة واتساب فورية</span>
            </a>
          </div>

          {/* كارت 3: مواعيد العمل والتقديم أونلاين */}
          <div className="reveal delay-300 bg-[#14161E] rounded-2xl border border-white/10 p-5 flex flex-col justify-between space-y-4 hover:border-[#EAA044]/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[#EAA044]">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#EAA044]" />
                </div>
                <span className="font-bold text-sm text-white">مواعيد العمل</span>
              </div>

              <div className="text-xs space-y-1 text-stone-300">
                <div className="font-semibold text-white">{OFFICE_INFO.workHours}</div>
                <div className="text-[11px] text-stone-400">الجمعة عطلة أسبوعية للمكتب</div>
              </div>
            </div>

            <button
              onClick={onOpenRegister}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white hover:text-[#EAA044] border border-white/15 hover:border-[#EAA044]/50 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FilePlus className="w-4 h-4 text-[#EAA044]" />
              <span>فتح ملف معاملة أونلاين</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
