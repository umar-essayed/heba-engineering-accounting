import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { SystemSettings } from '../../services/firebase';

interface AdminLoginProps {
  settings: SystemSettings;
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  settings,
  onLoginSuccess,
  onBackToSite
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const validUser = settings.adminUsername || 'admin';
      const validPass = settings.adminPasswordHash || 'heba2026';

      if (username.trim() === validUser && password === validPass) {
        if (rememberMe) {
          localStorage.setItem('heba_admin_auth', 'true');
        } else {
          sessionStorage.setItem('heba_admin_auth', 'true');
        }
        onLoginSuccess();
      } else {
        setErrorMsg('بيانات الدخول غير صحيحة، يرجى التأكد من اسم المستخدم وكلمة المرور.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-center items-center p-4 selection:bg-[#EAA044] selection:text-black relative overflow-hidden font-sans">
      
      {/* هالات إضاءة في الخلفية */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#EAA044]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-blue-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* زر العودة للموقع */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white text-xs font-bold transition-all border border-white/5 active:scale-95"
        >
          <ArrowRight className="w-3.5 h-3.5 text-[#EAA044]" />
          <span>العودة للموقع الرئيسي</span>
        </button>

        <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>اتصال محمي ومؤمن 256-bit</span>
        </span>
      </div>

      {/* كارت تسجيل الدخول */}
      <div className="w-full max-w-md bg-[#12141C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* الترويسة والشعار */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#EAA044]/10 border border-[#EAA044]/30 shadow-inner mb-1">
            <img 
              src="/emblem.png" 
              alt="شعار مكتب الهيبه" 
              className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(234,160,68,0.4)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo.png";
              }}
            />
          </div>

          <h1 className="font-display font-bold text-xl sm:text-2xl text-white">
            لوحة الإدارة المركزية
          </h1>
          <p className="text-xs text-stone-400">
            {settings.officeName || 'مكتب الهيبه للمحاسبة والأعمال الهندسية'}
          </p>
        </div>

        {/* رسالة الخطأ */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 text-right">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* فورم تسجيل الدخول */}
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300 block">
              اسم المستخدم
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#EAA044] transition-all"
                dir="ltr"
              />
              <User className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-300 block">
                كلمة المرور
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#EAA044] transition-all"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 rounded text-stone-400 hover:text-white absolute left-2.5 top-1/2 -translate-y-1/2"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-stone-400 hover:text-stone-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-black/40 border-white/20 text-[#EAA044] focus:ring-0 cursor-pointer"
              />
              <span>تذكر تسجيل دخولي</span>
            </label>
            <span className="text-[11px] text-stone-500">
              افتراضي: admin / heba2026
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#EAA044] hover:bg-[#D48B28] text-stone-950 font-bold text-xs sm:text-sm shadow-lg hover:shadow-[#EAA044]/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>تسجيل الدخول للنظام</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-white/5 text-center text-[11px] text-stone-500">
          نظام مشفر سحابياً مرتبط بـ Firebase Cloud Firestore
        </div>
      </div>

    </div>
  );
};
