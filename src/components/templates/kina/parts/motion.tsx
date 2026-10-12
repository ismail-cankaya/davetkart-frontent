import React from 'react';

/**
 * Kına'nın sürekli döngüleri (alev titremesi, mum ışığı nefesi) — yalnızca
 * transform/opacity. React 19 `href` + `precedence` taşıyan <style>'ı bir kez
 * <head>'e yazar; "hareketi azalt"ta hepsi durur, öğeler görünür kalır.
 */
const CSS = `
@keyframes kina-flicker{0%,100%{transform:scale(1,1) rotate(0)}22%{transform:scale(.93,1.07) rotate(-2.5deg)}48%{transform:scale(1.05,.94) rotate(1.8deg)}74%{transform:scale(.96,1.04) rotate(-1deg)}}
@keyframes kina-glow{0%,100%{opacity:.62}50%{opacity:1}}
.kina-flicker{animation:kina-flicker 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.kina-glow{animation:kina-glow 3.4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.kina-flicker,.kina-glow{animation:none!important}}
`;

/** `kina-flicker` ve `kina-glow` sınıflarının kare tanımları. */
export function KinaMotionStyles() {
  return (
    <style href="kina-motion" precedence="kina">
      {CSS}
    </style>
  );
}
