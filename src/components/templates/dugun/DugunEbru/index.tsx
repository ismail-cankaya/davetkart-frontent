import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunEbru — "Ebru" yorumu: inci su üstünde pudra şakayık, lila ve mersin
 * battal; taşlar mürekkep moru ve şakayık. Koltuğun cetveli altın değil inci.
 */
export function DugunEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunEbru}
      renderHero={(props) => <EbruHero {...props} paper="#fbf9fb" gold="#b4a9c0" ink="#8f2f57" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#f1edf3"
          inks={['#e8c3d3', '#d6cbea', '#c9dccf', '#efe8f3', '#f7f2f8']}
          stoneInks={['#2c2340', '#8f7fb8', '#b5577c', '#6f9c86']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#f3eff4"
        />
      )}
    />
  );
}
