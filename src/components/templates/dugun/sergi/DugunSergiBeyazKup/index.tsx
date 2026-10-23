import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../../shared/InvitationComposition';
import { TemplateProps } from '../../../types';
import { displayText } from '../../../utils';
import { cn } from '../../../../../utils/cn';
import { ease } from '../../../../../utils/motion';
import { DUGUN_FLAVOR } from '../../flavors';
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
import { DUGUN_SERGI_METINLERI } from '../ortak';

/**
 * DugunSergiBeyazKup — "Beyaz Küp": müzede düğün, tek eser (SERGI-KONSEPTI
 * §4.3). Duvarda çiftin adı sergi adı gibi yazılı; yanında beyaz paspartulu
 * tek çerçeve ("Eşik", kobalt) ve müze etiketi. Şakasız.
 *
 * Asimetri: 1024 px altında yazı üstte sola yaslı, eser altında sağa yaslı;
 * etiket 512 px'ten itibaren eserin yanında, altında eserin sağ alt
 * köşesinde. 1024 px'ten itibaren yazı solda, eser sağda.
 */
const ESER = SOYUT_ESERLER.esik;

/**
 * Adların boyu en uzun satıra göre: kısa ad büyük, uzun ad küçülür, kesilmez.
 * `cn` boyu satır aralığıyla çakışan sınıf sayar: `leading-*` boydan SONRA yazılır.
 */
function adBoyu(adlar: string[]): string {
  const enUzun = Math.max(...adlar.map((ad, i) => ad.length + (i > 0 ? 2 : 0)));
  if (enUzun <= 15) return 'text-[44px] @md:text-[54px] @3xl:text-[64px] @5xl:text-[68px]';
  if (enUzun <= 24) return 'text-[38px] @md:text-[46px] @3xl:text-[54px] @5xl:text-[58px]';
  return 'text-[32px] @md:text-[40px] @3xl:text-[46px] @5xl:text-[52px]';
}

function BeyazKupHero({ invitation }: HeroRenderProps) {
  const fontHazir = useDuvarYazisiHazir();
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const tarih = etiketTarihi(invitation.date);
  const adlar = kisiler(invitation.names);
  const duvarYazisi = adlar.length ? adlar : ['Davetlisiniz'];

  return (
    <section className="relative flex-1 flex flex-col justify-center px-6 pt-14 pb-14 @md:px-10 @3xl:px-16 @3xl:py-20 @5xl:px-20 @5xl:py-16">
      <div className="w-full max-w-[74rem] mx-auto grid gap-y-10 @5xl:grid-cols-[minmax(0,11fr)_minmax(0,13fr)] @5xl:gap-x-16 @5xl:gap-y-10">
        {/* Duvar yazısı: başlık üst etiket, adlar sergi adı. Font gelene kadar bekler (≤ 400 ms). */}
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

        {/* Eser ve etiketi. */}
        <div className="flex flex-col items-end gap-5 @lg:flex-row @lg:items-end @lg:justify-end @lg:gap-7 @5xl:col-start-2 @5xl:row-start-1 @5xl:row-span-2 @5xl:self-center">
          <div className="relative w-[76%] max-w-[18rem] shrink-0 @lg:w-[54%] @lg:max-w-[22rem] @5xl:w-[60%] @5xl:max-w-[26rem]">
            <Spot />
            <Cerceve gecikme={0.15}>
              <ESER.Bilesen className="absolute inset-0 h-full w-full" />
            </Cerceve>
          </div>
          <Etiket
            className="w-[62%] max-w-[15rem] @lg:w-auto @lg:max-w-[13.5rem] @lg:flex-1 @lg:pb-1"
            sanatci={displayText(invitation.names) || undefined}
            eser={ESER.ad}
            yil={tarih.yil}
            teknik={ESER.teknik}
            bilgiBasligi="Açılış"
            bilgi={[tarihSatiri(tarih), mekan]}
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

export function DugunSergiBeyazKup({ invitation, mode = 'preview' }: TemplateProps) {
  const flavor = useSergiFlavor(DUGUN_FLAVOR, invitation, DUGUN_SERGI_METINLERI);
  return (
    <SergiKok eser="kobalt">
      <InvitationComposition
        invitation={invitation}
        flavor={flavor}
        mode={mode}
        themeOverride={SERGI_TEMASI}
        renderBackdrop={() => <Duvar />}
        renderHero={(props) => <BeyazKupHero {...props} />}
        renderEnvelope={(props) => <SergiKapi {...props} />}
      />
    </SergiKok>
  );
}
