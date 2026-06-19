import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../utils/AuthContext';
import { useLanguage } from '../utils/LanguageContext';
import { useTheme } from '../utils/ThemeContext';

export default function RegisterInstitution() {
  const { registerInstitution } = useAuth();
  const { t, lang, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState('');
  const [type, setType] = useState('public_hospital');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [regNum, setRegNum] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [respPerson, setRespPerson] = useState('');

  const [success, setSuccess] = useState(false);
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
      await registerInstitution({
        name,
        type,
        country,
        city,
        address,
        registration_number: regNum,
        contact_email: email,
        contact_phone: phone,
        responsible_person: respPerson
      });
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || "Registration failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 bg-[#f7f9fb] dark:bg-[#0b0f19] text-[#191c1e] dark:text-[#f8faf5] transition-colors duration-300 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Head>
        <title>{t('registerInstTitle')}</title>
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

      <div className="w-full max-w-[620px] flex flex-col gap-6">
        
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
            <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
              {t('registerInstSubtitle')}
            </p>
          </div>

          {success ? (
            <div className="text-center flex flex-col gap-6 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-emerald-600">Application Submitted</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your institution application is now <strong className="text-primary">PENDING</strong> administrator review. An email notification containing instructions will be sent once approved.
                </p>
              </div>
              <div className="pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
                <Link href="/login" className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold flex items-center justify-center shadow-md transition-colors">
                  {t('haveAccount')}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Institution Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('instName')}
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Type and Reg Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('instType')}
                  </label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    <option value="public_hospital">{t('publicHospital')}</option>
                    <option value="private_clinic">{t('privateClinic')}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('regNumber')}
                  </label>
                  <input 
                    type="text" 
                    value={regNum} 
                    onChange={(e) => setRegNum(e.target.value)} 
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Country and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('country')}
                  </label>
                  <input 
                    type="text" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('city')}
                  </label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Physical Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('address')}
                </label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('contactEmail')}
                  </label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('contactPhone')}
                  </label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Responsible Person */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('respPerson')}
                </label>
                <input 
                  type="text" 
                  placeholder="Dr. John Doe"
                  value={respPerson} 
                  onChange={(e) => setRespPerson(e.target.value)} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              {errorMsg && (
                <div className="p-3 text-xs font-semibold rounded-xl text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-center">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold flex items-center justify-center shadow-md transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {submitting ? t('loading') : t('submitApplication')}
              </button>

              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50 text-center">
                <Link href="/login" className="text-xs font-bold text-gray-500 hover:text-primary transition-colors">
                  {t('haveAccount')}
                </Link>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
