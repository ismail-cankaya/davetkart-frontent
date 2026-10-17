import React from 'react';
import { InvitationComposition } from '../../../shared/InvitationComposition';
import { HARITA_TEMASI, HaritaKapak, HaritaKok, HaritaSahnesi, HaritaZarf, SehirPlani } from '../../../konsept/harita';
import { TemplateProps } from '../../../types';
import { DUGUN_HARITA_FLAVOR } from '../flavor';

/**
 * DugunHaritaKiyiKenti — "Kıyı Kenti": günün haritası bir kıyı kentinin
 * planıdır. Kartuş sol üstte, lejant sağ altta; rota beyaz bir caddenin
 * üstünden kartuştan iğneye iner. Köşede kuzey oku, dipnotta ölçek esprisi.
 */
export function DugunHaritaKiyiKenti({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <HaritaKok>
      <InvitationComposition
        invitation={invitation}
        flavor={DUGUN_HARITA_FLAVOR}
        mode={mode}
        themeOverride={HARITA_TEMASI}
        renderBackdrop={(durum) => (
          <HaritaSahnesi {...durum}>
            <SehirPlani />
          </HaritaSahnesi>
        )}
        renderHero={(props) => <HaritaKapak {...props} duzen="capraz" rota="cadde" sus="kuzey" olcekEsprisi />}
        renderEnvelope={(props) => <HaritaZarf {...props} arazi={<SehirPlani />} />}
      />
    </HaritaKok>
  );
}
