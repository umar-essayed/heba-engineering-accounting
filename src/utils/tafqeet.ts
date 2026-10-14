/**
 * Arabic number to words converter (Tafqeet) for Egyptian Pounds (EGP)
 */
export function tafqeetEGP(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return 'صفر جنيه مصري فقط لا غير';

  const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function convertGroup(n: number): string {
    if (n === 0) return '';
    let res = '';
    const h = Math.floor(n / 100);
    const remainder = n % 100;

    if (h > 0) {
      res += hundreds[h];
    }

    if (remainder > 0) {
      if (res) res += ' و';
      if (remainder <= 10) {
        res += units[remainder];
      } else if (remainder < 20) {
        res += teens[remainder - 10];
      } else {
        const u = remainder % 10;
        const t = Math.floor(remainder / 10);
        if (u > 0) {
          res += units[u] + ' و' + tens[t];
        } else {
          res += tens[t];
        }
      }
    }
    return res;
  }

  const intPart = Math.floor(amount);

  let text = '';
  const millions = Math.floor(intPart / 1000000);
  const thousands = Math.floor((intPart % 1000000) / 1000);
  const ones = intPart % 1000;

  if (millions > 0) {
    if (millions === 1) text += 'مليون';
    else if (millions === 2) text += 'مليونان';
    else if (millions >= 3 && millions <= 10) text += `${convertGroup(millions)} ملايين`;
    else text += `${convertGroup(millions)} مليون`;
  }

  if (thousands > 0) {
    if (text) text += ' و';
    if (thousands === 1) text += 'ألف';
    else if (thousands === 2) text += 'ألفان';
    else if (thousands >= 3 && thousands <= 10) text += `${convertGroup(thousands)} آلاف`;
    else text += `${convertGroup(thousands)} ألف`;
  }

  if (ones > 0) {
    if (text) text += ' و';
    text += convertGroup(ones);
  }

  return `${text.trim()} جنيه مصري فقط لا غير`;
}
