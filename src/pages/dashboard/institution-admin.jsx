import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../utils/AuthContext';
import { useLanguage } from '../../utils/LanguageContext';

export default function InstitutionAdminDashboard() {
  const { apiRequest } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('analytics');
  
  // Doctors state
  const [doctors, setDoctors] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);

  // Invitations state
  const [invitations, setInvitations] = useState([]);
  const [invsLoading, setInvsLoading] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [codeSuccessMsg, setCodeSuccessMsg] = useState('');

  // Subscription state
  const [subData, setSubData] = useState(null);
  const [subLoading, setSubLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedGateway, setSelectedGateway] = useState('stripe');
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // Stats State
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch doctors
  const fetchDoctors = async () => {
    setDocsLoading(true);
    try {
      const data = await apiRequest('/api/institutions/doctors');
      setDoctors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setDocsLoading(false);
    }
  };

  // Fetch invitations
  const fetchInvitations = async () => {
    setInvsLoading(true);
    try {
      const data = await apiRequest('/api/institutions/invitations');
      setInvitations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setInvsLoading(false);
    }
  };

  // Fetch active subscription
  const fetchSubscription = async () => {
    setSubLoading(true);
    try {
      const data = await apiRequest('/api/subscriptions/active');
      setSubData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSubLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await apiRequest('/api/institutions/stats');
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleToggleDoctorStatus = async (docId, currentStatus) => {
    const actionText = currentStatus === 'active' ? 'suspend' : 'activate';
    if (!confirm(`Are you sure you want to ${actionText} this doctor's account?`)) return;
    try {
      await apiRequest(`/api/institutions/doctors/${docId}/toggle-status`, {
        method: 'POST'
      });
      fetchDoctors();
      fetchStats();
    } catch (err) {
      alert("Failed to toggle status: " + err.message);
    }
  };

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  useEffect(() => {
    if (activeTab === 'doctors') fetchDoctors();
    if (activeTab === 'invitations') fetchInvitations();
    if (activeTab === 'billing') fetchSubscription();
    if (activeTab === 'analytics') fetchStats();
  }, [activeTab]);

  const handleGenerateCode = async (e) => {
    e.preventDefault();
    setCodeSuccessMsg('');
    try {
      const data = await apiRequest('/api/institutions/invitations', {
        method: 'POST',
        body: JSON.stringify({ expires_in_days: expiresInDays })
      });
      setCodeSuccessMsg(`${t('success')}: ${data.code}`);
      fetchInvitations();
    } catch (err) {
      alert("Failed to generate: " + err.message);
    }
  };

  const handleRevokeCode = async (id) => {
    if (!confirm("Revoke this invitation code? It will no longer be usable.")) return;
    try {
      await apiRequest(`/api/institutions/invitations/${id}`, {
        method: 'DELETE'
      });
      fetchInvitations();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpgrade = async (e) => {
    e.preventDefault();
    setUpgradeLoading(true);
    
    const amount = selectedPlan === 'monthly' ? 49.00 : 499.00;
    
    try {
      await apiRequest('/api/subscriptions/upgrade', {
        method: 'POST',
        body: JSON.stringify({
          plan_type: selectedPlan,
          gateway: selectedGateway,
          amount: amount
        })
      });
      alert(t('upgradeSuccess'));
      fetchSubscription();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpgradeLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(t('copied'));
  };

  return (
    <Layout title={t('instAdminDashboard')}>
      <div className={`space-y-8 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
        
        {/* Title & Introduction */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/55 dark:border-slate-800/55">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              {t('instAdminDashboard')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your clinic's practitioners, generate doctor invitation codes, and control your subscription.
            </p>
          </div>
        </div>

        {/* Custom Tab Navigation Bar */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/80 gap-6 overflow-x-auto">
          {[
            { id: 'analytics', label: t('navDashboard'), icon: 'dashboard' },
            { id: 'doctors', label: t('navDoctors'), icon: 'medical_information' },
            { id: 'invitations', label: t('navInvitations'), icon: 'mail' },
            { id: 'billing', label: t('navBilling'), icon: 'credit_card' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        
        {/* TAB 1: ANALYTICS / STATS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {statsLoading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
              </div>
            ) : stats ? (
              <>
                {/* Stats Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full"></div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-2xl">group</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('totalDoctors')}</span>
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.doctors_count}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Active clinical accounts linked to your clinic</p>
                  </div>
                  {/* Card 2 */}
                  <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full"></div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <span className="material-symbols-outlined text-2xl">biotech</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('totalScans')}</span>
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.analyses_count}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Performed by all of your clinic's practitioners</p>
                  </div>
                  {/* Card 3 */}
                  <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full"></div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-2xl">card_membership</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Plan Tier</span>
                        <h3 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 uppercase">{stats.plan_type.replace('_', ' ')}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">{stats.remaining_days} remaining days left in billing cycle</p>
                  </div>
                </div>

                {/* Recent Clinic Activity */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Diagnostic Activities</h3>
                  {stats.recent_analyses.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      No analysis records found for this facility.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <th className="py-4 px-4">Analysis Ref</th>
                            <th className="py-4 px-4">Attending Physician</th>
                            <th className="py-4 px-4">Date & Time</th>
                            <th className="py-4 px-4">Stage 1 Filter</th>
                            <th className="py-4 px-4">Pathology (Stage 2)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                          {stats.recent_analyses.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                              <td className="py-4 px-4 font-mono text-xs text-blue-650 dark:text-blue-400 font-semibold">{item.id.substring(0, 8)}...</td>
                              <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{item.doctor_name}</td>
                              <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{new Date(item.created_at).toLocaleString()}</td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                  item.result_stage1 === 'normal' 
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                                }`}>
                                  {item.result_stage1 === 'normal' ? t('normal') : t('abnormal')}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                {item.result_stage2 ? (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                    item.result_stage2 === 'benign'
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                                      : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400'
                                  }`}>
                                    {item.result_stage2 === 'benign' ? t('benign') : t('malignant')}
                                  </span>
                                ) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">Stats not available.</div>
            )}
          </div>
        )}

        {/* TAB 2: DOCTORS LIST */}
        {activeTab === 'doctors' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t('navDoctors')}</h3>
            {docsLoading ? (
              <div className="flex flex-col justify-center items-center py-12 gap-3">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-slate-350 dark:text-slate-700">medical_information</span>
                <p className="text-sm font-medium">No doctors registered yet. Generate invitation codes to onboard doctors.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-4">{t('firstName')}</th>
                      <th className="py-4 px-4">{t('lastName')}</th>
                      <th className="py-4 px-4">{t('email')}</th>
                      <th className="py-4 px-4">Account Status</th>
                      <th className="py-4 px-4 text-right">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {doctors.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-850 dark:text-slate-200">{doc.first_name}</td>
                        <td className="py-4 px-4 font-bold text-slate-850 dark:text-slate-200">{doc.last_name}</td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{doc.email}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            doc.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => handleToggleDoctorStatus(doc.id, doc.status)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              doc.status === 'active'
                                ? 'bg-red-500/10 text-red-600 hover:bg-red-650 hover:text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/15'
                            }`}
                          >
                            <span>{doc.status === 'active' ? 'Suspend' : 'Activate'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCTOR INVITATIONS */}
        {activeTab === 'invitations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Generate Code Box */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('generateCode')}</h3>
              <form onSubmit={handleGenerateCode} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{t('expiresInDays')}</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 text-sm" 
                    value={expiresInDays}
                    onChange={(e) => setExpiresInDays(e.target.value)}
                    min="1" 
                    max="30"
                    required 
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 text-sm transition-all">
                  {t('generateCode')}
                </button>
              </form>
              
              {codeSuccessMsg && (
                <div className="p-3 rounded-xl border border-emerald-250 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-center text-sm">
                  {codeSuccessMsg}
                </div>
              )}
            </div>

            {/* Active Invitations List */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t('activeInvitations')}</h3>
              {invsLoading ? (
                <div className="flex flex-col justify-center items-center py-12 gap-3">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
                </div>
              ) : invitations.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  No invitation codes generated yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-4">{t('codeColumn')}</th>
                        <th className="py-4 px-4">{t('expiryColumn')}</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {invitations.map(inv => {
                        const isExpired = new Date(inv.expires_at) < new Date();
                        let statusBadge = "unused";
                        let badgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
                        if (inv.is_revoked) {
                          statusBadge = t('revoked');
                          badgeClass = "bg-slate-100 text-slate-650 dark:bg-slate-950/30 dark:text-slate-500";
                        } else if (inv.is_used) {
                          statusBadge = t('used');
                          badgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400";
                        } else if (isExpired) {
                          statusBadge = "Expired";
                          badgeClass = "bg-rose-100 text-rose-850 dark:bg-rose-950/30 dark:text-rose-450";
                        }
                        
                        return (
                          <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white tracking-wider">{inv.code}</td>
                            <td className="py-4 px-4 text-slate-550 dark:text-slate-400">{new Date(inv.expires_at).toLocaleDateString()}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${badgeClass}`}>
                                {statusBadge}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="inline-flex gap-2">
                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-850 dark:text-slate-200" onClick={() => copyToClipboard(inv.code)}>
                                  {t('copy')}
                                </button>
                                {!inv.is_used && !inv.is_revoked && !isExpired && (
                                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-600 hover:bg-red-650 hover:text-white" onClick={() => handleRevokeCode(inv.id)}>
                                    {t('revokeBtn')}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: BILLING */}
        {activeTab === 'billing' && (
          <div className="space-y-8">
            {subLoading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
              </div>
            ) : subData ? (
              <>
                {/* Billing Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <span className="material-symbols-outlined text-2xl">card_membership</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('currentPlan')}</span>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 capitalize">{subData.plan_type.replace('_', ' ')}</h3>
                      <span className="text-xs text-emerald-500 font-bold block mt-1">Status: {subData.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <span className="material-symbols-outlined text-2xl">calendar_today</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('trialDaysRemaining')}</span>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{subData.remaining_days} Days</h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                        {subData.plan_type === 'free_trial' 
                          ? `Trial ends: ${new Date(subData.trial_end_date).toLocaleDateString()}`
                          : `Expires: ${new Date(subData.end_date).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Upgrade Form Card */}
                  <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('upgradePlan')}</h3>
                    <form onSubmit={handleUpgrade} className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Subscription Tier</label>
                        <div className="grid grid-cols-1 gap-3">
                          <label className={`flex p-4 border rounded-xl cursor-pointer items-center gap-3 transition-all ${
                            selectedPlan === 'monthly'
                              ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-350'
                          }`}>
                            <input type="radio" name="plan" checked={selectedPlan === 'monthly'} onChange={() => setSelectedPlan('monthly')} className="text-blue-600 focus:ring-blue-500" />
                            <div>
                              <strong className="block text-sm text-slate-800 dark:text-slate-200">{t('monthlyPlan')}</strong>
                              <span className="block text-xs text-slate-400 mt-0.5">Billed monthly. Cancel anytime.</span>
                            </div>
                          </label>
                          <label className={`flex p-4 border rounded-xl cursor-pointer items-center gap-3 transition-all ${
                            selectedPlan === 'yearly'
                              ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-350'
                          }`}>
                            <input type="radio" name="plan" checked={selectedPlan === 'yearly'} onChange={() => setSelectedPlan('yearly')} className="text-blue-600 focus:ring-blue-500" />
                            <div>
                              <strong className="block text-sm text-slate-800 dark:text-slate-200">{t('yearlyPlan')}</strong>
                              <span className="block text-xs text-slate-400 mt-0.5">Save 15%. Billed annually.</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Simulation Payment Gateway</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">payment</span>
                          <select className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 text-sm appearance-none" value={selectedGateway} onChange={(e) => setSelectedGateway(e.target.value)}>
                            <option value="stripe">{t('payWithStripe')}</option>
                            <option value="paypal">{t('payWithPayPal')}</option>
                          </select>
                        </div>
                      </div>

                      <button type="submit" disabled={upgradeLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 text-sm transition-all">
                        {upgradeLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </div>
                        ) : t('upgradePlan')}
                      </button>
                    </form>
                  </div>

                  {/* Billing History Card */}
                  <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('billingHistory')}</h3>
                    {subData.payments.length === 0 ? (
                      <div className="text-center py-12 text-slate-450 dark:text-slate-500">No payment records found.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                              <th className="py-4 px-4">Transaction ID</th>
                              <th className="py-4 px-4">{t('date')}</th>
                              <th className="py-4 px-4">Amount</th>
                              <th className="py-4 px-4">Gateway</th>
                              <th className="py-4 px-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {subData.payments.map(pay => (
                              <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                                <td className="py-4 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">{pay.transaction_id}</td>
                                <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{new Date(pay.created_at).toLocaleString()}</td>
                                <td className="py-4 px-4 font-bold text-slate-850 dark:text-slate-200">${pay.amount.toFixed(2)} {pay.currency}</td>
                                <td className="py-4 px-4 uppercase text-xs font-bold text-slate-650 dark:text-slate-350">{pay.gateway}</td>
                                <td className="py-4 px-4">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                                    {pay.payment_status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">No subscription details loaded.</div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}
