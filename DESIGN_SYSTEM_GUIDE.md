# دليل نظام التصميم المعماري والمؤسسي (Design System & Style Guide)
## Architectural Realism & Precision Enterprise Blueprint

> **نبذة عن هذا الدليل:**  
> تم استخلاص هذا النظام التوثيقي من فلسفة تصميم منصة **CGL** المتقدمة، وصياغته بطريقة **معيارية عامة وقابلة لإعادة الاستخدام (Generic & Agnostic)** لتكون بمثابة كود وميثاق تصميمي موحد لبناء أي موقع أو منصة رقمية مستقبلية (شركات استشارات، منصات هندسية، تقنية مالية Fintech، رعاية صحية، لوجستيات، عقارات فاخرة، أو برمجيات مؤسسية B2B).

---

## 1. الفلسفة البصرية والمبادئ التوجيهية (Design Philosophy)

### 1.1 جوهر الهوية: السلطة التقنية والواقعية المعمارية (Architectural Realism & Technical Authority)
* **الابتعاد التام عن نمط الشركات الناشئة المستهلك (Anti-Generic Startup):**
  تجنب المؤثرات الطفولية، تدرجات النيون البنفسجية الصاخبة، الزجاجيات العائمة غير المبررة، والمجسمات ثلاثية الأبعاد الكرتونية.
* **الرسوخ والاحترافية الموثقة (Grounded & Evidence-Driven):**
  كل عنصر بصري، رقم، أو إحصائية في الواجهة يجب أن يوحي بالدقة والمصداقية كأنه مستخرج من تقرير فني أو مخطط تنفيذي حقيقي.
* **ثنائية الوضعين (Dual Aesthetic Modes):**
  * **الوضع الداكن (Cinematic Obsidian / Carbon):** يعتمد على الأسود النقي `#000000` وأسطح الفحم العميق `#0a0a0a` مع خطوط شبكية دقيقة (Blueprint Grid) وحدود دقيقة للغاية (Micro-borders) توحي بالصلابة والعمق الفخم.
  * **الوضع الفاتح (Architectural Sokari / Off-White Stone):** يعتمد على درجات الحجر الطبيعي الدافئة والأوف وايت الفاخر `#FBF9F5` و `#F3ECE2` بدلاً من الأبيض الصريح المؤذي للعين، مع نصوص بلون الأردواز الداكن `#18181B`.
* **الحركة المنضبطة والهادفة (Restrained & Purposeful Motion):**
  الحركة ليست استعراضاً بصرياً؛ بل أداة قياس ونقل بصري ناعم (200ms - 400ms للميكرو-تفاعلات، وانتقالات متزنة للإحصائيات والصور).

---

## 2. منظومة الألوان والرموز (Color Tokens & Palette)

يعتمد النظام على تركيبة لونية منضبطة توازن بين درجات الخلفيات المحايدة، واللون الأساسي المميز، مع لون تمييز ثانوي للاعتمادات والإنجازات.

### 2.1 جدول الرموز اللونية الأساسية (Design Tokens)

