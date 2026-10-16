import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import {
  Adlar,
  KAGIT_TEMASI,
  KagitKok,
  KagitLevha,
  KagitZarf,
  PIGMENTLER,
  SuluboyaLeke,
  belirmeGirisi,
  useElYazisiHazir,
  type KagitSeti
} from '../../shared/paper';
import { displayText } from '../../utils';
import { TemplateProps } from '../../types';
import { NISAN_KAGIT_FLAVOR, kagitTarih } from '../parts/kagitOrtak';
import { KagitSayac } from '../parts/KagitSayac';
import { GulDali } from './GulDali';

/**
 * NisanGulKurusu — "Gül Kurusu": gül kurusu kâğıda taşmış suluboya lekeleri
 * ve kartın köşesine iliştirilmiş tek bir kurutulmuş gül dalı.
 *
 * Lekeler kartın ALTINDAN taşar, metnin altına girmez: kart opaktır,
 * lekeler yalnızca kenarlarından görünür. Konumları karta bağlıdır (kartı
 * saran kaba göre), ekrana değil — 1280 px'te de kartın kenarında kalırlar.
 * Kart hafif eğiktir (−1.2°): elle masaya bırakılmış.
 */
const SET: KagitSeti = {
  ton: 'acik',
  masa: 'gul',
  kart: 'fildisi',
  murekkep: 'gul',
  vurgu: 'gul',
  mum: 'gul',
  doku: 'lif',
  el: 'alex-brush'
};

function GulKurusuHero({ invitation }: HeroRenderProps) {
  const adHazir = useElYazisiHazir(SET.el, 500);
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const { gun, haftaGunu, saat } = kagitTarih(invitation.date);

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center gap-12 px-7 py-16 overflow-hidden">
      <div className="relative w-full max-w-[21rem]">
        {/* Masadaki lekeler — kartın altından taşar. */}
        <motion.div {...belirmeGirisi(0)} aria-hidden="true" className="pointer-events-none absolute inset-0">
          <SuluboyaLeke renk="gul" boyut={250} aci={-14} style={{ position: 'absolute', left: -96, top: -46 }} />
          <SuluboyaLeke renk="seftali" boyut={200} aci={160} ayna style={{ position: 'absolute', right: -92, bottom: 30 }} />
          <SuluboyaLeke renk="lavanta" boyut={150} aci={70} oran={0.85} style={{ position: 'absolute', left: -44, bottom: -58 }} />
        </motion.div>

        <KagitLevha giris={0.1} tohum={41} className="w-full rotate-[-1.2deg]" icerikClassName="px-8 pt-20 pb-12 text-center">
          {baslik && (
            <motion.p {...belirmeGirisi(0.25)} className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--kg-vurgu)]">
              {baslik}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: adHazir ? 1 : 0 }}
            transition={{ duration: 0.45, delay: adHazir ? 0.25 : 0 }}
            className="mt-4"
          >
            <Adlar adlar={invitation.names || 'Davetlisiniz'} boy={46} className="text-[var(--kg-baslik)]" />
          </motion.div>
          <motion.div {...belirmeGirisi(0.35)}>
            {altBaslik && <p className="mt-5 text-[16px] leading-relaxed text-[var(--kg-govde)]">{altBaslik}</p>}
            {(gun || mekan) && <div aria-hidden="true" className="mx-auto mt-6 h-px w-14 bg-[var(--kg-cizgi-guclu)]" />}
            {gun && (
              <p className="mt-6 font-serif text-[22px] leading-tight text-[var(--kg-baslik)]">
                {gun}
                {(haftaGunu || saat) && (
                  <span className="mt-1 block text-[12px] uppercase tracking-[0.22em] text-[var(--kg-govde)]">
                    {[haftaGunu, saat].filter(Boolean).join(' · ')}
                  </span>
                )}
              </p>
            )}
            {mekan && (
              <p className="mt-4 text-[12px] uppercase tracking-[0.2em] leading-relaxed text-[var(--kg-govde)] [overflow-wrap:anywhere]">
                {mekan}
              </p>
            )}
          </motion.div>
        </KagitLevha>

        {/* Dal kartın sol üst köşesine iliştirilmiş: kenarı aşar. */}
        <motion.div {...belirmeGirisi(0.4)} className="pointer-events-none absolute -left-9 -top-12 w-[10.5rem] rotate-[-10deg]">
          <GulDali className="w-full h-auto" />
        </motion.div>
      </div>

      <KagitSayac invitation={invitation} gecikme={0.5} />
    </section>
  );
}

export function NisanGulKurusu({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <KagitKok set={SET}>
      <InvitationComposition
        invitation={invitation}
        flavor={NISAN_KAGIT_FLAVOR}
        mode={mode}
        themeOverride={KAGIT_TEMASI}
        renderHero={(props) => <GulKurusuHero {...props} />}
        renderEnvelope={(props) => <KagitZarf {...props} astar={PIGMENTLER.gul} />}
      />
    </KagitKok>
  );
}
