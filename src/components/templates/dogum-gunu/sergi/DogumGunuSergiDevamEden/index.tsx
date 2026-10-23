import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../../shared/InvitationComposition';
import { TemplateProps } from '../../../types';
import { displayText } from '../../../utils';
import { cn } from '../../../../../utils/cn';
import { ease } from '../../../../../utils/motion';
import { DOGUM_GUNU_FLAVOR } from '../../flavors';
import {
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
  tarihSatiri,
  useDuvarYazisiHazir,
  useSergiFlavor,
  yaziBelirir
} from '../../../konsept/sergi';
import { DOGUM_GUNU_SERGI_METINLERI, RETROSPEKTIF, sergiKisileri } from '../ortak';

/**
 * DogumGunuSergiDevamEden — "Devam Eden": tek eser (SERGI-KONSEPTI §4.3).
 * Retrospektifin son odası: duvarda tek, yatay, yarım kalmış bir tuval —
 * "Yeni Yaş". Kobalt yay tuvalin ortasında kesilir, devamı kurşun kalem
 * eskizi. Etiket beyaz plakada; galerinin nokta işaretiyle "Sürüyor" —
 * preset'in tek espri satırı (eser satılmadı, bitmedi de).
 *
 * Asimetri: 512 px altında yazı üstte sola yaslı, tuval altında sağa yaslı,
 * plaka tuvalin sağ alt köşesinde; 512 px'ten itibaren plaka tuvalin
 * yanında; 1024 px'ten itibaren yazı solda, eser sağda.
 */
const ESER = SOYUT_ESERLER.yeniYas;

/** Adın boyu tek satırın uzunluğuna göre: kısa ad büyük, uzun ad küçülür, kesilmez. */
function adBoyu(ad: string): string {
  if (ad.length <= 12) return 'text-[48px] @md:text-[58px] @3xl:text-[66px] @5xl:text-[70px]';
  if (ad.length <= 22) return 'text-[40px] @md:text-[48px] @3xl:text-[56px] @5xl:text-[58px]';
  return 'text-[32px] @md:text-[40px] @3xl:text-[46px] @5xl:text-[50px]';
}

function DevamEdenHero({ invitation }: HeroRenderProps) {
  const fontHazir = useDuvarYazisiHazir();
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const tarih = etiketTarihi(invitation.date);
  const { sahibi, kurator } = sergiKisileri(invitation.names);
  const ad = sahibi || 'Davetlisiniz';

  return (
    <section className="relative flex-1 flex flex-col justify-center px-6 pt-14 pb-14 @md:px-10 @3xl:px-16 @3xl:py-20 @5xl:px-20 @5xl:py-16">
      <div className="w-full max-w-[76rem] mx-auto grid gap-y-10 @5xl:grid-cols-[minmax(0,10fr)_minmax(0,14fr)] @5xl:gap-x-14 @5xl:gap-y-10">
        {/* Duvar yazısı: başlık üst etiket, sahibi sanatçı. Font gelene kadar bekler (≤ 400 ms). */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={fontHazir ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: ease.out, delay: 0.1 }}
          className="@5xl:col-start-1 @5xl:row-start-1 @5xl:self-end"
        >
          {baslik && (
            <p className="max-w-[34ch] text-[11px] font-semibold leading-[1.7] tracking-[0.22em] text-[var(--sg-vurgu)]">{baslik}</p>
          )}
          <h1 className={cn('font-serif italic text-[var(--sg-murekkep)]', adBoyu(ad), 'leading-[1.02] [text-wrap:balance] [overflow-wrap:break-word]', baslik && 'mt-4')}>
            {ad}
          </h1>
          <p lang="tr" className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--sg-etiket)]">
            {RETROSPEKTIF.sergi} · Son oda
          </p>
        </motion.div>

        {/* Tuval ve plakası. */}
        <div className="flex flex-col items-end gap-5 @lg:flex-row @lg:items-end @lg:justify-end @lg:gap-7 @5xl:col-start-2 @5xl:row-start-1 @5xl:row-span-2 @5xl:self-center">
          <div className="relative w-[90%] max-w-[24rem] shrink-0 @lg:w-[60%] @lg:max-w-[30rem] @5xl:w-[66%] @5xl:max-w-[32rem]">
            <Spot className="w-[150%] aspect-[1.5]" />
            <Cerceve oran="5 / 4" paspartu={7} gecikme={0.15}>
              <ESER.Bilesen className="absolute inset-0 h-full w-full" />
            </Cerceve>
          </div>
          <Etiket
            levha
            className="w-[72%] max-w-[16rem] @lg:w-auto @lg:flex-1 @lg:max-w-[14.5rem]"
            sanatci={sahibi || undefined}
            eser={ESER.ad}
            yil={tarih.yil}
            teknik={ESER.teknik}
            nokta="Sürüyor"
            kurator={kurator || undefined}
            bilgiBasligi={RETROSPEKTIF.baslik}
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
            {invitation.showTimer && <SergiSayac date={invitation.date} timeZone={invitation.timezone} gecikme={0.5} />}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Karanlıkta yatay tuvalin kenarı seçilir. Yeri kısa adlı kapaktaki tuvalin ölçülen yeri
 * (360: üst %29.7; 768: sağ %41.8, üst %33.5; 1280: sağ %22.8, üst %28.7); uzun adda tuval biraz aşağıdadır.
 */
const TUVAL_SILUETI = (
  <div
    aria-hidden="true"
    className="absolute right-6 top-[29.7%] w-[78%] max-w-[24rem] aspect-[1.2] border border-white/[0.09] bg-white/[0.025] @md:right-10 @lg:right-[41.8%] @lg:top-[33.5%] @lg:w-[49.9%] @lg:max-w-[30rem] @5xl:right-[22.8%] @5xl:top-[28.7%] @5xl:w-[31.9%] @5xl:max-w-none"
  />
);

export function DogumGunuSergiDevamEden({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useSergiFlavor(DOGUM_GUNU_FLAVOR, invitation, DOGUM_GUNU_SERGI_METINLERI);
  return (
    <SergiKok eser="kobalt">
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={SERGI_TEMASI}
        renderBackdrop={() => <Duvar />}
        renderHero={(props) => <DevamEdenHero {...props} />}
        renderEnvelope={(props) => <SergiKapi {...props} siluet={TUVAL_SILUETI} />}
      />
    </SergiKok>
  );
}
