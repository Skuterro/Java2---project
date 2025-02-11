import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en.json';
import plTranslation from './locales/pl.json';

i18n
  .use(LanguageDetector) // Wykrywa język z localStorage, cookies lub przeglądarki
  .use(initReactI18next) // Integracja z React
  .init({
    resources: {
      en: { translation: enTranslation },
      pl: { translation: plTranslation },
    },
    fallbackLng: 'en', // Domyślnie angielski, jeśli nie znajdzie tłumaczenia
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'], // Szuka języka w localStorage, a potem w przeglądarce
      caches: ['localStorage'], // Zapisuje wybrany język w localStorage
    },
  });

export default i18n;
