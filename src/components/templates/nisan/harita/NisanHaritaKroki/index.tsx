import React from 'react';
import { InvitationComposition } from '../../../shared/InvitationComposition';
import { HARITA_TEMASI, HaritaKapak, HaritaKok, HaritaSahnesi, HaritaZarf, MahalleKrokisi } from '../../../konsept/harita';
import { TemplateProps } from '../../../types';
import { NISAN_HARITA_FLAVOR } from '../flavor';
import { useInvText } from '../../../../../invitationText/InvitationTextContext';

/**
 * NisanHaritaKroki — "Kroki": nişan evine giden yolun elle çizilmiş mahalle
 * krokisi. Harita ekranın başındadır; kartuş ve lejant tek bir başlık bloğu
 * olarak altta (genişte sağ sütunda) üst üste durur. Rota kesik çizgi ve yön
 * oklarıyla kartuştan çıkar, iğnede "Buradayız" der.
 */
export function NisanHaritaKroki({ invitation, mode = 'preview' }: TemplateProps) {
  const t = useInvText();
  return (
    <HaritaKok>
      <InvitationComposition
        invitation={invitation}
        flavor={NISAN_HARITA_FLAVOR}
        mode={mode}
        themeOverride={HARITA_TEMASI}
        renderBackdrop={(durum) => (
          <HaritaSahnesi {...durum}>
            <MahalleKrokisi />
          </HaritaSahnesi>
        )}
        renderHero={(props) => <HaritaKapak {...props} duzen="kenar" rota="kroki" sus="kuzey" etiketUstu={t('design.nisan-harita-kroki.buradayiz')} />}
        renderEnvelope={(props) => <HaritaZarf {...props} arazi={<MahalleKrokisi />} />}
      />
    </HaritaKok>
  );
}
