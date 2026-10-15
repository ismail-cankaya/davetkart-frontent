import type React from 'react';
import { DOKULAR, type DokuAdi } from './doku';
import { BASLIK_YIGINI, EL_YAZILARI, GOVDE_YIGINI, type ElYazisi } from './fontlar';

/**
 * "Kâğıt / el yapımı" ailesinin renk kaynağı. Kontrast tablosu ve kurallar:
 * docs/rehber/tasarim/KAGIT-KONSEPTI.md §2.
 *
 * Renkler sınıf adı olarak değil CSS değişkeni olarak dağıtılır (`KagitKok`):
 * Tailwind dinamik kurulmuş bir `bg-[${hex}]` sınıfını üretemez, ama
 * `bg-[var(--kg-kart)]` gibi sabit bir sınıfı üretir. Tema dizgileri bu
 * yüzden paletten bağımsızdır (bkz. tema.ts).
 */

/** Açık kâğıtlar: koyu mürekkeple yazılır. */
export const ACIK_KAGITLAR = {
  fildisi: '#FAF6EE',
  pamuk: '#F3ECDF',
  gul: '#F1E1DA',
  adacayi: '#E3E9DC',
  sis: '#E5EAEF',
  /** Orta ton: üstünde gövde metni de başlık mürekkebiyle yazılır (§2). */
  kraft: '#D2B48E'
} as const;

/** Koyu kartonlar: açık mürekkeple yazılır. */
export const KOYU_KAGITLAR = {
  lacivert: '#1E2840',
  murdum: '#2E1D27',
  komur: '#26231F'
} as const;

/** Koyu mürekkepler — açık kâğıt üstünde. `govde` başlıktan bir ton açık. */
export const KOYU_MUREKKEPLER = {
  is: { baslik: '#2A211B', govde: '#4A3C31' },
  sepya: { baslik: '#45291A', govde: '#5A3E2C' },
  bordo: { baslik: '#5C1A26', govde: '#6C2733' },
  lacivert: { baslik: '#1C2A47', govde: '#33405A' },
  orman: { baslik: '#203629', govde: '#364C40' },
  gul: { baslik: '#6A2539', govde: '#7A3446' }
} as const;

/** Açık mürekkepler — koyu karton üstünde. Yaldız düz renktir, parlamaz. */
export const ACIK_MUREKKEPLER = {
  beyaz: { baslik: '#F8F2E7', govde: '#DDD5C7' },
  yaldiz: { baslik: '#E2C892', govde: '#D4B87E' }
} as const;

/** Mum mühür renkleri. Harfler mumun kendi renginde kabartılır. */
export const MUMLAR = {
  bordo: '#7B1E2C',
  lacivert: '#263559',
  adacayi: '#5F7A5C',
  hardal: '#B8892F',
  gul: '#B0606F',
  komur: '#2F2B29',
  toprak: '#8B5A3C',
  yaldiz: '#C29A4B'
} as const;

/** Suluboya pigmentleri. Üstlerine yalnızca başlık mürekkebi yazılır, ölçülerek. */
export const PIGMENTLER = {
  gul: '#E8B0AA',
  seftali: '#F2C4A0',
  adacayi: '#AEC5A5',
  lavanta: '#BEB4D4',
  gok: '#AAC6DA',
  hardal: '#E7C984'
} as const;

export type AcikKagit = keyof typeof ACIK_KAGITLAR;
export type KoyuKagit = keyof typeof KOYU_KAGITLAR;
export type KoyuMurekkep = keyof typeof KOYU_MUREKKEPLER;
export type AcikMurekkep = keyof typeof ACIK_MUREKKEPLER;
export type MumAdi = keyof typeof MUMLAR;
export type PigmentAdi = keyof typeof PIGMENTLER;

/** Kitin dağıttığı CSS değişkenleri; kimlikli kategoriler `ozel` ile ezer. */
export type KagitDegiskeni =
  | '--kg-masa'
  | '--kg-kart'
  | '--kg-kart-koyu'
  | '--kg-baslik'
  | '--kg-govde'
  | '--kg-vurgu'
  | '--kg-vurgu-koyu'
  | '--kg-vurgu-ustu'
  | '--kg-cizgi'
  | '--kg-cizgi-guclu'
  | '--kg-mum'
  | '--kg-golge'
  | '--kg-levha-golge'
  | '--kg-kat-isik'
  | '--kg-kat-golge'
  | '--kg-kabartma-isik'
  | '--kg-kabartma-golge'
  | '--kg-karisim';

interface OrtakSecim {
  mum: MumAdi;
  doku: DokuAdi | 'yok';
  /** Adlarda kullanılacak el yazısı; yalnızca o font yüklenir. */
  el?: ElYazisi;
  /**
   * Kimlikli kategoriler (düğün, kına, sünnet, kurumsal) kendi KIMLIK
   * paletindeki değerleri buradan verir. Her değer kontrast tablosuna
   * eklenmeden kullanılmaz.
   */
  ozel?: Partial<Record<KagitDegiskeni, string>>;
}

