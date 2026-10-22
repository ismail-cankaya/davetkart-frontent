import { PaletteId } from '../../../types';

/**
 * Design tokens for the two elite invitation moods:
 *  - midnight: deep slate darkness with champagne-gold accents
 *  - stone:    airy pastel stone/ivory with warm bronze accents
 *
 * Every shared section consumes these tokens instead of hard-coding colors,
 * so a template switches mood with a single `palette` field.
 */
export interface SectionTheme {
  id: PaletteId;
  /**
   * Opaque page background. Only full-bleed covers (composition root,
   * envelope gate) paint this; sections stay transparent so the per-template
   * backdrop layers (hero photo, patterns, category decor) show through.
   */
  base: string;
  /** Base text color applied to every section (no background). */
  page: string;
  /** Elevated card / panel surface. */
  surface: string;
  /** Hairline borders on cards and inputs. */
  border: string;
  /** Serif display headings. */
  heading: string;
  /** Muted paragraph text. */
  body: string;
  /** Small uppercase eyebrow / accent text. */
  accent: string;
  /** Solid accent fill (chips, timeline dots). */
  accentBg: string;
  /** Soft tinted accent wash. */
  accentSoft: string;
  /** shadcn-style input field. */
  input: string;
  /** Primary CTA button. */
  buttonPrimary: string;
  /** Quiet secondary button. */
  buttonGhost: string;
  /** Horizontal hairline dividers. */
  divider: string;
  /** The vertical timeline spine color. */
  timelineLine: string;
  /**
   * Zarf renkleri (sınıf dizgeleri). Verilmeyen her alan `id`'ye göre
   * varsayılanı alır; koyu temanın varsayılan mührü altındır.
   */
  envelope?: {
    /** Zarf gövdesi. */
    paper?: string;
    /** Kapak ve yan katlar. */
    flap?: string;
    /** Mühür zemini + yazı rengi. */
    seal?: string;
    /** Zarfın arkasındaki ışıma. */
    glow?: string;
    /** Açılırken görünen iç kart (zemin + kenar). */
    card?: string;
  };
  /** Detaylar kartının harita başlığı zemini; verilmezse `id`'ye göre slate/stone. */
  mapHeader?: string;
  /**
   * `true`: Detaylar kartının soyut harita başlığı hiç çizilmez (kendi
   * haritasını çizen ya da "harita yok" diyen konseptler). Verilmezse çizilir.
   */
  hideMapHeader?: boolean;
  /**
   * Program adımının düğümü (zemin, kenar, biçim). Verilmezse `surface` +
   * `border`, her zaman yuvarlak: kartın köşe yuvarlaklığı düğüme geçmez.
   */
  timelineNode?: string;
  /**
   * Program bölümünün düzeni. `kart` (varsayılan): dikey çizgi, düğüm, kart.
   * `icindekiler`: kitap içindekiler sayfası gibi noktalı satırlar
   * (`Karşılama ........ 17:00`).
   */
  timelineLayout?: 'kart' | 'icindekiler';
  /** Bölüm başlıklarının (üst etiket + başlık) hizası; verilmezse `center`. */
  headingAlign?: 'center' | 'start';
  /**
   * Bölüm girişi: süre (s) ve kayma mesafesi (px). Verilmeyen değer her
   * parçanın bugünkü değerini korur (başlık 0.9 s / 24 px, kart 0.95 s /
   * 30 px, program adımı 0.85 s / 36 px). "Hareketi azalt" kayma yapmaz.
   */
  sectionMotion?: {
    duration?: number;
    distance?: number;
  };
  /**
   * Durum renkleri (sınıf dizgeleri). Verilmeyen her alan `id`'ye göre
   * ölçülmüş varsayılanı alır (bkz. `statusClasses`).
   */
  status?: {
    /** "Kopyalandı" çipi ve LCV onay rozeti: zemin + yazı. */
    success?: string;
    /** LCV hata metni. */
    error?: string;
    /** Hatalı alanın kenarı ve odak halkası. */
    errorInput?: string;
  };
  /**
   * Alt bilginin metin sınıfları. Verilmezse `body` rengi opaklıkla
   * soluklaştırılır (ad %60, imza %40). Soluk hâl açık kâğıt zeminde AA'nın
   * altına düşebilir (ölçülen 3.01 / 1.98); zemini bilen tema ölçülmüş
   * renklerini buradan verir.
   */
  footer?: {
    /** Adlar satırı. */
    names?: string;
    /** "DavetKart ile hazırlandı" imzası. */
    branding?: string;
  };
}

const MIDNIGHT: SectionTheme = {
  id: 'midnight',
  base: 'bg-slate-950',
  page: 'text-slate-100',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-white/10',
  heading: 'text-slate-50',
  body: 'text-slate-400',
  accent: 'text-amber-200/90',
  accentBg: 'bg-amber-300',
  accentSoft: 'bg-amber-300/10',
  input:
    'w-full bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/15 transition-all duration-300',
  buttonPrimary:
    'bg-amber-300 hover:bg-amber-200 text-slate-950 shadow-lg shadow-amber-300/10',
  buttonGhost:
    'border border-white/15 text-slate-200 hover:bg-white/5 hover:border-white/25',
  divider: 'bg-white/10',
  timelineLine: 'from-amber-300/70 via-amber-200/40 to-transparent'
};

const STONE: SectionTheme = {
  id: 'stone',
  base: 'bg-stone-50',
  page: 'text-stone-800',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-stone-200',
  heading: 'text-stone-900',
  body: 'text-stone-500',
  accent: 'text-stone-500',
  accentBg: 'bg-stone-800',
  accentSoft: 'bg-stone-200/60',
  input:
    'w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-300/40 transition-all duration-300',
  buttonPrimary:
    'bg-stone-900 hover:bg-stone-800 text-stone-50 shadow-lg shadow-stone-900/10',
  buttonGhost:
    'border border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400',
  divider: 'bg-stone-200',
  timelineLine: 'from-stone-500 via-stone-400/60 to-transparent'
};

export function getSectionTheme(palette: PaletteId): SectionTheme {
  return palette === 'stone' ? STONE : MIDNIGHT;
}

/**
 * Durum renkleri: tema verdiyse onunki, vermediyse `id`'ye göre. Sabit
 * `emerald-500` / `rose-500` açık zeminde AA'nın altındaydı; varsayılanların
 * açık ve koyu zemindeki ölçümü palette.md'de.
 */
export function statusClasses(theme: SectionTheme): Required<NonNullable<SectionTheme['status']>> {
  const dark = theme.id === 'midnight';
  return {
    success: theme.status?.success ?? (dark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-500/15 text-emerald-900'),
    error: theme.status?.error ?? (dark ? 'text-rose-400' : 'text-rose-800'),
    errorInput: theme.status?.errorInput ?? 'border-rose-500/70 focus:border-rose-500/70 focus:ring-rose-500/15'
  };
}
