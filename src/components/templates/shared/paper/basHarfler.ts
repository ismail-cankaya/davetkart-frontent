/**
 * Mühür ve kabartma için baş harfler.
 *
 * Kategoriye göre ikinci ad bir kişi olmayabilir (mezuniyette okul, sünnette
 * aile adı, kurumsalda etkinlik adı); o zaman `ilk` kuralı kullanılır.
 *
 * 🔴 Büyük harf `tr-TR` ile yapılır: "ilker" → "İ". Düz `toUpperCase` "I"
 * verir ve mühürde yanlış ad yazar.
 */
export type BasHarfKurali = 'cift' | 'ilk';

export function basHarfler(names: string, kural: BasHarfKurali = 'cift'): string {
  const parcalar = names
    .split(/\s*&\s*|\s+ve\s+/i)
    .map((parca) => parca.trim())
    .filter(Boolean);
  return parcalar
    .slice(0, kural === 'ilk' ? 1 : 2)
    .map((parca) => Array.from(parca)[0])
    .join('')
    .toLocaleUpperCase('tr-TR');
}
