import React, { useState } from 'react';
import { Search, CheckCircle2, Building, MessageCircle, AlertCircle, Clock } from 'lucide-react';
import { CaseFile, CaseStatus } from '../types';

interface LiveTrackerProps {
  cases: CaseFile[];
}

const STAGES: { key: CaseStatus; name: string; desc: string }[] = [
  { key: 'docs_received', name: 'استلام الأوراق', desc: 'مراجعة المستندات والعقود وفتح الملف الرسمي بالمكتب.' },
  { key: 'surveying', name: 'الرفع المساحي', desc: 'معاينة الموقع ورفع الإحداثيات بأجهزة الـ GPS المعتمدة.' },
  { key: 'drawings_prep', name: 'الرسومات الهندسية', desc: 'إعداد اللوحات المعمارية والإنشائية وتقرير السلامة.' },
  { key: 'submitted_gov', name: 'التقديم بالحي', desc: 'إيداع الملف برئاسة الحي واستخراج نموذج (3) لوقف الإجراءات.' },
  { key: 'committee_review', name: 'لجنة البت', desc: 'فحص الملف أمام اللجنة الفنية لحساب قيمة التصالح والرسوم.' },
  { key: 'approved_issued', name: 'صدور الرخصة / النموذج', desc: 'تسليم العميل نموذج (8) النهائي أو أصل الرخصة الرسمية.' }
];

export const LiveTracker: React.FC<LiveTrackerProps> = ({ cases }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CaseFile | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    setSearched(true);

    if (!q) {
      setResult(null);
      return;
    }

    const match = cases.find(c =>
      c.code.toLowerCase() === q ||
      c.clientPhone.replace(/\s+/g, '') === q.replace(/\s+/g, '') ||
      c.clientName.toLowerCase().includes(q)
    );

    setResult(match || null);
  };

  const getStageIndex = (status: CaseStatus) => {
    return STAGES.findIndex(s => s.key === status);
  };

  return (
    <section id="tracker" className="py-12 sm:py-16 bg-[#0C0D10] border-b border-white/10 text-right">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* رأس القسم */}
        <div className="reveal text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAA044]/10 border border-[#EAA044]/30 text-xs font-bold text-[#EAA044]">
            <Clock className="w-3.5 h-3.5" />
            <span>المنظومة الرقمية للاستعلام • مكتب الهيبه</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
            متابعة موقف ملفك بالحي
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            أدخل رقم الهاتف المسجل لدى المكتب أو كود المعاملة لمعرفة الموقف التنفيذي وموعد اللجان.
          </p>
        </div>

        {/* صندوق البحث الحديث */}
        <div className="reveal-scale delay-100 bg-[#15171E] p-2.5 sm:p-3.5 rounded-2xl border border-white/15 shadow-2xl flex flex-col sm:flex-row gap-2.5 items-center">
          <div className="relative w-full">
            <Search className="w-5 h-5 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="اكتب رقم هاتفك المسجل أو كود ملفك..."
              className="w-full pl-4 pr-11 py-3 bg-black/60 text-white rounded-xl text-xs sm:text-sm border border-white/10 focus:outline-none focus:border-[#EAA044] placeholder:text-stone-500 transition-colors"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-md active:scale-95"
          >
            استعلام فوري
          </button>
        </div>

        {/* في حالة عدم وجود نتيجة */}
        {searched && !result && (
          <div className="mt-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs sm:text-sm text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>لم نعثر على ملف مسجل بهذا الرقم. يرجى مراجعة رقم الهاتف أو التواصل مع إدارة مكتب الهيبه مباشرة.</span>
          </div>
        )}

        {/* نتيجة البحث */}
        {result && (
          <div className="mt-8 bg-[#15171E] rounded-3xl border border-[#EAA044]/50 p-5 sm:p-8 shadow-2xl space-y-6 text-right animate-in fade-in zoom-in-95">
            
            {/* بيانات الملف */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/10">
              <div>
                <span className="font-mono text-xs font-bold text-black bg-[#EAA044] px-2.5 py-1 rounded-md">
                  كود الملف: {result.code}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-2">
                  {result.clientName}
                </h3>
                <p className="text-xs sm:text-sm text-[#EAA044] mt-0.5">
                  نوع المعاملة: <strong className="text-white">{result.serviceTitle}</strong>
                </p>
              </div>

              <div className="bg-black/50 p-3 rounded-xl border border-white/10 text-xs text-stone-400">
                <div className="flex items-center gap-1.5 font-bold text-stone-200 mb-0.5">
                  <Building className="w-4 h-4 text-[#EAA044]" />
                  <span>{result.district}</span>
                </div>
                <div>{result.propertyAddress}</div>
              </div>
            </div>

            {/* مراحل سير المعاملة */}
            <div className="space-y-3">
              <div className="font-bold text-xs text-stone-300">مراحل إنجاز المعاملة بالحي ولجان البت:</div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {STAGES.map((stg, idx) => {
                  const currentIdx = getStageIndex(result.status);
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={stg.key}
                      className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                        isCurrent
                          ? 'bg-[#EAA044]/15 border-[#EAA044] text-[#EAA044] font-bold shadow-lg'
                          : isDone
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300 font-semibold'
                          : 'bg-black/30 border-white/5 text-stone-500'
                      }`}
                    >
                      <div className="text-[10px] font-mono mb-0.5">مرحلة {idx + 1}</div>
                      <div className="line-clamp-1">{stg.name}</div>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 mx-auto mt-1 text-emerald-400" />}
                      {isCurrent && <span className="inline-block w-2 h-2 rounded-full bg-[#EAA044] mt-1 animate-pulse" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* موقف المكتب الحالي */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-stone-300 space-y-1">
              <strong className="text-[#EAA044] block font-bold">الموقف الإجرائي الحالي:</strong>
              <p className="leading-relaxed">{result.statusNotes}</p>
            </div>

            {/* الموقف المالي وزر التواصل */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>الأتعاب: <strong className="text-white">{result.officeFees && result.officeFees > 0 ? `${result.officeFees.toLocaleString()} ج.م` : 'غير محدد'}</strong></div>
                <div>المدفوع: <strong className="text-emerald-400">{(result.paidAmount || 0).toLocaleString()} ج.م</strong></div>
                <div>المتبقي: <strong className="text-amber-400">{result.officeFees && result.officeFees > 0 ? `${Math.max(0, result.officeFees - (result.paidAmount || 0)).toLocaleString()} ج.م` : 'غير محدد'}</strong></div>
              </div>

              <a
                href={`https://wa.me/201207659999?text=${encodeURIComponent(`السلام عليكم مكتب الهيبه، بخصوص المعاملة كود ${result.code} باسم ${result.clientName}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>استفسار واتساب عن الملف</span>
              </a>
            </div>

          </div>
        )}


      </div>
    </section>
  );
};
