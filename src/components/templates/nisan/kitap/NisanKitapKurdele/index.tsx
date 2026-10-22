import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../../shared/InvitationComposition';
import { Invitation } from '../../../../../types';
import { TemplateProps } from '../../../types';
import { displayText } from '../../../utils';
import { cn } from '../../../../../utils/cn';
import {
  KITAP_BASLIKLARI,
  KITAP_TEMASI,
  KapakKapisi,
  KitapKok,
  Fleuron,
  KitapSayac,
  SayfaBasi,
  bolumGirisi,
  kapakBelirir,
  kisiler,
  kitapTarihi,
  tamTarih,
  useBaslikFontuHazir,
  useEkranBoyu,
  useKitapFlavor,
  useSikiBlok
} from '../../../konsept/kitap';
import { NISAN_BEZI, NISAN_KITAP_FLAVOR, ONSOZ_ETIKETI } from '../ortak';
import { KurdeleliAdlar } from './KurdeleliAdlar';

/**
 * NisanKitapKurdele — "Kurdele" (iç kapak ekseni).
 *
 * Kapak yok: ilk ekran şamua bir başlık sayfası. Sayfayı ayraç kurdelesi
 * enine, tam ortadan ikiye böler; kurdele kesiktir ve kesik uçların arasında
 * `&` durur — nişanda yüzükleri bağlayan kurdele kesilir. İlk ad kurdelenin
 * üstünde, ikinci ad altında; üstte kullanıcının başlığı, altta yalnızca gün.
 * Başlık sayfasının arkası künye sayfasıdır (gerçek kitapta da künye iç
 * kapağın arka yüzündedir): italik alt metin, matbaa süsü, mekân, tam tarih,
 * geri sayım.
 *
 * Düğünün İç Kapak'ından farkı düzende: orada her şey tek bir başlık
 * sayfasında ortalı bir yığın, kurdele sağ kenardan sarkan bir süs; burada
 * kurdele ilk ekranın yatay ekseni, adlar onun iki yanında, künye ayrı sayfada.
 *
 * Zarf modülü açıkken önce mürdüm bez kapak gelir; açılınca başlık sayfası.
 */
function BaslikSayfasi({ invitation, ekran }: { invitation: Invitation; ekran: number | null }) {
  const hazir = useBaslikFontuHazir();
  const baslik = displayText(invitation.title);
  const { gun } = kitapTarihi(invitation.date);

  return (
    <section
      className="relative flex flex-col items-center overflow-hidden px-10 pb-12 pt-16 text-center @3xl:pb-16 @3xl:pt-20"
      style={{ minHeight: ekran ?? '100svh' }}
    >
      <motion.div {...kapakBelirir(hazir)} className="relative flex w-full max-w-[34em] flex-1 flex-col items-center">
        {/* Üst yarı: yazar satırı gibi kullanıcının başlığı. */}
        <div className="flex flex-1 basis-0 flex-col items-center">
          {baslik && <p className="text-[12px] leading-relaxed tracking-[0.22em] text-[#231F1A] [text-wrap:balance]">{baslik}</p>}
          <span aria-hidden="true" className="mt-6 block h-px w-14 bg-[#231F1A]/40" />
        </div>

        <KurdeleliAdlar adlar={kisiler(invitation.names)} hazir={hazir} className="my-8" />

        {/* Alt yarı: yalnızca gün; ayrıntı arka sayfada. */}
        <div className="flex flex-1 basis-0 flex-col items-center justify-end">
          {gun && <p className="text-[12px] uppercase tracking-[0.26em] text-[#5E5446]">{gun}</p>}
        </div>
      </motion.div>
    </section>
  );
}

/** Künye sayfası: başlık sayfasının arka yüzü. Gösterecek bir şey yoksa çizilmez. */
function KunyeSayfasi({ invitation }: { invitation: Invitation }) {
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const tarih = tamTarih(kitapTarihi(invitation.date));
  const altRef = useRef<HTMLParagraphElement>(null);
  useSikiBlok(altRef, altBaslik);

  if (!altBaslik && !mekan && !tarih) return null;

  return (
    <section className="relative flex flex-col items-center px-8 py-16 text-center @3xl:py-24">
      <motion.div {...bolumGirisi} className="flex w-full max-w-[34em] flex-col items-center">
        {altBaslik && (
          <p
            ref={altRef}
            className="w-fit max-w-[24em] text-left text-[18px] italic leading-relaxed text-[#5E5446] [text-wrap:pretty]"
          >
            {altBaslik}
          </p>
        )}

        <Fleuron tur="cizgi" className={cn('text-[#8C2F2F]', altBaslik && 'mt-10')} />

        {(mekan || tarih) && (
          <div className="mt-10 flex flex-col items-center">
            {mekan && <p className="text-[14px] leading-snug tracking-[0.12em] text-[#231F1A] [text-wrap:balance]">{mekan}</p>}
            {tarih && <p className="mt-1.5 text-[14px] text-[#5E5446]">{tarih}</p>}
          </div>
        )}

        <KitapSayac invitation={invitation} className="mt-10" sayiClassName="text-[#231F1A]" birimClassName="text-[#5E5446]" />
      </motion.div>
    </section>
  );
}

function KurdeleHero({ invitation, scrollContainer }: HeroRenderProps) {
  const ekran = useEkranBoyu(scrollContainer);
  return (
    <div className="flex flex-1 flex-col">
      <BaslikSayfasi invitation={invitation} ekran={ekran} />
      <KunyeSayfasi invitation={invitation} />
    </div>
  );
}

export function NisanKitapKurdele({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useKitapFlavor(NISAN_KITAP_FLAVOR, invitation, KITAP_BASLIKLARI, ONSOZ_ETIKETI);
  const adlar = displayText(invitation.names);

  return (
    <KitapKok>
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={KITAP_TEMASI}
        renderHero={(props) => <KurdeleHero {...props} />}
        renderBackdrop={({ heroExit }) => <SayfaBasi heroExit={heroExit} sol={adlar} sag={flavor.envelopeLabel} />}
        renderEnvelope={(props) => (
          <KapakKapisi {...props} bez={NISAN_BEZI} etiket={props.flavor.envelopeLabel} altSatir={props.flavor.tagline} />
        )}
      />
    </KitapKok>
  );
}
