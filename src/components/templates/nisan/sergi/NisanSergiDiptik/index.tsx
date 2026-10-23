import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../../shared/InvitationComposition';
import { TemplateProps } from '../../../types';
import { displayText } from '../../../utils';
import { cn } from '../../../../../utils/cn';
import { ease } from '../../../../../utils/motion';
import { NISAN_FLAVOR } from '../../flavors';
import {
  Adlar,
  Cerceve,
  Duvar,
  Etiket,
  SERGI_TEMASI,
  SOYUT_ESERLER,
  SergiKapi,
  SergiKok,
  SergiSayac,
  Spot,
  etiketTarihi,
  kisiler,
  tarihSatiri,
  useDuvarYazisiHazir,
  useSergiFlavor,
  yaziBelirir
} from '../../../konsept/sergi';
import { NISAN_SERGI_METINLERI, ONIZLEME } from '../ortak';

/**
 * NisanSergiDiptik — "Diptik": tek eser, iki pano (SERGI-KONSEPTI §4.3).
 * "İki Yarım": bir daire iki panonun arasında bölünür, her yarı öbürünün
 * renklerini taşır. Panolar ayrı ayrı asılır; etiket beyaz plakada ve
 * galerinin "satıldı" noktasıyla işaretli: Rezerve (konseptin tek esprisi).
 *
 * Asimetri: 768 px altında yazı üstte sola yaslı, diptik altında sağa
 * yaslı, plaka diptiğin sağ alt köşesinde; 768 px'ten itibaren plaka
 * diptiğin yanında; 1024 px'ten itibaren yazı solda, eser sağda.
 */
const ESER = SOYUT_ESERLER.ikiYarim;

/** Adların boyu en uzun satıra göre: kısa ad büyük, uzun ad küçülür, kesilmez. */
function adBoyu(adlar: string[]): string {
  const enUzun = Math.max(...adlar.map((ad, i) => ad.length + (i > 0 ? 2 : 0)));
  if (enUzun <= 15) return 'text-[44px] @md:text-[54px] @3xl:text-[62px] @5xl:text-[66px]';
  if (enUzun <= 24) return 'text-[38px] @md:text-[46px] @3xl:text-[52px] @5xl:text-[56px]';
  return 'text-[32px] @md:text-[40px] @3xl:text-[46px] @5xl:text-[50px]';
}

function DiptikHero({ invitation }: HeroRenderProps) {
  const fontHazir = useDuvarYazisiHazir();
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const tarih = etiketTarihi(invitation.date);
  const adlar = kisiler(invitation.names);
  const duvarYazisi = adlar.length ? adlar : ['Davetlisiniz'];

  return (
    <section className="relative flex-1 flex flex-col justify-center px-6 pt-14 pb-14 @md:px-10 @3xl:px-16 @3xl:py-20 @5xl:px-20 @5xl:py-16">
      <div className="w-full max-w-[76rem] mx-auto grid gap-y-11 @5xl:grid-cols-[minmax(0,10fr)_minmax(0,14fr)] @5xl:gap-x-14 @5xl:gap-y-10">
        {/* Duvar yazısı: başlık üst etiket, adlar sanatçılar. Font gelene kadar bekler (≤ 400 ms). */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={fontHazir ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: ease.out, delay: 0.1 }}
          className="@5xl:col-start-1 @5xl:row-start-1 @5xl:self-end"
        >
          {baslik && (
            <p className="max-w-[34ch] text-[11px] font-semibold leading-[1.7] tracking-[0.22em] text-[var(--sg-vurgu)]">{baslik}</p>
          )}
          <h1 className={cn('font-serif italic text-[var(--sg-murekkep)]', adBoyu(duvarYazisi), 'leading-[1.02]', baslik && 'mt-4')}>
            <Adlar kisiler={duvarYazisi} girinti ampersandClassName="text-[var(--sg-vurgu)]" />
          </h1>
        </motion.div>

        {/* Diptik ve plakası. Panolar ayrı ayrı asılır: önce sol, sonra sağ. */}
        <div className="flex flex-col items-end gap-5 @3xl:flex-row @3xl:items-end @3xl:justify-end @3xl:gap-8 @5xl:col-start-2 @5xl:row-start-1 @5xl:row-span-2 @5xl:self-center">
          <div className="relative w-[88%] max-w-[23rem] shrink-0 @3xl:w-[58%] @3xl:max-w-[28rem] @5xl:w-[64%] @5xl:max-w-[30rem]">
            <Spot className="w-[150%] aspect-[1.3]" />
            <div className="grid grid-cols-2 gap-2.5 @md:gap-3.5">
              <Cerceve oran="2 / 3" paspartu={8} gecikme={0.15}>
                <ESER.Bilesen pano="sol" className="absolute inset-0 h-full w-full" />
              </Cerceve>
              <Cerceve oran="2 / 3" paspartu={8} gecikme={0.28}>
                <ESER.Bilesen pano="sag" className="absolute inset-0 h-full w-full" />
              </Cerceve>
            </div>
          </div>
          <Etiket
            levha
            className="w-[74%] max-w-[16rem] @3xl:w-auto @3xl:flex-1 @3xl:max-w-[14.5rem]"
            sanatci={displayText(invitation.names) || undefined}
            eser={ESER.ad}
            yil={tarih.yil}
            teknik={ESER.teknik}
            nokta="Rezerve"
            bilgiBasligi={ONIZLEME.baslik}
            bilgi={[tarihSatiri(tarih), mekan]}
            gecikme={0.55}
          />
        </div>

        {/* Duvardaki kısa metin ve geri sayım. */}
        {(altBaslik || invitation.showTimer) && (
          <div className="flex flex-col gap-9 @5xl:col-start-1 @5xl:row-start-2 @5xl:self-start">
            {altBaslik && (
              <motion.p {...yaziBelirir(0.45)} className="max-w-[34ch] text-[15px] leading-relaxed text-[var(--sg-etiket)] @md:text-[16px]">
                {altBaslik}
              </motion.p>
            )}
            {invitation.showTimer && (
              <SergiSayac date={invitation.date} timeZone={invitation.timezone} baslik={ONIZLEME.sayac} gecikme={0.5} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** Karanlıkta iki panonun kenarı seçilir; konumu kısa adlı kapaktaki diptiğe denk (ölçüldü). */
const DIPTIK_SILUETI = (
  <div
    aria-hidden="true"
    className="absolute right-[6.7%] top-[29%] grid w-[76%] max-w-[23rem] grid-cols-2 gap-2.5 @md:gap-3.5 @3xl:right-[42.7%] @3xl:top-[37%] @3xl:w-[48%] @5xl:right-[23.7%] @5xl:top-[33%] @5xl:w-[31%]"
  >
    <div className="aspect-[0.7] border border-white/[0.09] bg-white/[0.025]" />
    <div className="aspect-[0.7] border border-white/[0.09] bg-white/[0.025]" />
  </div>
);

export function NisanSergiDiptik({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useSergiFlavor(NISAN_FLAVOR, invitation, NISAN_SERGI_METINLERI);
  return (
    <SergiKok eser="fusya">
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={SERGI_TEMASI}
        renderBackdrop={() => <Duvar />}
        renderHero={(props) => <DiptikHero {...props} />}
        renderEnvelope={(props) => <SergiKapi {...props} siluet={DIPTIK_SILUETI} />}
      />
    </SergiKok>
  );
}
