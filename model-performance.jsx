import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import { useLanguage } from '../../../utils/LanguageContext';

export default function ModelPerformance() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('dataset');
  const [modalImage, setModalImage] = useState(null);

  const closeModel = () => setModalImage(null);

  return (
    <Layout title="AI Model Specifications">
      <div className={`space-y-8 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
        
        {/* Title & Introduction */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/55 dark:border-slate-800/55">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              Neural Network Specifications
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore deep learning model specifications, training sets, binary filters, and multi-task segmentation metrics.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/80 gap-6 overflow-x-auto">
          {[
            { id: 'dataset', label: 'Dataset Specifications', icon: 'database' },
            { id: 'stage1', label: 'Stage 1: Binary Filter', icon: 'filter_alt' },
            { id: 'stage2', label: 'Stage 2: Multi-Task U-Net', icon: 'layers' }
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

        {/* Tab Contents */}
        
        {/* TAB 1: DATASET */}
        {activeTab === 'dataset' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Grid 1: Class distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dataset Class Distribution</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    The model was trained on a comprehensive dataset of radiology scans containing normal, benign, and malignant samples. 
                    Normal cases are underrepresented, which is resolved via <strong>4x oversampling</strong> during Stage 1 training to ensure class balance.
                  </p>
                </div>
                <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Benign Samples</span>
                    <strong className="text-slate-800 dark:text-slate-250">437 (56.0%)</strong>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Malignant Samples</span>
                    <strong className="text-slate-800 dark:text-slate-250">210 (26.9%)</strong>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Normal Samples</span>
                    <strong className="text-slate-800 dark:text-slate-250">133 (17.1%)</strong>
                  </div>
                </div>
              </div>

              <div 
                className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex items-center justify-center cursor-zoom-in overflow-hidden"
                onClick={() => setModalImage('/class_distribution.png')}
              >
                <img src="/class_distribution.png" alt="Class Distribution Plot" className="max-w-full max-h-[300px] object-contain rounded-xl hover:scale-102 transition-transform duration-300" />
              </div>
            </div>

            {/* Grid 2: Sample explorations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div 
                className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex items-center justify-center cursor-zoom-in overflow-hidden"
                onClick={() => setModalImage('/sample_exploration.png')}
              >
                <img src="/sample_exploration.png" alt="Dataset Sample Exploration" className="max-w-full max-h-[300px] object-contain rounded-xl hover:scale-102 transition-transform duration-300" />
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col justify-center space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Radiology Scan Sample Visuals</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  The dataset features high-definition grayscale radiology scans with annotated ground-truth lesion masks. Benign abnormalities exhibit clear, circumscribed boundaries, while malignant lesions demonstrate irregular, speculative edges. Normal scans contain no abnormal regions.
                </p>
              </div>
            </div>

            {/* Augmentations */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Data Augmentation Pipeline</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  To improve model generalization, the training pipeline employs elastic transformations, grid distortion, Gaussian noise, horizontal/vertical flips, and brightness/contrast shifts.
                </p>
              </div>
              <div 
                className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-xl cursor-zoom-in overflow-hidden flex items-center justify-center"
                onClick={() => setModalImage('/augmentation_preview.png')}
              >
                <img src="/augmentation_preview.png" alt="Augmentation Pipeline Preview" className="max-w-full max-h-[350px] object-contain rounded-lg hover:scale-101 transition-transform" />
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: STAGE 1 */}
        {activeTab === 'stage1' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">Active Stage 1 Model</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">ResNet18 Binary Classifier</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Stage 1 utilizes a pre-trained ResNet18 backbone, freezing early layers and fine-tuning layer 4 and the fully connected heads. It acts as an initial filter classifying scans into <strong>Normal</strong> or <strong>Abnormal</strong>.
                  </p>
                </div>
                <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Best Validation Accuracy</span>
                    <strong className="text-slate-900 dark:text-white">96.8%</strong>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Precision (Abnormal)</span>
                    <strong className="text-slate-900 dark:text-white">98.1%</strong>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Recall (Abnormal)</span>
                    <strong className="text-slate-900 dark:text-white">95.4%</strong>
                  </div>
                </div>
              </div>

              <div 
                className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex items-center justify-center cursor-zoom-in overflow-hidden"
                onClick={() => setModalImage('/stage_1_binary_classifier_history.png')}
              >
                <img src="/stage_1_binary_classifier_history.png" alt="Stage 1 Training History" className="max-w-full max-h-[300px] object-contain rounded-xl hover:scale-102 transition-transform duration-300" />
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div 
                className="lg:col-span-6 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex items-center justify-center cursor-zoom-in overflow-hidden"
                onClick={() => setModalImage('/stage_1_confusion_matrix.png')}
              >
                <img src="/stage_1_confusion_matrix.png" alt="Stage 1 Confusion Matrix" className="max-w-full max-h-[300px] object-contain rounded-xl hover:scale-102 transition-transform duration-300" />
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col justify-center space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Binary Classifier Confusion Matrix</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  The confusion matrix shows exceptional separation. Abnormal scans are accurately detected, minimizing false negatives to preserve patient safety (crucial in clinical diagnostic workflows).
                </p>
              </div>
            </div>

            {/* Qualitative predictions */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Qualitative Binary Predictions</h3>
              <div 
                className="p-4 border border-slate-100 dark:border-slate-800/65 rounded-xl cursor-zoom-in overflow-hidden flex items-center justify-center"
                onClick={() => setModalImage('/stage1_predictions.png')}
              >
                <img src="/stage1_predictions.png" alt="Stage 1 Prediction Samples" className="max-w-full max-h-[350px] object-contain rounded-lg hover:scale-101 transition-transform" />
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: STAGE 2 */}
        {activeTab === 'stage2' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">Active Stage 2 Model</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Multi-Task U-Net (ResNet34)</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Stage 2 uses a multi-task U-Net architecture to perform pixel-wise lesion segmentation and classification (Benign vs Malignant) simultaneously. It only triggers when Stage 1 indicates an Abnormal scan.
                  </p>
                </div>
                <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Best Dice Coefficient</span>
                    <strong className="text-slate-900 dark:text-white">84.2%</strong>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Mean IoU (Segmentation)</span>
                    <strong className="text-slate-900 dark:text-white">78.9%</strong>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Classification Accuracy</span>
                    <strong className="text-slate-900 dark:text-white">91.4%</strong>
                  </div>
                </div>
              </div>

              <div 
                className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex items-center justify-center cursor-zoom-in overflow-hidden"
                onClick={() => setModalImage('/stage2_history.png')}
              >
                <img src="/stage2_history.png" alt="Stage 2 Training History" className="max-w-full max-h-[300px] object-contain rounded-xl hover:scale-102 transition-transform duration-300" />
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div 
                className="lg:col-span-6 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex items-center justify-center cursor-zoom-in overflow-hidden"
                onClick={() => setModalImage('/stage_2_diagnostic_confusion_matrix.png')}
              >
                <img src="/stage_2_diagnostic_confusion_matrix.png" alt="Stage 2 Confusion Matrix" className="max-w-full max-h-[300px] object-contain rounded-xl hover:scale-102 transition-transform duration-300" />
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl flex flex-col justify-center space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Diagnostic Classification Matrix</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Shows the model's accuracy when differentiating benign cysts from malignant nodules. Combined Loss (DiceBCE + CrossEntropy) ensures both the segmentation boundaries and classification labels are optimized jointly.
                </p>
              </div>
            </div>

            {/* Qualitative predictions */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Qualitative Segmentations & Classifications</h3>
              <div 
                className="p-4 border border-slate-100 dark:border-slate-800/65 rounded-xl cursor-zoom-in overflow-hidden flex items-center justify-center"
                onClick={() => setModalImage('/final_qualitative_results.png')}
              >
                <img src="/final_qualitative_results.png" alt="Stage 2 Qualitative Results" className="max-w-full max-h-[350px] object-contain rounded-lg hover:scale-101 transition-transform" />
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Expanded Modal Overlay */}
      {modalImage && (
        <div 
          onClick={closeModel}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center cursor-zoom-out animate-fadeIn"
        >
          <div className="max-w-4xl max-h-[85vh] p-2 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
            <img src={modalImage} alt="Expanded view" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </Layout>
  );
}
