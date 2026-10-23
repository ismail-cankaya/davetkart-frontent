import { kisiler, type SergiMetinleri } from '../../konsept/sergi';

/**
 * Doğum gününün sergi preset'lerinin (Retrospektif, Devam Eden) ortak
 * metinleri. Doğum günü bir *retrospektiftir* (SERGI-KONSEPTI §7): sergi
 * sahibinin dönemleri duvarda. Taban flavor `DOGUM_GUNU_FLAVOR`'dır; zarf
 * etiketi ("Doğum Günü Davetiyesi") ondan gelir.
 */
export const DOGUM_GUNU_SERGI_METINLERI: SergiMetinleri = {
  hediye: 'Armağan',
  hediyeNotu: 'En güzel armağan aramızda olmanız. Yine de bir şey getirmek isterseniz bilgiler aşağıda.'
};

/** Kapakta tekrar eden sabit sözler. */
export const RETROSPEKTIF = {
  /** Sergi adı; sahibinin adının altında durur. */
  sergi: 'Retrospektif',
  /** Etiketin tarih/mekân başlığı. */
  baslik: 'Açılış'
} as const;

/**
 * `names` doğum gününde *Sahibi & Ev sahibi*dir (KONSEPT-ORTAK §4): sahibi
 * duvar yazısının sanatçısı, ev sahibi etiketin küratörü. Tek ad sahibidir.
 * Üçüncü ve sonraki adlar (veride beklenmez) küratör satırına eklenir.
 */
export function sergiKisileri(names: string | null | undefined): { sahibi: string; kurator: string } {
  const [sahibi = '', ...kalan] = kisiler(names);
  return { sahibi, kurator: kalan.join(' & ') };
}
