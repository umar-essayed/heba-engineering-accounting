import React, { useState } from 'react';
import { 
  X, CheckSquare, Square, Printer, MessageCircle, FilePlus, 
  HelpCircle, AlertCircle, Sparkles, CheckCircle2, ChevronRight, FileText
} from 'lucide-react';
import { SERVICES_DATA, OFFICE_INFO } from '../data/mockData';

interface DocChecklistModalProps {
  initialServiceId?: string;
  onClose: () => void;
  onOpenRegister?: () => void;
}

export const DocChecklistModal: React.FC<DocChecklistModalProps> = ({
  initialServiceId,
  onClose,
  onOpenRegister
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || SERVICES_DATA[0]?.id || 'service-1'
  );

  const selectedService = SERVICES_DATA.find(s => s.id === selectedServiceId) || SERVICES_DATA[0];

  // Checked documents state (stored as set of strings)
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (docTitle: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docTitle]: !prev[docTitle]
    }));
  };

  const docs = selectedService.requiredDocs || [
    'صورة بطاقة الرقم القومي لمقدم الطلب (سارية)',
    'سند الملكية أو عقد البيع المشهر أو الابتدائي',
    'إيصال مرافق حديث (كهرباء أو مياه أو غاز)',
    'رسم كروكي وصور فوتوغرافية واضحة للموقع'
  ];

  const checkedCount = docs.filter(d => checkedDocs[d]).length;
  const progressPercent = Math.round((checkedCount / (docs.length || 1)) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleSendToWhatsApp = () => {
    const missingDocs = docs.filter(d => !checkedDocs[d]);
    const text = `السلام عليكم مكتب الهيبه، أنا بجهز أوراق معاملة: ${selectedService.title}.\nالأوراق اللي جهزتها (${checkedCount}/${docs.length}):\n${docs.filter(d => checkedDocs[d]).map(d => `✅ ${d}`).join('\n')}\n\nالأوراق المتبقية:\n${missingDocs.map(d => `⏳ ${d}`).join('\n')}`;
    window.open(`https://wa.me/201207659999?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#14161F] text-white rounded-3xl border border-white/15 p-5 sm:p-7 shadow-2xl space-y-5 my-6 max-h-[92vh] overflow-y-auto print:m-0 print:p-6 print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* الترويسة وأزرار الإغلاق (تختفي عند الطباعة) */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 print:hidden">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[#EAA044]/15 text-[#EAA044]">
                <FileCheckIcon className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-base sm:text-lg text-white">
                دليل المستندات والأوراق المطلوبة التفاعلي
              </h3>
            </div>
            <p className="text-xs text-stone-400">
              اختر نوع المعاملة وعلّم على الأوراق المتاحة معك لتجهيز ملفك قبل زيارة المكتب.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* رأس الورقة الرسمية للطباعة فقط */}
        <div className="hidden print:block border-b-2 border-black pb-4 text-right">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold font-display">مكتب الهيبه للمحاسبة والأعمال الهندسية</h2>
              <p className="text-xs text-stone-700">المحاسب / منصور هيبه — الإسكندرية (مدينة العامرية)</p>
              <p className="text-xs font-mono text-stone-600">هاتف: 01207659999 - 01044744686</p>
            </div>
            <div className="text-left font-mono text-xs">
              <div>كشف استيفاء المستندات</div>
              <div>التاريخ: {new Date().toLocaleDateString('ar-EG')}</div>
            </div>
          </div>
          <div className="mt-3 text-center py-1.5 bg-stone-100 font-bold text-sm border border-stone-300 rounded">
            قائمة المستندات المطلوبة لمعاملة: {selectedService.title}
          </div>
        </div>

        {/* قائمة اختيار نوع المعاملة (تختفي عند الطباعة) */}
        <div className="space-y-1.5 print:hidden">
          <label className="text-stone-300 font-bold text-xs block">
            اختر الخدمة أو المعاملة المراد تجهيز أوراقها:
          </label>
          <select
            value={selectedServiceId}
            onChange={(e) => {
              setSelectedServiceId(e.target.value);
              setCheckedDocs({});
            }}
            className="w-full p-3 rounded-2xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm font-semibold focus:border-[#EAA044] focus:outline-none"
          >
            {SERVICES_DATA.map(s => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.badge})
              </option>
            ))}
          </select>
        </div>

        {/* بطاقة نسبة الجاهزية والتقدم */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-black/50 via-[#181A24] to-black/50 border border-white/10 space-y-2.5 print:border-black print:bg-white">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-200">
              نسبة استيفاء أوراقك الحالية:
            </span>
            <span className="font-mono font-bold text-[#EAA044] text-sm">
              {checkedCount} من {docs.length} مستندات ({progressPercent}%)
            </span>
          </div>

          <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 print:border-black">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent === 100 
                  ? 'bg-emerald-500' 
                  : progressPercent > 50 
                    ? 'bg-gradient-to-r from-[#B8741D] to-[#EAA044]' 
                    : 'bg-[#EAA044]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-[11px] text-stone-400">
            {progressPercent === 100 ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ممتاز! ملفك جاهز بنسبة 100%، يمكنك الآن فتح الملف أونلاين أو التوجه للمكتب مباشرة.
              </span>
            ) : progressPercent > 0 ? (
              <span>متبقي لك <strong>{docs.length - checkedCount}</strong> مستندات لاستكمال ملف المعاملة بالكامل.</span>
            ) : (
              <span>انقر على المربعات أدناه لتحديد الأوراق المتوفرة لديك حالياً.</span>
            )}
          </div>
        </div>

        {/* قائمة فحص المستندات التفاعلية (Checklist) */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-stone-300 flex items-center justify-between">
            <span>المستندات المطلوبة رسمياً:</span>
            <span className="text-[11px] text-stone-400 font-normal">اضغط على الورقة لتحديدها</span>
          </div>

          <div className="space-y-2">
            {docs.map((docItem, idx) => {
              const isChecked = Boolean(checkedDocs[docItem]);

              return (
                <div
                  key={idx}
                  onClick={() => toggleDoc(docItem)}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-stone-100 shadow-sm'
                      : 'bg-black/30 border-white/10 hover:border-white/20 text-stone-300'
                  }`}
                >
                  <div className={`mt-0.5 flex-shrink-0 transition-colors ${
                    isChecked ? 'text-emerald-400' : 'text-stone-500'
                  }`}>
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-0.5 text-xs sm:text-sm flex-grow">
                    <span className={`font-semibold block ${isChecked ? 'line-through text-stone-400' : 'text-stone-100'}`}>
                      {docItem}
                    </span>
                    <span className="text-[11px] text-stone-400 block font-normal">
                      {getDocHint(docItem)}
                    </span>
                  </div>

                  {isChecked && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex-shrink-0 print:hidden">
                      جاهز ✔
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ما يوفره المكتب لك */}
        {selectedService.deliverables && (
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
            <span className="font-bold text-[#EAA044] block">
              ما يتولاه مكتب الهيبه لمعاملتك:
            </span>
            <ul className="space-y-1 text-stone-300 text-[11px]">
              {selectedService.deliverables.map((deliv, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-[#EAA044]">•</span>
                  <span>{deliv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* أزرار الإجراءات (تختفي عند الطباعة) */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-stone-200 font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-all active:scale-95"
              title="طباعة قائمة المستندات"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>طباعة كشف الأوراق</span>
            </button>

            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 transition-all active:scale-95"
              title="مشاركة القائمة عبر واتساب"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>إرسال للواتساب</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenRegister && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#EAA044]/20 transition-all active:scale-95"
              >
                <FilePlus className="w-4 h-4" />
                <span>فتح ملف أونلاين الآن</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white text-xs font-semibold"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper: Tips & hints for common documents
function getDocHint(docTitle: string): string {
  if (docTitle.includes('بطاقة')) {
    return 'أصل وصورة واضحة سارية لكلا الوجهين لصاحب الشأن أو الوكيل بالتوكيل.';
  }
  if (docTitle.includes('الملكية') || docTitle.includes('عقد')) {
    return 'عقد بيع مشهر، أو حكم صحة ونفاذ، أو عقد ابتدائي مؤيد بحيازات وإيصالات.';
  }
  if (docTitle.includes('مرافق') || docTitle.includes('كهرباء')) {
    return 'إيصال كهرباء أو مياه أو ممارسة يثبت تاريخ الإشغال قبل تاريخ المخالفة المحدد.';
  }
  if (docTitle.includes('كروكي') || docTitle.includes('المتغيرات')) {
    return 'يقوم المكتب باستخراجه واعتماده رسمياً مع إحداثيات GPS المعتمدة.';
  }
  if (docTitle.includes('سجل') || docTitle.includes('بطاقة ضريبية')) {
    return 'صورة السجل التجاري والبطاقة الضريبية سارية للأنشطة والمحلات التجارية.';
  }
  return 'يمكن للمكتب مساعدتك في مراجعة وتجهيز هذا المستند بالكامل.';
}

function FileCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