| الرمز (Token Name) | كود اللون (Hex) | الدور والاستخدام في الواجهة |
|---|---|---|
| `--color-bg-dark` | `#000000` | خلفية الصفحة الرئيسية في الوضع الداكن (Pure Obsidian) |
| `--color-surface-dark-1` | `#0a0a0a` | خلفية البطاقات والألواح الأساسية |
| `--color-surface-dark-2` | `#111111` | خلفية العناصر الثانوية، أزرار التبديل، وشارات البيانات |
| `--color-border-dark` | `#1f1f1f` / `rgba(255,255,255,0.08)` | الحدود الدقيقة الفاصلة بين الأقسام والبطاقات |
| `--color-bg-light` | `#FBF9F5` | خلفية الصفحة في الوضع الفاتح (Sokari Architectural Stone) |
| `--color-surface-light-1`| `#FFFFFF` | خلفية البطاقات الفاتحة المرتفعة |
| `--color-surface-light-2`| `#F3ECE2` | خلفية العناصر الفرعية وفوتر الوضع الفاتح |
| `--color-border-light` | `#E6DFD3` | حدود الوضع الفاتح المعمارية الهادئة |
| `--color-primary` | `#3B76B3` | الأزرق التقني الأساسي (الدقة، الإجراءات الرئيسية، الحالات النشطة) |
| `--color-primary-hover`| `#2A5B8C` | حالة التحويم (Hover State) للزر الأساسي |
| `--color-primary-light`| `#508ECB` | نصوص الروابط والتوهج الخافت |
| `--color-accent-green` | `#16A34A` / `#82B74B` | خيار السمة البديلة (الاستدامة، البيئة، التقارير الناجحة) |
| `--color-accent-gold` | `#D4A359` / `#C5A880` | شارات الاعتماد الرسمية، التميز، وأرقام الإحصائيات الفاخرة |
| `--color-text-main-dark`| `#FFFFFF` / `#F4F4F5` | النصوص والعناوين الرئيسية في الوضع الداكن |
| `--color-text-sub-dark` | `#A1A1AA` / `#71717A` | النصوص الوصفية والبيانات المترية في الداكن |
| `--color-text-main-light`| `#0F172A` / `#18181B` | العناوين والنصوص الأساسية في الوضع الفاتح |
| `--color-text-sub-light` | `#52525B` / `#706E66` | النصوص الثانوية في الوضع الفاتح |

---

## 3. منظومة الطباعة والنصوص (Typography Hierarchy)

يتميز النظام بتوزيع مدروس بين 3 عائلات خطية لتحقيق المزيج بين الفخامة المعمارية، وضوح القراءة، والدقة الرقمية:

```
┌────────────────────────────────────────────────────────┐
│  العناوين الرئيسية (Display / Sculptural)            │
│  الخط: El Messiri (عربي) / Cabinet Grotesk / Serif     │
├────────────────────────────────────────────────────────┤
│  المتن والواجهات (Sans / Clear Reading)               │
│  الخط: Cairo (عربي) / Plus Jakarta Sans / Inter       │
├────────────────────────────────────────────────────────┤
│  الأرقام والمعايير (Monospace / Engineering Metrics)   │
│  الخط: JetBrains Mono / Cairo Tabular Numbers           │
└────────────────────────────────────────────────────────┘
```

### 3.1 جدول المقاسات والأوزان القياسية (Type Scale)

| العنصر | الفئة في Tailwind | المقاس المكافئ | الوزن والخصائص | الاستخدام |
|---|---|---|---|---|
| **Hero Title** | `text-3xl sm:text-5xl lg:text-6xl` | 36px - 60px | `font-display font-bold leading-tight` | العنوان الرئيسي في أعلى الصفحة |
| **Section Title** | `text-2xl sm:text-3xl lg:text-4xl` | 24px - 36px | `font-display font-bold tracking-tight` | عناوين الأقسام الرئيسية |
| **Card Title** | `text-base sm:text-lg` | 16px - 18px | `font-display font-bold leading-snug` | عناوين الخدمات والمشاريع |
| **Body Large** | `text-sm sm:text-base md:text-lg` | 14px - 18px | `font-sans leading-relaxed` | مقدمات الأقسام والنصوص التفسيرية |
| **Body Regular** | `text-xs sm:text-sm` | 12px - 14px | `font-sans leading-relaxed text-sub` | فقرات الشرح داخل الكروت |
| **Technical Meta** | `text-[10px] sm:text-xs` | 10px - 12px | `font-mono font-medium tracking-wide` | المعايير الهندسية، التواريخ، والترقيم |

---

## 4. الملامح والخامات البصرية (Visual Textures & Surfaces)

### 4.1 شبكة المخططات الهندسية (Precision Blueprint Grid)
تعطي إحساساً فورياً بالدقة الهندسية دون أن تشوش على المحتوى:
```css
.blueprint-grid {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
}
```

### 4.2 الألواح الزجاجية المصقولة (Tactile Glass Panels)
زجاجية غير مبالغ فيها، معتمة بنسبة مدروسة (70-75%) مع ضبابية حادة وحدود فائقة النحافة:
```css
.glass-panel {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-panel-glow {
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(59, 118, 179, 0.3);
  box-shadow: 0 0 20px rgba(59, 118, 179, 0.15);
}
```

