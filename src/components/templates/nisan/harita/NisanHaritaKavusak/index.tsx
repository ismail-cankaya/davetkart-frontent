import React from 'react';
import { InvitationComposition } from '../../../shared/InvitationComposition';
import { HARITA_TEMASI, HaritaKapak, HaritaKok, HaritaSahnesi, HaritaZarf, KavusakArazisi } from '../../../konsept/harita';
import { TemplateProps } from '../../../types';
import { NISAN_HARITA_FLAVOR } from '../flavor';

/**
 * NisanHaritaKavusak — "Kavuşak": iki derenin birleştiği arazi. Rota iki kolla
 * başlar (iki ad, iki yol), bir kavşakta tek rota olur ve duraklardan geçip
 * iğneye varır. Tek ad girildiyse rota tek koldur. Köşede pusula gülü.
 */
export function NisanHaritaKavusak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <HaritaKok>
      <InvitationComposition
        invitation={invitation}
        flavor={NISAN_HARITA_FLAVOR}
        mode={mode}
        themeOverride={HARITA_TEMASI}
        renderBackdrop={(durum) => (
          <HaritaSahnesi {...durum}>
            <KavusakArazisi />
          </HaritaSahnesi>
        )}
        renderHero={(props) => <HaritaKapak {...props} duzen="kavsak" rota="patika" sus="pusula" />}
        renderEnvelope={(props) => <HaritaZarf {...props} arazi={<KavusakArazisi />} />}
      />
    </HaritaKok>
  );
}
