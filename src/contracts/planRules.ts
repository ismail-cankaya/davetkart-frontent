/**
 * Backend plan kuralları sözleşmesinin tipli yüzü (Faz 18 · OPS-01 · K146–K147).
 *
 * `plan-rules.json` backend deposundan **tek yönlü kopyalanır** (hata kataloğuyla
 * aynı desen, bkz. `errorCodes.ts`). Elle DÜZENLENMEZ: kural backend'de değişir,
 * kopya oradan gelir.
 *
 * 🔴 Uygulama bu dosyayı içeri ALMAZ. Tek tüketicisi `scripts/verify-plan-rules.ts`:
 * arayüzün kendi kural kopyalarını (`minimumTier`, fiyat kartı, `getRequiredTier`)
 * bu sözleşmeyle karşılaştırır. Fiyat burada yok; o API'den gelir (K128).
 *
 * Kaynak: `davetkart-backend-php-laravel/contracts/plan-rules.json` (`php artisan plans:export`)
 */
import contract from './plan-rules.json';
import type { Invitation } from '../types';
import { hasCustomTexts } from '../invitationText/hasCustomTexts';

/** Sözleşmenin biçimi. Plan adları bilerek `string`: doğrulamak denetimin işi. */
export interface PlanRules {
  /** Küçükten büyüğe plan sırası. */
  readonly tierOrder: readonly string[];
  /** Plan başına LCV sınırı (toplam misafir); `null` = sınırsız. */
  readonly rsvpLimits: Readonly<Record<string, number | null>>;
  /** Backend modül kolonu (`show_gallery`) → gereken en düşük plan. */
  readonly moduleTiers: Readonly<Record<string, string>>;
  /** Şablon kimliği → gereken en düşük plan. Listede olmayan şablon her planda yayınlanır. */
  readonly presetTiers: Readonly<Record<string, string>>;
  /** "Logosuz özel yayın"ın başladığı plan. */
  readonly whiteLabelTier: string;
}

/** Sözleşmeden bir anahtar kalkarsa bu atama derlenmez. */
export const PLAN_RULES: PlanRules = contract;

/** `Invitation`'ın aç/kapa (boolean) alanları. */
type InvitationFlag = {
  [K in keyof Invitation]-?: Invitation[K] extends boolean ? K : never;
}[keyof Invitation];

/**
 * Backend modül kolonu → davetiyedeki alan.
 *
 * Elle yazılır: `show_rsvp` → `showRSVP` hiçbir otomatik çeviriden çıkmaz. Alan
 * yeniden adlandırılırsa derleme kırılır; sözleşmeye yeni bir modül gelirse
 * `verify:plans` "eşlemesi yok" diye durur.
 */
export const MODULE_FIELDS: Readonly<Record<string, InvitationFlag>> = {
  show_envelope: 'showEnvelope',
  show_gallery: 'showGallery',
  show_gift: 'showGift',
  show_rsvp: 'showRSVP',
  show_timeline: 'showTimeline',
  show_timer: 'showTimer'
};

/**
 * Bir aç/kapa alanı olmayan, davetiyeden TÜRETİLEN kolonlar (Faz 24, K305): backend `has_custom_texts`'i
 * `text_overrides`'tan yazar. `verify:plans` iki haritanın birleşimini sözleşmenin modül listesiyle karşılaştırır.
 */
export const DERIVED_MODULES: Readonly<Record<string, (invitation: Invitation) => boolean>> = {
  has_custom_texts: hasCustomTexts
};
