import React from 'react';

/** Bindallı lalesi: orta yaprak + iki yan yaprak; (0,0) tabanda, yukarı bakar. */
const LALE = 'M0-15C4-11 5-6 0 0C-5-6-4-11 0-15ZM0 0C-7-2-9-8-7-12C-4-9-2-5 0 0ZM0 0C7-2 9-8 7-12C4-9 2-5 0 0Z';

/** Sağ kol: dalgalı sap, badem yapraklar, kıvrım ve pullar (sol kol aynası). */
function Kol() {
  return (
    <g>
      <path d="M104 18C114 22 122 10 134 14S152 22 162 14S180 8 189 14" />
      <path d="M189 14C195 13 197 9 194 7C191 6 189 9 192 10" />
      <path d="M116 17C118 11 124 9 128 10C126 15 121 18 116 17Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M146 18C150 22 156 23 159 21C156 17 151 16 146 18Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M171 12C173 8 177 7 180 8C178 11 175 12 171 12Z" fill="currentColor" fillOpacity="0.45" />
      <circle cx="134" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="162" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="126" cy="22" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="154" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </g>
  );
}

/**
 * Bindallı dalı — kadife üstüne sırmayla işlenen "dal": ortada lale, iki yana
 * kıvrılan saplar. Ayraç olarak kullanılır; rengi `currentColor`.
 */
export function BindalliDal({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={LALE} transform="translate(100 21)" fill="currentColor" fillOpacity="0.3" />
      <Kol />
      <g transform="translate(200 0) scale(-1 1)">
        <Kol />
      </g>
    </svg>
  );
}

/**
 * Bindallı köşesi — köşeden iki kenara uzanan sırma sarmaşık ve köşegende bir
 * lale. Sol üst köşe için çizilir; diğer köşeler `scale` ile aynalanır.
 */
export function BindalliKose({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M8 8C32 5 50 13 68 8S98 5 114 10" />
      <path d="M8 8C5 32 13 50 8 68S5 98 10 114" />
      <path d="M8 8C20 20 28 28 38 38" />
      <path d={LALE} transform="translate(41 41) rotate(135) scale(1.15)" fill="currentColor" fillOpacity="0.3" />
      <path d="M30 9C33 3 40 2 44 4C41 9 35 11 30 9Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M9 30C3 33 2 40 4 44C9 41 11 35 9 30Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M78 7C82 12 89 13 92 11C89 6 83 5 78 7Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M7 78C12 82 13 89 11 92C6 89 5 83 7 78Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M114 10C119 10 120 5 117 4C114 3 113 6 115 7" />
      <path d="M10 114C10 119 5 120 4 117C3 114 6 113 7 115" />
      <circle cx="56" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="56" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="100" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="6" cy="100" r="1" fill="currentColor" stroke="none" />
      <circle cx="24" cy="24" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
