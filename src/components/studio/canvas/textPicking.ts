import type { UserField } from '../../../invitationText/userFields';

/** Tuvalde tıklanan metnin karşılığı: kullanıcının alanı ya da şablon metni anahtarı (K321). */
export type TextPick = { kind: 'field'; field: UserField } | { kind: 'slot'; key: string };

export interface PickSources {
  /** Kullanıcı alanlarının çizilebilecek hâlleri (alan başına birden çok: tam metin, parçalar). */
  fields: Partial<Record<UserField, readonly string[]>>;
  /** Bu tasarımda çizilen şablon metinleri: anahtar → çözülmüş metin. */
  slots: ReadonlyArray<readonly [string, string]>;
}

const EDGE_PUNCTUATION = /^[\s"“”'‘’«»()[\]—–\-·•,.:;!?…]+|[\s"“”'‘’«»()[\]—–\-·•,.:;!?…]+$/g;

/** Karşılaştırma biçimi: boşluk tek, kenardaki tırnak ve noktalama yok, Türkçe küçük harf (CSS/JS büyük harfi yok sayılır). */
export function normalizePickText(text: string): string {
  return text.normalize('NFC').replace(/\s+/g, ' ').replace(EDGE_PUNCTUATION, '').toLocaleLowerCase('tr');
}

/** Metin → karşılık. Önce kullanıcı alanları, sonra şablon metinleri; aynı metinde ilk gelen kazanır. */
export function buildPickIndex(sources: PickSources): Map<string, TextPick> {
  const index = new Map<string, TextPick>();
  const add = (text: string, pick: TextPick) => {
    const key = normalizePickText(text);
    if (key.length < 2 || index.has(key)) return;
    index.set(key, pick);
  };
  for (const [field, texts] of Object.entries(sources.fields) as [UserField, readonly string[]][]) {
    for (const text of texts) add(text, { kind: 'field', field });
  }
  for (const [key, text] of sources.slots) {
    if (!text.includes('{')) add(text, { kind: 'slot', key });
  }
  return index;
}

/** İsimlerin çizilebilecek parçaları: tam metin, `&` ile ayrılan kişiler, kişilerin sözcükleri. */
export function nameVariants(names: string): string[] {
  const full = names.trim();
  if (!full) return [];
  const people = full.split(/\s*&\s*/).filter(Boolean);
  const words = people.flatMap((person) => person.split(/\s+/)).filter((word) => word.length >= 2);
  return [full, people.join(' & '), people.join(' ve '), ...people, ...words];
}

const SKIP = 'input, textarea, select, [data-text-slot], [contenteditable="true"]';
const MAX_DEPTH = 4;

/**
 * Tıklanan öğeden yukarı (en çok 4 ata) metni karşılığı olan ilk öğeyi bulur. Harf harf bölünmüş başlıklar
 * (her harf ayrı `span`) atada eşleşir. Form alanları ve zaten tıklanabilen işaretler (`data-text-slot`) atlanır.
 */
export function findPick(target: Element | null, index: ReadonlyMap<string, TextPick>): { element: Element; pick: TextPick } | null {
  if (!target || target.closest(SKIP)) return null;
  let element: Element | null = target;
  for (let depth = 0; element && depth <= MAX_DEPTH; depth += 1) {
    if (element.tagName === 'BODY' || element.tagName === 'SECTION') return null;
    const text = element.textContent ?? '';
    if (text.length <= 400) {
      const pick = index.get(normalizePickText(text));
      if (pick) return { element, pick };
    }
    element = element.parentElement;
  }
  return null;
}
