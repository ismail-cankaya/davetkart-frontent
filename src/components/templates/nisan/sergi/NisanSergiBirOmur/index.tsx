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
  Duvar,
  Etiket,
  SERGI_TEMASI,
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
 * NisanSergiBirOmur — "Bir Ömür": duvar yazısı (SERGI-KONSEPTI §4.3).
 * Nişan, açılışı yakında olan "Bir Ömür" sergisinin önizlemesidir (§7).
 * Sergi adı duvarın sağ kenarında aşağıdan yukarı okunan dev fuşya vinil;
 * çift, sergiyi açan sanatçılar gibi sol altta; etiket önizlemenin tarihi
 * ve mekânı. Çapraz denge: vinil sağ üstte, adlar sol altta, arası boş duvar.
 */

/**
 * Vinilin boyu kabın genişliğine göre; tavan 1280×800'de vinili ekrana sığdırır.
 * Yatay bir kapta tanımlanır: dikey yazının kendi `cqi`'si kabın genişliği değil.
 */
const VINIL_BOYU = 'clamp(96px, 30cqi, 172px)';

/**
 * Adların boyu en uzun satıra göre: kısa ad büyük, uzun ad küçülür, kesilmez.
 * Mobilde adlar tam genişliktedir (vinil üstte kalır). `leading-*` boydan sonra.
 */
function adBoyu(adlar: string[]): string {
  const enUzun = Math.max(...adlar.map((ad, i) => ad.length + (i > 0 ? 2 : 0)));
  if (enUzun <= 15) return 'text-[46px] @md:text-[54px] @3xl:text-[60px] @5xl:text-[76px]';
  if (enUzun <= 24) return 'text-[40px] @md:text-[46px] @3xl:text-[52px] @5xl:text-[64px]';
  return 'text-[34px] @md:text-[40px] @3xl:text-[44px] @5xl:text-[54px]';
}

/**
 * Dikey vinil: "YAKINDA  Bir Ömür", aşağıdan yukarı okunur. Küçük durum
 * sözü büyük adın taban çizgisinde durur (`sideways`). Font gelince vinil
 * kesiminden yukarı kayarak yapışır; kap yığın bağlamı kurmaz (spot).
 */
function Vinil({ hazir }: { hazir: boolean }) {
  return (
    <div className="relative col-start-2 row-start-1 row-span-2 justify-self-end self-start @3xl:row-span-3">
      <Spot className="top-[24%] w-[320%] aspect-square -translate-y-1/2" />
      <div className="overflow-y-clip">
        <motion.div
          initial={{ y: '100%' }}
          animate={hazir ? { y: 0 } : { y: '100%' }}
          transition={{ duration: 0.55, ease: ease.out, delay: 0.05 }}
          style={{ fontSize: VINIL_BOYU }}
        >
          <p
            lang="tr"
            className="[writing-mode:vertical-rl] [text-orientation:sideways] rotate-180 whitespace-nowrap leading-none text-[var(--sg-vurgu)]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">{ONIZLEME.durum}</span>{' '}
            <span className="font-serif italic ps-[0.12em]">{ONIZLEME.sergi}</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function BirOmurHero({ invitation }: HeroRenderProps) {
  const fontHazir = useDuvarYazisiHazir();
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const tarih = etiketTarihi(invitation.date);
  const adlar = kisiler(invitation.names);
  const duvarYazisi = adlar.length ? adlar : ['Davetlisiniz'];

  return (
    <section className="relative flex-1 flex flex-col px-6 pt-12 pb-12 @md:px-10 @3xl:px-14 @3xl:pt-16 @3xl:pb-14 @5xl:px-20 @5xl:pt-14">
      <div className="w-full max-w-[78rem] mx-auto flex-1 grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_minmax(2rem,1fr)_auto] gap-x-5 @3xl:gap-x-12">
        {baslik && (
          <motion.p
            {...yaziBelirir(0.1)}
            className="col-start-1 row-start-1 self-start max-w-[30ch] pt-1 text-[11px] font-semibold leading-[1.7] tracking-[0.22em] text-[var(--sg-etiket)]"
          >
            {baslik}
          </motion.p>
        )}

        <Vinil hazir={fontHazir} />

        <div className="col-span-2 row-start-3 mt-9 flex flex-col gap-8 @3xl:col-span-1 @3xl:col-start-1 @3xl:mt-0 @5xl:gap-10">
          {/* Sanatçılar: font gelene kadar bekler (≤ 400 ms). */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={fontHazir ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: ease.out, delay: 0.15 }}
            className={cn('font-serif italic text-[var(--sg-murekkep)]', adBoyu(duvarYazisi), 'leading-[1.02]')}
          >
            <Adlar kisiler={duvarYazisi} girinti ampersandClassName="text-[var(--sg-etiket)]" />
          </motion.h1>

          <div className="flex flex-col gap-9 @5xl:flex-row @5xl:items-end @5xl:gap-16">
            <Etiket
              className="max-w-[18rem] @5xl:shrink-0"
              bilgiBasligi={ONIZLEME.baslik}
              bilgi={[tarihSatiri(tarih), mekan]}
              gecikme={0.5}
            />
            {(altBaslik || invitation.showTimer) && (
              <div className="flex flex-col gap-8">
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
        </div>
      </div>
    </section>
  );
}

/** Karanlıkta vinil seçilir: aynı yerde, aynı boyda, neredeyse görünmez. */
const VINIL_SILUETI = (
  <div
    aria-hidden="true"
    className="absolute right-6 top-12 @md:right-10 @3xl:right-14 @3xl:top-16 @5xl:right-20 @5xl:top-14"
    style={{ fontSize: VINIL_BOYU }}
  >
    <p className="[writing-mode:vertical-rl] [text-orientation:sideways] rotate-180 whitespace-nowrap leading-none font-serif italic text-white/[0.06]">
      {ONIZLEME.sergi}
    </p>
  </div>
);

export function NisanSergiBirOmur({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useSergiFlavor(NISAN_FLAVOR, invitation, NISAN_SERGI_METINLERI);
  return (
    <SergiKok eser="fusya">
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={SERGI_TEMASI}
        renderBackdrop={() => <Duvar />}
        renderHero={(props) => <BirOmurHero {...props} />}
        renderEnvelope={(props) => <SergiKapi {...props} siluet={VINIL_SILUETI} />}
      />
    </SergiKok>
  );
}
