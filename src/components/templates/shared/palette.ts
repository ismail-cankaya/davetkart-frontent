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
