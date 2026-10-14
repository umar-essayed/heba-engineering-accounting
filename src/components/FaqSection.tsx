import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, ChevronDown, Search, CheckCircle2, MessageCircle, 
  Sparkles, ShieldCheck, FileText, Building2, Store, DollarSign 
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'reconciliation' | 'licenses' | 'commercial' | 'fees_tracking';
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_DATA: FaqItem[] = [
  // 1. التصالح في مخالفات البناء
  {
    id: 'faq-rec-1',
    category: 'reconciliation',
    question: 'ما هي أهم المستندات المطلوبة للتقديم على التصالح في القانون الجديد (قانون 187)؟',
    answer: 'المستندات الأساسية تشمل: صورة بطاقة الرقم القومي لمقدم الطلب، سند الملكية أو عقد البيع المشهر (أو عقد البيع الابتدائي المؤيد بالمستندات)، إيصال مرافق (كهرباء أو مياه أو غاز) يثبت تاريخ ارتكاب المخالفة قبل التصوير الجوي المحدد، رسم كروكي للموقع، وتقرير السلامة الإنشائية المعتمد من مهندس نقابي يقوم مكتب الهيبه بإعداده واعتماده رسمياً.',
    highlight: 'يقوم مكتب الهيبه بإعداد التقرير الإنشائي والرسومات الهندسية المعتمدة بالكامل.'
  },
  {
    id: 'faq-rec-2',
    category: 'reconciliation',
    question: 'ما هو الفرق بين نموذج 7 ونموذج 8 في التصالح؟',
    answer: 'نموذج (7) هو إخطار رسمي صادر من لجان البت الفنية يفيد بقبول طلب التصالح مبدئياً وتحديد قيمة مقابل التصالح المقررة للأمتار المخالفة. أما نموذج (8) النهائي فهو بمثابة رخصة بناء رسمية وشهادة براءة نهائية لكل القضايا والأحكام الصادرة للمبنى المخالف، ويتيح إدخال المرافق الرسمية واستكمال أعمال التشطيب وصب الأسقف.',
    highlight: 'نموذج 8 النهائي هو السند القانوني الأقوى لحماية عقارك وتوصيل المرافق الرسمية.'
  },
  {
    id: 'faq-rec-3',
    category: 'reconciliation',
    question: 'هل يمكن التصالح على المباني الواقعة خارج الحيز العمراني بالعامرية؟',
    answer: 'نعم، أتاح القانون الجديد التصالح للكتل المبنية القريبة من الأحوزة العمرانية للقرى وتوابعها والمدن بالعامرية، والمشغولة بالنشاط السكني أو غير السكني، والمقامة على مساحات فقدت مقوماتها الزراعية طبقاً لتقرير التصوير الجوي وشهادة المتغيرات المكانية الصادرة من المساحة العسكرية.',
    highlight: 'نقوم باستخراج إحداثيات GPS وشهادة المتغيرات المكانية المعتمدة للمبنى.'
  },
  {
    id: 'faq-rec-4',
    category: 'reconciliation',
    question: 'هل توجد تسهيلات أو تقسيط في سداد رسوم التصالح الحكومية؟',
    answer: 'نعم، تتيح الدولة خصم 25% من إجمالي قيمة التصالح في حالة السداد الفوري (الكاش)، أو إمكانية تقسيط باقي المبلغ على أقساط سنوية متساوية تصل حتى 3 سنوات بدون فوائد، أو حتى 5 سنوات بفائدة البنك المركزي المقررة.',
  },

  // 2. تراخيص البناء والهدم
  {
    id: 'faq-lic-1',
    category: 'licenses',
    question: 'ما هي خطوات استخراج رخصة بناء جديدة أو تعلية؟',
    answer: 'تبدأ بتقديم طلب شهادة صلاحية الموقع للبناء من الناحية التخطيطية والاشتراطات البنائية، يليه قيام مكتب الهيبه بإعداد الملف الهندسي المتكامل (الرسومات المعمارية والإنشائية، ونوتة الحسابات الإنشائية، ووثيقة التأمين المجمعة العشرية إن لزمت)، والمتابعة مع الإدارة الهندسية بالحي حتى صدور رخصة البناء المعتمدة.',
    highlight: 'يوفر المكتب إشرافاً هندسياً معتمداً من نقابة المهندسين ومطابقاً للكود المصري.'
  },
  {
    id: 'faq-lic-2',
    category: 'licenses',
    question: 'كم تستغرق إجراءات استخراج رخصة الهدم أو التعديل الداخلي؟',
    answer: 'تستغرق الإجراءات عادة من 20 إلى 45 يوم عمل من تاريخ استيفاء مستندات الملكية وتقرير المعاينة من لجنة المنشآت الآيلة للسقوط بالحي، ويتولى المكتب إنهاء كافة الموافقات الميدانية والفنية أمام الحي.',
  },

  // 3. رخص المحلات والمنشآت
  {
    id: 'faq-com-1',
    category: 'commercial',
    question: 'كيف يتم تقنين وتشغيل محل تجاري وفق قانون المحال العامة رقم 154؟',
    answer: 'ينقسم الترخيص لنظامين: نظام الإخطار للأنشطة غير الخطرة (تستخرج الرخصة خلال أيام قليلة)، ونظام الترخيص المسبق للأنشطة التي تتطلب موافقات أمنية وحماية مدنية وبيئية. يقوم مكتب الهيبه بإعداد كروكي المحل وشهادة استيفاء اشتراطات الحماية المدنية وتقديم الملف للمركز التكنولوجي المختص.',
    highlight: 'نساعدك في استيفاء شروط الحماية المدنية وموافقة الصحة والبيئة للمحل.'
  },
  {
    id: 'faq-com-2',
    category: 'commercial',
    question: 'هل يمكن ترخيص محل أو ورشة في عقار غير مسجل أو مخالف؟',
    answer: 'أتاح قانون المحال العامة منح تراخيص مؤقتة لمدة تصل إلى 5 سنوات للمحال القائمة بعقارات غير مرخصة لحين تقنين وتصالح العقار، مما يحمي صاحب النشاط من الإغلاق وتشميع المحل والغرامات.',
  },

  // 4. الرسوم وسندات الدفع والمتابعة
  {
    id: 'faq-fee-1',
    category: 'fees_tracking',
    question: 'كيف أعرف مصاريف وأتعاب المكتب لمعاملتي؟',
    answer: 'نظراً لأن كل عقار تختلف مساحته وموقعه وطبيعة مخالفته عن الآخر؛ يتم تقديم طلبك عبر الموقع الإلكتروني بحالة (أتعاب غير محددة)، ثم يقوم مهندس المكتب بدراسة الطلب أو المعاينة الميدانية والاتصال بك لتحديد الأتعاب العادلة بدقة قبل البدء، وتسجيلها في ملفك الرسمي.',
    highlight: 'لا توجد أي رسوم خفية، ويتم توضيح كافة المستحقات الحكومية وأتعاب المكتب مسبقاً.'
  },
  {
    id: 'faq-fee-2',
    category: 'fees_tracking',
    question: 'هل أحصل على إيصال رسمي عند سداد أي دفعة لمكتب الهيبه؟',
    answer: 'بالتأكيد. يصدر المكتب فوراً سند قبض نقدية رسمي معتمد ومختوم برقم متسلسل وكود ملفك، مدوناً به المبلغ بالحروف والأرقام وطريقة الدفع، ويتم تحديث الرصيد المتبقي على ملفك الإلكتروني لحظياً.',
  },
  {
    id: 'faq-fee-3',
    category: 'fees_tracking',
    question: 'كيف أتابع حالة طلبي خطوة بخطوة دون الحاجة للذهاب للمكتب كل يوم؟',
    answer: 'عبر صفحة «تتبع حالة معاملتك» في الموقع؛ أدخل كود المعاملة (مثل HB-2026-101) أو رقم هاتفك لتشاهد شريط الإنجاز المباشر، وتاريخ استلام الأوراق، وموقف المتابعة مع الحي، وأي مستندات مطلوب منك استيفاؤها.',
  }
];

