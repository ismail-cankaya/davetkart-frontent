import trBundle from './locales/tr.json';
import type { InvitationLocale, InvitationTextBundle, TextOverrides } from './types';
import { DEFAULT_INVITATION_LOCALE } from './types';

/** Dil → varsayılan metinler. v2.0'da tek dil statik; diğerleri v2.1'de tembel yüklenir. */
const BUNDLES: Record<InvitationLocale, InvitationTextBundle> = {
  tr: trBundle as InvitationTextBundle
};

export function textBundle(locale: InvitationLocale): InvitationTextBundle {
  return BUNDLES[locale] ?? BUNDLES[DEFAULT_INVITATION_LOCALE];
}

/** Bir metni çözmek için gereken bağlam: şablonun kimliği (kategori + kapsamlar) ve kullanıcının metinleri. */
export interface TextLookup {
  locale: InvitationLocale;
  categoryId: string;
  /** En özelden genele: `['dugun-opera']`. */
  scopes?: readonly string[];
  /** Şablonun çalışma anında hesapladığı varsayılanlar (ör. "Bölüm II"); kapsamlardan önce gelir. */
  runtimeDefaults?: Readonly<Record<string, string>>;
  overrides?: TextOverrides | null;
}

/** Kullanıcının metni yoksa şablonun varsayılanı. Kullanıcının değişikliğine bakmaz. */
export function defaultText(key: string, lookup: Omit<TextLookup, 'overrides'>): string | undefined {
  const bundle = textBundle(lookup.locale);
  const runtime = lookup.runtimeDefaults?.[key];
  if (runtime !== undefined) return runtime;
  for (const scope of lookup.scopes ?? []) {
    const value = bundle.scopes[scope]?.[key];
    if (value !== undefined) return value;
  }
  return bundle.categories[lookup.categoryId]?.[key] ?? bundle.shared[key];
}

/**
 * Bir anahtarın ekranda görünecek metni: kullanıcının metni → şablon varsayılanı → anahtarın kendisi.
 * Anahtar hiçbir yerde yoksa anahtar döner (sessiz boşluk yerine görünür hata; `verify:text-slots` yakalar).
 */
export function resolveText(key: string, lookup: TextLookup): string {
  const own = lookup.overrides?.[lookup.locale]?.[key];
  if (typeof own === 'string' && own.length > 0) return own;
  return defaultText(key, lookup) ?? key;
}

/** Düzenlenemeyen metinler (erişilebilirlik etiketleri vb.). */
export function fixedText(key: string, locale: InvitationLocale): string {
  return textBundle(locale).fixed[key] ?? key;
}

/** `{date}` gibi yer tutucuları doldurur; React düğümü gerekiyorsa `splitPlaceholder` kullanılır. */
export function splitPlaceholder(text: string, name: string): [string, string] | null {
  const token = `{${name}}`;
  const at = text.indexOf(token);
  if (at < 0) return null;
  return [text.slice(0, at), text.slice(at + token.length)];
}
