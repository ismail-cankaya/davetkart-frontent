import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** Kaustik ağı aşağıda yoğunlaşır; dikeyde üst yarı açık kalsın diye kaydırıldı. */
const VIDEO = videoSet('deniz-isiltisi', { landscape: '50% 50%', portrait: '50% 55%' });

/**
 * DugunDenizIsiltisi — "Deniz Işıltısı": su yüzeyinden yansıyan ışık ağı.
 * Kıyı ve yaz düğünleri için; palet akvamarin zemin, sıcak altın vurgu.
 */
const DENIZ_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#eef7f6]',
  page: 'text-[#33504f]',
  surface: 'bg-white/72 backdrop-blur-md',
  border: 'border-[#d3e6e3]',
  heading: 'text-[#22403f]',
  body: 'text-[#6a8785]',
  accent: 'text-[#c0985c]',
  accentBg: 'bg-[#c0985c]',
  accentSoft: 'bg-[#c0985c]/10',
  input:
    'w-full bg-white/85 border border-[#d3e6e3] rounded-lg px-3.5 py-2.5 text-sm text-[#33504f] placeholder:text-[#9ab5b2] focus:outline-none focus:border-[#5f9c98] focus:ring-2 focus:ring-[#5f9c98]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#2f5d5b] hover:bg-[#3c716e] text-[#f1faf9] shadow-lg shadow-[#2f5d5b]/15',
  buttonGhost:
    'border border-[#bcd8d5] text-[#4a706e] hover:bg-[#e2f0ee] hover:border-[#9cc4c0]',
  divider: 'bg-[#d3e6e3]',
  timelineLine: 'from-[#5f9c98] via-[#a9cfcb]/60 to-transparent'
};

export function DugunDenizIsiltisi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DENIZ_THEME}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Kaustik parlamaları yüksek frekanslı; metnin arkasında beyaz
              yıkama olmazsa okuma yorucu olur. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/50" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#eef7f6]" />
        </VideoBackdrop>
      )}
    />
  );
}
