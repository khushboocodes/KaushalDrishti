import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'EN' | 'HI';

export const DICTIONARY_HI: Record<string, string> = {
  // Navigation & Shell
  'Dashboard': 'डैशबोर्ड (कमान केंद्र)',
  'Demand & Supply': 'मांग एवं आपूर्ति',
  'Forecasting': 'पूर्वानुमान इंजन',
  'Sectors & Trades': 'क्षेत्र एवं व्यवसाय',
  'Geographic View': 'भौगोलिक विश्लेषण',
  'Training Capacity': 'प्रशिक्षण क्षमता',
  'Alerts & Insights': 'सचेतक एवं अंतर्दृष्टि',
  'Recommendations': 'योजना सिफारिशें',
  'Reports': 'रिपोर्ट एवं निर्यात',
  'Data Explorer': 'डेटा अन्वेषक',
  'Settings': 'सिस्टम सेटिंग्स',
  'Policy Sandbox': 'पॉलिसी सैंडबॉक्स',
  'What-If Policy Simulation Sandbox & Capacity Engine': 'व्हॉट-इफ़ नीति सिमुलेशन सैंडबॉक्स एवं क्षमता इंजन',
  'Search sector, trade, district..': 'क्षेत्र, व्यवसाय, जिला खोजें..',
  'Recent Skill Shortage Alerts': 'हाल के कौशल कमी सचेतक',
  'View all': 'सभी देखें',
  'Switch Officer Role / Credentials': 'अधिकारी पद / क्रेडेंशियल्स बदलें',
  'Sign Out to Login Page': 'लॉगिन पृष्ठ पर साइन आउट करें',
  'Jurisdiction:': 'अधिकार क्षेत्र:',
  'Jurisdiction: ': 'अधिकार क्षेत्र: ',
  'Jurisdiction': 'अधिकार क्षेत्र',
  'Active Officer:': 'सक्रिय अधिकारी:',
  'Skilled India': 'कुशल भारत',
  'Stronger India': 'सशक्त भारत',
  'Return to Dashboard': 'डैशबोर्ड पर वापस जाएं',
  'Module Access Restricted': 'मॉड्यूल पहुंच प्रतिबंधित',
  'RBAC ACCESS RESTRICTION': 'आरबीएसी पहुंच प्रतिबंध',

  // Time periods & horizons
  'Yearly': 'वार्षिक',
  'Quarterly': 'त्रैमासिक',
  'Next 1 Year': 'आगामी 1 वर्ष',
  'Next 3 Years': 'आगामी 3 वर्ष',
  'Next 5 Years': 'आगामी 5 वर्ष',
  'Last 1 Year': 'गत 1 वर्ष',
  'FY 2026–27': 'वित्तीय वर्ष 2026-27',
  'Horizon: Next 3 Years': 'क्षितिज: आगामी 3 वर्ष',
  'Horizon: Next 1 Year': 'क्षितिज: आगामी 1 वर्ष',
  'Horizon: Next 5 Years': 'क्षितिज: आगामी 5 वर्ष',
  'Horizon: Last 1 Year': 'क्षितिज: गत 1 वर्ष',
  '1 Year': '1 वर्ष',
  '3 Years': '3 वर्ष',
  '5 Years': '5 वर्ष',

  // Filter selections
  'All States': 'सभी राज्य',
  'All Districts': 'सभी ज़िले',
  'All Sectors': 'सभी क्षेत्र',
  'All': 'सभी',
  'Undersupply': 'न्यून आपूर्ति (कमी)',
  'Balanced': 'संतुलित',
  'Oversupply': 'अति आपूर्ति',
  'High Growth': 'उच्च वृद्धि',

  // KPIs & Chart Legends
  'Total Job Demand': 'कुल रोजगार मांग',
  'Trained Candidates': 'प्रशिक्षित उम्मीदवार',
  'Demand-Supply Gap': 'मांग-आपूर्ति अंतर',
  'High-Growth Trades': 'तीव्र वृद्धि वाले व्यवसाय',
  'Total Trades': 'कुल व्यवसाय',
  'Quick Insights': 'त्वरित अंतर्दृष्टि',
  'Explore trades': 'व्यवसाय देखें',
  'Explore trades →': 'व्यवसाय देखें →',
  'Job Demand vs Trained Candidates': 'रोजगार मांग बनाम प्रशिक्षित उम्मीदवार',
  'Demand-Supply Status (All Trades)': 'मांग-आपूर्ति स्थिति (समस्त व्यवसाय)',
  'Job Demand': 'रोजगार मांग',
  'Reference NSQF & NCO-2015 trade mapping': 'संदर्भ एनएसक्यूएफ एवं एनसीओ-2015 व्यवसाय मानचित्रण',

  // Sectors
  'Healthcare': 'स्वास्थ्य सेवा (हेल्थकेयर)',
  'Green Jobs': 'हरित कार्य (ग्रीन जॉब्स)',
  'IT/ITeS': 'सूचना प्रौद्योगिकी (आईटी/आईटीईएस)',
  'Construction': 'निर्माण (कंस्ट्रक्शन)',
  'Automotive': 'ऑटोमोटिव',
  'Electronics': 'इलेक्ट्रॉनिक्स',
  'Retail & Logistics': 'खुदरा एवं रसद',
  'Agriculture': 'कृषि एवं संबद्ध',
  'Apparel & Textiles': 'परिधान एवं वस्त्र',
  'Tourism & Hospitality': 'पर्यटन एवं आतिथ्य',

  // Demand & Supply Page
  'Demand & Supply Reconciliation': 'मांग एवं आपूर्ति समाधान',
  'Granular trade-by-district demand vs certified supply gap ledger across NSQF levels': 'एनएसक्यूएफ स्तरों पर जिला-वार मांग बनाम प्रमाणित आपूर्ति अंतर बहीखाता',
  'Aggregate Demand': 'कुल अनुमानित मांग',
  'Certified Supply Pipeline': 'प्रमाणित आपूर्ति पाइपलाइन',
  'Net Deficit (Shortfall)': 'शुद्ध कमी (घाटा)',
  'Balanced Trades': 'संतुलित व्यवसाय',
  'Across 36 States & UTs': '36 राज्यों एवं केंद्र शासित प्रदेशों में',
  'ITIs, PMKVY 4.0 & Polytechnics': 'आईटीआई, पीएमकेवीवाई 4.0 और पॉलिटेक्निक',
  'Demand exceeds capacity': 'मांग प्रशिक्षण क्षमता से अधिक है',
  'Equilibrium ±5%': 'संतुलन ±5%',
  'Shortage Trades Ledger': 'कमी वाले व्यवसायों का बहीखाता',
  'Trade Name & NCO': 'व्यवसाय का नाम एवं एनसीओ',
  'Sector': 'क्षेत्र',
  'District / State': 'जिला / राज्य',
  'Demand': 'मांग',
  'Supply': 'आपूर्ति',
  'Deficit Gap': 'कमी अंतर',
  'Gap %': 'अंतर %',
  'Status': 'स्थिति',
  'Action': 'कार्रवाई',
  'Export CSV Ledger': 'सीएसवी बहीखाता निर्यात करें',
  'Filter by State': 'राज्य द्वारा फ़िल्टर करें',
  'Filter by Sector': 'क्षेत्र द्वारा फ़िल्टर करें',
  'Search trade, NCO, district...': 'व्यवसाय, एनसीओ, जिला खोजें...',

  // Forecasting Page
  'Skill Demand Forecasting': 'कौशल मांग पूर्वानुमान',
  'AI-powered forecasts to plan training capacity and resources': 'प्रशिक्षण क्षमता और संसाधनों की योजना बनाने हेतु एआई-संचालित पूर्वानुमान',
  'Forecast Controls & Scenario Modeling': 'पूर्वानुमान नियंत्रण एवं परिदृश्य मॉडलिंग',
  'Select Sector': 'क्षेत्र चुनें',
  'Select Focus Trade': 'लक्षित व्यवसाय चुनें',
  'Forecast Horizon': 'पूर्वानुमान क्षितिज',
  'Current Demand': 'वर्तमान मांग',
  'Projected Demand': 'अनुमानित मांग',
  'Recommended Seats': 'अनुशंसित सीटें',
  'Projected Gap': 'अनुमानित अंतर',
  'Demand Trajectory (AI Model Prediction)': 'मांग प्रक्षेपवक्र (एआई मॉडल भविष्यवाणी)',
  'Confidence Interval': 'विश्वास अंतराल',
  'Growth Drivers & Technology Signals': 'वृद्धि कारक एवं प्रौद्योगिकी संकेत',
  'Download Projection Report': 'प्रक्षेपण रिपोर्ट डाउनलोड करें',
  'Scenario: Baseline Trajectory': 'परिदृश्य: आधारभूत प्रक्षेपवक्र',
  'Scenario: Aggressive MSME Growth (+18%)': 'परिदृश्य: तीव्र एमएसएमई वृद्धि (+18%)',
  'Scenario: Green Industrial Transition (+24%)': 'परिदृश्य: हरित औद्योगिक संक्रमण (+24%)',

  // Sectors & Trades Page
  'National Sectors & Qualifications Standards': 'राष्ट्रीय क्षेत्र एवं योग्यता मानक',
  'Sector-wise Analysis': 'क्षेत्र-वार विश्लेषण',
  'Monitor National Occupational Standards (NOS), curriculum obsolescence, and NSQF credit distribution': 'राष्ट्रीय व्यावसायिक मानक (NOS), पाठ्यक्रम अप्रचलन और एनएसक्यूएफ क्रेडिट वितरण की निगरानी',
  'Compare demand, supply, growth and skill gaps across sectors': 'विभिन्न क्षेत्रों में मांग, आपूर्ति, वृद्धि और कौशल अंतर की तुलना करें',
  'Sector Performance Matrix': 'क्षेत्र प्रदर्शन मैट्रिक्स',
  'High-Growth & Critical Trades': 'उच्च वृद्धि एवं महत्वपूर्ण व्यवसाय',
  'Active SSCs': 'सक्रिय एसएससाइज',
  'Accredited Trades': 'प्रत्यायित व्यवसाय',
  'Revise Curriculum': 'पाठ्यक्रम संशोधित करें',
  'Review Standards': 'मानकों की समीक्षा करें',
  'Export NOS Matrix': 'एनओएस मैट्रिक्स निर्यात करें',
  'NSQF Level': 'एनएसक्यूएफ स्तर',
  'Duration': 'अवधि',
  'Curriculum Status': 'पाठ्यक्रम स्थिति',
  'Obsolescence Risk': 'अप्रचलन जोखिम',
  'Key Competencies': 'प्रमुख दक्षता',

  // Geographic View Page
  'State & District Skill Intelligence Map': 'राज्य एवं जिला कौशल आसूचना मानचित्र',
  'Interactive geographical visualization of demand, supply and priority intervention zones': 'मांग, आपूर्ति और प्राथमिकता वाले हस्तक्षेप क्षेत्रों का संवादात्मक भौगोलिक मानचित्रण',
  'Map View': 'मानचित्र दृश्य',
  'Heatmap Layer': 'हीटमैप स्तर',
  'State Leaderboard': 'राज्य तालिका',
  'District Details': 'ज़िला विवरण',
  'High Shortage Zones': 'गंभीर कमी वाले क्षेत्र',
  'Select Region': 'क्षेत्र चुनें',
  'Demand Concentration': 'मांग एकाग्रता',
  'Supply Capacity': 'आपूर्ति क्षमता',
  'Skill Deficit': 'कौशल घाटा',

  // Training Capacity Page
  'National Training Capacity & Infrastructure': 'राष्ट्रीय प्रशिक्षण क्षमता एवं अवसंरचना',
  'ITI, NSTI, and PMKK training provider seat sanctions, batch utilization and instructor readiness': 'आईटीआई, एनएसटीआई और पीएमकेके प्रशिक्षण प्रदाता सीट मंजूरी, बैच उपयोग और प्रशिक्षक तत्परता',
  'Total Training Centers': 'कुल प्रशिक्षण केंद्र',
  'Sanctioned ITI Seats': 'स्वीकृत आईटीआई सीटें',
  'Capacity Utilization': 'क्षमता उपयोग दर',
  'Certified Instructors': 'प्रमाणित प्रशिक्षक',
  'Accredited across India': 'अखिल भारतीय स्तर पर मान्यता प्राप्त',
  'Annual intake capacity': 'वार्षिक प्रवेश क्षमता',
  'National average': 'राष्ट्रीय औसत',
  'TOT certified': 'टीओटी प्रमाणित',
  'Training Center Allocation Ledger': 'प्रशिक्षण केंद्र आवंटन बहीखाता',
  'Sanction New ITI Seats': 'नई आईटीआई सीटें स्वीकृत करें',
  'Center Name': 'केंद्र का नाम',
  'Type': 'प्रकार',
  'Location': 'स्थान',
  'Sanctioned': 'स्वीकृत',
  'Enrolled': 'नामांकित',
  'Utilization': 'उपयोग',

  // Alerts & Insights Page
  'Early warnings for emerging shortages and saturation risks': 'उभरती कमी और संतृप्ति जोखिमों के लिए पूर्व चेतावनियां',
  'Critical Shortage': 'गंभीर कमी',
  'Emerging High Growth': 'उभरती उच्च वृद्धि',
  'Saturation Warning': 'संतृप्ति चेतावनी',
  'Curriculum Obsolescence': 'पाठ्यक्रम अप्रचलन',
  'View Recommendations': 'सिफारिशें देखें',
  'Severity': 'तीव्रता',
  'Action Timeline': 'कार्रवाई समयसीमा',
  'Alert Category': 'सचेतक श्रेणी',
  'Immediate Intervention Required': 'तत्काल हस्तक्षेप आवश्यक',
  'Review in DSC Agenda': 'डीएससी कार्यसूची में समीक्षा करें',

  // Planning Recommendations Page
  'AI-Powered Planning & Policy Recommendations': 'एआई-संचालित योजना एवं नीतिगत सिफारिशें',
  'Actionable strategic interventions for MSDE, State SSDMs, and District Skill Committees': 'एमएसडीई, राज्य एसएसडीएम और जिला कौशल समितियों के लिए कार्ययोजना रणनीतिक हस्तक्षेप',
  'Strategic Interventions': 'रणनीतिक हस्तक्षेप',
  'Approve Recommendation': 'सिफारिश स्वीकृत करें',
  'Sanction Allocation': 'आवंटन स्वीकृत करें',
  'Estimated Impact': 'अनुमानित प्रभाव',
  'Priority Score': 'प्राथमिकता स्कोर',
  'Target District': 'लक्षित जिला',
  'Implementation Cost': 'कार्यान्वयन लागत',

  // Reports Page
  'Executive Reports & Policy Dossiers': 'कार्यकारी रिपोर्ट एवं नीति विवरणिका',
  'Generate DPDP-compliant statutory reports, state briefing notes, and district skill development plans (DSDP)': 'डीपीडीपी-अनुपालक वैधानिक रिपोर्ट, राज्य ब्रीफिंग नोट्स और जिला कौशल विकास योजनाएं (डीएसडीपी) तैयार करें',
  'Generate New Report': 'नई रिपोर्ट तैयार करें',
  'Available Dossiers & Statutory Audits': 'उपलब्ध विवरणिकाएं एवं वैधानिक ऑडिट',
  'Download PDF': 'पीडीएफ डाउनलोड करें',
  'Download CSV': 'सीएसवी डाउनलोड करें',
  'Report Type': 'रिपोर्ट का प्रकार',
  'Coverage Scope': 'कवरेज दायरा',
  'Generated On': 'तैयार किया गया',

  // Data Explorer Page
  'Labour Market Data Explorer': 'श्रम बाज़ार डेटा अन्वेषक',
  'Deep query engine for multi-dimensional analysis of PLFS, Periodic Labour Force Survey, and EPFO hiring trends': 'पीएलएफएस और ईपीएफओ भर्ती प्रवृत्तियों के बहुआयामी विश्लेषण हेतु गहन क्वेरी इंजन',
  'Query Filters & Dimensions': 'क्वेरी फिल्टर एवं आयाम',
  'Total Matched Records': 'कुल मिलान रिकॉर्ड',
  'Export Dataset (CSV)': 'डेटासेट निर्यात करें (सीएसवी)',
  'Export JSON': 'जेएसओएन निर्यात करें',
  'Search query..': 'खोजें..',

  // Settings Page
  'Platform & Planner Settings': 'प्लेटफ़ॉर्म एवं योजनाकार सेटिंग्स',
  'Configure MSDE planner profile, regional jurisdiction defaults, and early-warning shortage thresholds': 'एमएसडीई योजनाकार प्रोफ़ाइल, क्षेत्रीय अधिकार क्षेत्र और पूर्व-चेतावनी कमी सीमाएं कॉन्फ़िगर करें',
  'Planner Profile & Jurisdiction': 'योजनाकार प्रोफ़ाइल एवं अधिकार क्षेत्र',
  'Acute Shortage Trigger Threshold': 'गंभीर कमी ट्रिगर सीमा',
  'Notification & Digest Preferences': 'अधिसूचना एवं सार प्राथमिकताएं',
  'Save Preferences': 'प्राथमिकताएं सहेजें',
  'MSDE Government Officer Authentication & Delegation': 'एमएसडीई सरकारी अधिकारी प्रमाणीकरण एवं प्रत्यायोजन',
  'Launch Officer Auth Dialog': 'अधिकारी प्रमाणीकरण संवाद खोलें',
  'Secure role-based access for District Skill Officers (DSO), State SSDM Directors, and NCVET Authorities.': 'जिला कौशल अधिकारियों (डीएसओ), राज्य एसएसडीएम निदेशकों और एनसीवीईटी अधिकारियों के लिए सुरक्षित भूमिका-आधारित पहुंच।',
  'Preferences saved to planner profile.': 'योजनाकार प्रोफ़ाइल में प्राथमिकताएं सहेजी गईं।',
  'Weekly State Skill Gap Briefing PDF': 'साप्ताहिक राज्य कौशल अंतर ब्रीफिंग पीडीएफ',
  'Automated Monday summary for State Skill Development Mission directors': 'राज्य कौशल विकास मिशन निदेशकों के लिए स्वचालित सोमवार सारांश',
  'Critical Alert SMS Notifications': 'गंभीर सचेतक एसएमएस सूचनाएं',
  'Instant dispatch to District Skill Officers for acute shortages': 'गंभीर कमियों के लिए जिला कौशल अधिकारियों को त्वरित प्रेषण',
  'Primary Classification Standard': 'प्राथमिक वर्गीकरण मानक',

  // Auth Modal
  'MSDE Government Officer Portal': 'एमएसडीई सरकारी अधिकारी पोर्टल',
  'Authorized credentials for Labour Market Intelligence & Target Allocation': 'श्रम बाज़ार आसूचना एवं लक्ष्य आवंटन हेतु अधिकृत क्रेडेंशियल्स',
  'District DSO': 'जिला डीएसओ',
  'State SSDM': 'राज्य एसएसडीएम',
  'NCVET HQ': 'एनसीवीईटी मुख्यालय',
  'Official NIC / Govt Email': 'आधिकारिक एनआईसी / सरकारी ईमेल',
  'Password': 'पासवर्ड',
  'Security PIN': 'सुरक्षा पिन',
  'Cancel': 'रद्द करें',
  'Sign In as Officer': 'अधिकारी के रूप में साइन इन करें',
  'Authenticating...': 'प्रमाणीकरण जारी...',
  '256-bit TLS Encrypted · DPDP Act (2023) Compliant': '256-बिट टीएलएस एन्क्रिप्टेड · डीपीडीपी अधिनियम (2023) अनुपालक',

  // Common UI actions
  'Download': 'डाउनलोड',
  'Export': 'निर्यात',
  'Filter': 'फ़िल्टर',
  'Search': 'खोजें',
  'Apply': 'लागू करें',
  'Reset': 'रीसेट',
  'Save': 'सहेजें',
  'Close': 'बंद करें',
  'Back': 'वापस',
  'Submit': 'प्रस्तुत करें',
  'Clear': 'साफ़ करें',
  'Loading...': 'लोड हो रहा है...',
  'Processing...': 'प्रक्रियाधीन...',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (en: string, hi?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (en, _hi) => en,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kd_language');
        if (saved === 'HI' || saved === 'EN') return saved;
      } catch {
        // ignore
      }
    }
    return 'EN';
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'EN' ? 'HI' : 'EN';
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('kd_language', next);
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const setLanguagePersistent = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kd_language', lang);
      } catch {
        // ignore
      }
    }
  };

  const t = (en: string, hi?: string): string => {
    if (language !== 'HI') return en;
    if (hi !== undefined) return hi;
    return DICTIONARY_HI[en] || DICTIONARY_HI[en.trim()] || en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguagePersistent, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext);
};
