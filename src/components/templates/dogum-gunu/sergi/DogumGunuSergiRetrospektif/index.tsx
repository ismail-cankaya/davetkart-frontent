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
  yaziBelirir,
  type SoyutEserTanimi
} from '../../../konsept/sergi';
import { DOGUM_GUNU_SERGI_METINLERI, RETROSPEKTIF, sergiKisileri } from '../ortak';

/**
 * DogumGunuSergiRetrospektif — "Retrospektif": salon asması (SERGI-KONSEPTI
 * §4.3, §7). Sergi sahibinin dört dönemi tek bir duvar rayından, farklı
 * boylarda tellerle asılı dört küçük çerçevede. Çerçevenin altında dönemin
 * numarası ve adı; yıl yazılmaz (veride yok). Eser rengi safran: duvarda yazı
 * olamaz, vurgu yazısı mürekkebe döner (kit `palet.ts`).
 *
 * Asimetri: 768 px altında yazı üstte sola yaslı, salon altında tam genişlikte,
 * etiket salonun sağ alt köşesinde; 768 px'ten itibaren etiket salonun
 * yanında; 1024 px'ten itibaren yazı solda, salon sağda.
 */

interface Donem {
  eser: SoyutEserTanimi;
  /** Roma rakamı: dönem sırası. */
  no: string;
  oran: string;
  /** Çerçevenin rayın genişliğindeki payı. */
  genislik: string;
  /** Telin boyu: çerçeveler aynı raydan farklı yükseklikte sarkar. */
  tel: string;
}

const DONEMLER: Donem[] = [
  { eser: SOYUT_ESERLER.ilkIsler, no: 'I', oran: '1 / 1', genislik: 'w-[24%]', tel: 'h-5 @3xl:h-6' },
  { eser: SOYUT_ESERLER.oyunDonemi, no: 'II', oran: '3 / 4', genislik: 'w-[19%]', tel: 'h-2' },
  { eser: SOYUT_ESERLER.kesifDonemi, no: 'III', oran: '4 / 3', genislik: 'w-[30%]', tel: 'h-9 @3xl:h-11' },
  { eser: SOYUT_ESERLER.bugun, no: 'IV', oran: '2 / 3', genislik: 'w-[15%]', tel: 'h-3.5 @3xl:h-4' }
];

/** Asılma sırası: soldan sağa, 70 ms arayla; sonuncusu 0.33 + 0.6 = 0.93 s'de oturur. */
const ASILMA = (i: number) => 0.12 + i * 0.07;

/** Adın boyu tek satırın uzunluğuna göre: kısa ad büyük, uzun ad küçülür, kesilmez. */
function adBoyu(ad: string): string {
  if (ad.length <= 12) return 'text-[52px] @md:text-[62px] @3xl:text-[72px] @5xl:text-[76px]';
  if (ad.length <= 22) return 'text-[42px] @md:text-[52px] @3xl:text-[60px] @5xl:text-[62px]';
  return 'text-[34px] @md:text-[42px] @3xl:text-[48px] @5xl:text-[52px]';
}

