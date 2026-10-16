import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import {
  Adlar,
  KAGIT_TEMASI,
  KagitKok,
  KagitLevha,
  KagitZarf,
  MumMuhur,
  basHarfler,
  basmaGirisi,
  belirmeGirisi,
  useElYazisiHazir,
  type KagitSeti
} from '../../shared/paper';
import { displayText } from '../../utils';
import { TemplateProps } from '../../types';
import { NISAN_KAGIT_FLAVOR, kagitTarih } from '../parts/kagitOrtak';
import { KagitSayac } from '../parts/KagitSayac';

/**
 * NisanSozMektubu — "Söz Mektubu": söz kesilen akşam için elle yazılmış,
 * ikiye katlanmış ve gül renkli mumla mühürlenmiş bir mektup.
 *
 * Kat izi kartın tam ortasındadır ve iki yarı eşit yükseklikte tutulur
 * (`grid-rows-2`): kat hiçbir zaman bir satırın üstünden geçmez. Alt yarıda
 * yazacak bir şey yoksa kart katlanmaz — boş bir yarım sayfa kalmasın.
 */
const SET: KagitSeti = {
  ton: 'acik',
  masa: 'pamuk',
  kart: 'fildisi',
  murekkep: 'is',
  vurgu: 'gul',
  mum: 'gul',
  doku: 'lif',
  el: 'pinyon'
};

function SozMektubuHero({ invitation }: HeroRenderProps) {
  const adHazir = useElYazisiHazir(SET.el, 500);
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const { gun, haftaGunu, saat } = kagitTarih(invitation.date);
  const altYariVar = Boolean(altBaslik || gun || mekan);
  const harfler = basHarfler(invitation.names);

  return (
    <section className="flex-1 flex flex-col items-center justify-center gap-12 px-5 py-14">
      <KagitLevha
        giris
        tohum={23}
        kat={altYariVar ? 'yatay' : 'yok'}
        className="w-full max-w-[22rem]"
        icerikClassName={altYariVar ? 'grid grid-rows-2 px-7 text-center' : 'px-7 text-center'}
      >
        <div className="flex flex-col items-center justify-center pt-10 pb-7">
          {baslik && (
            <motion.p {...belirmeGirisi(0.15)} className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--kg-vurgu)]">
              {baslik}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: adHazir ? 1 : 0 }}
            transition={{ duration: 0.45, delay: adHazir ? 0.15 : 0 }}
            className="mt-5 w-full"
          >
            <Adlar adlar={invitation.names || 'Davetlisiniz'} boy={46} className="text-[var(--kg-baslik)]" />
          </motion.div>
        </div>

        {altYariVar && (
          <motion.div {...belirmeGirisi(0.3)} className="flex flex-col items-center justify-center pt-7 pb-14">
            {altBaslik && <p className="text-[16px] italic leading-relaxed text-[var(--kg-govde)] max-w-[17rem]">{altBaslik}</p>}
            {gun && (
              <p className="mt-5 font-serif text-[22px] leading-tight text-[var(--kg-baslik)]">
                {haftaGunu && <span className="block text-[13px] uppercase tracking-[0.24em] text-[var(--kg-govde)]">{haftaGunu}</span>}
                {gun}
              </p>
            )}
            {saat && <p className="mt-1 text-[13px] uppercase tracking-[0.24em] text-[var(--kg-govde)]">Saat {saat}</p>}
            {mekan && (
              <p className="mt-4 text-[12px] uppercase tracking-[0.2em] leading-relaxed text-[var(--kg-govde)] [overflow-wrap:anywhere] max-w-[17rem]">
                {mekan}
              </p>
            )}
          </motion.div>
        )}

        {/* Mühür kartın alt kenarına biner: üstüne basılmış, içine konmamış. */}
        <motion.div {...basmaGirisi(0.55, -6)} className="absolute left-1/2 -bottom-8 -ml-9">
          <MumMuhur harfler={harfler} boyut={72} bicim={1} />
        </motion.div>
      </KagitLevha>

      <KagitSayac invitation={invitation} gecikme={0.55} />
    </section>
  );
}

export function NisanSozMektubu({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <KagitKok set={SET}>
      <InvitationComposition
        invitation={invitation}
        flavor={NISAN_KAGIT_FLAVOR}
        mode={mode}
        themeOverride={KAGIT_TEMASI}
        renderHero={(props) => <SozMektubuHero {...props} />}
        renderEnvelope={(props) => <KagitZarf {...props} />}
      />
    </KagitKok>
  );
}
