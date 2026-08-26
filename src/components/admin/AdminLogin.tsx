import { useState } from 'react';
import { Lock, Mail, Coffee, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast(t('Please enter email and password', 'يرجى إدخال البريد وكلمة المرور'), 'warning');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      showToast(t('Invalid credentials', 'بيانات غير صحيحة'), 'error');
    } else {
      showToast(t('Welcome back!', 'مرحباً بعودتك!'), 'success');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-hero-pattern opacity-20" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-caramel-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative w-full max-w-md">
        <div className="glass-dark rounded-2xl p-8 shadow-premium animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-green shadow-card mb-4">
              <Coffee className="h-8 w-8 text-caramel-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-cream-50">VERO VITA</h1>
            <p className="text-sm text-caramel-300 mt-1">{t('Admin Dashboard', 'لوحة الإدارة')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-cream-200 mb-1.5">
                {t('Email', 'البريد الإلكتروني')}
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 left-4 h-5 w-5 text-green-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@verovito.com"
                  className="w-full rounded-xl bg-green-900/50 border border-green-700/50 pl-12 pr-4 py-3 text-sm text-cream-50 placeholder:text-green-500/50 focus:border-caramel-400 focus:outline-none focus:ring-2 focus:ring-caramel-400/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cream-200 mb-1.5">
                {t('Password', 'كلمة المرور')}
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 left-4 h-5 w-5 text-green-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-green-900/50 border border-green-700/50 pl-12 pr-4 py-3 text-sm text-cream-50 placeholder:text-green-500/50 focus:border-caramel-400 focus:outline-none focus:ring-2 focus:ring-caramel-400/20 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-caramel-500 px-6 py-3.5 text-sm font-bold text-cream-50 shadow-soft transition-all hover:bg-caramel-600 hover:shadow-caramel disabled:opacity-50"
            >
              {loading ? (
                <span className="h-5 w-5 rounded-full border-2 border-cream-50/30 border-t-cream-50 animate-spin" />
              ) : (
                <>
                  {t('Sign In', 'تسجيل الدخول')}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleLang}
              className="text-xs text-cream-300/60 hover:text-caramel-400 transition-colors"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
