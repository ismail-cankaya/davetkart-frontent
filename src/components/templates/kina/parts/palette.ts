/**
 * "Al & Kına" — kına kategorisinin renk ailesi (hex; SVG ve hero parametreleri için).
 * Tema sınıfları Tailwind taraması için `themes.ts`'te değerleriyle açık yazılır.
 */
export const KINA = {
  /** Avuç — açık zemin: şeftali-kayısı krem (fildişi değil). */
  avuc: '#f8ebdf',
  /** Avuç derin — açık degradelerin ucu. */
  avucDerin: '#efd6c1',
  /** Kına tozu — açık zeminde kıl çizgi. */
  toz: '#e4c4ab',
  /** Mürekkep — açık zeminde başlık: kına kahvesi. */
  murekkep: '#33140c',
  /** Mürekkep orta — açık zeminde sayfa metni. */
  murekkepOrta: '#52261a',
  /** Gövde — açık zeminde soluk metin. */
  govde: '#7a4532',
  /** Kına — imza turuncusu; leke, damga, süs. */
  kina: '#c4581d',
  /** Kına koyu — açık zeminde metin olarak kına. */
  kinaMetin: '#a4451a',
  /** Kına ışığı — koyu zeminde vurgu metni. */
  kinaIsigi: '#f2a066',
  /** Al — duvak kırmızısı; açık temada birincil düğme. */
  al: '#b0241c',
  /** Al koyu — kenar, gölge. */
  alKoyu: '#871a15',
  /** Sırma — bindallı işlemesinin altın ipliği; yalnızca süs ve koyu zeminde vurgu. */
  sirma: '#d8a24a',
  /** Mum alevi. */
  mum: '#ffd27f',
  /** Is — koyu zemin: sıcak, kahve-siyah (mor ya da lacivert değil). */
  is: '#1b0c07',
  /** Kadife — bindallı kadifesi. */
  kadife: '#4a0f1f',
  /** Yaprak — kuru kına yaprağı zeytini. */
  yaprak: '#666a2c',
  /** Yaprak açık — koyu zeminde. */
  yaprakAcik: '#b9b56d'
} as const;

/** `#rrggbb` → `r,g,b` (atmosfer katmanları rgb üçlüsü bekler). */
export function rgb(hex: string): string {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)).join(',');
}
