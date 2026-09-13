import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import tr from './locales/tr/translation.json';
import es from './locales/es/translation.json';
import fr from './locales/fr/translation.json';
import de from './locales/de/translation.json';
import zh from './locales/zh/translation.json';
import hi from './locales/hi/translation.json';
import ar from './locales/ar/translation.json';
import ru from './locales/ru/translation.json';
import pt from './locales/pt/translation.json';

// Hata metinleri ayrı bir namespace'te durur: arayüz sözlüğü ürünle birlikte
// büyür, hata sözlüğü ise backend'in `error-codes.json` sözleşmesine bağlıdır
// (K20/K31). İkisini ayırmak, sözleşme yenilendiğinde neyin denetleneceğini
// tek dosyada tutar. Yalnızca tr/en yazılıdır; kalan diller fallbackLng ile
// 'en' metinlerini görür — eksik anahtar uyarısı üretmez.
import trErrors from './locales/tr/errors.json';
import enErrors from './locales/en/errors.json';

export interface AppLanguage {
  /** ISO 639-1 code — matches the resource key and the localStorage value. */
  code: string;
  /** Language name in its own language (shown in the switcher). */
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: AppLanguage[] = [
  { code: 'en', nativeName: 'English', dir: 'ltr' },
  { code: 'tr', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'es', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'zh', nativeName: '中文', dir: 'ltr' },
  { code: 'hi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'ar', nativeName: 'العربية', dir: 'rtl' },
  { code: 'ru', nativeName: 'Русский', dir: 'ltr' },
  { code: 'pt', nativeName: 'Português', dir: 'ltr' }
];

/** Resolves 'en-US', 'ar-SA' etc. to the base code and its layout direction. */
export function getLanguageDirection(language: string): 'ltr' | 'rtl' {
  const base = language.split('-')[0];
  return SUPPORTED_LANGUAGES.find(l => l.code === base)?.dir ?? 'ltr';
}

i18n
  // Detects the browser language on first visit; afterwards the user's
  // explicit choice wins because localStorage is checked first.
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en, errors: enErrors },
      tr: { translation: tr, errors: trErrors },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      zh: { translation: zh },
      hi: { translation: hi },
      ar: { translation: ar },
      ru: { translation: ru },
      pt: { translation: pt }
    },
    fallbackLng: 'en',
    ns: ['translation', 'errors'],
    defaultNS: 'translation',
    supportedLngs: SUPPORTED_LANGUAGES.map(l => l.code),
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false // React already escapes rendered strings
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'davetkart-language'
    }
  });

export default i18n;
