import React, { useContext, type ReactNode } from 'react';
import { MirrorContext } from './Kitap';
import { cn } from '../../../../utils/cn';
import { BEZ_DOKUSU } from '../../konsept/kitap/doku';

/** Kâğıt lifi: tek seferlik SVG gürültüsü, data-URI görsel (kare başına filtre yok). */
const LIF =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.35 0 0 0 0 0.2 0 0 0 0.09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const KAGIT = '#F4ECD8';
export const MUREKKEP = '#2B2118';
export const SOLUK = '#6B5A45';
export const GUL = '#8E3346';
export const YALDIZ = '#C9A35C';
const KUMAS = '#6E2A37';

interface FaceProps {
  side: 'front' | 'back';
  /** Sayfa numarası; kapakta yok. */
  number?: number;
  /** Üst başlık (koşan başlık). */
  head?: string;
  children: ReactNode;
  className?: string;
  /** İçerik kaydırılabilir mi (uzun bölümler). */
  scroll?: boolean;
}

/**
 * Kitap sayfası yüzü: kâğıt, lif, sararmış kenar, sırt gölgesi, koşan başlık
 * ve sayfa numarası. Ön yüzde sırt solda, arka yüzde sağda.
 */
export function Face({ side, number, head, children, className, scroll }: FaceProps) {
  const mirrored = useContext(MirrorContext);
  const spine =
    side === 'front'
      ? 'linear-gradient(90deg, rgba(60,40,20,0.22), rgba(60,40,20,0.06) 22px, transparent 48px)'
      : 'linear-gradient(270deg, rgba(60,40,20,0.22), rgba(60,40,20,0.06) 22px, transparent 48px)';
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', side === 'front' ? 'rounded-r-[6px]' : 'rounded-l-[6px]', className)}
      style={{ backgroundColor: KAGIT, backgroundImage: `${LIF}`, color: MUREKKEP }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `${spine}, radial-gradient(140% 110% at 50% 50%, transparent 62%, rgba(176,132,64,0.28) 100%)`
        }}
      />
      <div className={cn('absolute inset-0', mirrored && '-scale-x-100')}>
      {head && (
        <p className="absolute top-4 inset-x-10 text-center text-[9px] tracking-[0.32em] uppercase truncate" style={{ color: SOLUK }}>
          {head}
        </p>
      )}
      <div
        className={cn(
          'absolute inset-x-0 top-9 bottom-10',
          side === 'front' ? 'pl-7 pr-5' : 'pl-5 pr-7',
          scroll ? 'overflow-y-auto overscroll-contain [scrollbar-width:thin] [touch-action:pan-y]' : 'overflow-hidden'
        )}
        data-lenis-prevent
      >
        {children}
      </div>
      {number !== undefined && (
        <p className="absolute bottom-3.5 inset-x-0 text-center text-[11px] tabular-nums" style={{ color: SOLUK }}>
          — {number} —
        </p>
      )}
      </div>
    </div>
  );
}

/** Bez cilt kapak yüzeyi (kitin dokusu, kendi gül kurusu rengi). */
export function Cloth({ side, children }: { side: 'front' | 'back'; children?: ReactNode }) {
  const mirrored = useContext(MirrorContext);
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', side === 'front' ? 'rounded-r-[6px]' : 'rounded-l-[6px]')}
      style={{
        backgroundColor: KUMAS,
        backgroundImage: `url("${BEZ_DOKUSU.url}")`,
        backgroundSize: `${BEZ_DOKUSU.boy}px`,
        backgroundBlendMode: 'multiply'
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            side === 'front'
              ? 'linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0.1) 16px, transparent 30px), radial-gradient(130% 95% at 50% 45%, transparent 58%, rgba(0,0,0,0.32) 100%)'
              : 'linear-gradient(270deg, rgba(0,0,0,0.35), rgba(0,0,0,0.1) 16px, transparent 30px), radial-gradient(130% 95% at 50% 45%, transparent 58%, rgba(0,0,0,0.32) 100%)'
        }}
      />
      <div className="absolute inset-4 border border-[#C9A35C]/70 rounded-[3px]" />
      <div className="absolute inset-[22px] border border-[#C9A35C]/35 rounded-[2px]" />
      <div className={cn('absolute inset-0', mirrored && '-scale-x-100')}>{children}</div>
    </div>
  );
}

