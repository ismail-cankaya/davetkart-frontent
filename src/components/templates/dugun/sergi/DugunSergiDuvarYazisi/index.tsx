import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../../shared/InvitationComposition';
import { TemplateProps } from '../../../types';
import { displayText } from '../../../utils';
import { ease } from '../../../../../utils/motion';
import { DUGUN_FLAVOR } from '../../flavors';
import {
  Adlar,
  Duvar,
  SERGI_TEMASI,
  SergiKapi,
  SergiKok,
  SergiSayac,
  Spot,
  etiketBelirir,
  etiketTarihi,
  kisiler,
  tarihSatiri,
  useDuvarYazisiHazir,
  useSergiFlavor,
  yaziBelirir
} from '../../../konsept/sergi';
import { DUGUN_SERGI_METINLERI } from '../ortak';

/**
 * DugunSergiDuvarYazisi — "Duvar Yazısı": çerçevesiz (SERGI-KONSEPTI §4.3).
 * Adlar sergi girişindeki vinil harfler gibi duvarın üst yarısına yazılı;
 * altında tek satır etiket. Eser rengi `gece`: yazı da düğme de siyah vinil.
 *
 * Konseptin tek espri satırı etiketin alt satırındadır: "Kalıcı koleksiyon".
 */

/**
 * Vinil harflerin boyu kabın genişliğine göre (`cqi`). Tek satıra sığacak
 * kısa adlar o satırı doldurur; uzun ad en uzun kelimesi sığacak kadar
 * küçülür ve dengelenerek kırılır, kesilmez.
 */
function vinilBoyu(adlar: string[]): string {
  const satirlar = adlar.map((ad, i) => (i > 0 ? `& ${ad}` : ad));
  const enUzunSatir = Math.max(...satirlar.map((s) => s.length));
  const enUzunKelime = Math.max(...satirlar.flatMap((s) => s.split(/\s+/)).map((k) => k.length));
  // Ölçülen: "& Mehmet Çağrı" girintisiyle 6.27 em → harf başına ≈ 0.40 em + 0.7 em girinti.
  // Kabın %80'i yazıya ayrılır (yan boşluklar kabın %7–8'i).
  const harf = enUzunSatir <= 16 ? enUzunSatir : Math.max(enUzunKelime + 2, 12);
  const tavan = enUzunSatir <= 16 ? 168 : 116;
  return `clamp(34px, ${(80 / (0.4 * harf + 0.7)).toFixed(2)}cqi, ${tavan}px)`;
}

function DuvarYazisiHero({ invitation }: HeroRenderProps) {
  const fontHazir = useDuvarYazisiHazir();
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const tarih = etiketTarihi(invitation.date);
  const adlar = kisiler(invitation.names);
  const duvarYazisi = adlar.length ? adlar : ['Davetlisiniz'];
  const etiketSatiri = [tarihSatiri(tarih), mekan].filter(Boolean).join(' · ');

  return (
    <section className="relative flex-1 flex flex-col px-6 pt-16 pb-12 @md:px-10 @3xl:px-16 @3xl:pt-24 @3xl:pb-16 @5xl:px-24 @5xl:pt-20">
      <div className="w-full max-w-[78rem] mx-auto flex-1 flex flex-col justify-center gap-20 @3xl:justify-between @3xl:gap-14">
        <div className="relative">
          <Spot className="left-[34%] top-1/2 w-[130%] -translate-y-1/2" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={fontHazir ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: ease.out, delay: 0.1 }}
          >
            {baslik && (
              <p className="max-w-[36ch] text-[11px] font-semibold leading-[1.7] tracking-[0.22em] text-[var(--sg-etiket)]">{baslik}</p>
            )}
            <h1
              className="mt-5 font-serif italic leading-[0.96] tracking-[-0.005em] text-[var(--sg-murekkep)]"
              style={{ fontSize: vinilBoyu(duvarYazisi) }}
            >
              <Adlar kisiler={duvarYazisi} girinti ampersandClassName="text-[var(--sg-etiket)]" />
            </h1>
          </motion.div>
        </div>

        <div className="grid gap-10 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] @3xl:items-end @3xl:gap-16">
          {/* Tek satır etiket: tarih ve mekân; altında konseptin tek espri satırı. */}
          <motion.div {...etiketBelirir(0.5)} className="text-[13px] leading-[1.5] tabular-nums">
            <div aria-hidden="true" className="mb-3 h-px w-12 bg-[var(--sg-murekkep)]" />
            {etiketSatiri && <p className="max-w-[44ch] text-[var(--sg-murekkep)]">{etiketSatiri}</p>}
            <p className="text-[var(--sg-etiket)]">Kalıcı koleksiyon</p>
          </motion.div>

          {(altBaslik || invitation.showTimer) && (
            <div className="flex flex-col gap-8 @3xl:justify-self-end">
              {altBaslik && (
                <motion.p {...yaziBelirir(0.45)} className="max-w-[34ch] text-[15px] leading-relaxed text-[var(--sg-etiket)] @md:text-[16px]">
                  {altBaslik}
                </motion.p>
              )}
              {invitation.showTimer && <SergiSayac date={invitation.date} timeZone={invitation.timezone} gecikme={0.5} />}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function DugunSergiDuvarYazisi({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useSergiFlavor(DUGUN_FLAVOR, invitation, DUGUN_SERGI_METINLERI);
  return (
    <SergiKok eser="gece">
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={SERGI_TEMASI}
        renderBackdrop={() => <Duvar />}
        renderHero={(props) => <DuvarYazisiHero {...props} />}
        renderEnvelope={(props) => <SergiKapi {...props} siluet={false} />}
      />
    </SergiKok>
  );
}
