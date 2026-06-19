import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../utils/AuthContext';
import { useLanguage } from '../../utils/LanguageContext';

export default function SuperAdminDashboard() {
  const { apiRequest } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('analytics');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Requests state
  const [requests, setRequests] = useState([]);
  const [reqsLoading, setReqsLoading] = useState(false);
  const [approvedDetails, setApprovedDetails] = useState(null);

  // Institutions state
  const [institutions, setInstitutions] = useState([]);
  const [instsLoading, setInstsLoading] = useState(false);
  const [instFilter, setInstFilter] = useState('all'); // 'all', 'active', 'suspended'
  const [instSearch, setInstSearch] = useState('');

  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Audit Logs state
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRequests = async () => {
    setReqsLoading(true);
    try {
      const data = await apiRequest('/api/admin/requests');
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setReqsLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    setInstsLoading(true);
    try {
      const data = await apiRequest('/api/admin/institutions');
      setInstitutions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setInstsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const data = await apiRequest('/api/admin/analytics');
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const data = await apiRequest('/api/admin/logs');
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  useEffect(() => {
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'institutions') fetchInstitutions();
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'logs') fetchLogs();
    if (activeTab === 'subscriptions') {
      fetchAnalytics();
      fetchInstitutions();
    }
  }, [activeTab]);

  const handleApprove = async (id) => {
    setApprovedDetails(null);
    try {
      const data = await apiRequest(`/api/admin/requests/${id}/approve`, {
        method: 'POST'
      });
      setApprovedDetails(data);
      fetchRequests();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Reject this institution application?")) return;
    try {
      await apiRequest(`/api/admin/requests/${id}/reject`, {
        method: 'POST'
      });
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSuspend = async (id, suspend) => {
    const action = suspend ? 'suspend' : 'unsuspend';
    if (suspend && !confirm("Suspend this institution? All doctors under this institution will be blocked from access.")) return;
    
    try {
      await apiRequest(`/api/admin/institutions/${id}/${action}`, {
        method: 'POST'
      });
      fetchInstitutions();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter audit logs by search query
  const filteredLogs = logs.filter(log => {
    const query = searchQuery.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(query)) ||
      (log.user_email && log.user_email.toLowerCase().includes(query)) ||
      (log.ip_address && log.ip_address.toLowerCase().includes(query)) ||
      (log.details && log.details.toLowerCase().includes(query))
    );
  });

  // Filter institutions by status and search query
  const filteredInstitutions = institutions.filter(inst => {
    const matchesFilter = instFilter === 'all' || inst.status === instFilter;
    const matchesSearch = inst.name.toLowerCase().includes(instSearch.toLowerCase()) || 
                          inst.registration_number.toLowerCase().includes(instSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sub-render 1: Dashboard Header
  const renderHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/55 dark:border-slate-800/55">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
          {t('superAdminDashboard')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Global Platform Administration Hub. Review system analytics, facility onboarding requests, and audit trails.
        </p>
      </div>
    </div>
  );

  // Sub-render 2: Navigation Tabs Bar
  const renderTabs = () => (
    <div className="flex border-b border-slate-100 dark:border-slate-800/80 gap-6 overflow-x-auto">
      {[
        { id: 'analytics', label: t('navDashboard'), icon: 'dashboard' },
        { id: 'institutions', label: t('allInstitutions'), icon: 'domain' },
        { id: 'requests', label: t('navRequests'), icon: 'rate_review' },
        { id: 'subscriptions', label: t('navBilling'), icon: 'payments' },
        { id: 'logs', label: t('navAuditLogs'), icon: 'admin_panel_settings' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            if (tab.id === 'requests') setApprovedDetails(null);
          }}
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
  );

  // Sub-render 3: TAB 1: Analytics & Metrics Tab
  const renderAnalyticsTab = () => {
    if (analyticsLoading) {
      return (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
        </div>
      );
    }

    if (!analytics) {
      return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Analytics not available.</div>;
    }

    const chartPoints = [
      { month: 'Jan', value: 120, cx: 40, cy: 170 },
      { month: 'Feb', value: 240, cx: 120, cy: 142 },
      { month: 'Mar', value: 230, cx: 200, cy: 144 },
      { month: 'Apr', value: 480, cx: 350, cy: 74 },
      { month: 'Jun', value: 620, cx: 480, cy: 45 }
    ];

    return (
      <div className="space-y-8">
        {/* Bento Grid Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Institutions */}
          <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined text-2xl">domain</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('totalInstitutions')}</span>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{analytics.institutions.total}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">{analytics.institutions.active} Active | {analytics.institutions.pending} Pending</p>
          </div>

          {/* Onboarded Doctors */}
          <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-bl-full"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('totalDoctors')}</span>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{analytics.total_doctors}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Total onboarded medical physicians</p>
          </div>

          {/* Total Diagnoses */}
          <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-bl-full"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <span className="material-symbols-outlined text-2xl">biotech</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('totalScans')}</span>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{analytics.total_analyses}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Cumulative patient scans across system</p>
          </div>

          {/* MRR (Estimated Revenue) */}
          <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('monthlyRevenue')}</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${analytics.revenue_monthly_estimated.toFixed(2)}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Estimated SaaS recurring MRR</p>
          </div>
        </div>

        {/* Charts & Diagnostics Volume Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SVG Diagnostics Trend Chart (2 Columns width on LG screens) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Diagnostic Scan Volume</h3>
            <p className="text-xs text-slate-400 mt-1">Evaluation counts processed system-wide over the last 6 months</p>
            <div className="h-64 w-full relative pt-4">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Chart Grid Lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="4" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="4" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="4" />
                <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="4" />
                
                {/* Color Gradients */}
                <defs>
                  <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2D8CFF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2D8CFF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Fill Area */}
                <path d="M 40 170 Q 120 140 200 145 T 350 70 T 480 45 L 480 170 Z" fill="url(#chart-fill)" />
                
                {/* Trend line */}
                <path d="M 40 170 Q 120 140 200 145 T 350 70 T 480 45" fill="none" stroke="#2D8CFF" strokeWidth="3.5" strokeLinecap="round" />
                
                {/* Dotted indicator line when hovering */}
                {hoveredPoint !== null && (
                  <line 
                    x1={chartPoints[hoveredPoint].cx} 
                    y1="20" 
                    x2={chartPoints[hoveredPoint].cx} 
                    y2="170" 
                    stroke="#2D8CFF" 
                    strokeWidth="1.5" 
                    strokeDasharray="4"
                  />
                )}

                {/* Chart data dots */}
                {chartPoints.map((pt, idx) => (
                  <circle 
                    key={idx}
                    cx={pt.cx} 
                    cy={pt.cy} 
                    r={hoveredPoint === idx ? "7" : "5"} 
                    fill="#2D8CFF" 
                    stroke="#FFFFFF" 
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>
              
              {/* Month Labels */}
              <div className="flex justify-between text-[11px] font-bold text-slate-400/80 px-8 mt-2">
                {chartPoints.map((pt, idx) => (
                  <span key={idx} className={hoveredPoint === idx ? "text-blue-500 font-extrabold" : ""}>
                    {pt.month}
                  </span>
                ))}
              </div>

              {/* Floating Tooltip */}
              {hoveredPoint !== null && (
                <div 
                  className="absolute bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-2.5 rounded-xl border border-slate-700/50 shadow-xl pointer-events-none transition-all duration-150 z-10"
                  style={{
                    left: `${chartPoints[hoveredPoint].cx - 50}px`,
                    top: `${chartPoints[hoveredPoint].cy - 60}px`,
                    width: '100px',
                    textAlign: 'center'
                  }}
                >
                  <div className="font-semibold text-slate-400 uppercase tracking-wider">{chartPoints[hoveredPoint].month}</div>
                  <div className="font-extrabold text-blue-400 text-sm mt-0.5">{chartPoints[hoveredPoint].value} Scans</div>
                </div>
              )}
            </div>
          </div>

          {/* Subscriptions breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Subscription Breakdown</h3>
              <p className="text-xs text-slate-400 mt-1 mb-6">Distribution of plans across onboarded medical facilities</p>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                <div className="flex justify-between py-3">
                  <span className="text-slate-600 dark:text-slate-350">Active Trials:</span>
                  <strong className="text-slate-900 dark:text-white">{analytics.subscriptions.free_trial}</strong>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-600 dark:text-slate-350">Monthly Tier ($49/mo):</span>
                  <strong className="text-slate-900 dark:text-white">{analytics.subscriptions.monthly}</strong>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-600 dark:text-slate-350">Yearly Tier ($499/yr):</span>
                  <strong className="text-slate-900 dark:text-white">{analytics.subscriptions.yearly}</strong>
                </div>
                <div className="flex justify-between py-4">
                  <span className="text-slate-700 dark:text-slate-200 font-bold">Total Active Subscriptions:</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{analytics.subscriptions.active}</strong>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setActiveTab('subscriptions')} className="w-full py-2.5 text-center text-xs font-bold text-blue-600 dark:text-blue-450 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
                Manage Billing Packages
              </button>
            </div>
          </div>
        </div>

        {/* Diagnostic Feeds */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Recent System Diagnostic Feeds</h3>
          <p className="text-xs text-slate-400 mb-6">Real-time trace of AI inferences performed by medical practitioners</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.recent_logs.filter(l => l.action === 'inference_performed').slice(0, 4).map(log => {
              const details = JSON.parse(log.details);
              return (
                <div key={log.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 flex justify-between items-center text-sm transition-all hover:border-slate-200 dark:hover:border-slate-700">
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{log.user_email}</span>
                    <span className="block text-xs text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                    details.result_stage1 === 'normal' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                  }`}>
                    {details.result_stage1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Sub-render 4: TAB 2: Registered Institutions Tab
  const renderInstitutionsTab = () => {
    const countAll = institutions.length;
    const countActive = institutions.filter(i => i.status === 'active').length;
    const countSuspended = institutions.filter(i => i.status === 'suspended').length;

    return (
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 text-sm" 
              placeholder="Search by name or license number..." 
              value={instSearch}
              onChange={(e) => setInstSearch(e.target.value)}
            />
          </div>

          {/* Filter Buttons with Counting Badges */}
          <div className="flex border border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden bg-white dark:bg-slate-950 text-xs font-bold shrink-0 self-start md:self-auto shadow-sm">
            {[
              { id: 'all', label: 'All', count: countAll },
              { id: 'active', label: 'Active', count: countActive },
              { id: 'suspended', label: 'Suspended', count: countSuspended }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setInstFilter(filter.id)}
                className={`px-4 py-2 capitalize transition-colors flex items-center gap-1.5 ${
                  instFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                  instFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Institutions Table */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          {instsLoading ? (
            <div className="flex flex-col justify-center items-center py-12 gap-3">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
            </div>
          ) : filteredInstitutions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No medical institutions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-4">{t('instName')}</th>
                    <th className="py-4 px-4">{t('instType')}</th>
                    <th className="py-4 px-4">{t('regNumber')}</th>
                    <th className="py-4 px-4">{t('currentPlan')}</th>
                    <th className="py-4 px-4">{t('status')}</th>
                    <th className="py-4 px-4 text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredInstitutions.map(inst => (
                    <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-850 dark:text-slate-200">{inst.name}</td>
                      <td className="py-4 px-4 text-slate-550 dark:text-slate-450">{inst.type === 'public_hospital' ? t('publicHospital') : t('privateClinic')}</td>
                      <td className="py-4 px-4 font-mono text-xs text-slate-500">{inst.registration_number}</td>
                      <td className="py-4 px-4 capitalize">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          inst.plan_type === 'free_trial' 
                            ? 'bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400' 
                            : inst.plan_type === 'monthly' 
                              ? 'bg-purple-50/50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' 
                              : 'bg-emerald-50/50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                        }`}>
                          {inst.plan_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          inst.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            inst.status === 'active' 
                              ? 'bg-emerald-500 animate-pulse' 
                              : 'bg-rose-500'
                          }`} />
                          <span>{inst.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {inst.status === 'active' ? (
                          <button className="inline-flex items-center px-3 py-1.5 bg-red-500/10 text-red-650 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-all" onClick={() => handleSuspend(inst.id, true)}>
                            {t('suspendBtn')}
                          </button>
                        ) : inst.status === 'suspended' ? (
                          <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all" onClick={() => handleSuspend(inst.id, false)}>
                            {t('unsuspendBtn')}
                          </button>
                        ) : <span className="text-slate-400">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Sub-render 5: TAB 3: Onboarding Applications Requests Tab
  const renderRequestsTab = () => {
    return (
      <div className="space-y-8">
        {approvedDetails && (
          <div className="p-6 rounded-2xl border border-emerald-250 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/30 space-y-4">
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Institution Approved Successfully</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-350">
              The facility administrator credentials have been provisioned. Please communicate these secure details to the applicant:
            </p>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 font-mono text-sm space-y-1 max-w-md">
              <div><strong>Login Email:</strong> {approvedDetails.admin_email}</div>
              <div><strong>Temporary Password:</strong> {approvedDetails.temporary_password}</div>
            </div>
            <button className="px-5 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg" onClick={() => setApprovedDetails(null)}>
              Dismiss Notification
            </button>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t('pendingRequests')}</h2>
          {reqsLoading ? (
            <div className="flex flex-col justify-center items-center py-12 gap-3">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No pending approval requests.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-4">{t('instName')}</th>
                    <th className="py-4 px-4">{t('instType')}</th>
                    <th className="py-4 px-4">{t('country')}/{t('city')}</th>
                    <th className="py-4 px-4">{t('respPerson')}</th>
                    <th className="py-4 px-4">{t('email')}</th>
                    <th className="py-4 px-4">{t('status')}</th>
                    <th className="py-4 px-4 text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-850 dark:text-slate-200">{req.name}</td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-350">{req.type === 'public_hospital' ? t('publicHospital') : t('privateClinic')}</td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{req.country}, {req.city}</td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{req.responsible_person}</td>
                      <td className="py-4 px-4 text-slate-550 dark:text-slate-400">{req.contact_email}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>{req.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {req.status === 'pending' && (
                          <div className="inline-flex gap-2">
                            <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/10 transition-all" onClick={() => handleApprove(req.id)}>
                              {t('approveBtn')}
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition-all" onClick={() => handleReject(req.id)}>
                              {t('rejectBtn')}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Sub-render 6: TAB 4: Billing & Subscriptions Tab
  const renderSubscriptionsTab = () => {
    if (!analytics) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading billing packages...</div>;

    return (
      <div className="space-y-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Subscription Packages & Distribution</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 text-center">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Active Trials</span>
              <strong className="block text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">{analytics.subscriptions.free_trial}</strong>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 text-center">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Tier ($49)</span>
              <strong className="block text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">{analytics.subscriptions.monthly}</strong>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 text-center">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Yearly Tier ($499)</span>
              <strong className="block text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">{analytics.subscriptions.yearly}</strong>
            </div>
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-500/5 dark:bg-blue-500/10 text-center">
              <span className="block text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">Estimated MRR</span>
              <strong className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">${analytics.revenue_monthly_estimated.toFixed(2)}</strong>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Facility Billing Registry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4">{t('instName')}</th>
                  <th className="py-4 px-4">{t('currentPlan')}</th>
                  <th className="py-4 px-4 text-right">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {institutions.map(inst => (
                  <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-850 dark:text-slate-200">{inst.name}</td>
                    <td className="py-4 px-4 capitalize">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        inst.plan_type === 'free_trial' 
                          ? 'bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400' 
                          : inst.plan_type === 'monthly' 
                            ? 'bg-purple-50/50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' 
                            : 'bg-emerald-50/50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                      }`}>
                        {inst.plan_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        inst.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inst.status === 'active' 
                            ? 'bg-emerald-500 animate-pulse' 
                            : 'bg-rose-500'
                        }`} />
                        <span>{inst.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Sub-render 7: TAB 5: Audit Log Tab
  const renderLogsTab = () => {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('systemLogsTitle')}</h2>
            <p className="text-xs text-slate-400 mt-1">Platform-wide events and clinical operations audit trail</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 text-sm" 
              placeholder={t('searchLogs')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {logsLoading ? (
          <div className="flex flex-col justify-center items-center py-12 gap-3">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No audit logs matches search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4">{t('date')}</th>
                  <th className="py-4 px-4">{t('userEmailCol')}</th>
                  <th className="py-4 px-4">{t('actionCol')}</th>
                  <th className="py-4 px-4">{t('detailsCol')}</th>
                  <th className="py-4 px-4">{t('ipCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-650 dark:text-slate-350">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{log.user_email || 'System / Guest'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                        log.action.includes('approve') 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : log.action.includes('suspend') || log.action.includes('reject') || log.action.includes('lock')
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                            : 'bg-blue-50 text-blue-750 dark:bg-blue-950/20 dark:text-blue-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono max-w-[280px] truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-4 px-4 font-mono">{log.ip_address || '127.0.0.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout title={t('superAdminDashboard')}>
      <div className={`space-y-8 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
        
        {/* Title & Introduction */}
        {renderHeader()}

        {/* Navigation Tabs */}
        {renderTabs()}

        {/* Active Tab Panel Content */}
        <div className="mt-6">
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'institutions' && renderInstitutionsTab()}
          {activeTab === 'requests' && renderRequestsTab()}
          {activeTab === 'subscriptions' && renderSubscriptionsTab()}
          {activeTab === 'logs' && renderLogsTab()}
        </div>

      </div>
    </Layout>
  );
}
