/** Davetiye tarihinin, düğün kartı düzenine dağıtılan parçaları. */
export interface DateParts {
  day: string;
  month: string;
  year: string;
  /** Saat girilmemiş ya da biçim tanınmamışsa boş. */
  time: string;
}

/**
 * `formatDateStr` çıktısını ("14 Kasım 2026 19:00") gün / ay / yıl / saat
 * parçalarına ayırır.
 *
 * Tarih yeniden ayrıştırılmaz (`new Date` yok): biçimlenmiş metin bölünür.
 * Tarayıcı araya virgül ya da "saat" koysa da ilk dört alan yakalanır;
 * tanınmayan bir biçimde `null` döner ve çağıran tek satırlık etikete düşer.
 */
export function splitDateLabel(label: string): DateParts | null {
  const match = /^(\d{1,2})\.?\s+([^\s,]+)\s+(\d{4})(?:[\s,]+(?:saat\s+)?(\d{1,2}[:.]\d{2}))?/i.exec(label.trim());
  if (!match) return null;
  return { day: match[1], month: match[2], year: match[3], time: match[4] ?? '' };
}

/** Hero'nun isim satırları: çift ise iki ayrı satır, değilse tek satır. */
export type CoupleNames = { kind: 'pair'; first: string; second: string } | { kind: 'single'; text: string };

/**
 * İsim metnini ilk `&` işaretinden iki kişiye ayırır.
 *
 * İsimler `TemplateRenderer`'da `displayNames` ile temizlenmiş gelir
 * ("Ayşe & Ali", "Ayşe" ya da ""). Bir taraf boşsa çift değil tek satırdır;
 * ikisi de boşsa `fallback` yazılır.
 */
export function splitCouple(names: string | null | undefined, fallback = 'Davetlisiniz'): CoupleNames {
  const text = names?.trim() ?? '';
  const at = text.indexOf('&');
  if (at > 0) {
    const first = text.slice(0, at).trim();
    const second = text.slice(at + 1).trim();
    if (first && second) return { kind: 'pair', first, second };
  }
  const single = text.replace(/^&\s*|\s*&$/g, '').trim();
  return { kind: 'single', text: single || fallback };
}
