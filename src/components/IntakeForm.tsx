import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Phone, MapPin, Building, MessageSquare, Copy, Check } from 'lucide-react';
import { SERVICES_DATA, OFFICE_INFO } from '../data/mockData';
import { CaseFile } from '../types';

interface IntakeFormProps {
  onAddNewCase: (newCase: CaseFile) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onAddNewCase }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [serviceCategory, setServiceCategory] = useState(SERVICES_DATA[0].category);
  const [propertyAddress, setPropertyAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !propertyAddress) {
      alert('برجاء استيفاء البيانات الأساسية (الاسم، الهاتف، وعنوان العقار)');
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `HB-2026-${randomNum}`;
    setGeneratedCode(code);

    const selectedService = SERVICES_DATA.find(s => s.category === serviceCategory) || SERVICES_DATA[0];

    const newCase: CaseFile = {
      id: `case-${Date.now()}`,
      code: code,
      clientName: fullName,
      clientPhone: phone,
      nationalId: nationalId || undefined,
      category: serviceCategory,
      serviceTitle: selectedService.title,
      propertyAddress: propertyAddress,
      district: district || 'حي العامرية',
      status: 'docs_received',
      statusNotes: 'تم تسجيل طلب فتح الملف مبدئياً عبر المنصة الإلكترونية، وجاري تواصل فريق العمل لتحديد موعد المعاينة واستلام أصول المستندات.',
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      officeFees: 15000,
      paidAmount: 0,
      govFees: 0,
      isFullyPaid: false,
      documents: []
    };

    onAddNewCase(newCase);
    setIsSubmitted(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const openWhatsAppConfirmation = () => {
    const text = `السلام عليكم مكتب الهيبه (الأستاذ منصور هيبه العزومى)،
قمت بتسجيل طلب فتح ملف جديد على الموقع:
- كود الملف المسجل: ${generatedCode}
- الاسم: ${fullName}
- التليفون: ${phone}
- نوع الخدمة: ${serviceCategory}
- العنوان: ${propertyAddress} (${district})
أرجو تأكيد موعد المعاينة البدائية والتنسيق مع المكتب.`;

    window.open(`https://wa.me/${OFFICE_INFO.phones[0].whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="intake" className="py-20 sm:py-28 bg-surface-dark relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-xs font-mono text-brand-primary">
            <ShieldCheck className="w-3.5 h-3.5" />
            DIRECT CLIENT REGISTRATION • فتح ملف واستشارة هندسية
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
            احجز موعد معاينة أو افتح ملف معاملتك الآن
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            سجل بياناتك وموقع العقار ليقوم الأستاذ منصور هيبه أو مهندس المكتب بالاتصال بك وتحديد موعد المعاينة الميدانية وإعداد الملف فوراً.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 space-y-6 text-right">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* الاسم بالكامل */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    الاسم ثلاثي أو رباعي <span className="text-brand-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: أحمد عبد الله محمود"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-stone-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-primary font-sans"
                  />
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    رقم الهاتف (موبايل وواتساب) <span className="text-brand-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 01012345678"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-stone-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-primary font-sans"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* الرقم القومي (اختياري) */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    الرقم القومي (اختياري لربط الملف الحكومي)
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="14 رقم من بطاقة المالك"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-stone-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-primary font-mono"
                    dir="ltr"
                  />
                </div>

                {/* نوع الخدمة */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    نوع الخدمة أو المعاملة <span className="text-brand-primary">*</span>
                  </label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-stone-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-primary font-sans"
                  >
                    {SERVICES_DATA.map((s) => (
                      <option key={s.id} value={s.category} className="bg-stone-900">
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* الحي المختص */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    الحي المختص
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="مثال: حي العجمي، برج العرب، المنتزه..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-stone-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-primary font-sans"
                  />
                </div>

                {/* عنوان العقار أو قطعة الأرض */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-2">
                    عنوان العقار بالتفصيل أو رقم القطعة <span className="text-brand-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="رقم العقار، اسم الشارع، وأقرب علامة مميزة"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-stone-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-primary font-sans"
                  />
                </div>
              </div>

              {/* ملاحظات أو تفاصيل الحالة */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-2">
                  تفاصيل إضافية عن المخالفة أو النشاط
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: دور سادس بدون ترخيص، مطلوب رخصة تشغيل ورشة، تقنين أرض مساحة 300 متر..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-stone-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-primary font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-black font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/25 transition-all active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الطلب وإصدار كود المعاملة الفوري</span>
              </button>

            </form>
          ) : (
            <div className="rounded-3xl glass-panel-glow p-8 sm:p-12 border border-brand-primary text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-brand-primary/20 border border-brand-primary mx-auto flex items-center justify-center text-brand-primary">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-2xl text-white">
                  تم تسجيل ملف معاملتك بنجاح في مكتب الهيبه!
                </h3>
                <p className="text-stone-300 text-sm max-w-lg mx-auto">
                  تم إدراج المعاملة في النظام الداخلي للمكتب، وبإمكانك الآن تتبع حالتها في أي وقت باستخدام كود الملف:
                </p>
              </div>

              {/* كود الملف المصدر */}
              <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-black/80 border border-brand-primary/60">
                <span className="font-mono font-bold text-xl sm:text-2xl text-brand-primary tracking-widest">
                  {generatedCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-colors"
                  title="نسخ الكود"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={openWhatsAppConfirmation}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>تأكيد الموعد مع الأستاذ منصور هيبه عبر واتساب</span>
                </button>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-bold transition-colors"
                >
                  تسجيل طلب آخر
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
