import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import tr from './locales/tr/translation.json';

// Hata metinleri ayrı bir namespace'te durur: arayüz sözlüğü ürünle birlikte
// büyür, hata sözlüğü ise backend'in `error-codes.json` sözleşmesine bağlıdır
// (K20/K31). İkisini ayırmak, sözleşme yenilendiğinde neyin denetleneceğini
// tek dosyada tutar. Yalnızca tr/en yazılıdır.
import trErrors from './locales/tr/errors.json';
import enErrors from './locales/en/errors.json';

export interface AppLanguage {
  /** ISO 639-1 code — matches the resource key and the localStorage value. */
  code: string;
  /** Language name in its own language (shown in the switcher). */
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

/** Missing keys, unsupported browsers and stale stored choices land here (FE-01). */
export const DEFAULT_LANGUAGE = 'tr';

/** Where the visitor's explicit choice is kept. */
export const LANGUAGE_STORAGE_KEY = 'davetkart-language';

// Only tr/en are offered (FE-01, K220): the other eight files stay in
// src/locales but are hidden until the core flow is translated.
// How to bring one back: docs/rehber/src/i18n.md
export const SUPPORTED_LANGUAGES: AppLanguage[] = [
  { code: 'tr', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'en', nativeName: 'English', dir: 'ltr' }
];

/** 'en-US' → true, 'de' → false. */
export function isSupportedLanguage(language: string | null | undefined): boolean {
  if (!language) return false;
  const base = language.split('-')[0];
  return SUPPORTED_LANGUAGES.some(l => l.code === base);
}

/** Resolves 'en-US', 'ar-SA' etc. to the base code and its layout direction. */
export function getLanguageDirection(language: string): 'ltr' | 'rtl' {
  const base = language.split('-')[0];
  return SUPPORTED_LANGUAGES.find(l => l.code === base)?.dir ?? 'ltr';
}

// A stored code we no longer offer (e.g. 'de' from the ten-language switcher)
// resolves to DEFAULT_LANGUAGE instead of handing the choice to the browser.
const storedPreference = {
  name: 'storedPreference',
  lookup(): string | undefined {
    let stored: string | null;
    try {
      stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
      return undefined; // private mode / no window: fall through to navigator
    }
    if (!stored) return undefined;
    return isSupportedLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  }
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(storedPreference);

i18n
  // Detects the browser language on first visit; afterwards the user's
  // explicit choice wins because the stored preference is checked first.
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en, errors: enErrors },
      tr: { translation: tr, errors: trErrors }
    },
    fallbackLng: DEFAULT_LANGUAGE,
    ns: ['translation', 'errors'],
    defaultNS: 'translation',
    supportedLngs: SUPPORTED_LANGUAGES.map(l => l.code),
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false // React already escapes rendered strings
    },
    detection: {
      order: ['storedPreference', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY
    }
  });

export default i18n;
