import React from 'react';
import { ShieldCheck, Award, Building, Compass, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const AccreditationStats: React.FC = () => {
  const accreditations = [
    {
      icon: <Award className="w-6 h-6 text-brand-primary" />,
      title: "نقابة المهندسين المصرية",
      desc: "تقارير سلامة إنشائية معتمدة، شهادات إشراف، وتصميمات مطابقة للأكواد الرسمية"
    },
    {
      icon: <Building className="w-6 h-6 text-brand-primary" />,
      title: "الأحياء والإدارات الهندسية",
      desc: "خبرة في إنهاء معاملات اللجان، التقديم، إصدار نموذج 3، نموذج 8، ورخص البناء"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-primary" />,
      title: "إدارة الحماية المدنية",
      desc: "مطابقة تقارير السلامة ومكافحة الحريق لاستخراج رخص تشغيل المنشآت والمحال"
    },
    {
      icon: <Compass className="w-6 h-6 text-brand-primary" />,
      title: "المساحة العسكرية وأملاك الدولة",
      desc: "توقيع إحداثيات GPS المعتمدة لخريطة المتغيرات المكانية وملفات تقنين الأراضي"
    }
  ];

  return (
    <section className="py-16 bg-surface-darkCard border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="font-mono text-xs text-brand-primary tracking-wider">OFFICIAL RECOGNITION & STANDARDS</span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
            الاعتمادات والسند المؤسسي لمكتب الهيبه
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accreditations.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-brand-primary/40 transition-all text-right space-y-3"
            >
              <div className="p-3 rounded-xl bg-white/5 w-fit border border-white/10">
                {item.icon}
              </div>
              <h4 className="font-display font-bold text-base text-white">
                {item.title}
              </h4>
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
