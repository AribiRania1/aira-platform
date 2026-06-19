import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useAuth } from '../../utils/AuthContext';
import { useLanguage } from '../../utils/LanguageContext';

export default function DoctorDashboard() {
  const { apiRequest } = useAuth();
  const { t, lang } = useLanguage();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/predict/stats');
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout title={t('navDashboard')}>
      <div className={`space-y-8 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
        
        {/* Dashboard Title & Introduction */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/55 dark:border-slate-800/55">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              {t('navDashboard')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, Doctor. Manage your radiology AI diagnostic evaluations and review platform statistics.
            </p>
          </div>
          <Link href="/dashboard/doctor/analyze" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-xl">biotech</span>
            <span>Start Radiology Analysis</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/30 text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        ) : stats ? (
          <div className="space-y-8">
            
            {/* Stats Cards Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Total */}
              <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full transition-all duration-500 group-hover:scale-110"></div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined text-2xl">bar_chart</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Scans Analysed</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.total}</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Cumulative patient scans processed by you</p>
              </div>

              {/* Card 2: Normal */}
              <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full transition-all duration-500 group-hover:scale-110"></div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <span className="material-symbols-outlined text-2xl">task_alt</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Normal Cases</span>
                    <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats.normal}</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Scans where no abnormalities were identified</p>
              </div>

              {/* Card 3: Abnormal */}
              <div className="relative overflow-hidden group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full transition-all duration-500 group-hover:scale-110"></div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <span className="material-symbols-outlined text-2xl">warning</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Abnormal Cases</span>
                    <h3 className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{stats.abnormal}</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Scans flagged with benign or malignant findings</p>
              </div>

            </div>

            {/* Split Info Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Left 3 columns: Ratios & Breakdown */}
              <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Diagnostic Ratios</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
                  Percentage distribution of patient scan outcomes.
                </p>
                
                <div className="space-y-6">
                  {/* Normal percentage bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">Normal Findings</span>
                      <span className="text-slate-900 dark:text-white">
                        {stats.total > 0 ? Math.round((stats.normal / stats.total) * 100) : 0}% ({stats.normal} cases)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${stats.total > 0 ? (stats.normal / stats.total) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* Abnormal percentage bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">Abnormal Anomalies</span>
                      <span className="text-slate-900 dark:text-white">
                        {stats.total > 0 ? Math.round((stats.abnormal / stats.total) * 100) : 0}% ({stats.abnormal} cases)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${stats.total > 0 ? (stats.abnormal / stats.total) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 2 columns: Deep Learning Model Insights */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900/60 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">query_stats</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4">Deep Learning Insights</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Review specifications, training sets, binary classification curves (Stage 1), and multi-task segmentation masks (Stage 2) generated by our neural network model.
                  </p>
                </div>
                <div className="mt-6">
                  <Link href="/dashboard/doctor/model-performance" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all duration-200">
                    <span>View Model Specifications</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* Recent Analyses Panel */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Your Recent Evaluations</h3>
              
              {stats.recent.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700">clinical_notes</span>
                  <p className="text-sm font-medium">No evaluations performed yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-4">Analysis ID</th>
                        <th className="py-4 px-4">Date Performed</th>
                        <th className="py-4 px-4 text-left">Stage 1 Filter</th>
                        <th className="py-4 px-4 text-right">Pathology (Stage 2)</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {stats.recent.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                          <td className="py-4 px-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">
                            {item.id.substring(0, 8)}...
                          </td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                            {new Date(item.created_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-left">
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
                            ) : (
                              <span className="text-slate-400 dark:text-slate-600">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link href={`/dashboard/doctor/results?id=${item.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all">
                              <span>Details</span>
                              <span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        ) : null}
      </div>
    </Layout>
  );
}
