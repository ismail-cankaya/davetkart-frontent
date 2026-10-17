import React from 'react';
import { motion } from 'motion/react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { displayText } from '../../utils';
import { KitapAdlar } from './Adlar';
import { Fleuron } from './Fleuron';
import { bolumGirisi, kapakBelirir } from './hareket';
import { KitapSayac } from './KitapSayac';
import { kisiler, kitapTarihi, tamTarih } from './tarih';

/**
 * Bölüm açılışı: kapağın ardındaki ilk sayfa. Üstte bölüm etiketi, kullanıcının
 * başlığı, ince çizgi; sonra başharfli tek paragraf (alt metin), sarmaşık
 * süsü, künye gibi tarih ve mekân, geri sayım ve sayfa numarası.
 *
 * Başharf (`::first-letter`) konseptin tek başharfidir: Caslon Display, kurdele
 * renginde, iki satır boyu. Paragraf sola yaslıdır (`text-wrap: pretty`):
 * alt metin çoğu zaman iki satırdır ve iki yana yaslanan iki satırda ilk
 * satırın kelime araları açılır (denendi, 768 / 1280 px).
 *
 * Zarf açıkken kapak kapıydı ve gitti: adlar burada başlık (`h1`) olur.
 * Zarfsızken adlar kapakta durur; bu sayfada tekrarlanmaz.
 */
interface BolumAcilisiProps {
  invitation: Invitation;
  /** Bölüm etiketi (ör. "Birinci Bölüm"); büyük harfe çevrilir. */
  etiket: string;
  /** Adlar bu sayfada başlık olarak dizilsin mi? */
  adlar: boolean;
  /** İlk ekransa yüklenince, kapağın altındaysa görününce girer. */
  giris: 'yuklenince' | 'gorununce';
  /** Sayfa numarası (süs). */
  sayfaNo?: string;
  className?: string;
}

const BASHARF = [
  'first-letter:float-left',
  'first-letter:mr-[0.07em]',
  'first-letter:mt-[0.05em]',
  'first-letter:text-[3.3em]',
  'first-letter:leading-[0.8]',
  'first-letter:text-[#8C2F2F]',
  'first-letter:[font-family:var(--kt-baslik-font)]'
].join(' ');

export function BolumAcilisi({ invitation, etiket, adlar, giris, sayfaNo, className }: BolumAcilisiProps) {
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const tarih = tamTarih(kitapTarihi(invitation.date));
  const hareket = giris === 'yuklenince' ? kapakBelirir() : bolumGirisi;

  return (
    <section className={cn('relative flex flex-col items-center px-6 py-16 text-center @3xl:py-24', className)}>
      <motion.div {...hareket} className="flex w-full max-w-[34em] flex-col items-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#8C2F2F]">{etiket}</p>

        {adlar && (
          <KitapAdlar
            adlar={kisiler(invitation.names)}
            as="h1"
            enCok={56}
            akis={11}
            className="mt-8 text-[#231F1A]"
            baglacClassName="text-[#8C2F2F]"
          />
        )}

        {baslik && <p className="mt-8 text-[13px] leading-relaxed tracking-[0.18em] text-[#5E5446] [text-wrap:balance]">{baslik}</p>}
        <span aria-hidden="true" className="mt-6 block h-px w-12 bg-[#231F1A]/40" />

        {altBaslik && (
          <p className={cn('mt-9 w-full max-w-[26em] text-left text-[17px] leading-[1.6] text-[#231F1A] [display:flow-root] [text-wrap:pretty]', BASHARF)}>
            {altBaslik}
          </p>
        )}

        <Fleuron className="mt-10 text-[#8C2F2F]" />

        {(tarih || mekan) && (
          <div className="mt-9 flex flex-col items-center gap-1.5">
            {tarih && <p className="text-[15px] text-[#231F1A]">{tarih}</p>}
            {mekan && <p className="text-[15px] italic leading-snug text-[#5E5446] [text-wrap:balance]">{mekan}</p>}
          </div>
        )}

        <KitapSayac invitation={invitation} className="mt-10" sayiClassName="text-[#231F1A]" birimClassName="text-[#5E5446]" />

        {sayfaNo && (
          <p aria-hidden="true" className="mt-14 text-[13px] text-[#5E5446]">
            {sayfaNo}
          </p>
        )}
      </motion.div>
    </section>
  );
}
