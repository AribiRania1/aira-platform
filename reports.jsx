import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../utils/AuthContext';
import { useLanguage } from '../../../utils/LanguageContext';

export default function ReportsPage() {
  const { apiRequest } = useAuth();
  const { t, lang } = useLanguage();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [patientIdFilter, setPatientIdFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  
  // Downloading state track
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string
      const params = new URLSearchParams();
      if (patientIdFilter.trim()) {
        params.append('patient_id', patientIdFilter.trim());
      }
      if (resultFilter) {
        params.append('result_stage1', resultFilter);
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const data = await apiRequest(`/api/predict/history${queryString}`);
      setHistory(data);
    } catch (err) {
      setError(err.message || "Failed to load reports history.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on filter changes with a slight delay
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchHistory();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [patientIdFilter, resultFilter]);

  const handleClearFilters = () => {
    setPatientIdFilter('');
    setResultFilter('');
  };

  const handleDownloadReport = async (item) => {
    try {
      setDownloadingId(item.id);
      const response = await apiRequest(`/api/predict/report/${item.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aira_report_${item.patient_id || 'PAT'}_${item.id.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Failed to download report: " + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Layout title={t('navReports')}>
      <div className={`space-y-8 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/55 dark:border-slate-800/55">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              Patient Diagnostic History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Browse and retrieve previous radiology scan results and generated clinical reports.
            </p>
          </div>
          <Link href="/dashboard/doctor/analyze" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-xl">biotech</span>
            <span>New Scan Analysis</span>
          </Link>
        </div>

        {/* Filter Controls Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:flex-1 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Search Patient ID</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">search</span>
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all text-sm" 
                placeholder="e.g. PAT-9821-X"
                value={patientIdFilter}
                onChange={(e) => setPatientIdFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-64 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Scan Classification</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg font-normal">tune</span>
              <select 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all text-sm appearance-none" 
                value={resultFilter} 
                onChange={(e) => setResultFilter(e.target.value)}
              >
                <option value="">All Scans</option>
                <option value="normal">Normal</option>
                <option value="abnormal">Abnormal</option>
              </select>
            </div>
          </div>

          {(patientIdFilter || resultFilter) && (
            <button 
              onClick={handleClearFilters}
              className="w-full md:w-auto px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* List Grid Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl min-h-[350px] flex flex-col">
          {loading && history.length === 0 ? (
            <div className="m-auto flex flex-col justify-center items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
            </div>
          ) : error ? (
            <div className="m-auto text-center text-sm font-medium text-rose-500">
              {error}
            </div>
          ) : history.length === 0 ? (
            <div className="m-auto text-center space-y-4 text-slate-500 dark:text-slate-400 flex flex-col items-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700">folder_open</span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-200">No screening records found</h3>
                <p className="text-xs text-slate-400">
                  {patientIdFilter || resultFilter ? "Try adjusting your search terms or filters." : "Perform a new analysis to get started."}
                </p>
              </div>
              {!patientIdFilter && !resultFilter && (
                <Link href="/dashboard/doctor/analyze" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 text-sm">
                  Analyze Radiology Scan
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-4">Patient ID</th>
                    <th className="py-4 px-4">Date & Time</th>
                    <th className="py-4 px-4">Primary Finding</th>
                    <th className="py-4 px-4">Pathology</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {item.patient_id || <span className="text-xs font-normal text-slate-400 dark:text-slate-600">N/A</span>}
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
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
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex gap-2">
                          <Link href={`/dashboard/doctor/results?id=${item.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            <span>{t('view')}</span>
                          </Link>
                          <button 
                            onClick={() => handleDownloadReport(item)}
                            disabled={downloadingId === item.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all ${
                              downloadingId === item.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {downloadingId === item.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <span className="material-symbols-outlined text-sm">download</span>
                            )}
                            <span>PDF Report</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
