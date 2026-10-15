import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'EN' | 'HI';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (en, _hi) => en,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'HI' : 'EN'));
  };

  const t = (en: string, hi: string): string => {
    return language === 'HI' ? hi : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext);
};
