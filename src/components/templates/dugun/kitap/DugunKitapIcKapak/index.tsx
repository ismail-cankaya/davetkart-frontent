import React from 'react';
import { InvitationComposition } from '../../../shared/InvitationComposition';
import { TemplateProps } from '../../../types';
import { displayText } from '../../../utils';
import { IcKapak, KITAP_TEMASI, KapakKapisi, KitapKok, SayfaBasi, useKitapFlavor, type BezAdi } from '../../../konsept/kitap';
import { DUGUN_KITAP_FLAVOR } from '../ortak';

/**
 * DugunKitapIcKapak — "İç Kapak" (iç kapak ekseni).
 *
 * Kapak yok: ilk ekran şamua bir başlık sayfası, künye düzeninde — üstte
 * kullanıcının başlığı, ortada adlar (kitabın adı) ve matbaa süsü, altta
 * yayın yeri ve yılı yerine mekân ve tarih. Sağ üstten ayraç sarkar.
 *
 * Zarf modülü açıkken önce şarap rengi bez kapak gelir; kapak açılınca
 * başlık sayfası görünür. Zarfsızken bez hiç yoktur.
 */
const BEZ: BezAdi = 'sarap';

export function DugunKitapIcKapak({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useKitapFlavor(DUGUN_KITAP_FLAVOR, invitation);
  const adlar = displayText(invitation.names);

  return (
    <KitapKok>
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={KITAP_TEMASI}
        renderHero={({ invitation: davet }) => <IcKapak invitation={davet} />}
        renderBackdrop={({ heroExit }) => <SayfaBasi heroExit={heroExit} sol={adlar} sag={flavor.envelopeLabel} />}
        renderEnvelope={(props) => (
          <KapakKapisi {...props} bez={BEZ} etiket={props.flavor.envelopeLabel} altSatir={props.flavor.tagline} />
        )}
      />
    </KitapKok>
  );
}
