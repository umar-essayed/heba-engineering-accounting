import React, { useState } from 'react';
import { Calculator, CheckSquare, ArrowRight, MessageCircle, AlertTriangle, FileCheck, Layers } from 'lucide-react';
import { SERVICES_DATA, OFFICE_INFO } from '../data/mockData';

export const DiagnosticMatrix: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState(SERVICES_DATA[0].id);
  const [locationType, setLocationType] = useState<'city' | 'village' | 'industrial' | 'new_city'>('city');
  const [violationType, setViolationType] = useState<string>('overhang');

  const selectedService = SERVICES_DATA.find(s => s.id === selectedServiceId) || SERVICES_DATA[0];

  const generateWhatsAppInquiry = () => {
    const locNames = {
      city: 'داخل المدينة / الحي القديم',
      village: 'داخل القرى والتوابع',
      industrial: 'منطقة صناعية / استثمارية',
      new_city: 'مدينة جديدة / هيئة المجتمعات العمرانية'
    };

    const text = `السلام عليكم ورحمة الله،
أود الاستفسار من مكتب الهيبه (الأستاذ منصور هيبه) بشأن:
- نوع المعاملة: ${selectedService.title}
- الموقع: ${locNames[locationType]}
- كود الخدمة: ${selectedService.legalCode}
يرجى إفادتي بقيمة أتعاب المكتب التقديرية وموعد أقرب معاينة.`;

    return `https://wa.me/${OFFICE_INFO.phones[0].whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="calculator" className="py-20 bg-surface-darkCard border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس القسم */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-xs font-mono text-brand-primary">
            <Calculator className="w-3.5 h-3.5" />
            DIAGNOSTIC INTAKE MATRIX • فاحص الموقف وحاسبة المستندات
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
            فحص أولي لمتطلبات معاملتك قبل التقديم بالحي
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            اختر نوع الإجراء وموقع العقار لمعرفة الأوراق الدقيقة والمستندات الإلزامية التي يجهزها لك المكتب لتفادي رفض الملف أو تأخير اللجان.
          </p>
        </div>

        {/* جسم الأداة التفاعلية */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden glass-panel-glow p-6 sm:p-10 border border-brand-primary/40">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* الجانب الأيمن: محددات الخيارات */}
            <div className="lg:col-span-6 space-y-6 text-right">
              
              {/* الخطوة 1: اختيار الخدمة */}
              <div>
                <label className="block text-xs font-mono font-bold text-brand-primary mb-2">
                  01 • اختر نوع المعاملة أو الخدمة المطلوبة:
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-black/60 border border-stone-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-primary font-sans transition-colors"
                >
                  {SERVICES_DATA.map((srv) => (
                    <option key={srv.id} value={srv.id} className="bg-stone-900 text-white">
                      {srv.indexCode} - {srv.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* الخطوة 2: النطاق الجغرافي / نوع الولاية */}
              <div>
                <label className="block text-xs font-mono font-bold text-brand-primary mb-2">
                  02 • النطاق الجغرافي والولاية التابع لها العقار:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'city', label: 'أحياء ومراكز المدن' },
                    { id: 'village', label: 'قرى وتوابع وريف' },
                    { id: 'industrial', label: 'منطقة صناعية / ورش' },
                    { id: 'new_city', label: 'هيئة المجتمعات الجديدة' }
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setLocationType(loc.id as any)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-right ${
                        locationType === loc.id
                          ? 'bg-brand-primary text-black border-brand-primary shadow-md shadow-brand-primary/20'
                          : 'bg-black/40 text-stone-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* بطاقة توجيهية خاصة بالقانون المنظم */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1.5">
                <div className="font-bold text-stone-200 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-brand-primary" />
                  السند التشريعي المعتمد:
                </div>
                <div className="text-brand-primary font-mono font-bold">{selectedService.legalCode}</div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  يتم إعداد الملف ومراجعته من خلال استشاريين معتمدين بنقابة المهندسين ومحاسبين قانونيين لضمان التوافق التام.
                </p>
              </div>

            </div>

            {/* الجانب الأيسر: مخرجات الفحص والمستندات المطلوبة فوراً */}
            <div className="lg:col-span-6 flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-black/60 border border-white/10 text-right space-y-6">
              
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <span className="font-display font-bold text-base text-white">
                    قائمة المستندات الإلزامية
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                    مراجعة فورية
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedService.requiredDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-300">
                      <CheckSquare className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* زر التواصل المحسوب */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                  <span>المدة المقدرة للإنجاز:</span>
                  <span className="text-white font-bold">{selectedService.durationEstimate}</span>
                </div>

                <a
                  href={generateWhatsAppInquiry()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>إرسال هذه البيانات للأستاذ منصور هيبه عبر واتساب</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
