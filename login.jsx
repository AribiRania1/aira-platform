import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../utils/AuthContext';
import { useLanguage } from '../utils/LanguageContext';
import { useTheme } from '../utils/ThemeContext';

export default function Login() {
  const { login } = useAuth();
  const { t, lang, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials");
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 bg-[#f7f9fb] dark:bg-[#0b0f19] text-[#191c1e] dark:text-[#f8faf5] transition-colors duration-300 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Head>
        <title>Login - AIRA Screening Platform</title>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: "class",
              theme: {
                extend: {
                  colors: {
                    primary: {
                      DEFAULT: "#005bb2",
                      hover: "#00468b"
                    }
                  }
                }
              }
            }
          `
        }} />
        <style dangerouslySetInnerHTML={{
          __html: `
            .glass-card {
              background: rgba(255, 255, 255, 0.85);
              backdrop-filter: blur(16px);
              border: 1px solid rgba(226, 232, 240, 0.8);
            }
            .dark .glass-card {
              background: rgba(21, 27, 44, 0.85);
              border: 1px solid rgba(255, 255, 255, 0.08);
            }
            .soft-blue-shadow {
              box-shadow: 0px 10px 30px rgba(0, 91, 178, 0.05);
            }
            .font-arabic {
              font-family: 'IBM Plex Sans Arabic', sans-serif;
            }
            .font-sans {
              font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
            }
          `
        }} />
      </Head>

      <div className="w-full max-w-[460px] flex flex-col gap-6">
        
        {/* Navigation & Controls */}
        <div className="flex justify-between items-center px-2">
          {/* Home Link */}
          <Link href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-200/50 dark:bg-gray-800/50 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all shadow-sm">
            <span className="material-symbols-outlined text-[16px]">{lang === 'ar' ? 'arrow_forward' : 'arrow_back'}</span>
            <span>{t('navHome')}</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-200/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined flex items-center justify-center text-[18px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            {/* Language Selector */}
            <select 
              value={lang} 
              onChange={(e) => changeLanguage(e.target.value)}
              className="p-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="fr">FR</option>
            </select>
          </div>
        </div>

        {/* Card Panel */}
        <div className="glass-card rounded-3xl p-8 md:p-10 soft-blue-shadow bg-white/60 dark:bg-gray-900/40">
          
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center gap-3">
            <img src="/logo.svg" alt="AIRA Logo" className="h-12 w-auto object-contain mb-1" />
            <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
              {t('loginSubtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                {t('email')}
              </label>
              <input 
                type="email" 
                placeholder="admin@generalchu.org" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                {t('password')}
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            {errorMsg && (
              <div className="p-3 text-xs font-semibold rounded-xl text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-center">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>{submitting ? t('signingIn') : t('loginBtn')}</span>
            </button>

          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-800/50 flex flex-col gap-2.5 text-xs font-semibold text-center">
            <div>
              <span className="text-gray-500">{t('needAccount')}</span>{' '}
              <Link href="/register-institution" className="text-primary hover:underline">
                {t('registerInstLink')}
              </Link>
            </div>
            <div>
              <span className="text-gray-500">{t('haveCode')}</span>{' '}
              <Link href="/register-doctor" className="text-primary hover:underline">
                {t('registerDocLink')}
              </Link>
            </div>
          </div>

        </div>

        {/* Operational status */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Status: Operational</span>
        </div>

      </div>
    </div>
  );
}