/** Yan kâğıdı: iki tonlu tekrar eden dal deseni. */
export function Endpaper({ side }: { side: 'front' | 'back' }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', side === 'front' ? 'rounded-r-[6px]' : 'rounded-l-[6px]')} style={{ background: '#E9D9C4' }}>
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <pattern id="ks-yan-kagidi" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
            <path d="M8 46 C 18 30, 30 26, 46 10" fill="none" stroke="#B9806F" strokeWidth="1.3" />
            <ellipse cx="22" cy="31" rx="6" ry="2.6" transform="rotate(-40 22 31)" fill="#C79A8A" />
            <ellipse cx="34" cy="20" rx="6" ry="2.6" transform="rotate(-40 34 20)" fill="#9EAE8E" />
            <circle cx="46" cy="10" r="3.2" fill="#8E3346" fillOpacity="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ks-yan-kagidi)" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            side === 'front'
              ? 'linear-gradient(90deg, rgba(60,40,20,0.25), transparent 40px)'
              : 'linear-gradient(270deg, rgba(60,40,20,0.25), transparent 40px)'
        }}
      />
    </div>
  );
}

/** Süslü bölüm başlığı: Romen rakamı, ince çizgiler, ortada yaprak. */
export function ChapterHead({ numeral, title }: { numeral: string; title: string }) {
  return (
    <div className="text-center mb-4">
      <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: GUL }}>
        Bölüm {numeral}
      </p>
      <h2 className="mt-2 text-[1.65rem] leading-tight [font-family:var(--kt-baslik-font)]">{title}</h2>
      <svg viewBox="0 0 120 12" className="mx-auto mt-2 w-28 h-3" aria-hidden="true">
        <path d="M2 6 H48 M72 6 H118" stroke={YALDIZ} strokeWidth="0.8" />
        <path d="M60 1 C 54 6, 54 6, 60 11 C 66 6, 66 6, 60 1 Z" fill={GUL} fillOpacity="0.8" />
        <circle cx="50" cy="6" r="1.4" fill={YALDIZ} />
        <circle cx="70" cy="6" r="1.4" fill={YALDIZ} />
      </svg>
    </div>
  );
}

// ——— Düz (2D) illüstrasyonlar: yalnızca dolgu şekiller, kontur yok ———

export function Kuslar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 140" className={className} aria-hidden="true">
      <path d="M10 104 C 60 92, 120 96, 192 84" stroke="#6B4A33" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="42" cy="94" rx="10" ry="4" transform="rotate(-25 42 94)" fill="#8FA27E" />
      <ellipse cx="150" cy="86" rx="10" ry="4" transform="rotate(20 150 86)" fill="#8FA27E" />
      <ellipse cx="170" cy="92" rx="8" ry="3.4" transform="rotate(-15 170 92)" fill="#A9B894" />
      {/* Sol kuş */}
      <path d="M70 98 C 58 70, 82 52, 102 66 C 106 82, 96 98, 70 98 Z" fill="#D27C83" />
      <circle cx="94" cy="62" r="11" fill="#D27C83" />
      <path d="M104 61 L 113 64 L 104 67 Z" fill="#E0A458" />
      <circle cx="97" cy="60" r="1.8" fill={MUREKKEP} />
      <path d="M72 86 C 66 76, 76 70, 88 80 Z" fill="#B5606A" />
      <path d="M68 96 L 52 104 L 64 92 Z" fill="#B5606A" />
      {/* Sağ kuş */}
      <path d="M134 96 C 146 68, 122 50, 104 66 C 100 82, 110 96, 134 96 Z" fill="#7F9DB0" />
      <circle cx="111" cy="61" r="11" fill="#7F9DB0" />
      <path d="M101 60 L 93 63 L 101 66 Z" fill="#E0A458" />
      <circle cx="108" cy="59" r="1.8" fill={MUREKKEP} />
      <path d="M132 84 C 138 74, 128 68, 116 78 Z" fill="#5F7F94" />
      {/* Kalp */}
      <path d="M102 36 C 96 28, 86 34, 92 42 L 102 50 L 112 42 C 118 34, 108 28, 102 36 Z" fill={GUL} />
    </svg>
  );
}