### 4.3 الذوبان اللوني التدرجي العضوي للصور (Organic Dissolve Gradients)
بدلاً من حشر الصور داخل مربعات مقفلة (boxed images)، يتم إطلاق الصورة على نصف الشاشة بالكامل (Full-bleed)، مع تطبيق تدرجات تذويب متعددة الاتجاهات (Multi-directional Dissolves) لدمج الصورة بنعومة مطلقة في خلفية النصوص.

---

## 5. تشريح المكونات القياسية (Component Specifications)

### 5.1 كبسولة الحالة الحية (Status & Tag Pill)
عنصر بصري أساسي يوضع فوق أي عنوان رئيسي لإعطاء طابع المتابعة الحية والمباشرة.
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#111111] border border-[#E6DFD3] dark:border-[#1f1f1f] text-xs font-sans text-[#3b76b3] shadow-sm w-fit">
  <span className="w-1.5 h-1.5 rounded-full bg-[#3b76b3] animate-pulse" />
  <span className="font-semibold">{tagTitle}</span>
  {metrics && (
    <>
      <span className="text-stone-300 dark:text-stone-600">|</span>
      <span className="text-[#52525B] dark:text-stone-300 font-mono text-[11px]">{metrics}</span>
    </>
  )}
</div>
```

---

### 5.2 البطاقة الهندسية التفاعلية (The Engineering Elevation Card)
بطاقة المحتوى الموحدة لعرض الخدمات، المشاريع، أو المنتجات:
* **صورة علوية:** تتفاعل عند التحويم بتكبير بطيء (`group-hover:scale-105 duration-700`).
* **تدرج سفلي للصورة:** يدمج أسفل الصورة مباشرة مع لون خلفية البطاقة.
* **رقم مؤشر مونو:** مثل `01`, `02` بلون السمة الأساسي.
* **إيقاع بصري متغير (Staggered Heights):** تبادل الارتفاعات (كارت مرتفع وكارت أقصر) لكسر رتابة الشبكات التقليدية.
* **تذييل بطاقة فني:** يحتوي على شرائح المعايير/التصنيفات وسهم تفاعلي ينزاح بمقدار 2 بكسل عند الـ Hover.

```tsx
<div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#0a0a0a] border border-[#E6DFD3] dark:border-[#1f1f1f] hover:border-[#3b76b3]/50 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl flex flex-col justify-between">
  {/* صورة رأس البطاقة */}
  <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-stone-100 dark:bg-[#111111]">
    <img 
      src={item.image} 
      alt={item.title} 
      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/50 dark:to-transparent" />
  </div>

  {/* محتوى البطاقة */}
  <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-bold text-[#3b76b3]">01</span>
        <div className="text-stone-400 group-hover:text-[#3b76b3] transition-colors">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>
      <h3 className="font-display font-bold text-base sm:text-lg text-[#18181B] dark:text-white group-hover:text-[#3b76b3] transition-colors mb-2">
        {item.title}
      </h3>
      <p className="text-xs sm:text-sm text-[#52525B] dark:text-stone-300 font-sans leading-relaxed line-clamp-3 mb-4">
        {item.description}
      </p>
    </div>

    {/* شريط المعايير والإجراء */}
    <div className="pt-3 border-t border-[#E6DFD3] dark:border-white/5 flex items-center justify-between gap-2 mt-auto">
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F3ECE2] dark:bg-white/5 text-[#52525B] dark:text-stone-300 border border-[#E6DFD3] dark:border-white/10">
          ISO 9001
        </span>
      </div>
      <span className="text-xs font-bold text-[#3b76b3] group-hover:underline flex items-center gap-1">
        التفاصيل
        <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      </span>
    </div>
  </div>
</div>
```

---

### 5.3 شريط التنقل والترويسة العلوية (Precision Scrolled Navbar)
* يكون شفافاً بالكامل عند وجود Hero سينمائي في أعلى الصفحة، ويتحول بنعومة عند التمرير (`scrollY > 20`) إلى شريط زجاجي مصقول معتم.
* **خط الحافة المميز (Accent Hairline Edge):** شريط سفلي دقيق بسمك `2px` بلون السمة الأساسي `#3B76B3` يمنح شعوراً هندسياً معماريّاً للموقع.
* يدعم في طرفه محول اللغات ومبدل المظهر ومسار الاتصال السريع المباشر (مثل زر الواتساب).

---

### 5.4 محدد التبويب المعماري (Segmented Control / Filter Bar)
بدلاً من الأزرار العادية، يتم استخدام حاوية كبسولية مقعرة تحتضن الأزرار:
```tsx
<div className="flex items-center bg-[#F3ECE2] dark:bg-[#111111] p-1 rounded-xl border border-[#E6DFD3] dark:border-[#1f1f1f]">
  <button className="px-4 py-2 rounded-lg text-xs font-sans font-bold bg-[#3b76b3] text-white shadow-sm">
    الكل (24)
  </button>
  <button className="px-4 py-2 rounded-lg text-xs font-sans font-bold text-[#52525B] dark:text-stone-400 hover:text-white transition-colors">
    القسم الميداني
  </button>
</div>
```

---

### 5.5 نظام ترقيم وتمرير السلايدر (Cinematic Progress Pagination)
* شريط مؤشرات مدمج في كبسولة زجاجية شبه شفافة.
* المؤشر النشط يتمدد أفقياً (`w-9 sm:w-12`) ويحتوي داخله على شريط تعبئة زمني متحرك بنعومة بالغة يوضح الزمن المتبقي للانتقال التلقائي.
* بجانبه شاشة عداد رقمية مصغرة بصيغة: `01 / 05 • عنوان القسم`.

---

### 5.6 الأزرار وحقول التفاعل (Action Buttons & CTAs)

1. **الزر الأساسي (Primary CTA):**
   * كلاسات: `bg-[#3b76b3] hover:bg-[#2a5b8c] text-white font-bold text-xs sm:text-sm rounded-xl px-6 py-3 shadow-lg shadow-[#3b76b3]/20 active:scale-[0.98] transition-all`
   * يقترن بأيقونة سهم متجهة للخارج توحي بالحركة والانطلاق.
2. **الزر الثانوي الشفاف (Secondary Glass CTA):**
   * كلاسات: `bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md rounded-xl px-5 py-3 transition-all`
3. **أزرار الأيقونات الدائرية:**
   * كلاسات: `p-2.5 rounded-full bg-white dark:bg-[#111111] border border-[#E6DFD3] dark:border-[#1f1f1f] text-stone-600 dark:text-stone-300 hover:text-[#3b76b3] active:scale-95 transition-all`

---

## 6. قواعد الحركة والتفاعل (Motion & Micro-interactions)

1. **مبدأ الحساب التراكمي للظهور (Stagger In-View):**
   كل شبكة بطاقات تظهر عند التمرير إليها بفارق زمني بسيط وثابت:
   ```ts
   transition: { duration: 0.4, delay: index * 0.06 }
   ```
2. **عداد الأرقام التفاعلي (Easing Counter):**
   الأرقام والإحصائيات لا تقفز فجأة، بل تصعد بانسيابية تكعيبية (`easeOut = 1 - Math.pow(1 - progress, 3)`) خلال 2000 - 2200 ميلي ثانية.
3. **التمرير اللمسي الذكي (RTL-Aware Touch Swiping):**
   حساب اتجاه السحب اللمسي على الهواتف مع مراعاة اتجاه اللغة (في اللغة العربية السحب لليسار يعني التالي والعكس في الإنجليزية)، مع حد أدنى للإزاحة (45px) لتفادي اللمسات العرضية.

---

## 7. دليل تعميم النظام على أي مجال جديد (Generalization Playbook)

لتطبيق هذا الأسلوب التصميمي المتميز على أي مشروع مستقبلي في قطاع مختلف، اتبع هذه التعديلات التوجيهية:

| المجال الجديد (Sector) | اللون الأساسي المقترح | لون التمييز المقترح (Accent) | طبيعة الصور والرسومات | مصطلحات شريط المقاييس (Pill Badges) |
|---|---|---|---|---|
| **التقنية المالية والمدفوعات (FinTech)** | كحلي بنكي دقيق `#1E3A8A` | أخضر أمان `#10B981` | واجهات شاشات التداول، رسوم بيانية مترية | `PCI-DSS Level 1` • `معدل إتاحة 99.99%` |
| **الرعاية الصحية والمختبرات الطبية** | أزرق جراحي نقي `#0284C7` | فيروزي مخبري `#14B8A6` | صور مجاهر، تصوير طبي عالي الدقة | `ISO 15189` • `معتمد من وزارة الصحة` |
| **التطوير العقاري والمقاولات الكبرى** | رمادي أنثراسيت `#1F242D` | نحاس ذهبي دافئ `#C5A880` | صور معمارية حقيقية أثناء الغروب | `كود البناء السعودي` • `مساحة 120,000م²` |
| **الخدمات اللوجستية وسلاسل الإمداد** | أزرق كحلي أطلسي `#0F2942` | برتقالي لوجستي صناعي `#EA580C` | أساطيل نقل، مستودعات رقمية مؤتمتة | `تتبع فوري GPS` • `تغطية 14 منطقة` |
| **منصات البرمجيات وحلول السحاب (B2B SaaS)** | أزرق كوني `#2563EB` | ياقوتي `#6366F1` | لقطات شاشات النظام، توثيق الـ API | `SOC2 Type II` • `زمن استجابة < 40ms` |

---

## 8. حزمة الكود الجاهزة للاستخدام الفوري (Starter Boilerplate)

### 8.1 إعداد `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary, #3B76B3)",
          primaryHover: "var(--brand-primary-hover, #2A5B8C)",
          accent: "#D4A359",
        },
        surface: {
          dark: "#000000",
          darkCard: "#0A0A0A",
          darkMuted: "#111111",
          light: "#FBF9F5",
          lightCard: "#FFFFFF",
          lightMuted: "#F3ECE2",
        },
        border: {
          dark: "#1F1F1F",
          light: "#E6DFD3",
        }
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        display: ["var(--font-el-messiri)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
```

### 8.2 كود الأنماط العامة `globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-cairo: 'Cairo', sans-serif;
    --font-el-messiri: 'El Messiri', sans-serif;
    --brand-primary: #3b76b3;
    --brand-primary-hover: #2a5b8c;
  }

  body {
    font-family: var(--font-cairo);
    background-color: #000000;
    color: #F4F4F5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-el-messiri);
  }
}

