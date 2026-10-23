/**
 * "Günün Haritası" paleti. Değerler ve hesaplanmış kontrastlar
 * docs/rehber/tasarim/HARITA-KONSEPTI.md §2.1'dedir; burada yalnızca adları var.
 *
 * Bir preset arazi tonlarından en çok dördünü kullanır. `murekkep` ve `gri`
 * yazı ve çizgi rengidir, ton sayılmaz.
 */
export const HARITA_RENK = {
  arazi: '#EEF0E6',
  /** Hazine haritası ekseninin sıcak arazisi (§2.2); mürekkep 10.85, gri 5.63, rota 5.37 (hesaplandı). */
  araziSicak: '#F1E6C8',
  murekkep: '#23303A',
  gri: '#4E5B63',
  yol: '#FFFFFF',
  blok: '#DDD6C6',
  park: '#B7C9A2',
  su: '#9CC3D5',
  rota: '#A8321F',
  /** Yalnızca rota noktası ve iğne başı; yazıda kullanılmaz (arazide 4.31). */
  rotaAcik: '#C8402F',
  /** Yalnızca düğmenin üzerine gelince; beyaz yazı 8.6. */
  rotaKoyu: '#8F2A1A'
} as const;

export type HaritaRengi = keyof typeof HARITA_RENK;
