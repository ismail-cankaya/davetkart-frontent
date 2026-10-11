import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { VideoBackdrop } from '../../shared/VideoBackdrop';
import { videoSet } from '../../shared/videoAssets';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/** Bokeh kütlesi her iki renderda da kenarlarda; merkez metin için temiz. */
const VIDEO = videoSet('mum-isigi', { landscape: '50% 50%', portrait: '50% 50%' });

/**
 * DugunMumIsigi — "Mum Işığı": gece nikâhı. Sıcak toprak tonunda bir gece;
 * mum ışığı bokeh'i hero'nun üst yarısında serbest kalır, metin alttaki
 * koyulaşan bölgeye iner (kategoride metni alta indiren tek şablon).
 */
export function DugunMumIsigi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunMumIsigi}
      renderHero={(props) => <KurdeleHero {...props} anchor="end" />}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Sıcak tint: mor gece değil, mumun düştüğü toprak tonu. */}
          <div className="absolute inset-0 bg-[#5a3220]/35 mix-blend-multiply" />
          {/* Alt yarı koyulaşır; metin orada durur, üstte bokeh nefes alır. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#120d0b]/20 via-[#120d0b]/55 to-[#120d0b]/90" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#120d0b]" />
        </VideoBackdrop>
      )}
    />
  );
}