/** Duvar rayı ve dört çerçeve. Ray ve teller süstür; dönem adları metindir. */
function Salon() {
  return (
    <div className="relative">
      <Spot className="top-[20%] w-[130%] aspect-[1.6]" />
      <div aria-hidden="true" className="h-[2px] bg-[var(--sg-kenar-guclu)]" />
      <ol className="flex items-start justify-between gap-[3%] px-[2%]" aria-label="Dönemler">
        {DONEMLER.map((d, i) => (
          <li key={d.no} className={cn('flex flex-col items-center', d.genislik)}>
            <span aria-hidden="true" className={cn('block w-px bg-[var(--sg-kenar-guclu)]', d.tel)} />
            <Cerceve oran={d.oran} paspartu={9} gecikme={ASILMA(i)} className="w-full">
              <d.eser.Bilesen className="absolute inset-0 h-full w-full" />
            </Cerceve>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: ease.out, delay: 0.45 + i * 0.05 }}
              className="mt-2.5 w-full text-center text-[12px] leading-[1.35] text-[var(--sg-etiket)] [overflow-wrap:break-word]"
            >
              <span className="block font-semibold tabular-nums text-[var(--sg-murekkep)]">{d.no}</span>
              {d.eser.ad}
            </motion.p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RetrospektifHero({ invitation }: HeroRenderProps) {
  const fontHazir = useDuvarYazisiHazir();
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const tarih = etiketTarihi(invitation.date);
  const { sahibi, kurator } = sergiKisileri(invitation.names);
  // Adsız davette sergi adı duvar yazısına çıkar ("Davetlisiniz Retrospektif" okunmasın).
  const ad = sahibi || RETROSPEKTIF.sergi;

  return (
    <section className="relative flex-1 flex flex-col justify-center px-6 pt-14 pb-14 @md:px-10 @3xl:px-16 @3xl:py-20 @5xl:px-20 @5xl:py-16">
      <div className="w-full max-w-[78rem] mx-auto grid gap-y-11 @5xl:grid-cols-[minmax(0,9fr)_minmax(0,15fr)] @5xl:gap-x-14 @5xl:gap-y-10">
        {/* Duvar yazısı: başlık üst etiket, sahibi sanatçı, altında sergi adı. Font gelene kadar bekler (≤ 400 ms). */}
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
          {sahibi && (
            <p className="mt-2 font-serif text-[26px] leading-[1.1] text-[var(--sg-etiket)] @md:text-[30px] @5xl:text-[34px]">
              {RETROSPEKTIF.sergi}
            </p>
          )}
        </motion.div>

        {/* Salon ve duvar etiketi. */}
        <div className="flex flex-col items-end gap-6 @3xl:flex-row @3xl:items-end @3xl:gap-8 @5xl:col-start-2 @5xl:row-start-1 @5xl:row-span-2 @5xl:self-center">
          <div className="w-full @3xl:w-[72%] @3xl:shrink-0">
            <Salon />
          </div>
          <Etiket
            className="w-[66%] max-w-[15rem] @3xl:w-auto @3xl:flex-1 @3xl:pb-8"
            sanatci={sahibi || undefined}
            eser="Dört dönem"
            teknik="Karışık teknik: sabır, kahkaha, çay"
            kurator={kurator || undefined}
            bilgiBasligi={RETROSPEKTIF.baslik}
            bilgi={[tarihSatiri(tarih), mekan]}
            gecikme={0.6}
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
 * Karanlıkta ray ve dört çerçevenin kenarı seçilir. Yeri kısa adlı kapaktaki rayın ölçülen yeri
 * (360: üst %31; 768: üst %40.4; 1280: sol %41.9, sağ %20.9, üst %37.6); uzun adda salon biraz aşağıdadır.
 */
const SALON_SILUETI = (
  <div
    aria-hidden="true"
    className="absolute left-6 right-6 top-[31%] @md:left-10 @md:right-10 @3xl:left-16 @3xl:right-[31%] @3xl:top-[40.4%] @5xl:left-[41.9%] @5xl:right-[20.9%] @5xl:top-[37.6%]"
  >
    <div className="h-[2px] bg-white/[0.08]" />
    <div className="flex items-start justify-between gap-[3%] px-[2%]">
      {DONEMLER.map((d) => (
        <div key={d.no} className={cn('flex flex-col items-center', d.genislik)}>
          <span className={cn('block w-px bg-white/[0.08]', d.tel)} />
          <div className="w-full border border-white/[0.09] bg-white/[0.025]" style={{ aspectRatio: d.oran }} />
        </div>
      ))}
    </div>
  </div>
);

export function DogumGunuSergiRetrospektif({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useSergiFlavor(DOGUM_GUNU_FLAVOR, invitation, DOGUM_GUNU_SERGI_METINLERI);
  return (
    <SergiKok eser="safran">
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={SERGI_TEMASI}
        renderBackdrop={() => <Duvar />}
        renderHero={(props) => <RetrospektifHero {...props} />}
        renderEnvelope={(props) => <SergiKapi {...props} siluet={SALON_SILUETI} />}
      />
    </SergiKok>
  );
}
