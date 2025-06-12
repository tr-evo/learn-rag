import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

// Initialize i18n for both client and server
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      // Detection options
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    // Language fallbacks
    load: 'languageOnly', // This will load 'de' for 'de-DE', 'de-AT', etc.

    // Default namespaces
    defaultNS: 'common',
    ns: ['common', 'home', 'steps', 'step-page', 'demos'],

    react: {
      useSuspense: false, // Important for static export
    }
  })

export default i18n 