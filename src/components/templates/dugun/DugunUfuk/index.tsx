import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { TemplateProps } from '../../types';

/**
 * DugunUfuk — "Ufuk" yorumu: servi bahçesindeki rotundada gün batımından
 * yıldızlı geceye uzanan bir akşam.
 *
 * Sahne ön ayarı (UFUK_PRESETS.dugun) ortaktır ve kart kapağı da ondan
 * üretilir; bu yüzden gökyüzü olduğu gibi kalır. Kategori kimliği sahnenin
 * önündeki katmanda: inci pembesi vurgu, inci buton, kurdele mührü.
 */
const SCENE = UFUK_PRESETS.dugun;

export function DugunUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunUfuk}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
