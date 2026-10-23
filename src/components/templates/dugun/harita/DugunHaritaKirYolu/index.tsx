import React from 'react';
import { InvitationComposition } from '../../../shared/InvitationComposition';
import { HARITA_TEMASI, HaritaKapak, HaritaKok, HaritaSahnesi, HaritaZarf, KirArazisi } from '../../../konsept/harita';
import { TemplateProps } from '../../../types';
import { DUGUN_HARITA_FLAVOR } from '../flavor';

/**
 * DugunHaritaKirYolu — "Kır Yolu": kır düğününün arazi haritası. Eş yükselti
 * eğrileri, korular, dere; rota bir patikadır. Geniş ekranda kartuş klasik
 * başlık bloğu gibi sol altta, lejant sağ üstte; köşede pusula gülü.
 */
export function DugunHaritaKirYolu({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <HaritaKok>
      <InvitationComposition
        invitation={invitation}
        flavor={DUGUN_HARITA_FLAVOR}
        mode={mode}
        themeOverride={HARITA_TEMASI}
        renderBackdrop={(durum) => (
          <HaritaSahnesi {...durum}>
            <KirArazisi />
          </HaritaSahnesi>
        )}
        renderHero={(props) => <HaritaKapak {...props} duzen="ayna" rota="patika" sus="pusula" />}
        renderEnvelope={(props) => <HaritaZarf {...props} arazi={<KirArazisi />} />}
      />
    </HaritaKok>
  );
}
