import React from 'react';
import { InvitationComposition, type HeroRenderProps } from '../../../shared/InvitationComposition';
import { TemplateProps } from '../../../types';
import { displayText } from '../../../utils';
import {
  BezKapak,
  BolumAcilisi,
  KITAP_TEMASI,
  KapakKapisi,
  KitapKok,
  SayfaBasi,
  useEkranBoyu,
  useKitapFlavor,
  type BezAdi
} from '../../../konsept/kitap';
import { DUGUN_KITAP_FLAVOR } from '../ortak';

/**
 * DugunKitapBirinciBolum — "Birinci Bölüm" (bez cilt ekseni).
 *
 * Düğün hikâyenin birinci bölümüdür: ilk ekran şişe yeşili bez kapak, yaldız
 * adlar. Kapağın ardında başharfli ilk sayfa (Bölüm I), sonra numaralı
 * bölümler şamua üstünde.
 *
 * Zarf modülü açıkken kapak kapıdır: dokununca sol menteşeden açılır ve hero
 * yalnızca ilk sayfadır (adlar orada başlık olur). Zarfsızken kapak hero'nun
 * ilk ekranıdır; ilk sayfa altından gelir.
 */
const BEZ: BezAdi = 'sise';
const KAPAK_ETIKETI = 'Birinci Bölüm';

function SayfayiCevirin() {
  return (
    <div className="flex flex-col items-center gap-2 text-[#C9A35C]">
      <p className="text-[11px] uppercase tracking-[0.26em]">Sayfayı çevirin</p>
      <svg aria-hidden="true" viewBox="0 0 16 10" width="14" height="9" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M1 1.5 L8 8.5 L15 1.5" />
      </svg>
    </div>
  );
}

function BirinciBolumHero({ invitation, flavor, scrollContainer }: HeroRenderProps) {
  const ekran = useEkranBoyu(scrollContainer);

  if (invitation.showEnvelope) {
    return (
      <BolumAcilisi
        invitation={invitation}
        etiket="Bölüm I"
        adlar
        giris="yuklenince"
        sayfaNo="1"
        className="flex-1 justify-center"
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <BezKapak
        invitation={invitation}
        bez={BEZ}
        etiket={KAPAK_ETIKETI}
        altSatir={flavor.tagline}
        style={{ minHeight: ekran ?? '100svh' }}
        alt={<SayfayiCevirin />}
      />
      <BolumAcilisi invitation={invitation} etiket="Bölüm I" adlar={false} giris="gorununce" sayfaNo="1" />
    </div>
  );
}

export function DugunKitapBirinciBolum({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useKitapFlavor(DUGUN_KITAP_FLAVOR, invitation);
  const adlar = displayText(invitation.names);

  return (
    <KitapKok>
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={KITAP_TEMASI}
        renderHero={(props) => <BirinciBolumHero {...props} />}
        renderBackdrop={({ heroExit }) => <SayfaBasi heroExit={heroExit} sol={adlar} sag={KAPAK_ETIKETI} />}
        renderEnvelope={(props) => <KapakKapisi {...props} bez={BEZ} etiket={KAPAK_ETIKETI} altSatir={props.flavor.tagline} />}
      />
    </KitapKok>
  );
}