export function Buket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 180" className={className} aria-hidden="true">
      <path d="M80 176 L 70 104 M80 176 L 92 102 M80 176 L 80 98" stroke="#6E8A5C" strokeWidth="3" />
      <path d="M62 150 L 98 150 L 92 176 L 68 176 Z" fill="#E8D3B5" />
      <path d="M62 150 L 80 162 L 98 150" fill="#D9BE98" />
      <ellipse cx="50" cy="96" rx="16" ry="6" transform="rotate(-35 50 96)" fill="#8FA27E" />
      <ellipse cx="112" cy="94" rx="16" ry="6" transform="rotate(35 112 94)" fill="#8FA27E" />
      <circle cx="80" cy="70" r="24" fill="#D27C83" />
      <circle cx="80" cy="70" r="14" fill="#B5606A" />
      <circle cx="80" cy="70" r="6" fill="#8E3346" />
      <circle cx="48" cy="80" r="16" fill="#F0C7B8" />
      <circle cx="48" cy="80" r="7" fill="#E0A458" />
      <circle cx="114" cy="78" r="17" fill="#F2E3C6" />
      <circle cx="114" cy="78" r="7" fill="#E0A458" />
      <circle cx="96" cy="40" r="10" fill="#7F9DB0" />
      <circle cx="60" cy="44" r="9" fill="#A9B894" />
    </svg>
  );
}

export function Yuzukler({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden="true">
      <circle cx="62" cy="62" r="30" fill="none" stroke={YALDIZ} strokeWidth="9" />
      <circle cx="98" cy="62" r="30" fill="none" stroke="#D9B98A" strokeWidth="9" />
      <path d="M62 32 A 30 30 0 0 1 92 62" fill="none" stroke={YALDIZ} strokeWidth="9" />
      <path d="M62 24 L 54 14 L 62 4 L 70 14 Z" fill="#DCE8EE" />
      <path d="M62 24 L 54 14 L 70 14 Z" fill="#B8CCD6" />
    </svg>
  );
}

export function Fener({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 170" className={className} aria-hidden="true">
      <path d="M60 4 V 22" stroke="#6B4A33" strokeWidth="3" />
      <path d="M38 22 H 82 L 76 34 H 44 Z" fill="#6B4A33" />
      <path d="M44 34 H 76 L 84 130 H 36 Z" fill="#E8C47A" />
      <path d="M52 34 H 68 L 70 130 H 50 Z" fill="#F6DFA4" />
      <ellipse cx="60" cy="86" rx="9" ry="16" fill="#FFF3D1" />
      <path d="M32 130 H 88 L 80 144 H 40 Z" fill="#6B4A33" />
      <circle cx="60" cy="86" r="40" fill="#F6DFA4" fillOpacity="0.18" />
    </svg>
  );
}

/** Arka yüz: ortada bir illüstrasyon, altında küçük bir söz. */
export function Vignette({ number, children, caption }: { number: number; children: ReactNode; caption?: string }) {
  return (
    <Face side="back" number={number}>
      <div className="h-full flex flex-col items-center justify-center text-center px-2">
        {children}
        {caption && (
          <p className="mt-5 italic text-[15px] leading-relaxed max-w-[15rem]" style={{ color: SOLUK }}>
            {caption}
          </p>
        )}
      </div>
    </Face>
  );
}
