/**
 * Tasarım stüdyosunun çevirileri (Faz 25): ana pakete girmesin diye ayrı dosyada, editör modülleri içe
 * aktarınca varsayılan ad alanına (`translation`) eklenir; anahtarlar `textEditor.*` olarak kalır.
 * Misafir sayfası bunları indirmez (paket bütçesi, K237). Ayrıntı: docs/rehber/src/i18nEditor.md
 */
import i18n from './i18n';
import tr from './locales/tr/editor.json';
import en from './locales/en/editor.json';

i18n.addResourceBundle('tr', 'translation', { textEditor: tr }, true, false);
i18n.addResourceBundle('en', 'translation', { textEditor: en }, true, false);

export const EDITOR_TRANSLATIONS_READY = true;
