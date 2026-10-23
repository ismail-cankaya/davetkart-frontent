import React from 'react';
import { InvitationComposition } from '../../../shared/InvitationComposition';
import type { TemplateFlavor } from '../../../shared/flavor';
import {
  Carpi,
  HARITA_RENK,
  HARITA_TEMASI_SICAK,
  HaritaKok,
  HaritaSahnesi,
  HaritaZarf,
  HazineAdasi,
  IzKapak,
  type SimgeSozlugu
} from '../../../konsept/harita';
import { TemplateProps } from '../../../types';
import { DOGUM_GUNU_HARITA_FLAVOR } from '../flavor';

/** Programın üst etiketi hazinenin diliyle; geri kalan kategori harita flavor'ı. */
const FLAVOR: TemplateFlavor = {
  ...DOGUM_GUNU_HARITA_FLAVOR,
  eyebrows: { timeline: 'Hazineye giden yol' }
};

/** Çocuk partisinin sözlüğü: karşılama kadeh değil balondur; mum pastadır. */
const SOZLUK: SimgeSozlugu = [
  ['balon', ['karşılama', 'balon', 'hoş geldin']],
  ['pasta', ['pasta', 'mum ']]
];

/**
 * DogumGunuHaritaHazineAvi — "Hazine Avı": çocuk doğum gününün hazine
 * haritası. Kurgusal bir ada, sıcak kum zemini; kartuş üstte ortada bir başlık
 * bandı, program adımları sağlı sollu ipucu kutuları, kesik çizgili rota
 * kutudan kutuya zikzakla iner ve X'te biter. Mekân X'in yanındaki varış
 * kartında: "Hazine burada". Köşede pusula gülü.
 */
export function DogumGunuHaritaHazineAvi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <HaritaKok>
      <InvitationComposition
        invitation={invitation}
        flavor={FLAVOR}
        mode={mode}
        themeOverride={HARITA_TEMASI_SICAK}
        renderBackdrop={(durum) => (
          // Perde %86: adanın kıyı ve palmiye çizgileri sıcak zeminde koyu; %80'de bölüm üst etiketi 4.44'e düşüyordu (ölçüm).
          <HaritaSahnesi {...durum} zemin={HARITA_RENK.araziSicak} perde={0.86}>
            <HazineAdasi />
          </HaritaSahnesi>
        )}
        renderHero={(props) => (
          <IzKapak {...props} duzen="hazine" rota="kroki" sus="pusula" hedefEtiketi="Hazine burada" sozluk={SOZLUK} vurgu="ilk" />
        )}
        renderEnvelope={(props) => <HaritaZarf {...props} arazi={<HazineAdasi />} isaret={(olcek) => <Carpi olcek={olcek} />} />}
      />
    </HaritaKok>
  );
}
