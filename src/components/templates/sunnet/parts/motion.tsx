import React from 'react';

/**
 * Sünnet'in sürekli döngüleri — yalnızca transform/opacity, compositor'da döner.
 *
 * index.css ortak dosya olduğu için kare tanımları burada durur. React 19
 * `href` + `precedence` taşıyan <style>'ı <head>'e taşır ve tekilleştirir;
 * kaç bileşen çağırırsa çağırsın belgeye bir kez yazılır. "Hareketi azalt"
 * tercihinde hepsi durur, öğeler son yerinde ve görünür kalır.
 */
const CSS = `
@keyframes sunnet-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes sunnet-glow{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes sunnet-sheen{0%,62%{transform:translateX(-130%)}100%{transform:translateX(330%)}}
@keyframes sunnet-spin{to{transform:rotate(360deg)}}
.sunnet-sway{animation:sunnet-sway 6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.sunnet-sway-hang{animation:sunnet-sway 5.2s ease-in-out infinite;transform-origin:50% 0}
.sunnet-glow{animation:sunnet-glow 4.4s ease-in-out infinite}
.sunnet-sheen{transform:translateX(-130%);animation:sunnet-sheen 7s cubic-bezier(.65,0,.35,1) 1.8s infinite}
.sunnet-spin{animation:sunnet-spin 140s linear infinite}
.sunnet-spin-rev{animation:sunnet-spin 190s linear infinite reverse}
@media (prefers-reduced-motion:reduce){.sunnet-sway,.sunnet-sway-hang,.sunnet-glow,.sunnet-sheen,.sunnet-spin,.sunnet-spin-rev{animation:none!important}}
`;

/** Döngü sınıflarının (sunnet-sway, -glow, -sheen, -spin) kare tanımları. */
export function SunnetMotionStyles() {
  return (
    <style href="sunnet-motion" precedence="sunnet">
      {CSS}
    </style>
  );
}
