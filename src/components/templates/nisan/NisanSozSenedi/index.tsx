import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import {
  KAGIT_TEMASI,
  KagitKok,
  KagitLevha,
  KagitZarf,
  MurekkepDamga,
  basHarfler,
  basmaGirisi,
  belirmeGirisi,
  useElYazisiHazir,
  type KagitSeti
} from '../../shared/paper';
import { displayText } from '../../utils';
import { TemplateProps } from '../../types';
import { NISAN_KAGIT_FLAVOR, kagitTarih, kisiler } from '../parts/kagitOrtak';
import { KagitSayac } from '../parts/KagitSayac';

/**
 * NisanSozSenedi — "Söz Senedi": nişan bir sözdür; davetiye iki imzalı bir
 * senet. Tepede mürekkepsiz kabartılmış iç içe iki halka, her ad kendi imza
 * çizgisinin üstünde, köşede tarih damgası.
 *
 * Tek ad girildiyse tek imza çizgisi çizilir; ad yoksa çizginin üstünde
 * "Davetlisiniz" durur. İmzalar 384 px altında alt alta, üstünde yan yana.
 */
const SET: KagitSeti = {
  ton: 'acik',
  masa: 'fildisi',
  kart: 'pamuk',
  murekkep: 'lacivert',
  vurgu: 'lacivert',
  mum: 'yaldiz',
  doku: 'keten',
  el: 'caveat'
};

/** Halka kabartması: kâğıt renginde şerit, üst-sol ışık, alt-sağ gölge. */
function Halka({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--kg-kabartma-golge)" strokeWidth="4.4" transform="translate(0.8 0.9)" />
      <path d={d} fill="none" stroke="var(--kg-kabartma-isik)" strokeWidth="4.4" transform="translate(-0.7 -0.8)" />
      <path d={d} fill="none" stroke="var(--kg-kart)" strokeWidth="4.4" />
    </>
  );
}

const DAIRE = (cx: number) => `M${cx - 20} 30 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0`;

/**
 * İç içe iki halka. B halkası A'nın üstünden geçer; sonra A'nın üst kesişme
 * yayı yeniden çizilir ve A orada B'nin üstüne çıkar — iki halka birbirine
 * geçmiş okunur.
 */
function Halkalar() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 60" className="mx-auto w-24 h-auto overflow-visible">
      <Halka d={DAIRE(38)} />
      <Halka d={DAIRE(62)} />
      <Halka d="M44.84 11.21 A20 20 0 0 1 54.18 18.24" />
    </svg>
  );
}

/** İmza: ad el yazısıyla, altında tam gövde mürekkebiyle çizgi. */
function Imza({ ad, gecikme }: { ad: string; gecikme: number }) {
  const boy = ad.length <= 12 ? 32 : ad.length <= 22 ? 26 : 22;
  return (
    <motion.div {...belirmeGirisi(gecikme)} className="flex flex-col justify-end">
      <p
        className="px-1 leading-[1.05] text-[var(--kg-baslik)] [text-wrap:balance] [overflow-wrap:anywhere]"
        style={{ fontFamily: 'var(--kg-el-font)', fontSize: boy }}
      >
        {ad}
      </p>
      <div aria-hidden="true" className="mt-1.5 h-px w-full bg-[var(--kg-govde)]" />
    </motion.div>
  );
}

function KunyeSatiri({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--kg-vurgu)]">{etiket}</span>
      <span className="font-serif text-[18px] leading-snug text-[var(--kg-baslik)] [overflow-wrap:anywhere]">{deger}</span>
    </div>
  );
}

function SozSenediHero({ invitation, flavor }: HeroRenderProps) {
  const adHazir = useElYazisiHazir(SET.el, 500);
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const { gun, haftaGunu, saat } = kagitTarih(invitation.date);
  const tarih = [haftaGunu ? `${haftaGunu}, ${gun}` : gun, saat].filter(Boolean).join(' · ');
  const adlar = kisiler(invitation.names);
  const imzalar = adlar.length ? adlar.slice(0, 2) : ['Davetlisiniz'];

  return (
    <section className="flex-1 flex flex-col items-center justify-center gap-12 px-5 py-14">
      <KagitLevha giris tohum={57} className="w-full max-w-[22rem] @sm:max-w-[26rem]" icerikClassName="px-9 pt-11 pb-24 text-center">
        {/* Basılı çift çerçeve — resmî belgenin işareti. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-[14px] border border-[var(--kg-cizgi-guclu)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-[18px] border border-[var(--kg-cizgi)]" />

        <motion.div {...belirmeGirisi(0.1)}>
          <Halkalar />
        </motion.div>
        {baslik && (
          <motion.p {...belirmeGirisi(0.15)} className="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--kg-vurgu)]">
            {baslik}
          </motion.p>
        )}
        {altBaslik && (
          <motion.p {...belirmeGirisi(0.2)} className="mt-4 text-[16px] leading-relaxed text-[var(--kg-govde)]">
            {altBaslik}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: adHazir ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={imzalar.length > 1 ? 'mt-9 grid gap-7 @sm:grid-cols-2 @sm:gap-6' : 'mt-9 mx-auto max-w-[14rem]'}
        >
          {imzalar.map((ad, i) => (
            <Imza key={ad + i} ad={ad} gecikme={0.35 + i * 0.15} />
          ))}
        </motion.div>

        {(tarih || mekan) && (
          <motion.div {...belirmeGirisi(0.55)} className="mt-9 flex flex-col gap-4">
            {tarih && <KunyeSatiri etiket="Tarih" deger={tarih} />}
            {mekan && <KunyeSatiri etiket="Yer" deger={mekan} />}
          </motion.div>
        )}

        {/* Tarih damgası köşeye vurulmuş: kartın kenarını aşar. */}
        <motion.div {...basmaGirisi(0.7, -10)} className="absolute -right-2 -bottom-7">
          <MurekkepDamga ust={flavor.envelopeLabel} alt={gun || undefined} orta={basHarfler(invitation.names)} boyut={104} aci={0} />
        </motion.div>
      </KagitLevha>

      <KagitSayac invitation={invitation} gecikme={0.6} />
    </section>
  );
}

export function NisanSozSenedi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <KagitKok set={SET}>
      <InvitationComposition
        invitation={invitation}
        flavor={NISAN_KAGIT_FLAVOR}
        mode={mode}
        themeOverride={KAGIT_TEMASI}
        renderHero={(props) => <SozSenediHero {...props} />}
        renderEnvelope={(props) => <KagitZarf {...props} />}
      />
    </KagitKok>
  );
}
