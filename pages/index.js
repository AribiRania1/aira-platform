import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { useAuth } from '../utils/AuthContext';
import { useLanguage } from '../utils/LanguageContext';
import { useTheme } from '../utils/ThemeContext';

const localTranslations = {
  en: {
    heroTag: "AI-DRIVEN RADIOLOGY ANALYSIS",
    heroTitle1: "Early Detection,",
    heroTitle2: "Enhanced by AI.",
    heroSubtitle: "Leading the future of radiology scan analysis for hospitals and clinics worldwide. Empowering radiologists with precision tools to save lives through earlier detection.",
    doctorPortalBtn: "Doctor Workstation",
    adminPortalBtn: "Administration Hub",
    registerInstBtn: "Register Institution",
    registerDocBtn: "Register as Doctor",
    trustText: "TRUSTED BY LEADING CHUs & CLINICS",
    // Features
    featuresTitle: "Unmatched Precision, Seamless Workflow",
    featuresSubtitle: "Designed by radiologists for radiologists, AIRA integrates seamlessly into your clinical environment.",
    feat1Title: "AI-Powered Analysis",
    feat1Desc: "Our deep learning algorithms analyze pixel-level data to identify structural anomalies and target regions that are invisible to the naked eye.",
    feat2Title: "99% Accuracy Support",
    feat2Desc: "Clinically validated datasets ensure our support tools minimize false positives while maximizing sensitivity for early stage diagnosis.",
    feat3Title: "Secure Cloud Storage",
    feat3Desc: "HIPAA and GDPR compliant cloud infrastructure ensures patient data is always encrypted, accessible, and safe from unauthorized access.",
    feat4Title: "Integrated Reporting",
    feat4Desc: "Generate comprehensive radiology reports in seconds. AIRA automatically populates findings into your existing hospital PACS systems.",
    // How it works
    howItWorksTitle: "Simplified Diagnostic Workflow",
    step1Title: "Upload Scan",
    step1Desc: "Securely upload medical radiology scans or images directly from your imaging equipment or PACS system.",
    step2Title: "Analyze",
    step2Desc: "AIRA's AI engine performs a deep scan, identifying potential areas of concern within seconds.",
    step3Title: "Report",
    step3Desc: "Review annotated results and finalize clinical reports with automated finding summaries.",
    // Testimonials
    testimonialsTitle: "Trusted by Healthcare Leaders",
    test1Text: '"AIRA has transformed our workflow. The AI\'s ability to spot subtle patterns has increased our diagnostic confidence significantly."',
    test1Author: "Dr. Sarah Chen",
    test1Role: "Head of Radiology, Metro Health",
    test2Text: '"Integration was seamless. Our clinic processed 20% more cases in the first month with AIRA\'s automated reporting support."',
    test2Author: "Marc Dupont",
    test2Role: "Director, Clinique du Parc",
    test3Text: '"The accuracy for detecting structural anomalies is impressive. It serves as a vital second pair of eyes for our radiology team."',
    test3Author: "Prof. Layla Mansour",
    test3Role: "Radiology Department, CHU Rabat",
    // Final CTA
    ctaTitle: "Ready to upgrade your radiology practice?",
    ctaSubtitle: "Join the hundreds of medical institutions using AIRA to improve patient outcomes through early detection.",
    // Portals section title
    portalsTitle: "Access Portals & Registration",
    portalsSubtitle: "Select the appropriate portal to log in, or register your facility below.",
    portalDocTitle: "Doctor Portal",
    portalDocDesc: "Access workstation for scan uploads, AI prediction maps, and patient report creation.",
    portalAdminTitle: "Admin & Institution Hub",
    portalAdminDesc: "Manage staff accounts, generate invite codes, and review system audit trails or billing.",
    portalRegisterTitle: "New Clinic Registration",
    portalRegisterDesc: "Submit an application for your medical facility to gain full clinical access to AIRA.",
    portalDocRegTitle: "Onboard as Doctor",
    portalDocRegDesc: "If you received an invitation code, use it here to create your practitioner account.",
    dashboardBtn: "Go to Dashboard",
    signInBtn: "Sign In",
    demoBtn: "Request Demo",
    footerLogoSubtitle: "Leading the future of radiology scan analysis for hospitals and clinics worldwide. AI-driven precision for better healthcare.",
    features: "Features",
    howItWorks: "How It Works",
    testimonials: "Testimonials",
    portals: "Portals",
    allRightsReserved: "© 2026 AIRA Medical AI. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contactSupport: "Contact Support"
  },
  ar: {
    heroTag: "تحليل صور الأشعة بالذكاء الاصطناعي",
    heroTitle1: "الكشف المبكر،",
    heroTitle2: "مدعوماً بالذكاء الاصطناعي.",
    heroSubtitle: "نقود مستقبل تحليل صور الأشعة للمستشفيات والعيادات حول العالم. نمكّن أطباء الأشعة بالأدوات الأكثر دقة لإنقاذ الأرواح من خلال الكشف المبكر.",
    doctorPortalBtn: "بوابة الأطباء",
    adminPortalBtn: "بوابة الإدارة الطبية",
    registerInstBtn: "تسجيل منشأة جديدة",
    registerDocBtn: "تسجيل حساب طبيب",
    trustText: "موضع ثقة في كبرى المستشفيات الجامعية CHU والعيادات",
    featuresTitle: "دقة لا مثيل لها، وتدفق عمل سلس",
    featuresSubtitle: "صُممت آيرا بواسطة أطباء أشعة من أجل أطباء الأشعة، وهي تندمج بسلاسة في بيئتك السريرية.",
    feat1Title: "تحليل مدعوم بالذكاء الاصطناعي",
    feat1Desc: "تُحلل خوارزميات التعلم العميق البيانات على مستوى البيكسل لتحديد التشوهات الهيكلية والمناطق المصابة غير المرئية بالعين المجردة.",
    feat2Title: "دعم دقة يصل لـ 99%",
    feat2Desc: "تضمن قواعد البيانات الموثقة إكلينيكياً تقليل القراءات الإيجابية الخاطئة مع رفع الحساسية لتشخيص الحالات المبكرة.",
    feat3Title: "تخزين سحابي آمن",
    feat3Desc: "بنية تحتية متوافقة تماماً مع معايير HIPAA و GDPR تضمن تشفير بيانات المرضى وحمايتها من الوصول غير المصرح به.",
    feat4Title: "تقارير طبية مدمجة",
    feat4Desc: "أنشئ تقارير أشعة شاملة في ثوانٍ. تقوم آيرا بتعبئة النتائج تلقائياً في أنظمة PACS الخاصة بالمستشفى.",
    howItWorksTitle: "تدفق عمل تشخيصي مبسط",
    step1Title: "رفع الأشعة",
    step1Desc: "ارفع صور الأشعة الطبية بأمان مباشرة من جهاز التصوير أو نظام PACS.",
    step2Title: "التحليل",
    step2Desc: "يقوم محرك الذكاء الاصطناعي بفحص عميق للورم وتحديد الخلايا المشتبه بها خلال ثوانٍ معدودة.",
    step3Title: "التقرير",
    step3Desc: "راجع النتائج المزودة بتحديد الورم واستخرج التقارير الطبية المعتمدة للتحميل.",
    testimonialsTitle: "موضع ثقة قادة الرعاية الصحية",
    test1Text: "«لقد غيرت آيرا طريقة عملنا بالكامل. قدرة الذكاء الاصطناعي على كشف الأنماط الدقيقة زادت ثقتنا التشخيصية بشكل كبير.»",
    test1Author: "د. سارة تشن",
    test1Role: "رئيسة قسم الأشعة، مترو هيلث",
    test2Text: "«كان الدمج سلساً للغاية. استطاعت عيادتنا معالجة حالات أكثر بنسبة 20% في الشهر الأول بمساعدة تقارير آيرا المؤتمتة.»",
    test2Author: "مارك دوبونت",
    test2Role: "مدير عيادة بارك كلينيك",
    test3Text: "«دقة كشف الأورام والتشوهات الهيكلية مبهرة حقاً. آيرا تمثل عيناً ثانية بالغة الأهمية لفريق الأشعة لدينا.»",
    test3Author: "أ.د. ليلى منصور",
    test3Role: "قسم الأشعة، المستشفى الجامعي بالرباط",
    ctaTitle: "هل أنت مستعد لترقية عيادتك الأشعة؟",
    ctaSubtitle: "انضم إلى مئات المؤسسات الطبية التي تستخدم آيرا لتحسين نتائج المرضى من خلال الكشف المبكر.",
    portalsTitle: "بوابات الوصول والتسجيل",
    portalsSubtitle: "اختر البوابة المناسبة لتسجيل الدخول، أو قدم طلب تسجيل لمنشأتك الطبية.",
    portalDocTitle: "بوابة الأطباء المعالجين",
    portalDocDesc: "ادخل إلى محطة عمل الطبيب لرفع الفحوصات الطبية، ورسم خرائط الذكاء الاصطناعي، واستخراج التقارير.",
    portalAdminTitle: "بوابة الإدارة والمستشفيات",
    portalAdminDesc: "قم بإدارة حسابات الأطباء، وتوليد رموز الدعوة، ومراجعة سجلات الأمان أو باقات الفوترة.",
    portalRegisterTitle: "تسجيل مستشفى/عيادة جديدة",
    portalRegisterDesc: "قدم طلباً لاعتماد مستشفاك أو عيادتك الخاصة للانضمام والحصول على كامل الصلاحيات الطبية للمنصة.",
    portalDocRegTitle: "انضمام طبيب جديد بالرمز",
    portalDocRegDesc: "إذا تلقيت رمز دعوة من إدارتك الطبية، استخدمه هنا لإنشاء حساب ممارس طبي خاص بك.",
    dashboardBtn: "الانتقال للوحة التحكم",
    signInBtn: "تسجيل الدخول",
    demoBtn: "طلب نسخة تجريبية",
    footerLogoSubtitle: "ريادة مستقبل تحليل صور الأشعة حول العالم. دقة مدعومة بالذكاء الاصطناعي لرعاية صحية أفضل.",
    features: "المميزات",
    howItWorks: "كيف يعمل؟",
    testimonials: "آراء الأطباء",
    portals: "بوابات الدخول",
    allRightsReserved: "© 2026 آيرا للذكاء الاصطناعي الطبي. جميع الحقوق محفوظة.",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    contactSupport: "الاتصال بالدعم الفني"
  },
  fr: {
    heroTag: "ANALYSE DE RADIOGRAPHIES PROPULSÉE PAR L'IA",
    heroTitle1: "Détection Précoce,",
    heroTitle2: "Optimisée par l'IA.",
    heroSubtitle: "Pionnier de l'avenir de l'analyse des radiographies pour les hôpitaux et cliniques du monde entier. Donner aux radiologues des outils de précision pour sauver des vies grâce à un diagnostic précoce.",
    doctorPortalBtn: "Poste de Travail Médecin",
    adminPortalBtn: "Espace Administration",
    registerInstBtn: "Enregistrer l'Établissement",
    registerDocBtn: "S'inscrire comme Médecin",
    trustText: "APPROUVÉ PAR LES PLUS GRANDS CHU & CLINIQUES",
    // Features
    featuresTitle: "Précision Inégalée, Flux de Travail Fluide",
    featuresSubtitle: "Conçu par des radiologues pour des radiologues, AIRA s'intègre parfaitement dans votre environnement clinique.",
    feat1Title: "Analyse Propulsée par l'IA",
    feat1Desc: "Nos algorithmes d'apprentissage profond analysent les données au pixel près pour identifier les anomalies structurelles invisibles à l'œil nu.",
    feat2Title: "Précision de Support à 99%",
    feat2Desc: "Des ensembles de données cliniquement validés garantissent que nos outils minimisent les faux positifs tout en maximisant la sensibilité.",
    feat3Title: "Stockage SÉCURISÉ dans le Cloud",
    feat3Desc: "Une infrastructure conforme HIPAA et RGPD garantit que les données des patients sont chiffrées, accessibles et protégées.",
    feat4Title: "Rapports Médicaux Intégrés",
    feat4Desc: "Générez des rapports radiologiques complets en quelques secondes. AIRA exporte automatiquement les résultats vers vos systèmes PACS.",
    // How it works
    howItWorksTitle: "Flux de Diagnostic Simplifié",
    step1Title: "Téléchargement",
    step1Desc: "Téléchargez en toute sécurité vos radiographies et images médicales directement depuis vos appareils d'imagerie ou PACS.",
    step2Title: "Analyse",
    step2Desc: "Le moteur d'IA d'AIRA effectue un balayage profond, identifiant les zones suspectes en quelques secondes.",
    step3Title: "Rapport",
    step3Desc: "Passez en revue les résultats annotés et finalisez vos rapports médicaux avec des résumés automatisés.",
    // Testimonials
    testimonialsTitle: "Témoignages",
    test1Text: '"AIRA a transformé notre flux de travail. La capacité de l\'IA à repérer des anomalies subtiles a considérablement renforcé notre confiance diagnostique."',
    test1Author: "Dr. Sarah Chen",
    test1Role: "Chef du Service Radiologie, Metro Health",
    test2Text: '"L\'intégration a été un succès. Notre clinique a traité 20% de cas en plus dès le premier mois grâce à la génération automatisée des rapports."',
    test2Author: "Marc Dupont",
    test2Role: "Directeur, Clinique du Parc",
    test3Text: '"La précision de détection des anomalies structurelles est impressionnante. C\'est un second regard précieux pour notre équipe de radiologues."',
    test3Author: "Prof. Layla Mansour",
    test3Role: "Département Radiologie, CHU Rabat",
    // Final CTA
    ctaTitle: "Prêt à moderniser votre cabinet de radiologie?",
    ctaSubtitle: "Rejoignez les centaines d'institutions médicales utilisant AIRA pour améliorer les résultats des patients grâce au dépistage précoce.",
    // Portals
    portalsTitle: "Portails d'Accès & Inscription",
    portalsSubtitle: "Sélectionnez le portail approprié pour vous connecter ou enregistrer votre établissement.",
    portalDocTitle: "Portail des Médecins",
    portalDocDesc: "Accédez à la station de travail pour analyser les clichés, afficher les cartes IA, et éditer des rapports de diagnostic.",
    portalAdminTitle: "Espace Administrateur & Hôpital",
    portalAdminDesc: "Gerez les comptes des praticiens, générez des codes d'invitation, et consultez les journaux d'audit et la facturation.",
    portalRegisterTitle: "Inscrire une Nouvelle Clinique",
    portalRegisterDesc: "Soumettez une demande d'enregistrement pour votre établissement médical afin d'obtenir un accès clinique complet.",
    portalDocRegTitle: "Rejoindre en tant que Praticien",
    portalDocRegDesc: "Si vous disposez d'un code d'invitation généré par votre établissement, créez votre compte praticien ici.",
    dashboardBtn: "Aller au Tableau de Bord",
    signInBtn: "Se Connecter",
    demoBtn: "Demander une Démo",
    footerLogoSubtitle: "À l'avant-garde de l'analyse des radiographies. Une précision guidée par l'IA pour de meilleurs soins.",
    features: "Fonctionnalités",
    howItWorks: "Comment ça marche",
    testimonials: "Témoignages",
    portals: "Portails",
    allRightsReserved: "© 2026 AIRA Medical AI. Tous droits réservés.",
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'Utilisation",
    contactSupport: "Contacter le Support"
  }
};

