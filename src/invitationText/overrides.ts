/**
 * Kullanıcının metinleri üzerindeki saf işlemler (Faz 25, K303, K309). Bileşen ve store bunları çağırır;
 * kural tek yerde kalsın diye hiçbiri React bilmez. Ayrıntı: docs/rehber/src/invitationText/README.md
 */
import { textSlot } from '../contracts/textSlots';
import type { InvitationLocale, TextOverrides } from './types';

/** Kaydedilecek metin: baştaki/sondaki boşluk kırpılır; tek satırlıkta satır sonu boşluğa döner. */
export function normalizeText(key: string, text: string): string {
  const slot = textSlot(key);
  const flat = slot?.multiline ? text.replace(/\r\n?/g, '\n') : text.replace(/[\r\n]+/g, ' ');
  return flat.trim();
}

export type TextProblem = 'empty' | 'tooLong' | 'placeholder' | 'unknown';

/** Backend kuralının (`TextSlots::isValidText`) istemci kopyası: kaydetmeden önce kullanıcıya söylemek için. */
export function textProblem(key: string, text: string): TextProblem | null {
  const slot = textSlot(key);
  if (!slot) return 'unknown';
  const value = normalizeText(key, text);
  if (value.length === 0) return 'empty';
  if ([...value].length > slot.maxLength) return 'tooLong';
  for (const name of slot.placeholders ?? []) {
    if (value.split(`{${name}}`).length !== 2) return 'placeholder';
  }
  return null;
}

/**
 * Bir metni yazar. Varsayılana eşit metin saklanmaz (anahtar silinir): varsayılan sonradan düzeltilirse
 * dokunulmamış metin onu izlesin (K303).
 */
export function withText(
  overrides: TextOverrides | undefined,
  locale: InvitationLocale,
  key: string,
  text: string,
  defaultText: string | undefined
): TextOverrides {
  const value = normalizeText(key, text);
  if (value === '' || value === defaultText) return withoutText(overrides, locale, key);
  return { ...overrides, [locale]: { ...overrides?.[locale], [key]: value } };
}

/** Bir metni varsayılana döndürür (anahtarı siler). */
export function withoutText(overrides: TextOverrides | undefined, locale: InvitationLocale, key: string): TextOverrides {
  const current = { ...overrides?.[locale] };
  delete current[key];
  return { ...overrides, [locale]: current };
}

/** Dildeki değiştirilmiş metin sayısı. */
export function overrideCount(overrides: TextOverrides | undefined, locale: InvitationLocale): number {
  return Object.keys(overrides?.[locale] ?? {}).length;
}

/** Kategoriye göre varsayılanı değişen anahtarlardan kullanıcının değiştirdikleri (kategori değişiminde sorulur, K309). */
export function categoryScopedKeys(overrides: TextOverrides | undefined, locale: InvitationLocale): string[] {
  return Object.keys(overrides?.[locale] ?? {}).filter((key) => textSlot(key)?.scope === 'category');
}

/** Verilen anahtarları siler. */
export function withoutKeys(overrides: TextOverrides | undefined, locale: InvitationLocale, keys: readonly string[]): TextOverrides {
  const current = { ...overrides?.[locale] };
  for (const key of keys) delete current[key];
  return { ...overrides, [locale]: current };
}

/** Oturum içi geri al / yinele geçmişi (K311): en fazla bu kadar adım. */
export const HISTORY_LIMIT = 50;

export interface History<T> {
  past: T[];
  future: T[];
}

export function pushHistory<T>(history: History<T>, before: T): History<T> {
  return { past: [...history.past, before].slice(-HISTORY_LIMIT), future: [] };
}

export function undoHistory<T>(history: History<T>, current: T): { history: History<T>; value: T } | null {
  const value = history.past[history.past.length - 1];
  if (value === undefined) return null;
  return { history: { past: history.past.slice(0, -1), future: [current, ...history.future] }, value };
}

export function redoHistory<T>(history: History<T>, current: T): { history: History<T>; value: T } | null {
  const [value, ...rest] = history.future;
  if (value === undefined) return null;
  return { history: { past: [...history.past, current].slice(-HISTORY_LIMIT), future: rest }, value };
}
