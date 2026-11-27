/**
 * Davetiye metinleri (Faz 24, K300–K304): şablonun sabit metinleri koddan çıktı, anahtarla okunur.
 * Ayrıntı: docs/rehber/src/invitationText/README.md
 */

/** Davetiyenin dili. v2.0'da yalnızca `tr`; yeni dil buraya ve `locales/`'a eklenir (v2.1). */
export const INVITATION_LOCALES = ['tr'] as const;
export type InvitationLocale = (typeof INVITATION_LOCALES)[number];
export const DEFAULT_INVITATION_LOCALE: InvitationLocale = 'tr';

/** Kullanıcının değiştirdiği metinler: yalnızca değişenler, dile göre gruplu (`{ tr: { 'rsvp.submit': '…' } }`). */
export type TextOverrides = Partial<Record<InvitationLocale, Record<string, string>>>;

/** Bir dilin varsayılan metinleri. Çözüm sırası: scopes (en özelden) → categories → shared. */
export interface InvitationTextBundle {
  /** Bütün şablonlarda aynı olan varsayılanlar. */
  shared: Record<string, string>;
  /** Kategoriye göre değişen varsayılanlar (`dugun` → `hero.tagline` …). */
  categories: Record<string, Record<string, string>>;
  /** Tek bir şablona (ya da şablon ailesine) özel varsayılanlar; `TemplateFlavor.textScopes` adlandırır. */
  scopes: Record<string, Record<string, string>>;
  /** Kullanıcının değiştiremediği metinler (erişilebilirlik etiketleri, menü seçenekleri). Sözleşmede yoktur. */
  fixed: Record<string, string>;
}

export function isInvitationLocale(value: unknown): value is InvitationLocale {
  return typeof value === 'string' && (INVITATION_LOCALES as readonly string[]).includes(value);
}
