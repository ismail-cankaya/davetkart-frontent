import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { KINA_UFUK } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * Sahne ortak kına ön ayarıdır (fenerli kubbe şehri, kızıl gün batımı); kart
 * kapağı aynı ön ayardan üretildiği için renkleri burada değiştirilmez.
 */
const SCENE = UFUK_PRESETS.kina;

/** KinaUfuk — kaydırdıkça kızıl akşamdan geceye geçen fenerli şehir; bölümler kına ailesinde. */
export function KinaUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_UFUK}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
