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
 * DugunMumIsigi — "Mum Işığı": gece nikâhı. Video sıcak bokeh taşır;
 * tipografi inci, vurgu mum ışığında pembeleşen inci.
 */
export function DugunMumIsigi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunMumIsigi}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <VideoBackdrop {...VIDEO.landscape} portrait={VIDEO.portrait}>
          {/* Açık renk metnin kontrastı için koyu scrim: kenarlarda yoğun,
              ortada şeffaf — bokeh görünürken yazı okunaklı kalır. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0c0b12]" />
        </VideoBackdrop>
      )}
    />
  );
}