export default function Index() {
  const { user, loading } = useAuth();
  const { lang, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Local state for translations
  const t = (key) => {
    const activeLang = lang === 'ar' || lang === 'fr' ? lang : 'en';
    return localTranslations[activeLang][key] || key;
  };

  // Synchronize HTML dark class for Tailwind CSS
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Quick helper to redirect logged-in user
  const handleDashboardRedirect = () => {
    if (user) {
      if (user.role === 'super_admin') {
        Router.push('/dashboard/super-admin');
      } else if (user.role === 'institution_admin') {
        Router.push('/dashboard/institution-admin');
      } else {
        Router.push('/dashboard/doctor');
      }
    }
  };

  return (
    <div className={`min-h-screen bg-[#f7f9fb] dark:bg-[#0b0f19] text-[#191c1e] dark:text-[#f8faf5] transition-colors duration-300 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Head>
        <title>AIRA - AI Radiology Assistant</title>
        <meta name="description" content="Leading the future of radiology analysis for hospitals and clinics worldwide." />
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
                      DEFAULT: "#2D8CFF",
                      hover: "#1a7ae6",
                      container: "#2D8CFF"
                    },
                    secondary: {
                      DEFAULT: "#F8D7E8",
                      container: "#F8D7E8"
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
        <style dangerouslySetInnerHTML={{
          __html: `
            .glass-card {
              background: rgba(255, 255, 255, 0.7);
              backdrop-filter: blur(16px);
              border: 1px solid rgba(255, 255, 255, 0.5);
              box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
            }
            .dark .glass-card {
              background: rgba(21, 27, 44, 0.65);
              border: 1px solid rgba(255, 255, 255, 0.05);
              box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            }
            .soft-blue-shadow {
              box-shadow: 0px 10px 30px rgba(45, 140, 255, 0.06);
            }
            .dark .soft-blue-shadow {
              box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
            }
            .font-arabic {
              font-family: 'IBM Plex Sans Arabic', sans-serif;
            }
            .font-sans {
              font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
            }
            .rtl-mirror {
              transform: scaleX(-1);
            }
          `
        }} />
      </Head>

      {/* Top Bar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 bg-[#f7f9fb]/70 dark:bg-[#0b0f19]/75 backdrop-blur-xl border border-gray-200/40 dark:border-gray-800/40 rounded-2xl h-16 shadow-lg shadow-blue-500/5">
        <div className="flex justify-between items-center px-6 h-full w-full mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="AIRA Logo" className="h-10 w-auto object-contain" />
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-gray-600 dark:text-gray-300 font-medium hover:text-primary transition-colors cursor-pointer" href="#features">{t('features')}</a>
            <a className="text-gray-600 dark:text-gray-300 font-medium hover:text-primary transition-colors cursor-pointer" href="#how-it-works">{t('howItWorks')}</a>
            <a className="text-gray-600 dark:text-gray-300 font-medium hover:text-primary transition-colors cursor-pointer" href="#testimonials">{t('testimonials')}</a>
            <a className="text-gray-600 dark:text-gray-300 font-medium hover:text-primary transition-colors cursor-pointer" href="#portals">{t('portals')}</a>
          </nav>

          {/* Actions: Theme, Lang, Portal */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" onClick={toggleTheme} title="Toggle Theme">
              <span className="material-symbols-outlined flex items-center justify-center text-[20px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Language Selector */}
            <select 
              className="p-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs md:text-sm font-semibold cursor-pointer"
              value={lang} 
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="fr">FR</option>
            </select>

            {/* Account Dashboard Shortcut or Demo CTA */}
            {user ? (
              <button onClick={handleDashboardRedirect} className="bg-primary hover:bg-primary-hover text-white font-semibold px-4 md:px-6 py-2 rounded-xl soft-blue-shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                {t('dashboardBtn')}
              </button>
            ) : (
              <a href="#portals" className="bg-primary hover:bg-primary-hover text-white font-semibold px-4 md:px-6 py-2 rounded-xl soft-blue-shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                {t('signInBtn')}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main content wrapper */}
      <main className="pt-20">
        
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-[#0b0f19] border-b border-gray-100 dark:border-gray-900">
          <div className="absolute inset-0 z-0 opacity-40">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>
          </div>

          <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-12 items-center relative z-10 py-12">
            
            {/* Left Column (Hero copy) */}
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                {t('heroTag')}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                {t('heroTitle1')} <br/>
                <span className="text-primary">{t('heroTitle2')}</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                {t('heroSubtitle')}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                {user ? (
                  <button onClick={handleDashboardRedirect} className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-xl soft-blue-shadow transition-all transform hover:scale-[1.03] active:scale-[0.97]">
                    {t('dashboardBtn')}
                  </button>
                ) : (
                  <>
                    <a href="#portals" className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-xl soft-blue-shadow transition-all transform hover:scale-[1.03] active:scale-[0.97]">
                      {t('signInBtn')}
                    </a>
                    <Link href="/register-institution" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      {t('registerInstBtn')}
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-4 pt-6 grayscale opacity-60">
                <span className="text-xs font-bold text-gray-500 tracking-widest">{t('trustText')}</span>
              </div>
            </div>

            {/* Right Column (Clinical Mockup Card) */}
            <div className="md:col-span-5 relative">
              <div className="relative glass-card rounded-3xl p-3 overflow-hidden soft-blue-shadow bg-white/40 dark:bg-gray-900/30">
                <img 
                  className="w-full rounded-2xl object-cover aspect-[4/3]" 
                  alt="Professional radiologist analyzing digital scans"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3nnyRzSDUVzjrWeH_xqYy6xNXyqtq63XNdUQtD5Nn0VOSKWgFGDHIuz8bVF1SSk_RO84k-7oziCosXeJ2HDiJEXS33s81phcV3grEqhQhATr3N76zad9yrzkr65WOH--aVSifUsiZT_zmQE2bwJn_7L-nVkQ5V1iV1GbTCKPJXAodV25SJI250GXHEB5639b33I8GgPk_W2d_wnz7RWWs_YdjwdtSYrT_8FYUjIHcE0WgTDLFRvm2BfiI5xLT5leyfduxhzUFtaE"
                />
                
                {/* Float Badge */}
                <div className={`absolute bottom-6 ${lang === 'ar' ? 'right-6' : 'left-6'} glass-card p-3 rounded-2xl flex items-center gap-3 animate-bounce duration-[3000ms]`}>
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#705765] flex items-center justify-center">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-gray-800 dark:text-white">AI Diagnostics</p>
                    <p className="text-[10px] text-gray-500">99% Clinically Validated</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Portals Section */}
        <section id="portals" className="py-20 bg-gray-50 dark:bg-[#0c1221] border-b border-gray-100 dark:border-gray-900">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">{t('portalsTitle')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('portalsSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              
              {/* Doctor Portal Login */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 soft-blue-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">medical_information</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('portalDocTitle')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('portalDocDesc')}</p>
                </div>
                <div className="mt-8">
                  <Link href="/login-doctor" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold py-3 px-4 rounded-xl transition-colors">
                    <span>{t('doctorPortalBtn')}</span>
                    <span className={`material-symbols-outlined text-sm ${lang === 'ar' ? 'rtl-mirror' : ''}`}>arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Admin Portal Login */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 soft-blue-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('portalAdminTitle')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('portalAdminDesc')}</p>
                </div>
                <div className="mt-8">
                  <Link href="/login" className="w-full flex items-center justify-center gap-2 bg-[#1e2640] hover:bg-[#151b2c] text-white text-sm font-bold py-3 px-4 rounded-xl transition-colors border border-gray-700">
                    <span>{t('adminPortalBtn')}</span>
                    <span className={`material-symbols-outlined text-sm ${lang === 'ar' ? 'rtl-mirror' : ''}`}>arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Institution Registration */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 soft-blue-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">domain_add</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('portalRegisterTitle')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('portalRegisterDesc')}</p>
                </div>
                <div className="mt-8">
                  <Link href="/register-institution" className="w-full flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 text-sm font-bold py-3 px-4 rounded-xl transition-colors">
                    <span>{t('registerInstBtn')}</span>
                    <span className={`material-symbols-outlined text-sm ${lang === 'ar' ? 'rtl-mirror' : ''}`}>arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Doctor Registration */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 soft-blue-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">key</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('portalDocRegTitle')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('portalDocRegDesc')}</p>
                </div>
                <div className="mt-8">
                  <Link href="/register-doctor" className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-bold py-3 px-4 rounded-xl transition-colors">
                    <span>{t('registerDocBtn')}</span>
                    <span className={`material-symbols-outlined text-sm ${lang === 'ar' ? 'rtl-mirror' : ''}`}>arrow_forward</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-20 bg-white dark:bg-[#0b0f19] border-b border-gray-100 dark:border-gray-900">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">{t('featuresTitle')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('featuresSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {/* Feature 1 (Large card) */}
              <div className="lg:col-span-2 glass-card rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center transition-transform hover:scale-[1.01] soft-blue-shadow">
                <div className="flex-1 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">chip_extraction</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('feat1Title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t('feat1Desc')}</p>
                </div>
                <div className="flex-1 w-full h-56 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative">
                  <img 
                    className="w-full h-full object-cover opacity-80" 
                    alt="Neural network processing visualization"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXnYV1AvxkZuknjulZvrLCpMwwemH-qYyTmJYnkq_mHGLoRW0n216d3HxDIh_ASfsvn7_ueVjEJT91PfKn0ZM6vZz9bVAn-w87fKZMp0XVXnskPRG7c7L9eHaj_i2FUs4y7pvXSIvDVC-fwbzjUKdNfC9tdAUoAKY4QkhwXYfXhEfrKB9Rybg-Wsl0QM81ApkgvIaywpkQByl1UCsZ3cPGnUplsgUnxGPNzCt9_0ItC4Nm24o6hZvdKPHWoVv3mKW7QS8nV1By-V0"
                  />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="glass-card rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-transform hover:scale-[1.01] bg-primary text-white soft-blue-shadow">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6">
                  <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{t('feat2Title')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{t('feat2Desc')}</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="glass-card rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-transform hover:scale-[1.01] soft-blue-shadow">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center text-[#705765] mb-6">
                  <span className="material-symbols-outlined text-[28px]">cloud_sync</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('feat3Title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t('feat3Desc')}</p>
                </div>
              </div>

              {/* Feature 4 (Large card) */}
              <div className="lg:col-span-2 glass-card rounded-3xl p-8 md:p-10 flex flex-col md:flex-row-reverse gap-8 items-center transition-transform hover:scale-[1.01] soft-blue-shadow">
                <div className="flex-1 space-y-4">
                  <div className="w-12 h-12 bg-[#705765]/10 rounded-2xl flex items-center justify-center text-[#705765]">
                    <span className="material-symbols-outlined text-[28px]">monitoring</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('feat4Title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t('feat4Desc')}</p>
                </div>
                <div className="flex-1 w-full h-56 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Clinical analytics reporting system dashboard mockup"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiQqP1HPa22u9rD3cJ7tklhPEG5ZlFxc5RmFhqlQCivi4jJI_Kf0FqRbZcVJ78-ZwlvqaPju5HWeeTIVR5wI-oGHpu0osIO6wMOaRB7e8sTUlvm_PSw_sWUbJ9p6OVmG8Vh-nYI3q-8EPs7SmRX3wjdxfYL_-Fg1iqJw7ppOUk6uIByPTjRSp6H75bROPpSYPL19AXAifO7xwRlD4LvMTInioJ4_JHhVMnXG63TcDCSJ8ZuamN1N_JCJNpmfTsq-Jj6nSs-o7hScM"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-[#0c1221] border-b border-gray-100 dark:border-gray-900">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              
              {/* Stepper info */}
              <div className="space-y-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('howItWorksTitle')}</h2>
                <div className="space-y-8">
                  
                  {/* Step 1 */}
                  <div className="flex gap-6">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('step1Title')}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t('step1Desc')}</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-6">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('step2Title')}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t('step2Desc')}</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-6">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('step3Title')}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t('step3Desc')}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Graphic container */}
              <div className="relative">
                <div className="aspect-square bg-primary/5 rounded-[40px] absolute inset-0 -rotate-3 scale-105"></div>
                <div className="aspect-square glass-card rounded-[40px] overflow-hidden relative z-10 p-6 shadow-md bg-white/50 dark:bg-gray-900/40">
                  <img 
                    className="w-full h-full object-cover rounded-3xl" 
                    alt="Isometric representation of clinical medical data flows"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbC8zRLiByQaUV8B5HD-Moc_KA_sUn5QyvUnUJXsy6fLIKO339lEEQCuRW9e5fEYb2vJRLK1VoNb_6EwCUHcbJxEskxmm3Ks5teHvJMunGX1ODoGuFu12PzJU9oNC8edbD3cJxEl3M9ZJgd1t_3KSGXZvROecZZ3fMUkivr1f9_4-aQhgM9bCejfyM5MbcUWvCDzZ9IcL9CY8xllrD8TDjc3LOntq71ldNJsli6UW7counYKwHpLGwOcQX8DK0qFGSwS_AISHaJsM"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-white dark:bg-[#0b0f19] border-b border-gray-100 dark:border-gray-900">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">{t('testimonialsTitle')}</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Testimonial 1 */}
              <div className="glass-card p-8 rounded-3xl soft-blue-shadow flex flex-col justify-between h-full bg-white/40 dark:bg-gray-900/30">
                <div className="space-y-6">
                  <div className="flex text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">{t('test1Text')}</p>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Sarah Chen"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5nEn4Qhr2Bk6MJ_SMZilpAnGChdSVhNp93F2OJW81dGUxROtyphIzxeCKHrPDUbTv4CapWkYjNuDd2Nae7cufH56MMWoCDAfOYGotoDqj-wDE4l-QabMf7cuSsEPgM3iFYtl8QDBO4xYnFZXcMMPDLsB6VSVFl5dp1-1WN-OJVs8RIOwPuCvAPfdKycOL-kjyA09HxUOJgVN_CRKB9Gn4aN0IrsL0M8ISB96K7rkxPRC-humjF1-Z3F-rCW0Fvx65p8DgniKx3H4"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-900 dark:text-white">{t('test1Author')}</p>
                    <p className="text-[10px] text-gray-500">{t('test1Role')}</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="glass-card p-8 rounded-3xl soft-blue-shadow flex flex-col justify-between h-full bg-white/40 dark:bg-gray-900/30">
                <div className="space-y-6">
                  <div className="flex text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">{t('test2Text')}</p>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Marc Dupont"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA97wS_imPxvA-fOYwY2m_pN_HS3CBz9UdWeK9NeMYs45iNOiZYRUmrjDmD0LVry1sogGT_sY3eUSmJME4jYofKoT766D7uywjs-IFADnl16w27X748bU_VJjb39AjuCPo66Fd0ssQq9E7elyDSn7GJmK2RqNHVc6st6BJWdkIUmrhPJq3YtDuara5oBACvCpTuF-XDEkNtZewWixwPZVbHCqm1RljH_u7QDm0FCQ4OPzwnM3cttVViE4wPMTOspSOWgAdbJH-ikZ4"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-900 dark:text-white">{t('test2Author')}</p>
                    <p className="text-[10px] text-gray-500">{t('test2Role')}</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="glass-card p-8 rounded-3xl soft-blue-shadow flex flex-col justify-between h-full bg-white/40 dark:bg-gray-900/30">
                <div className="space-y-6">
                  <div className="flex text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">{t('test3Text')}</p>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Prof. Layla Mansour"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxaoIExwShspPe9w2mJn29aB3fizqjQhhNDV0hh5J5hv1lpDpN52AM8ZquqCDRkUkEhqM6O7VIetac69qlByOO95cOKT_rbL1jiSl9R2cHNeB_m__1jdCepQJdfHsE4jtFo90CJx_kWUHltrkmwPSw60Aen5yY8I4BfQivm9-1t9NgGhwiQH6wF6lVFxk8SpTQx0XIiRCfRr7nEB2Sr2Txws09YE34i_CYDvbQgj5z6JHrFxYGV38Sq5mNldJmCWvbkQyR0csTWRE"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-900 dark:text-white">{t('test3Author')}</p>
                    <p className="text-[10px] text-gray-500">{t('test3Role')}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-20 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 z-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3"></div>
          </div>
          <div className="container mx-auto px-6 md:px-12 text-center relative z-10 max-w-4xl space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold">{t('ctaTitle')}</h2>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{t('ctaSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a href="#portals" className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-opacity-95 transition-all shadow-md transform hover:scale-[1.02] active:scale-[0.98]">
                {t('signInBtn')}
              </a>
              <Link href="/register-institution" className="border border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                {t('registerInstBtn')}
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#090d16] border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div className="space-y-4 max-w-xs">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logo.svg" alt="AIRA Logo" className="h-8 w-auto object-contain" />
              </Link>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t('footerLogoSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div className="space-y-3">
                <p className="font-bold text-xs uppercase tracking-wider text-gray-400">Platform</p>
                <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <li><a className="hover:text-primary transition-colors" href="#features">AI Diagnostics</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#how-it-works">PACS Integration</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#portals">Clinical Portals</a></li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-xs uppercase tracking-wider text-gray-400">Contact & Support</p>
                <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <li><a className="hover:text-primary transition-colors" href="mailto:raniaarb19@gmail.com">raniaarb19@gmail.com</a></li>
                  <li><a className="hover:text-primary transition-colors" href="mailto:Hadidkaouther64@gmail.com">Hadidkaouther64@gmail.com</a></li>
                </ul>
              </div>
              <div className="space-y-3 col-span-2 sm:col-span-1">
                <p className="font-bold text-xs uppercase tracking-wider text-gray-400">Language</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button onClick={() => changeLanguage('en')} className={`px-2 py-1 rounded text-xs ${lang === 'en' ? 'bg-primary text-white font-bold' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>English</button>
                  <button onClick={() => changeLanguage('ar')} className={`px-2 py-1 rounded text-xs ${lang === 'ar' ? 'bg-primary text-white font-bold' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>العربية</button>
                  <button onClick={() => changeLanguage('fr')} className={`px-2 py-1 rounded text-xs ${lang === 'fr' ? 'bg-primary text-white font-bold' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>Français</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
            <p>{t('allRightsReserved')}</p>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#">{t('privacyPolicy')}</a>
              <a className="hover:text-primary transition-colors" href="#">{t('termsOfService')}</a>
              <a className="hover:text-primary transition-colors" href="mailto:raniaarb19@gmail.com,Hadidkaouther64@gmail.com">{t('contactSupport')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
