import { UfukPalette, UfukSceneKind } from './art';

/**
 * Ufuk ön ayarları — her kategorinin gökyüzü, mürekkep ve ışık değerleri.
 *
 * Saf veridir: hem canlı sahne (UfukScene) hem kapak görseli üreten betik
 * buradan okur. Renk değişikliği tek yerde yapılır, ikisi aynı kalır.
 *
 * ——— Gökyüzünün üç hâli ———
 *
 * Sahne kaydırmayla zamanda ilerler: davetiye gün batımında açılır, bölümler
 * mavi saatte akar, LCV gece yıldızların altında doldurulur. Üç degrade üst
 * üste durur ve yalnızca opaklıkları değişir — degradeyi canlandırmak her
 * karede boyama demekti, opaklık compositor'da kalır.
 *
 * 🔴 Okunabilirlik kuralı: her degradenin ÜST yarısı koyu kalır (hero metni
 * orada durur), sıcak tonlar yalnızca ufukta, yani alt üçte birde parlar.
 * Yeni bir ön ayar eklenirken üst duraklar açılırsa beyaz başlık eriyecektir.
 */

/** [renk, konum %] */
export type SkyStop = readonly [color: string, at: number];

export interface UfukSky {
  /** Gün batımı — davetiyenin açılış anı. */
  dusk: readonly SkyStop[];
  /** Mavi saat — bölümler akarken. */
  twilight: readonly SkyStop[];
  /** Gece — davetiyenin sonu. */
  night: readonly SkyStop[];
}

export interface UfukPreset {
  kind: UfukSceneKind;
  /** Alacakaranlık mürekkepleri: uzak tepeler sisli ve açık, ön plan koyu. */
  palette: UfukPalette;
  /**
   * Gece mürekkepleri. Siluetler gökyüzüyle birlikte koyulaşmazsa gece
   * gökyüzünün önünde "parlayan" tepeler kalırdı; sahne bu tonları aynı
   * şekillerin üstüne bindirip opaklıkla geçiş yapar.
   */
  night: Pick<UfukPalette, 'far' | 'mid' | 'near'>;
  sky: UfukSky;
  /** Batan güneş (rgb üçlüsü). */
  sun: string;
  /** Doğan ay: renk (rgb üçlüsü) ve evre. */
  moon: { color: string; phase: 'full' | 'crescent' };
  /** Ufuk sisi (rgb üçlüsü): uzak tepelerle ana motif arasındaki hava. */
  haze: string;
  /** Okuma perdesi (rgb üçlüsü): bölümler akarken sahneyi kısan ton. */
  scrim: string;
}

/** Degrade duraklarından CSS dizgisi. */
export function skyCss(stops: readonly SkyStop[]): string {
  return `linear-gradient(180deg, ${stops.map(([color, at]) => `${color} ${at}%`).join(', ')})`;
}

