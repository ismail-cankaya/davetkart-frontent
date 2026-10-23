import React from 'react';
import { InvitationComposition, type HeroRenderProps } from '../../../shared/InvitationComposition';
import { TemplateProps } from '../../../types';
import { displayText } from '../../../utils';
import {
  BolumAcilisi,
  CizgiliSayfa,
  DefterKapak,
  KITAP_BASLIKLARI,
  KITAP_TEMASI,
  KapakKapisi,
  KitapKok,
  SayfaBasi,
  SayfayiCevirin,
  useEkranBoyu,
  useKitapFlavor
} from '../../../konsept/kitap';
import { DOGUM_GUNU_KITAP_FLAVOR, SahipAdi, YENI_BOLUM_ETIKETI } from '../ortak';

/**
 * DogumGunuKitapYeniBolum — "Yeni Bölüm" (anı defteri ekseni, yetişkin).
 *
 * Doğum günü hikâyenin yeni bölümüdür; yaş veride yok, bölüm numarasız.
 * İlk ekran kara kaplı bir anı defteri: sağ kenarda kurdele renkli lastik,
 * ortada şamua etiket kâğıdında "Yeni Bölüm" ve sahibinin adı, altında ev
 * sahibi künye satırı. Kapağın ardında çizgili defter sayfası: başharfli
 * alt metin, tarih ve mekân, geri sayım, sayfa numarası "1". Bölümler
 * "Yeni Bölüm · II…" diye sürer.
 *
 * Zarf modülü açıkken defter kapağı kapıdır (sol menteşeden açılır), hero
 * yalnızca çizgili sayfadır ve sahibinin adı orada başlık olur.
 */
const ETIKET = 'Yeni Bölüm';
const SAYFA_NO = '1';

const kapakBasligi = (names: string, as: 'h1' | 'p') => (
  <SahipAdi names={names} as={as} enCok={52} akis={11} className="text-[#231F1A]" kunyeClassName="text-[#5E5446]" />
);

function YeniBolumHero({ invitation, flavor, scrollContainer }: HeroRenderProps) {
  const ekran = useEkranBoyu(scrollContainer);

  if (invitation.showEnvelope) {
    return (
      <CizgiliSayfa className="flex-1">
        <BolumAcilisi
          invitation={invitation}
          etiket={ETIKET}
          adlar
          adlarDizgisi={<SahipAdi names={invitation.names} enCok={56} akis={11} className="text-[#231F1A]" kunyeClassName="text-[#5E5446]" />}
          giris="yuklenince"
          sayfaNo={SAYFA_NO}
          className="flex-1 justify-center"
        />
      </CizgiliSayfa>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <DefterKapak
        invitation={invitation}
        etiket={ETIKET}
        baslik={kapakBasligi(invitation.names, 'h1')}
        altSatir={flavor.tagline}
        style={{ minHeight: ekran ?? '100svh' }}
        alt={<SayfayiCevirin />}
      />
      <CizgiliSayfa>
        <BolumAcilisi invitation={invitation} etiket={ETIKET} adlar={false} giris="gorununce" sayfaNo={SAYFA_NO} />
      </CizgiliSayfa>
    </div>
  );
}

export function DogumGunuKitapYeniBolum({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useKitapFlavor(DOGUM_GUNU_KITAP_FLAVOR, invitation, KITAP_BASLIKLARI, YENI_BOLUM_ETIKETI);
  const adlar = displayText(invitation.names);

  return (
    <KitapKok>
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={KITAP_TEMASI}
        renderHero={(props) => <YeniBolumHero {...props} />}
        renderBackdrop={({ heroExit }) => <SayfaBasi heroExit={heroExit} sol={adlar} sag={ETIKET} />}
        renderEnvelope={(props) => (
          <KapakKapisi
            {...props}
            yuz={({ dugme, className }) => (
              <DefterKapak
                invitation={props.invitation}
                etiket={ETIKET}
                baslik={kapakBasligi(props.invitation.names, 'p')}
                altSatir={props.flavor.tagline}
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
