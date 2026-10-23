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
  MasalKapak,
  MasalSayfasi,
  SayfaBasi,
  SayfayiCevirin,
  useEkranBoyu,
  useKitapFlavor,
  type BezAdi
} from '../../../konsept/kitap';
import { DOGUM_GUNU_KITAP_FLAVOR, MASAL_SAYFA_ETIKETI, SahipAdi } from '../ortak';
import { KayanYildiz } from './KayanYildiz';

/**
 * DogumGunuKitapMasal — "Masal" (masal kitabı ekseni, çocuk).
 *
 * Çocuğun doğum günü bir masal kitabıdır. İlk ekran kestane bez kapak:
 * yaldız çift çizgi çerçeve, köşelerde ışıltı, üstte "Bir varmış, bir
 * yokmuş…", ortada kayan yıldız (dilek) figürü ve çocuğun adı, altında ev
 * sahibi. Kapağın ardında çerçeveli birinci sayfa: başharfli alt metin,
 * tarih ve mekân, geri sayım. Bölümler "İkinci Sayfa, Üçüncü Sayfa…".
 *
 * Bez `kestane`: öbür dört bez başka kategorilerindir (KITAP-KONSEPTI §11,
 * K7 · N4). Zarf modülü açıkken masal kapağı kapıdır.
 */
const BEZ: BezAdi = 'kestane';
const ACILIS = 'Bir varmış, bir yokmuş…';
const ILK_SAYFA = 'Birinci Sayfa';
const SAG_SAYFA_BASI = 'Masal';

const YALDIZ = 'text-[#C9A35C] [text-shadow:0_-1px_0_rgba(0,0,0,0.35)]';

const kapakBasligi = (names: string, as: 'h1' | 'p') => (
  <SahipAdi names={names} as={as} enCok={60} akis={12} className={YALDIZ} kunyeClassName={YALDIZ} />
);

function MasalHero({ invitation, flavor, scrollContainer }: HeroRenderProps) {
  const ekran = useEkranBoyu(scrollContainer);

  if (invitation.showEnvelope) {
    return (
      <MasalSayfasi className="flex-1">
        <BolumAcilisi
          invitation={invitation}
          etiket={ILK_SAYFA}
          adlar
          adlarDizgisi={<SahipAdi names={invitation.names} enCok={56} akis={11} className="text-[#231F1A]" kunyeClassName="text-[#5E5446]" />}
          giris="yuklenince"
          className="flex-1 justify-center"
        />
      </MasalSayfasi>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <MasalKapak
        invitation={invitation}
        bez={BEZ}
        acilis={ACILIS}
        figur={<KayanYildiz />}
        baslik={kapakBasligi(invitation.names, 'h1')}
        altSatir={flavor.tagline}
        style={{ minHeight: ekran ?? '100svh' }}
        alt={<SayfayiCevirin />}
      />
      <MasalSayfasi>
        <BolumAcilisi invitation={invitation} etiket={ILK_SAYFA} adlar={false} giris="gorununce" />
      </MasalSayfasi>
    </div>
  );
}

export function DogumGunuKitapMasal({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useKitapFlavor(DOGUM_GUNU_KITAP_FLAVOR, invitation, KITAP_BASLIKLARI, MASAL_SAYFA_ETIKETI);
  const adlar = displayText(invitation.names);

  return (
    <KitapKok>
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={KITAP_TEMASI}
        renderHero={(props) => <MasalHero {...props} />}
        renderBackdrop={({ heroExit }) => <SayfaBasi heroExit={heroExit} sol={adlar} sag={SAG_SAYFA_BASI} />}
        renderEnvelope={(props) => (
          <KapakKapisi
            {...props}
            yuz={({ dugme, className }) => (
              <MasalKapak
                invitation={props.invitation}
                bez={BEZ}
                acilis={ACILIS}
                figur={<KayanYildiz />}
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
