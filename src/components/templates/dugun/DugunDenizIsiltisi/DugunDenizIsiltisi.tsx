import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/** Kaustik ağı aşağıda yoğunlaşır; dikeyde üst yarı açık kalsın diye kaydırıldı. */
const VIDEO = videoSet('deniz-isiltisi', { landscape: '50% 50%', portrait: '50% 55%' });

/**
 * DugunDenizIsiltisi — "Deniz Işıltısı": su yüzeyinden yansıyan ışık ağı.
 * Kıyı ve yaz düğünleri için akvamarin zemin; vurgu altın değil mercana
 * çalan şakayık.
 */
export function DugunDenizIsiltisi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunDenizIsiltisi}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Kaustik parlamaları yüksek frekanslı; metnin arkasında beyaz
              yıkama olmazsa okuma yorucu olur. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/40 to-white/60" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#eef6f5]" />
        </VideoBackdrop>
      )}
    />
  );
}