/* الوضع الفاتح الحجري المعماري */
html.theme-light body {
  background-color: #FBF9F5 !important;
  color: #18181B !important;
}

/* شبكة المخططات */
.blueprint-grid {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
}

/* شريط تمرير هندسي دقيق */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #000000;
}
html.theme-light ::-webkit-scrollbar-track {
  background: #F3ECE2;
}
::-webkit-scrollbar-thumb {
  background: #1f1f1f;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3b76b3;
}
```

---

## 9. قائمة التحقق قبل الإطلاق (Quality & Consistency Checklist)

- [ ] **فحص التباين والخطوط:** هل خطوط العناوين محددة بوضوح (`El Messiri` للعربي أو خط نحتي للإنجليزية) وخط المتن واضح ومريح (`Cairo`)؟
- [ ] **تناغم الثنائية (Dark/Light Sync):** هل تمت تجربة الموقع بكلا المظهرين، والتأكد من أن الوضع الفاتح يرتدي درجات الأوف وايت الدافئة (`#FBF9F5`) وليس الأبيض الفاقع؟
- [ ] **حدود الـ 1 بكسل الدقيقة:** هل جميع الفواصل والبطاقات محمية بحدود شفافة خافتة (`border-[#1f1f1f]` أو `border-[#E6DFD3]`)؟
- [ ] **عناصر التوثيق الحي:** هل كل قسم مدعوم بكبسولة نبضية علوية وشريط ترقيم مونو (`01`, `02`)؟
- [ ] **استجابة الهواتف وشاشات اللمس:** هل تم اختبار السحب الأفقي للشرائح بالأصبع ومراعاة التوجيه في اللغتين العربية والإنجليزية؟
- [ ] **حافة الترويسة السفلية:** هل الترويسة العلوية عند التمرير تتزين بالشريط الرفيع الأزرق (`h-[2px] bg-[#3b76b3]`)؟
