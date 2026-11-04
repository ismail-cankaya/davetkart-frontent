import React from 'react';

/**
 * Pop-up kartın kâğıt katmanları: düz renkli, kesik kâğıt dili (SVG, dış
 * görsel yok). Her katmanın tabanı viewBox'un altındadır; kart açılınca o
 * kenarda katlanarak ayağa kalkar.
 */

export function Gokyuzu() {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="pp-gok" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9E3D6" />
          <stop offset="1" stopColor="#FBF1E6" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" rx="6" fill="url(#pp-gok)" />
      <circle cx="290" cy="92" r="46" fill="#F4BE96" />
      <circle cx="290" cy="92" r="62" fill="#F4BE96" fillOpacity="0.25" />
      <path d="M60 70 q 8 -8 16 0 q 8 -8 16 0" stroke="#B88A86" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M110 46 q 6 -6 12 0 q 6 -6 12 0" stroke="#B88A86" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 150 C 70 130, 110 140, 150 132 C 190 124, 220 140, 260 134" stroke="#FFFFFF" strokeWidth="10" strokeOpacity="0.55" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Tepeler() {
  return (
    <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 120 V 60 C 50 30, 110 34, 160 56 C 210 78, 250 26, 310 30 C 350 32, 380 50, 400 58 V 120 Z" fill="#B8CBA5" />
      <path d="M0 120 V 86 C 70 64, 130 70, 200 84 C 270 98, 330 70, 400 80 V 120 Z" fill="#9DB48D" />
    </svg>
  );
}

export function Kemer() {
  const flowers: [number, number, string][] = [
    [62, 120, '#E79AA6'], [70, 86, '#F6C87A'], [86, 58, '#F2B8C2'], [110, 36, '#E79AA6'], [140, 22, '#F6E7D4'],
    [170, 16, '#F6C87A'], [200, 14, '#E79AA6'], [230, 16, '#F2B8C2'], [260, 22, '#F6E7D4'], [290, 36, '#E79AA6'],
    [314, 58, '#F6C87A'], [330, 86, '#F2B8C2'], [338, 120, '#E79AA6']
  ];
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full" aria-hidden="true">
      <path
        d="M52 260 V 130 C 52 50, 120 6, 200 6 C 280 6, 348 50, 348 130 V 260 H 316 V 132 C 316 72, 264 36, 200 36 C 136 36, 84 72, 84 132 V 260 Z"
        fill="#FBF6EE"
      />
      {flowers.map(([x, y, c], i) => (
        <g key={i}>
          <ellipse cx={x - 9} cy={y + 6} rx="9" ry="4" fill="#8FA884" transform={`rotate(-30 ${x - 9} ${y + 6})`} />
          <circle cx={x} cy={y} r="11" fill={c} />
          <circle cx={x} cy={y} r="4" fill="#FBF6EE" fillOpacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

export function Agac({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 200" className="w-full h-full" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M56 200 V 120 L 46 96 L 58 108 V 84 L 66 104 L 76 90 L 66 124 V 200 Z" fill="#8A6A55" />
      <circle cx="60" cy="72" r="44" fill="#7E9C72" />
      <circle cx="34" cy="96" r="26" fill="#8FA884" />
      <circle cx="88" cy="92" r="28" fill="#6F8F6A" />
      <circle cx="60" cy="40" r="26" fill="#9DB48D" />
      <circle cx="46" cy="64" r="5" fill="#F2B8C2" />
      <circle cx="78" cy="56" r="5" fill="#F2B8C2" />
      <circle cx="62" cy="96" r="5" fill="#F6C87A" />
    </svg>
  );
}

/** Çift silueti: elbise ve takım, el ele (yalın geometrik biçimler). */
export function Cift() {
  return (
    <svg viewBox="0 0 160 200" className="w-full h-full" aria-hidden="true">
      {/* Gelin */}
      <circle cx="58" cy="40" r="15" fill="#3B3A4A" />
      <path d="M44 34 C 30 60, 30 90, 24 110 L 46 70 Z" fill="#F6E7D4" fillOpacity="0.9" />
      <path d="M50 58 H 66 L 72 96 L 96 198 H 18 L 44 96 Z" fill="#FFFFFF" stroke="#C9B8A2" strokeWidth="2" />
      <path d="M50 58 H 66 L 70 90 H 46 Z" fill="#F2E6D8" />
      <circle cx="74" cy="104" r="9" fill="#E79AA6" />
      <circle cx="80" cy="98" r="6" fill="#F6C87A" />
      {/* Damat */}
      <circle cx="106" cy="36" r="15" fill="#3B3A4A" />
      <path d="M92 56 H 120 L 126 120 H 86 Z" fill="#3B3A4A" />
      <path d="M102 56 L 106 74 L 110 56 Z" fill="#FBF6EE" />
      <path d="M90 120 H 104 L 102 198 H 90 Z M108 120 H 122 L 122 198 H 110 Z" fill="#2C2B38" />
      <path d="M92 66 L 78 100" stroke="#3B3A4A" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

export function Cimen() {
  return (
    <svg viewBox="0 0 400 70" className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 70 V 40 Q 12 14 22 40 Q 34 10 46 40 Q 58 18 70 40 Q 82 8 96 40 Q 108 20 120 40 Q 134 6 148 40 Q 160 22 172 40 Q 186 10 200 40 Q 214 16 226 40 Q 240 6 254 40 Q 266 20 278 40 Q 292 10 306 40 Q 318 18 330 40 Q 344 8 358 40 Q 370 20 382 40 Q 392 16 400 40 V 70 Z"
        fill="#7E9C72"
      />
      {[30, 90, 160, 230, 300, 370].map((x, i) => (
        <circle key={x} cx={x} cy={30 + (i % 2) * 6} r="6" fill={i % 2 ? '#F6C87A' : '#E79AA6'} />
      ))}
    </svg>
  );
}
