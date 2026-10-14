import React, { useState } from 'react';
import { 
  ArrowRight, CheckCircle2, MessageCircle, 
  Check, FileCheck, Phone, MapPin, ChevronLeft, ChevronRight,
  HardHat, Store, Compass, Layers, Building2, FileText, Copy
} from 'lucide-react';
import { SERVICES_DATA, OFFICE_INFO } from '../data/mockData';
import { CaseFile, ServiceItem } from '../types';

interface RegistrationPageProps {
  services?: ServiceItem[];
  onBackToHome: () => void;
  onAddNewCase?: (newCase: CaseFile) => void;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  reconciliation_buildings: <FileCheck className="w-4 h-4 text-[#EAA044]" />,
  building_licenses: <HardHat className="w-4 h-4 text-[#EAA044]" />,
  commercial_facilities: <Store className="w-4 h-4 text-[#EAA044]" />,
  land_regularization: <MapPin className="w-4 h-4 text-[#EAA044]" />,
  engineering_drawings: <Compass className="w-4 h-4 text-[#EAA044]" />,
  reconciliation_usage_change: <Layers className="w-4 h-4 text-[#EAA044]" />,
  syndicate_district_supervision: <Building2 className="w-4 h-4 text-[#EAA044]" />
};

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ 
  services = SERVICES_DATA, 
  onBackToHome, 
  onAddNewCase 
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || SERVICES_DATA[0].id);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0] || SERVICES_DATA[0];

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleNextToStep2 = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('يرجى كتابة الاسم ورقم الهاتف للمتابعة');
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    const code = `HB-2026-${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedCode(code);

    if (onAddNewCase) {
      const newCase: CaseFile = {
        id: `case-${Date.now()}`,
        code: code,
        source: 'website',
        clientName: name.trim(),
        clientPhone: phone.trim(),
        category: selectedService.category,
        serviceTitle: selectedService.title,
        propertyAddress: address.trim() || 'العامرية - الإسكندرية',
        district: 'حي العامرية',
        status: 'docs_received',
        statusNotes: notes.trim() || 'طلب حجز واستشارة أونلاين عبر الموقع الإلكتروني — بانتظار فحص المستندات وتحديد الأتعاب.',
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        officeFees: 0, // غير محدد للطلبات الواردة من الموقع
        paidAmount: 0,
        govFees: 0,
        isFullyPaid: false,
        documents: []
      };
      onAddNewCase(newCase);
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const text = `السلام عليكم مكتب الهيبه،
أود تأكيد الحجز:
• كود المعاملة: ${generatedCode}
• الاسم: ${name}
• التليفون: ${phone}
• المعاملة: ${selectedService.title}
• العنوان: ${address || 'العامرية'}`;

    window.open(`https://wa.me/201207659999?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0C0D10] text-stone-100 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 text-right font-sans flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full space-y-6">
        
        {/* شريط أعلى الصفحة: مسافة واضحة ومريحة عن النافبار مع زر العودة والشعار */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#15171E] hover:bg-[#1C1F28] text-stone-300 hover:text-white text-xs font-bold transition-all border border-white/10 shadow-sm active:scale-95"
          >
            <ArrowRight className="w-4 h-4 text-[#EAA044]" />
            <span>العودة للرئيسية</span>
          </button>

          <div className="flex items-center gap-2">
            <img src="/emblem.png" alt="شعار مكتب الهيبه" className="h-6 w-auto object-contain" />
            <span className="font-bold text-sm text-white">مكتب <span className="text-[#EAA044] font-fayonka text-lg">الهيبه</span></span>
          </div>
        </div>

        {!submitted ? (
          <div className="bg-[#14161E] rounded-3xl border border-white/10 p-5 sm:p-7 shadow-2xl space-y-6">
            
            {/* شريط الخطوات التفاعلي (1 إلى 3) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold px-1">
                <span className={currentStep === 1 ? 'text-[#EAA044]' : currentStep > 1 ? 'text-emerald-400' : 'text-stone-500'}>
                  1. نوع المعاملة
                </span>
                <span className={currentStep === 2 ? 'text-[#EAA044]' : currentStep > 2 ? 'text-emerald-400' : 'text-stone-500'}>
                  2. البيانات والعنوان
                </span>
                <span className={currentStep === 3 ? 'text-[#EAA044]' : 'text-stone-500'}>
                  3. تأكيد الحجز
                </span>
              </div>

              {/* شريط التقدم التفاعلي */}
              <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-l from-[#EAA044] to-[#F7B85F] transition-all duration-300 ease-out"
                  style={{
                    width: currentStep === 1 ? '33.3%' : currentStep === 2 ? '66.6%' : '100%'
                  }}
                />
              </div>
            </div>

            {/* محتوى الخطوة 1: اختيار المعاملة */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="font-bold text-base sm:text-lg text-white">اختر نوع المعاملة:</h2>
                  <p className="text-xs text-stone-400">حدد الإجراء المطلوب لفتح الملف بشأنه</p>
                </div>

                <div className="space-y-2">
                  {services.map((s) => {
                    const isSelected = selectedServiceId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedServiceId(s.id)}
                        className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#EAA044]/15 border-[#EAA044] text-white shadow-md'
                            : 'bg-black/30 border-white/5 text-stone-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0">
                            {SERVICE_ICONS[s.id]}
                          </div>
                          <div>
                            <div className={`text-xs font-bold ${isSelected ? 'text-[#EAA044]' : 'text-stone-200'}`}>
                              {s.title}
                            </div>
                            <div className="text-[10px] text-stone-400">
                              {s.badge}
                            </div>
                          </div>
                        </div>

                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-[#EAA044] bg-[#EAA044]' : 'border-stone-600'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleNextToStep2}
                    className="w-full py-3 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <span>التالي: إدخال البيانات</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* محتوى الخطوة 2: الاسم والموبايل والعنوان */}
            {currentStep === 2 && (
              <form onSubmit={handleNextToStep3} className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="font-bold text-base sm:text-lg text-white">بيانات صاحب الشأن:</h2>
                  <p className="text-xs text-stone-400">بيانات التواصل وموقع العقار بالعامرية أو الإسكندرية</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">الاسم بالكامل *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="اسم صاحب العقار أو الموكل"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-[#EAA044] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">رقم الموبايل (واتساب) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-[#EAA044] transition-colors text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">موقع العقار أو المنطقة</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="مثال: العامرية، الناصرية، أو المنطقة التابع لها..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-[#EAA044] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold transition-all border border-white/10 flex items-center gap-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <span>التالي: مراجعة وتأكيد</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* محتوى الخطوة 3: تأكيد الحجز وفتح الملف */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="font-bold text-base sm:text-lg text-white">تأكيد بيانات الحجز:</h2>
                  <p className="text-xs text-stone-400">راجع تفاصيل طلبك قبل إصدار الكود الرسمي</p>
                </div>

                {/* بطاقة ملخص البيانات النظيفة */}
                <div className="bg-black/40 rounded-2xl p-4 border border-white/10 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-stone-400">المعاملة:</span>
                    <span className="font-bold text-[#EAA044]">{selectedService.title}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-stone-400">صاحب الشأن:</span>
                    <span className="font-bold text-white">{name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-stone-400">رقم الهاتف:</span>
                    <span className="font-mono font-bold text-white" dir="ltr">{phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">الموقع:</span>
                    <span className="text-white">{address || 'العامرية، الإسكندرية'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    ملاحظة سريعة <span className="text-stone-500 font-normal">(اختياري)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي توضيح ترغب في إبلاغ الإدارة به..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#EAA044] resize-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold transition-all border border-white/10 flex items-center gap-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex-1 py-3 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>تأكيد الحجز وفتح الملف</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ========================================================
             رسالة النجاح المطلوبة بدقة:
             علامة صح بأنيميشن فقط + وتحتها "تم الحجز" فقط بدون أي لك
             ======================================================== */
          <div className="bg-[#14161E] rounded-3xl border border-[#EAA044]/40 p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-90 duration-300">
            
            {/* علامة صح بأنيميشن فخم */}
            <div className="w-20 h-20 rounded-full bg-[#EAA044]/15 border-2 border-[#EAA044] flex items-center justify-center mx-auto text-[#EAA044] shadow-[0_0_35px_rgba(234,160,68,0.25)] animate-in zoom-in-50 duration-500">
              <Check className="w-10 h-10 animate-in spin-in-180 duration-500" strokeWidth={3} />
            </div>

            {/* تم الحجز والكود مع زر النسخ المباشر */}
            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                تم الحجز
              </h2>
              <div className="inline-flex items-center gap-2 p-2 px-3.5 rounded-xl bg-black/50 border border-[#EAA044]/30 shadow-inner">
                <span className="font-mono text-base sm:text-lg font-bold text-[#EAA044]">
                  {generatedCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white transition-all active:scale-90"
                  title="نسخ كود المعاملة"
                >
                  {copiedCode ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#EAA044]" />
                  )}
                </button>
              </div>
              {copiedCode && (
                <div className="text-[11px] text-emerald-400 font-bold animate-fadeIn">
                  تم نسخ كود المعاملة بنجاح!
                </div>
              )}
            </div>

            {/* الأزرار المباشرة */}
            <div className="space-y-2.5 pt-3 max-w-xs mx-auto">
              <button
                onClick={openWhatsApp}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>متابعة على واتساب</span>
              </button>

              <button
                onClick={onBackToHome}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold transition-colors"
              >
                العودة للرئيسية
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
