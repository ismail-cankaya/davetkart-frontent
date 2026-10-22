import React from 'react';
import { InvitationComposition, type HeroRenderProps } from '../../../shared/InvitationComposition';
import { TemplateProps } from '../../../types';
import { displayText } from '../../../utils';
import {
  BolumAcilisi,
  KITAP_BASLIKLARI,
  KITAP_TEMASI,
  KapakKapisi,
  KitapKok,
  SayfaBasi,
  SayfayiCevirin,
  useEkranBoyu,
  useKitapFlavor
} from '../../../konsept/kitap';
import { NISAN_BEZI, NISAN_KITAP_FLAVOR, ONSOZ_ETIKETI } from '../ortak';
import { PencereliKapak } from './PencereliKapak';

/**
 * NisanKitapOnsoz — "Önsöz" (bez cilt ekseni, pencereli kapak).
 *
 * Nişan hikâyenin önsözüdür. İlk ekran mürdüm bez kapak; ortasındaki oval
 * pencereden ilk sayfadaki adlar görünür. Kapağın ardında önsöz sayfası:
 * italik dizilmiş alt metin (önsöz başharf almaz), sayfa numarası "i"
 * (kitabın ön sayfaları küçük Roma rakamıyla numaralanır). Bölümler
 * "Önsöz · II…" diye sürer: birinci bölüm düğündür.
 *
 * Zarf modülü açıkken pencereli kapak kapıdır: dokununca sol menteşeden
 * açılır, hero yalnızca önsöz sayfasıdır (adlar orada başlık olur).
 */
const KAPAK_ETIKETI = 'Önsöz';
const SAYFA_NO = 'i';

function OnsozHero({ invitation, flavor, scrollContainer }: HeroRenderProps) {
  const ekran = useEkranBoyu(scrollContainer);

  if (invitation.showEnvelope) {
    return (
      <BolumAcilisi
        invitation={invitation}
        etiket={KAPAK_ETIKETI}
        adlar
        giris="yuklenince"
        sayfaNo={SAYFA_NO}
        dizgi="italik"
        className="flex-1 justify-center"
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <PencereliKapak
        invitation={invitation}
        bez={NISAN_BEZI}
        etiket={KAPAK_ETIKETI}
        altSatir={flavor.tagline}
        style={{ minHeight: ekran ?? '100svh' }}
        alt={<SayfayiCevirin />}
      />
      <BolumAcilisi
        invitation={invitation}
        etiket={KAPAK_ETIKETI}
        adlar={false}
        giris="gorununce"
        sayfaNo={SAYFA_NO}
        dizgi="italik"
      />
    </div>
  );
}

export function NisanKitapOnsoz({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useKitapFlavor(NISAN_KITAP_FLAVOR, invitation, KITAP_BASLIKLARI, ONSOZ_ETIKETI);
  const adlar = displayText(invitation.names);

  return (
    <KitapKok>
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={KITAP_TEMASI}
        renderHero={(props) => <OnsozHero {...props} />}
        renderBackdrop={({ heroExit }) => <SayfaBasi heroExit={heroExit} sol={adlar} sag={KAPAK_ETIKETI} />}
        renderEnvelope={(props) => (
          <KapakKapisi
            {...props}
            bez={NISAN_BEZI}
            etiket={KAPAK_ETIKETI}
            altSatir={props.flavor.tagline}
            yuz={({ dugme, className }) => (
              <PencereliKapak
                invitation={props.invitation}
                bez={NISAN_BEZI}
                etiket={KAPAK_ETIKETI}
                altSatir={props.flavor.tagline}
                adlarEtiketi="p"
                className={className}
                alt={dugme}
              />
            )}
          />
        )}
      />
    </KitapKok>
  );
}
