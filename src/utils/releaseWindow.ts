/**
 * Yayınlanmış bir davetiye silinirse ödenen planın hakkı ne olur? (K82)
 * Faz 10, 10.28 — `DashboardPage` silme onayı.
 *
 * Pencerenin sonunu backend hesaplıyor (`InvitationRecord.releasableUntil`);
 * burada yalnızca "şimdi" ile karşılaştırılıyor. "3 gün" bu dosyada BİLEREK
 * yok: kural backend config'inde ve silme kuralıyla aynı satırdan türetiliyor.
 */
export type ReleaseOutcome =
  /** Pencere açık: şimdi silinirse hak serbest kalır, yeni davetiyede kullanılabilir. */
  | 'releases'
  /** Pencere kapandı: silinirse hak yanar. */
  | 'burns'
  /** Tarih okunamadı (eski bir backend yanıtı ya da bozuk değer): kesin konuşma. */
  | 'unknown';

export function releaseOutcome(releasableUntil: string | null | undefined, now: Date): ReleaseOutcome {
  if (!releasableUntil) return 'unknown';

  const endsAt = new Date(releasableUntil);
  if (Number.isNaN(endsAt.getTime())) return 'unknown';

  // Backend `isFuture()` soruyor: tam sınır anında pencere KAPALI.
  return endsAt.getTime() > now.getTime() ? 'releases' : 'burns';
}

/** "23 Eylül 2026 10:00" — kullanıcının yerel saatiyle. */
export function formatReleaseDeadline(releasableUntil: string): string {
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(releasableUntil));
}
