import React from 'react';
import { InvitationComposition } from '../../../shared/InvitationComposition';
import { CarsiPlani, HARITA_TEMASI, HaritaKok, HaritaSahnesi, HaritaZarf, IzKapak } from '../../../konsept/harita';
import { TemplateProps } from '../../../types';
import { DOGUM_GUNU_HARITA_FLAVOR } from '../flavor';

/**
 * DogumGunuHaritaKutlamaHatti — "Kutlama Hattı": yetişkin doğum gününün
 * akşam rotası, şehir planı ekseninde. Kurgusal bir çarşının dolu yapı
 * adaları; program adımları bir hat şemasının istasyonlarıdır. Telefonda hat
 * sol kenarda dikey bir omurga: kartuş ilk istasyon, duraklar sırayla, iğne
 * son durak. Genişte kartuş solda, hat sağda; rota kartuştan çıkıp hatta katılır.
 */
export function DogumGunuHaritaKutlamaHatti({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <HaritaKok>
      <InvitationComposition
        invitation={invitation}
        flavor={DOGUM_GUNU_HARITA_FLAVOR}
        mode={mode}
        themeOverride={HARITA_TEMASI}
        renderBackdrop={(durum) => (
          <HaritaSahnesi {...durum}>
            <CarsiPlani />
          </HaritaSahnesi>
        )}
        renderHero={(props) => <IzKapak {...props} duzen="hat" rota="cadde" sus="kuzey" hedefEtiketi="Son durak" vurgu="ilk" />}
        renderEnvelope={(props) => <HaritaZarf {...props} arazi={<CarsiPlani />} />}
      />
    </HaritaKok>
  );
}
