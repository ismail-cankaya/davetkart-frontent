import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { EbruSheet } from '../../shared/effects';
import { EbruHero } from '../../shared/heroes';
import { KINA_EBRU } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaEbru — "Ebru" kına yorumu: teknede kına, al ve yaprak boyaları; sırma kenar. */
export function KinaEbru({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_EBRU}
      renderHero={(props) => <EbruHero {...props} paper="#fdf5ec" gold="#b8843a" ink="#9c2a18" />}
      renderHeroBackground={({ revealed }) => (
        <EbruSheet
          ground="#f1dccb"
          inks={['#eab48e', '#f2cfa0', '#e3a294', '#c9b58a', '#f8e4d0']}
          stoneInks={['#b0241c', '#c4581d', '#666a2c', '#4a1a10']}
          names={invitation.names}
          date={invitation.date}
          revealed={revealed}
          fadeTo="#f6e6d6"
        />
      )}
    />
  );
}
