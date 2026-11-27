/**
 * Düzenlenebilir davetiye metinleri sözleşmesinin tipli yüzü (Faz 24, K301).
 *
 * Yön `plan-rules.json`'ın tersidir: anahtarlar varsayılan metinlerle birlikte frontend'de doğar
 * (`src/invitationText/locales/tr.json`), sözleşme oradan `npm run text-slots:export` ile üretilir
 * ve backend'e **aynen** kopyalanır (`contracts/text-slots.json`). Backend doğrulamayı buna göre yapar.
 * Kopyaların eşitliği iki depoda da sınanır (`verify:text-slots`, `TextSlotsContractTest`).
 */
import contract from './text-slots.json';

export type TextSlotScope = 'shared' | 'category' | 'template';

export interface TextSlot {
  /** Editör panelindeki grup (`rsvp`, `gift` …). */
  readonly group: string;
  /** Şablon/kategori değişiminde ne olacağını belirler (K309). */
  readonly scope: TextSlotScope | string;
  readonly maxLength: number;
  readonly multiline: boolean;
  /** Metinde bir kez geçmesi gereken yer tutucular (`{date}`). */
  readonly placeholders?: readonly string[];
}

export interface TextSlotContract {
  readonly version: number;
  readonly locales: readonly string[];
  /** Bir davetiyede en fazla kaç metin değiştirilebilir (dil başına). */
  readonly maxOverrides: number;
  readonly slots: Readonly<Record<string, TextSlot>>;
}

export const TEXT_SLOTS: TextSlotContract = contract;

export function textSlot(key: string): TextSlot | undefined {
  return TEXT_SLOTS.slots[key];
}