/**
 * Bir davetiye setinin bütün malzemesi. Masa (sayfa zemini) ve kart (ek
 * kartlar) aynı tonda olmak zorunda: bölüm başlıkları masada, metinleri
 * kartta durur ve ikisi aynı mürekkebi kullanır.
 */
export type KagitSeti =
  | (OrtakSecim & { ton: 'acik'; masa: AcikKagit; kart: AcikKagit; murekkep: KoyuMurekkep; vurgu: KoyuMurekkep })
  | (OrtakSecim & { ton: 'koyu'; masa: KoyuKagit; kart: KoyuKagit; murekkep: AcikMurekkep; vurgu: AcikMurekkep });

const kanallar = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** İki rengi sRGB'de karıştırır; `t` = ikincinin payı. */
export function karistir(a: string, b: string, t: number): string {
  const [x, y] = [kanallar(a), kanallar(b)];
  return '#' + x.map((c, i) => Math.round(c + (y[i] - c) * t).toString(16).padStart(2, '0')).join('');
}

const saydam = (hex: string, alfa: number) => `rgba(${kanallar(hex).join(',')},${alfa})`;

/** Setin CSS değişkenleri — `KagitKok` bunları kökün `style`'ına yazar. */
export function kagitDegiskenleri(set: KagitSeti): React.CSSProperties {
  const acik = set.ton === 'acik';
  const masa = acik ? ACIK_KAGITLAR[set.masa] : KOYU_KAGITLAR[set.masa];
  const kart = acik ? ACIK_KAGITLAR[set.kart] : KOYU_KAGITLAR[set.kart];
  const murekkep = acik ? KOYU_MUREKKEPLER[set.murekkep] : ACIK_MUREKKEPLER[set.murekkep];
  const vurgu = acik ? KOYU_MUREKKEPLER[set.vurgu] : ACIK_MUREKKEPLER[set.vurgu];
  // Kraft orta tondur: gövde tonu üstünde 4.5:1'in altına düşer (§2).
  const kraft = acik && (set.masa === 'kraft' || set.kart === 'kraft');

  const degiskenler: Record<string, string> = {
    '--kg-masa': masa,
    '--kg-kart': kart,
    '--kg-kart-koyu': karistir(kart, murekkep.baslik, acik ? 0.07 : 0.1),
    '--kg-baslik': murekkep.baslik,
    '--kg-govde': kraft ? murekkep.baslik : murekkep.govde,
    '--kg-vurgu': vurgu.baslik,
    '--kg-vurgu-koyu': karistir(vurgu.baslik, acik ? '#000000' : '#ffffff', 0.18),
    '--kg-vurgu-ustu': acik ? ACIK_KAGITLAR.fildisi : masa,
    '--kg-cizgi': saydam(murekkep.baslik, acik ? 0.16 : 0.2),
    '--kg-cizgi-guclu': saydam(murekkep.baslik, acik ? 0.38 : 0.45),
    '--kg-mum': MUMLAR[set.mum],
    '--kg-golge': acik
      ? '0 1px 1px rgba(40,30,20,0.10), 0 12px 24px -12px rgba(40,30,20,0.32)'
      : '0 1px 1px rgba(0,0,0,0.45), 0 14px 28px -14px rgba(0,0,0,0.75)',
    '--kg-levha-golge': acik
      ? 'drop-shadow(0 1px 1px rgba(40,30,20,0.14)) drop-shadow(0 12px 16px rgba(40,30,20,0.16))'
      : 'drop-shadow(0 1px 1px rgba(0,0,0,0.5)) drop-shadow(0 14px 18px rgba(0,0,0,0.45))',
    '--kg-kat-isik': acik ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.08)',
    '--kg-kat-golge': acik ? 'rgba(60,45,30,0.07)' : 'rgba(0,0,0,0.22)',
    '--kg-kabartma-isik': acik ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.14)',
    '--kg-kabartma-golge': acik ? 'rgba(60,45,30,0.24)' : 'rgba(0,0,0,0.6)',
    '--kg-karisim': acik ? 'multiply' : 'screen',
    '--kg-doku': set.doku === 'yok' ? 'none' : `url("${DOKULAR[set.doku].url}")`,
    '--kg-doku-boy': set.doku === 'yok' ? 'auto' : `${DOKULAR[set.doku].boy}px`,
    '--kg-govde-font': GOVDE_YIGINI,
    '--kg-baslik-font': BASLIK_YIGINI,
    '--kg-el-font': set.el ? EL_YAZILARI[set.el].yigin : BASLIK_YIGINI,
    ...set.ozel
  };
  return degiskenler as React.CSSProperties;
}
