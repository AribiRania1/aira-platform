import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { useAuth, API_BASE } from '../../../utils/AuthContext';
import { useLanguage } from '../../../utils/LanguageContext';

export default function ResultsPage() {
  const { apiRequest } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();
  
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.6);
  const [activeImageTab, setActiveImageTab] = useState('overlay'); // 'original', 'mask', 'overlay'
  const [downloading, setDownloading] = useState(false);

  // Helper to format image URLs
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('data:image/') || path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${API_BASE}${path}`;
  };

  const fetchAnalysis = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest(`/api/predict/analysis/${id}`);
      setAnalysis(data);
      if (data.result_stage1 === 'normal') {
        setActiveImageTab('original');
      }
    } catch (err) {
      setError(err.message || "Failed to load analysis details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      if (id) {
        fetchAnalysis(id);
      } else {
        // Fallback to local storage latest result ID
        const latestRaw = localStorage.getItem('aira_latest_result');
        if (latestRaw) {
          try {
            const latest = JSON.parse(latestRaw);
            if (latest.id) {
              fetchAnalysis(latest.id);
            } else {
              setLoading(false);
              setError("No active analysis found. Please run a new scan.");
            }
          } catch (e) {
            setLoading(false);
            setError("Invalid local session data. Please run a new scan.");
          }
        } else {
          setLoading(false);
          setError("No recent scan results detected. Please perform an analysis first.");
        }
      }
    }
  }, [router.isReady, router.query]);

  const handleDownloadReport = async () => {
    if (!analysis) return;
    try {
      setDownloading(true);
      const response = await apiRequest(`/api/predict/report/${analysis.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aira_report_${analysis.patient_id || 'PAT'}_${analysis.id.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Failed to download report: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Layout title={t('navResults')}>
      <div className={`space-y-6 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
        
        {/* Navigation / Back link */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/dashboard/doctor" className="flex items-center gap-1 hover:text-blue-600 font-semibold transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Dashboard</span>
          </Link>
          <span>/</span>
          <Link href="/dashboard/doctor/analyze" className="hover:text-blue-600 transition-colors font-semibold">
            New Scan
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl text-center space-y-4 max-w-md mx-auto">
            <span className="material-symbols-outlined text-5xl text-rose-500">error</span>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Error Loading Results</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{error}</p>
            </div>
            <Link href="/dashboard/doctor/analyze" className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 text-sm">
              Go to Scan Analysis
            </Link>
          </div>
        ) : analysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Viewer (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scan Visualizer</h3>
                
                {analysis.result_stage1 !== 'normal' && (
                  <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl gap-1">
                    <button 
                      onClick={() => setActiveImageTab('original')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeImageTab === 'original'
                          ? 'bg-white dark:bg-slate-850 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      Original
                    </button>
                    <button 
                      onClick={() => setActiveImageTab('mask')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeImageTab === 'mask'
                          ? 'bg-white dark:bg-slate-850 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      Mask
                    </button>
                    <button 
                      onClick={() => setActiveImageTab('overlay')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeImageTab === 'overlay'
                          ? 'bg-white dark:bg-slate-850 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      Overlay
                    </button>
                  </div>
                )}
              </div>

              {/* Viewer Window */}
              <div className="relative w-full aspect-square rounded-2xl bg-slate-950 border border-slate-250 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
                {activeImageTab === 'original' && (
                  <img src={getImageUrl(analysis.file_path)} alt="Original Scan" className="max-w-full max-h-full object-contain" />
                )}

                {activeImageTab === 'mask' && (
                  analysis.mask_path ? (
                    <img src={getImageUrl(analysis.mask_path)} alt="AI Segmentation Mask" className="max-w-full max-h-full object-contain brightness-110 contrast-125" />
                  ) : (
                    <div className="text-sm text-slate-500">No lesion mask available for normal scans.</div>
                  )
                )}

                {activeImageTab === 'overlay' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img src={getImageUrl(analysis.file_path)} alt="Original Scan" className="max-w-full max-h-full object-contain" />
                    {analysis.mask_path && (
                      <img 
                        src={getImageUrl(analysis.mask_path)} 
                        alt="Mask Overlay" 
                        className="absolute max-w-full max-h-full object-contain mix-blend-screen" 
                        style={{ 
                          opacity: overlayOpacity,
                          filter: 'hue-rotate(300deg) saturate(3) brightness(1.2)'
                        }} 
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Slider Opacity */}
              {activeImageTab === 'overlay' && analysis.mask_path && (
                <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40">
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Overlay Transparency</span>
                    <span>{Math.round(overlayOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Right Column: Classification Results (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card 1: Diagnostic Status */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">AI Classification Result</span>
                  <div className="mt-3">
                    {analysis.result_stage1 === 'normal' ? (
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span>{t('normal').toUpperCase()}</span>
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase ${
                        analysis.result_stage2 === 'malignant'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        <span className="material-symbols-outlined text-lg">warning</span>
                        <span>{analysis.result_stage2 === 'malignant' ? t('malignant') : t('benign')}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-150 dark:border-slate-800 pt-6 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Patient Reference</span>
                    <strong className="text-sm text-slate-800 dark:text-slate-200">{analysis.patient_id || 'N/A'}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Analysis Date</span>
                    <span className="text-xs text-slate-650 dark:text-slate-350 font-semibold">{new Date(analysis.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Registry UUID</span>
                  <span className="font-mono text-xs text-slate-450 dark:text-slate-500 break-all">{analysis.id}</span>
                </div>
              </div>

              {/* Card 2: Probability Confidence */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-6">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Neural network confidence levels</h4>
                <div className="space-y-4">
                  {Object.entries(analysis.confidence_score).map(([label, val]) => {
                    const isMalignant = label === 'malignant';
                    const isNormal = label === 'normal';
                    const colorClass = isNormal 
                      ? 'bg-emerald-500' 
                      : (isMalignant ? 'bg-rose-500' : 'bg-amber-500');
                    const textClass = isNormal 
                      ? 'text-emerald-550 dark:text-emerald-400' 
                      : (isMalignant ? 'text-rose-550 dark:text-rose-400' : 'text-amber-550 dark:text-amber-400');
                    const percent = Math.round(val * 100);
                    return (
                      <div key={label} className="space-y-1.5">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="capitalize text-slate-700 dark:text-slate-300">{label}</span>
                          <span className={textClass}>{percent}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                          <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 3: Actions */}
              <div className="p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
                <button 
                  onClick={handleDownloadReport} 
                  disabled={downloading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 text-sm transition-all"
                >
                  {downloading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined text-lg">download</span>
                  )}
                  <span>{downloading ? "Generating PDF..." : "Download PDF Report"}</span>
                </button>
                <Link href="/dashboard/doctor/analyze" className="w-full flex items-center justify-center gap-2 py-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 bg-white dark:bg-slate-950 rounded-xl font-bold text-slate-800 dark:text-slate-200 text-sm transition-all">
                  <span className="material-symbols-outlined text-lg">biotech</span>
                  <span>Perform Another Analysis</span>
                </Link>
              </div>

              {/* Clinical Disclaimer */}
              <div className="text-[10px] text-slate-450 dark:text-slate-500 leading-relaxed text-center px-4">
                {t('disclaimer')}
              </div>

            </div>

          </div>
        ) : null}

      </div>
    </Layout>
  );
}