export const FaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'reconciliation' | 'licenses' | 'commercial' | 'fees_tracking'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-rec-1');

  const categories = [
    { id: 'all', label: 'جميع الأسئلة' },
    { id: 'reconciliation', label: 'التصالح في مخالفات البناء', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'licenses', label: 'تراخيص البناء والهدم', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'commercial', label: 'رخص المحلات التجارية', icon: <Store className="w-3.5 h-3.5" /> },
    { id: 'fees_tracking', label: 'الرسوم والمتابعة وسندات الدفع', icon: <DollarSign className="w-3.5 h-3.5" /> }
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query || 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query) ||
        (item.highlight && item.highlight.toLowerCase().includes(query));
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-20 bg-[#0A0B0E] border-b border-white/10 text-right overflow-hidden">
      
      {/* توهج خلفي هادئ */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#EAA044]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* الترويسة الرئيسية */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAA044]/10 border border-[#EAA044]/30 text-xs font-bold text-[#EAA044]">
            <HelpCircle className="w-4 h-4" />
            <span>دليل واستفسارات المواطنين الشائعة</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            إجابات واضحة لأهم الأسئلة القانونية والهندسية
          </h2>

          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto leading-relaxed">
            كل ما يهم أهالي العامرية والإسكندرية حول قانون التصالح الجديد 2024، اشتراطات البناء، رخص المحلات، والمتابعة الإجرائية بالأجهزة المختصة.
          </p>
        </div>

        {/* شريط البحث المباشر في الأسئلة */}
        <div className="relative max-w-xl mx-auto mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الأسئلة الشائعة (مثال: نموذج 8، تقسيط، المستندات، رخصة محل)..."
            className="w-full py-3.5 pr-11 pl-4 rounded-2xl bg-[#14161E] border border-white/10 text-white placeholder-stone-500 text-xs sm:text-sm focus:border-[#EAA044] focus:outline-none transition-all shadow-lg"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
            >
              مسح
            </button>
          )}
        </div>

        {/* فلاتر التصنيفات */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#EAA044] text-stone-950 shadow-md shadow-[#EAA044]/20 scale-105'
                  : 'bg-[#14161E] text-stone-400 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* قائمة الأكورديون للأسئلة */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 bg-[#12141D] rounded-2xl border border-white/5">
              لم نجد نتائج مطابقة لبحثك "{searchQuery}". يمكنك التواصل مباشرة عبر الواتساب للاستفسار.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all border overflow-hidden ${
                    isOpen
                      ? 'bg-[#14161F] border-[#EAA044]/40 shadow-xl'
                      : 'bg-[#101218] border-white/5 hover:border-white/15'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-right transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-stone-100 leading-snug">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-xl transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'bg-[#EAA044] text-stone-950 rotate-180' : 'bg-white/5 text-stone-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-white/5 pt-3 space-y-3 animate-fadeIn">
                      <p>{faq.answer}</p>
                      
                      {faq.highlight && (
                        <div className="p-3 rounded-xl bg-[#EAA044]/10 border border-[#EAA044]/20 text-[11px] sm:text-xs text-[#EAA044] font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* شريط المساعدة الإضافية */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#14161E] to-[#181B26] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1 text-center sm:text-right">
            <div className="font-bold text-white text-sm">لديك استفسار خاص بعقارك أو لم تجد إجابة لسؤالك؟</div>
            <div className="text-stone-400 text-xs">فريق مكتب الهيبه جاهز للرد على استفساراتك القانونية والهندسية مباشرة.</div>
          </div>

          <a
            href="https://wa.me/201207659999?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D9%85%D9%83%D8%AA%D8%A8%20%D8%A7%D9%84%D9%87%D9%8A%D8%A8%D9%87%D8%8C%20%D8%B9%D9%86%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D9%85%D8%B9%D8%A7%D9%85%D9%84%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#EAA044]/20 active:scale-95 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>اسأل المحاسب منصور هيبه عبر واتساب</span>
          </a>
        </div>

      </div>
    </section>
  );
};
