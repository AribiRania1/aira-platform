import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import { useLanguage } from '../utils/LanguageContext';
import { useTheme } from '../utils/ThemeContext';

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Helper to check active state
  const isActive = (pathname, queryTab = null) => {
    if (router.pathname !== pathname) return '';
    if (queryTab && router.query.tab !== queryTab) return '';
    if (!queryTab && router.query.tab) return '';
    return 'active';
  };

  return (
    <div className="app-container">
      <Head>
        <title>{title ? `${title} | AIRA` : 'AIRA - AI Radiology Diagnostic SaaS'}</title>
        <meta name="description" content="AI powered Radiology Scan & Image Analysis" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" rel="stylesheet" />
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
                      hover: "#00468b",
                      container: "#0073de"
                    },
                    secondary: {
                      DEFAULT: "#705765",
                      container: "#f8d7e8"
                    }
                  },
                  fontFamily: {
                    sans: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
                    arabic: ["'IBM Plex Sans Arabic'", "sans-serif"]
                  }
                }
              }
            }
          `
        }} />
      </Head>

      {/* Sidebar Navigation */}
      {user && (
        <aside className="sidebar">
          <div>
            <Link href="/" className="sidebar-logo flex items-center">
              <img src="/logo.svg" alt="AIRA Logo" className="h-10 w-auto object-contain" />
            </Link>
            
            <nav>
              <ul className="sidebar-menu">
                {/* Super Admin Menu */}
                {user.role === 'super_admin' && (
                  <>
                    <li>
                      <Link href="/dashboard/super-admin?tab=analytics" className={`menu-item ${isActive('/dashboard/super-admin', 'analytics')}`}>
                        <span className="material-symbols-outlined">dashboard</span>
                        {t('navDashboard')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/super-admin?tab=institutions" className={`menu-item ${isActive('/dashboard/super-admin', 'institutions')}`}>
                        <span className="material-symbols-outlined">domain</span>
                        {t('allInstitutions')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/super-admin?tab=requests" className={`menu-item ${isActive('/dashboard/super-admin', 'requests')}`}>
                        <span className="material-symbols-outlined">rate_review</span>
                        {t('navRequests')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/super-admin?tab=subscriptions" className={`menu-item ${isActive('/dashboard/super-admin', 'subscriptions')}`}>
                        <span className="material-symbols-outlined">payments</span>
                        {t('navBilling')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/super-admin?tab=logs" className={`menu-item ${isActive('/dashboard/super-admin', 'logs')}`}>
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                        {t('navAuditLogs')}
                      </Link>
                    </li>
                  </>
                )}

                {/* Institution Admin Menu */}
                {user.role === 'institution_admin' && (
                  <>
                    <li>
                      <Link href="/dashboard/institution-admin?tab=analytics" className={`menu-item ${isActive('/dashboard/institution-admin', 'analytics')}`}>
                        <span className="material-symbols-outlined">dashboard</span>
                        {t('navDashboard')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/institution-admin?tab=doctors" className={`menu-item ${isActive('/dashboard/institution-admin', 'doctors')}`}>
                        <span className="material-symbols-outlined">medical_information</span>
                        {t('navDoctors')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/institution-admin?tab=invitations" className={`menu-item ${isActive('/dashboard/institution-admin', 'invitations')}`}>
                        <span className="material-symbols-outlined">mail</span>
                        {t('navInvitations')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/institution-admin?tab=billing" className={`menu-item ${isActive('/dashboard/institution-admin', 'billing')}`}>
                        <span className="material-symbols-outlined">analytics</span>
                        {t('navBilling')}
                      </Link>
                    </li>
                  </>
                )}

                {/* Doctor Menu */}
                {user.role === 'doctor' && (
                  <>
                    <li>
                      <Link href="/dashboard/doctor" className={`menu-item ${isActive('/dashboard/doctor')}`}>
                        <span className="material-symbols-outlined">dashboard</span>
                        {t('navDashboard')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/doctor/analyze" className={`menu-item ${isActive('/dashboard/doctor/analyze')}`}>
                        <span className="material-symbols-outlined">biotech</span>
                        {t('navScanner')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/doctor/results" className={`menu-item ${isActive('/dashboard/doctor/results')}`}>
                        <span className="material-symbols-outlined">assignment_turned_in</span>
                        {t('navResults')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/doctor/reports" className={`menu-item ${isActive('/dashboard/doctor/reports')}`}>
                        <span className="material-symbols-outlined">description</span>
                        {t('navReports')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/doctor/model-performance" className={`menu-item ${isActive('/dashboard/doctor/model-performance')}`}>
                        <span className="material-symbols-outlined">query_stats</span>
                        {t('navModelPerformance')}
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {t('welcome')}, <strong style={{ color: 'var(--text-main)' }}>{user.firstName}</strong>
              <div style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>Role: {user.role.replace('_', ' ')}</div>
            </div>
            <button className="menu-item" onClick={logout} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'start' }}>
              <span className="material-symbols-outlined">logout</span>
              {t('logout')}
            </button>
          </div>
        </aside>
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] text-slate-400">folder_open</span>
            <span>AIRA</span>
            <span>{"/"}</span>
            <span className="text-primary font-bold">{title || t('logo')}</span>
          </div>

          <div className="topbar-actions">
            {/* Dark Mode Toggle */}
            <button className="toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              <span className="material-symbols-outlined">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Language Switcher */}
            <select 
              className="language-selector" 
              value={lang} 
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">English (EN)</option>
              <option value="ar">العربية (AR)</option>
              <option value="fr">Français (FR)</option>
            </select>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
