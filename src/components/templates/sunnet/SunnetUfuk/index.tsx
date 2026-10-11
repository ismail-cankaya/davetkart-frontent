import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { SUNNET_UFUK } from '../themes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

const SCENE = UFUK_PRESETS.sunnet;

/** SunnetUfuk — "Ufuk": havuzunda yansıyan soğan kubbeli bir saray, hilalin altında; bölümler gece camında. */
export function SunnetUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_UFUK}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
