import React, { createContext, useContext, useMemo, useState } from 'react';
import { Language, translate, TranslationKey } from '../i18n/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (value: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'medical-ai-language';

const getInitialLanguage = (): Language => {
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem(LOCAL_STORAGE_KEY) : null;
  if (stored === 'en' || stored === 'zh') {
    return stored;
  }
  const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'zh';
  return browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (value: Language) => {
    setLanguageState(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, value);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage,
    t: (key, params) => translate(language, key, params),
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
