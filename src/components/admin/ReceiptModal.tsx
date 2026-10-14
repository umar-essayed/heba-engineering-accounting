import React from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { Receipt } from '../../types';
import { OFFICE_INFO } from '../../data/mockData';

interface ReceiptModalProps {
  receipt: Receipt;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white text-black rounded-2xl shadow-2xl p-6 sm:p-10 border border-stone-300 print:m-0 print:p-8 print:border-none print:shadow-none">
        
        {/* أزرار الإجراءات في الشاشة (تختفي أثناء الطباعة) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-black font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة سند القبض (PDF)</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم السند الرسمي */}
        <div className="space-y-6 text-right">
          
          {/* ترويسة السند الرسمية */}
          <div className="flex justify-between items-start border-b-2 border-black pb-4">
            <div className="text-right">
              <h2 className="font-display font-bold text-xl text-black">
                مكتب الهيبه
              </h2>
              <p className="text-xs font-bold text-stone-700">
                للمحاسبة والأعمال الهندسية
              </p>
              <p className="text-[11px] text-stone-800 font-bold mt-0.5">
                صاحب المكتب: {OFFICE_INFO.director}
              </p>
              <p className="text-[10px] text-stone-600 mt-0.5">
                {OFFICE_INFO.address}
              </p>
              <p className="text-[10px] text-stone-500 font-mono mt-0.5" dir="ltr">
                {OFFICE_INFO.phones.map(p => p.display).join(' - ')}
              </p>
            </div>

            {/* الشعار المركزي أو الختم */}
            <div className="w-16 h-16 rounded-xl border border-stone-400 p-1 flex items-center justify-center bg-stone-50">
              <img src="/logo.png" alt="شعار المكتب" className="w-full h-full object-contain" />
            </div>

            <div className="text-left">
              <div className="text-xs font-bold text-stone-600 font-mono">رقم السند:</div>
              <div className="font-mono text-base font-bold text-black">{receipt.receiptNumber}</div>
              <div className="text-xs text-stone-500 font-mono mt-1">التاريخ: {receipt.date}</div>
              <div className="text-xs text-stone-800 font-mono font-bold mt-1">كود الملف: {receipt.caseCode}</div>
            </div>
          </div>

          {/* عنوان السند */}
          <div className="text-center py-2 bg-stone-100 border border-stone-300 rounded-lg">
            <span className="font-display font-bold text-lg text-black">
              سند قبض نقدية رسمي (إيصال استلام)
            </span>
          </div>

          {/* تفاصيل السند المحاسبية */}
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <span className="font-bold text-stone-700 whitespace-nowrap min-w-28">استلمنا من السيد/ة:</span>
              <span className="font-bold text-black border-b border-dotted border-stone-500 flex-grow pb-1">
                {receipt.clientName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-stone-700 whitespace-nowrap min-w-28">مبلغ وقدره:</span>
              <span className="font-mono font-bold text-black text-base px-3 py-1 bg-stone-100 rounded border border-stone-300">
                {receipt.amount.toLocaleString()} ج.م
              </span>
              <span className="font-sans font-bold text-stone-800 border-b border-dotted border-stone-500 flex-grow pb-1">
                ({receipt.amountInWords})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-stone-700 whitespace-nowrap min-w-28">طريقة السداد:</span>
              <span className="text-black border-b border-dotted border-stone-500 flex-grow pb-1">
                {receipt.paymentMethod}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-stone-700 whitespace-nowrap min-w-28">وذلك مقابل:</span>
              <span className="text-black border-b border-dotted border-stone-500 flex-grow pb-1 font-medium">
                {receipt.category} — {receipt.notes || 'أتعاب استشارات ومتابعة إجراءات حكومية'}
              </span>
            </div>
          </div>

          {/* التوقيعات والختم الدائري الفخم */}
          <div className="pt-8 border-t border-stone-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="font-bold text-stone-700 mb-12">المستلم:</div>
              <div className="font-mono text-stone-800 font-bold">{receipt.receivedBy}</div>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="font-bold text-stone-700 mb-2">اعتماد الإدارة والختم:</div>
              {/* الختم الرسمي المستخرج من الصورة */}
              <div className="w-20 h-20 mb-2 rounded-full overflow-hidden border border-amber-600 shadow-sm">
                <img src="/mansour-seal.jpg" alt="الختم الرسمي" className="w-full h-full object-cover" />
              </div>
              <div className="font-display font-bold text-stone-900 border-t border-stone-300 pt-1 w-full text-center">
                {OFFICE_INFO.director}
              </div>
            </div>
          </div>

          {/* تذييل السند */}
          <div className="pt-4 border-t border-stone-200 text-center text-[10px] text-stone-500 font-mono">
            هذا السند معتمد ومسجل في المنظومة الرقمية لمكتب الهيبه للمحاسبة والأعمال الهندسية — العامرية، الإسكندرية.
          </div>

        </div>

      </div>
    </div>
  );
};
