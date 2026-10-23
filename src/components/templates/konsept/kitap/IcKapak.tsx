import React, { useRef } from 'react';
import { motion } from 'motion/react';
import type { Invitation } from '../../../../types';
import { cn } from '../../../../utils/cn';
import { displayText } from '../../utils';
import { KitapAdlar } from './Adlar';
import { Ayrac } from './Ayrac';
import { Fleuron } from './Fleuron';
import { useBaslikFontuHazir } from './fontlar';
import { kapakBelirir } from './hareket';
import { KitapSayac } from './KitapSayac';
import { kisiler, kitapTarihi, tamTarih } from './tarih';
import { useSikiBlok } from './useSikiBlok';

/**
 * İç kapak (künye düzeni): kapak yok, şamua bir başlık sayfası. Üç kat:
 *   üst  — kullanıcının başlığı, yazar satırı gibi aralıklı; altında çizgi
 *   orta — adlar (kitabın adı), italik alt metin, matbaa süsü
 *   alt  — künye: çizgi, yayın yeri = mekân, yılı = tarih; geri sayım
 * Sağ üstten ayraç kurdelesi sarkar (süs).
 *
 * Kurdele metnin sütununa girmez: dar ekranda sayfanın sağ kenarında,
 * genişte metin sütununun 40 px dışında durur.
 *
 * Alt metin sola yaslı (`text-wrap: pretty`, KITAP-KONSEPTI §3.2) ama kutusu
 * ortada ve en uzun satırına göre daralır (`useSikiBlok`): tek satır ortalı
 * görünür, uzun metin ortalı bir blokta sola yaslı akar — simetri bozulmaz.
 */
interface IcKapakProps {
  invitation: Invitation;
  className?: string;
}

export function IcKapak({ invitation, className }: IcKapakProps) {
  const hazir = useBaslikFontuHazir();
  const baslik = displayText(invitation.title);
  const altBaslik = displayText(invitation.subtitle);
  const mekan = displayText(invitation.venue);
  const tarih = tamTarih(kitapTarihi(invitation.date));
  const altRef = useRef<HTMLParagraphElement>(null);
  useSikiBlok(altRef, altBaslik);

  return (
    <section className={cn('relative flex flex-1 flex-col items-center overflow-hidden px-10 pb-12 pt-16 text-center @3xl:pt-20', className)}>
      <Ayrac className="right-[18px] @3xl:right-[calc(50%-19.5rem)]" />

      <motion.div {...kapakBelirir(hazir)} className="relative flex w-full max-w-[34em] flex-1 flex-col items-center justify-between gap-12">
        <div className="flex flex-col items-center">
          {baslik && <p className="text-[12px] leading-relaxed tracking-[0.22em] text-[#231F1A] [text-wrap:balance]">{baslik}</p>}
          <span aria-hidden="true" className="mt-6 block h-px w-14 bg-[#231F1A]/40" />
        </div>

        <div className="flex flex-col items-center">
          <KitapAdlar adlar={kisiler(invitation.names)} as="h1" className="text-[#231F1A]" baglacClassName="text-[#8C2F2F]" />
          {altBaslik && (
            <p ref={altRef} className="mt-8 w-fit max-w-[24em] text-left text-[18px] italic leading-relaxed text-[#5E5446] [text-wrap:pretty]">{altBaslik}</p>
          )}
          <Fleuron tur="cizgi" className="mt-10 text-[#8C2F2F]" />
        </div>

        <div className="flex flex-col items-center">
          {(mekan || tarih) && (
            <>
              <span aria-hidden="true" className="mb-5 block h-px w-16 bg-[#231F1A]/40" />
              {mekan && <p className="text-[14px] leading-snug tracking-[0.12em] text-[#231F1A] [text-wrap:balance]">{mekan}</p>}
              {tarih && <p className="mt-1.5 text-[14px] text-[#5E5446]">{tarih}</p>}
            </>
          )}
          <KitapSayac invitation={invitation} className="mt-8" sayiClassName="text-[#231F1A]" birimClassName="text-[#5E5446]" />
        </div>
      </motion.div>
    </section>
  );
}
