import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/**
 * Odak farkı bilinçli: yatay renderda güneş sol-alt üçte birde, merkez
 * korunur; dikeyde güneş alt yarıda olduğu için kırpmada biraz yukarısı
 * tutulur ki isimler açık gökte kalsın.
 */
const VIDEO = videoSet('gokyuzu-ruyasi', { landscape: '50% 50%', portrait: '50% 42%' });

/**
 * DugunGokyuzu — "Gökyüzü Rüyası": şafak göğü ve süzülen bulutların önünde
 * kurdele hero. Mürekkep göğün gece mavisine, vurgu bulut altındaki şakayık
 * yansımasına çekildi.
 *
 * Hero'nun tamamını döngüsel gökyüzü videosu kaplar; dikey konteynerde ayrı
 * komponize edilmiş dikey render devreye girer.
 */
export function DugunGokyuzu({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunGokyuzu}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Tül perde: koyu mürekkebin açık gök üzerinde kontrastını kurar.
              Metin bloğunun durduğu orta bant da yıkanır; video kenarlardan görünür. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/35 to-white/60" />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 48% at 50% 50%, rgba(241,244,249,0.55), rgba(241,244,249,0) 75%)' }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#f1f4f9]" />
        </VideoBackdrop>
      )}
    />
  );
}