/** İki hex rengi karıştırır; `t` = 1 tamamen ikinci renk. */
export function mixHex(a: string, b: string, t: number): string {
  const parse = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const channel = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${channel(ar, br)}${channel(ag, bg)}${channel(ab, bb)}`;
}

/**
 * Gece paleti: siluetler gece tonuna, renkli süsler (balon, flama, çiçek)
 * gecenin orta tonuna doğru söner. Işık rengi DEĞİŞMEZ — gecenin anlamı
 * zaten ışıkların öne çıkmasıdır.
 */
export function nightPalette(preset: UfukPreset): UfukPalette {
  return {
    ...preset.palette,
    ...preset.night,
    accents: preset.palette.accents.map((accent) => mixHex(accent, preset.night.mid, 0.62))
  };
}

export type UfukFamily =
  | 'dugun'
  | 'kina'
  | 'nisan'
  | 'sunnet'
  | 'dogum-gunu'
  | 'mezuniyet'
  | 'baby'
  | 'parti'
  | 'kurumsal';

export const UFUK_PRESETS: Record<UfukFamily, UfukPreset> = {
  // Şampanya alacakaranlığı: servi bahçesinde kubbeli bir rotunda.
  dugun: {
    kind: 'servi',
    palette: { far: '#5a4a6d', mid: '#261f3b', near: '#110d1b', light: '#ffd89c', accents: ['#f3cf9b', '#f6b8a8'] },
    night: { far: '#161730', mid: '#0d0c1c', near: '#060510' },
    sky: {
      dusk: [['#141a36', 0], ['#2a2a56', 24], ['#5b4470', 46], ['#b37279', 66], ['#e8a47e', 82], ['#f5cf9f', 100]],
      twilight: [['#0c1230', 0], ['#192150', 40], ['#2f3369', 72], ['#4f4a7d', 100]],
      night: [['#05070f', 0], ['#0a0f24', 55], ['#121937', 100]]
    },
    sun: '255,196,138',
    moon: { color: '244,238,219', phase: 'full' },
    haze: '247,190,150',
    scrim: '7,8,20'
  },
  // Kına kızılı: terastan kubbeli bir şehre bakış, tepede Osmanlı fenerleri.
  kina: {
    kind: 'fener',
    palette: { far: '#6b2a3b', mid: '#2c0f1d', near: '#13060d', light: '#ffb866', accents: ['#ffb866', '#e85a5a'] },
    night: { far: '#1f0c18', mid: '#12060e', near: '#080307' },
    sky: {
      dusk: [['#1a0b1d', 0], ['#3a1230', 24], ['#7a2338', 46], ['#c4523f', 66], ['#ec8a4f', 82], ['#f7bd72', 100]],
      twilight: [['#12081a', 0], ['#261026', 40], ['#42162f', 72], ['#5e1f35', 100]],
      night: [['#07040a', 0], ['#110812', 55], ['#1c0c1a', 100]]
    },
    sun: '255,170,100',
    moon: { color: '255,231,194', phase: 'crescent' },
    haze: '240,140,100',
    scrim: '12,4,10'
  },
  // Gül kurusu: ampul dizileri altında çiçekli bir kemer.
  nisan: {
    kind: 'bahce',
    palette: { far: '#6d5577', mid: '#2b2140', near: '#120e1c', light: '#ffe2b8', accents: ['#f7a8b8', '#fff1e6', '#f5c26b'] },
    night: { far: '#191630', mid: '#0e0b1d', near: '#070610' },
    sky: {
      dusk: [['#191630', 0], ['#352a50', 24], ['#77526f', 46], ['#c98790', 66], ['#f0b2a0', 82], ['#f9d8c0', 100]],
      twilight: [['#0f1029', 0], ['#211a42', 40], ['#3d2c5c', 72], ['#5a3f6e', 100]],
      night: [['#06060f', 0], ['#0d0c21', 55], ['#181433', 100]]
    },
    sun: '255,206,170',
    moon: { color: '248,240,227', phase: 'full' },
    haze: '248,196,180',
    scrim: '9,8,20'
  },
  // Saray mavisi ve altın: soğan kubbeli bir saray, havuzunda yansıması.
  sunnet: {
    kind: 'saray',
    palette: { far: '#3c5f78', mid: '#13283f', near: '#08121e', light: '#ffd27a', accents: ['#f2cf7a'] },
    night: { far: '#0d1b2f', mid: '#08121f', near: '#040910' },
    sky: {
      dusk: [['#0b1a2f', 0], ['#163659', 24], ['#2f6286', 46], ['#8e9a8c', 64], ['#dba965', 82], ['#f3d38f', 100]],
      twilight: [['#081427', 0], ['#0f2643', 40], ['#1c3f63', 72], ['#2c5577', 100]],
      night: [['#03070f', 0], ['#071226', 55], ['#0d1c37', 100]]
    },
    sun: '255,200,120',
    moon: { color: '251,238,201', phase: 'crescent' },
    haze: '230,190,130',
    scrim: '4,9,18'
  },
  // Mercan gün batımı: tepelerin üstünde sıcak hava balonları, tepede flamalar.
  'dogum-gunu': {
    kind: 'balon',
    palette: {
      far: '#6f4a80',
      mid: '#2f2152',
      near: '#150f28',
      light: '#ffcf7a',
      accents: ['#ff7a6b', '#ffd27a', '#7fd8c4', '#b8a2ff']
    },
    night: { far: '#1b1638', mid: '#110d26', near: '#080616' },
    sky: {
      dusk: [['#1d1640', 0], ['#3f2c6a', 24], ['#8c4577', 46], ['#e0687a', 64], ['#f8956d', 80], ['#ffcf8e', 100]],
      twilight: [['#141235', 0], ['#261e5a', 40], ['#43317a', 72], ['#5d4389', 100]],
      night: [['#07061a', 0], ['#100e2c', 55], ['#1b1742', 100]]
    },
    sun: '255,180,130',
    moon: { color: '255,244,220', phase: 'full' },
    haze: '255,170,150',
    scrim: '9,7,24'
  },
  // Lacivert ve bronz: saat kuleli kampüs, gökyüzüne atılan kepler.
  mezuniyet: {
    kind: 'kampus',
    palette: { far: '#46597a', mid: '#18233f', near: '#0a0f1e', light: '#ffd896', accents: ['#e8c37e'] },
    night: { far: '#111a33', mid: '#0a1022', near: '#050811' },
    sky: {
      dusk: [['#0f1832', 0], ['#22375f', 24], ['#4f6489', 46], ['#a08a87', 64], ['#d9a46c', 82], ['#efcd95', 100]],
      twilight: [['#0b1430', 0], ['#15234a', 40], ['#263b67', 72], ['#35507a', 100]],
      night: [['#04070f', 0], ['#0a1124', 55], ['#111c38', 100]]
    },
    sun: '255,196,130',
    moon: { color: '245,239,223', phase: 'full' },
    haze: '230,190,150',
    scrim: '5,8,20'
  },
  // Ninni lavantası: bulutların üstünde bir beşik dönencesi.
  baby: {
    kind: 'bulut',
    palette: {
      far: '#9fa0d4',
      mid: '#7279b8',
      near: '#4d559a',
      light: '#fff3d6',
      accents: ['#ffd6e0', '#cfe3ff', '#fff0b8', '#d9ccff']
    },
    night: { far: '#2f3670', mid: '#232a5e', near: '#19204c' },
    sky: {
      dusk: [['#1b2150', 0], ['#34407e', 24], ['#6d77b4', 46], ['#b39cc8', 64], ['#ecb9cc', 82], ['#fadbd3', 100]],
      twilight: [['#121842', 0], ['#222b68', 40], ['#3a4790', 72], ['#5060a2', 100]],
      night: [['#070a1f', 0], ['#0e1437', 55], ['#182050', 100]]
    },
    sun: '255,214,190',
    moon: { color: '255,248,230', phase: 'crescent' },
    haze: '250,210,220',
    scrim: '10,12,34'
  },
  // Neon gece: suya yansıyan, pencereleri tek tek yanan bir şehir.
  parti: {
    kind: 'neon',
    palette: { far: '#4b1d5c', mid: '#1e0c2e', near: '#0b0514', light: '#ffd59a', accents: ['#ff5fa2', '#5ff2ff', '#c08bff'] },
    night: { far: '#170a26', mid: '#0c0517', near: '#05020a' },
    sky: {
      dusk: [['#12081f', 0], ['#2c0e45', 24], ['#63186a', 44], ['#c03a78', 62], ['#f06b6e', 80], ['#ffad7a', 100]],
      twilight: [['#0b0618', 0], ['#1a0a31', 40], ['#2f0f4c', 72], ['#44135c', 100]],
      night: [['#040208', 0], ['#0a0514', 55], ['#150a26', 100]]
    },
    sun: '255,150,120',
    moon: { color: '255,233,242', phase: 'full' },
    haze: '255,120,150',
    scrim: '8,3,14'
  },
  // Mavi saat: cam kuleler ve eğik askılı bir köprü.
  kurumsal: {
    kind: 'kule',
    palette: { far: '#36566e', mid: '#13253a', near: '#08111d', light: '#e6f3ff', accents: ['#7fd8ea', '#ffcf7a'] },
    night: { far: '#0c1828', mid: '#08111e', near: '#040a12' },
    sky: {
      dusk: [['#0a1526', 0], ['#18324d', 24], ['#345f7e', 46], ['#7ea2b4', 64], ['#c9c9b8', 82], ['#ebd5ad', 100]],
      twilight: [['#071120', 0], ['#0e2137', 40], ['#1a3854', 72], ['#26496a', 100]],
      night: [['#03070d', 0], ['#08111e', 55], ['#0e1c2f', 100]]
    },
    sun: '255,206,150',
    moon: { color: '238,244,251', phase: 'full' },
    haze: '200,215,220',
    scrim: '3,8,16'
  }
};
