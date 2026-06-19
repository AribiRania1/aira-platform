import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../utils/AuthContext';
import { useLanguage } from '../../../utils/LanguageContext';

export default function AnalyzePage() {
  const { apiRequest } = useAuth();
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [age, setAge] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [highSensitivity, setHighSensitivity] = useState(true);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setError("Please select a valid image file (PNG, JPG, JPEG).");
    }
  };

  const onFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (patientId) {
      formData.append('patient_id', patientId);
    }

    try {
      const data = await apiRequest('/api/predict', {
        method: 'POST',
        body: formData
      });
      
      // Save result and patient ID for the results page
      localStorage.setItem('aira_latest_result', JSON.stringify({
        ...data,
        patient_id: patientId || 'N/A',
        timestamp: new Date().toISOString()
      }));

      // Redirect to results page
      router.push('/dashboard/doctor/results');
    } catch (err) {
      setError(err.message || "An error occurred during AI analysis. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Layout title={t('navScanner')}>
      <div className={`space-y-6 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
        
        {/* Header Section */}
        <div className="pb-4 border-b border-slate-200/55 dark:border-slate-800/55">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
            {t('scannerTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t('scannerSubtitle')}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Drag & Drop + Preview Area (8/12 span) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Drag & Drop Upload Zone */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onFileDrop}
              onClick={() => document.getElementById('file-upload-input').click()}
              className={`group flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-300 min-h-[350px] ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10' 
                  : 'border-slate-250 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800/80 bg-white dark:bg-slate-900/60 shadow-xl'
              }`}
            >
              <input 
                type="file" 
                id="file-upload-input" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
              />
              
              <div className={`p-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110 ${
                isDragOver ? 'animate-bounce' : ''
              }`}>
                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              </div>

              <div className="mt-4 space-y-2">
                <strong className="block text-base font-bold text-slate-800 dark:text-slate-100">
                  {t('dragDropTitle')}
                </strong>
                <span className="block text-xs text-slate-400 dark:text-slate-500">
                  {t('dragDropSubtitle')}
                </span>
              </div>
              
              <button type="button" className="mt-6 px-5 py-2.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-all duration-200">
                {t('browseFiles')}
              </button>
            </div>

            {/* Selected Scan Preview Container */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">image</span>
                <span>{t('scanPreview')}</span>
              </h3>
              
              {previewUrl ? (
                <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-black flex items-center justify-center">
                  <img src={previewUrl} alt="Selected radiology scan" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10 rounded-xl p-12 flex flex-col items-center justify-center min-h-[250px] text-center text-slate-400 dark:text-slate-600">
                  <span className="material-symbols-outlined text-5xl mb-3">image_search</span>
                  <p className="text-sm font-semibold">{t('scanPreviewPlaceholder')}</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Patient Information & Parameters (4/12 span) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Patient details Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="material-symbols-outlined text-primary text-xl">person_search</span>
                <span>{t('patientDetails')}</span>
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {t('patientIdField')} <span className="text-[10px] text-slate-400 font-normal">({t('optional') || 'Optional'})</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">patient_list</span>
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                      placeholder="e.g. PAT-9821-X"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      {t('ageField')}
                    </label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                      placeholder="45"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      {t('date')}
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Parameters Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="material-symbols-outlined text-primary text-xl">settings_suggest</span>
                <span>{t('analysisParameters')}</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t('highSensitivityMode')}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{t('highSensitivityDesc')}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={highSensitivity}
                      onChange={() => setHighSensitivity(!highSensitivity)}
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500/20 dark:peer-focus:ring-blue-500/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-650 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-900/30 rounded-xl flex gap-2.5">
                  <span className="material-symbols-outlined text-blue-500 text-lg shrink-0">info</span>
                  <p className="text-[11px] leading-relaxed text-blue-650 dark:text-blue-400 italic">
                    {t('highSensitivityWarning')}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/30 text-red-650 dark:text-red-400 font-semibold text-center text-xs">
                {error}
              </div>
            )}

            {/* Action Button */}
            <button 
              onClick={handleAnalyze} 
              disabled={!selectedFile || loading}
              className={`w-full py-4 rounded-xl font-bold text-sm shadow-xl transition-all duration-300 transform ${
                !selectedFile || loading
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none border border-slate-200/20'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('analyzing')}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">network_intelligence_history</span>
                  <span>{t('runAnalysis')}</span>
                </div>
              )}
            </button>

          </div>

        </div>

      </div>
    </Layout>
  );
}
