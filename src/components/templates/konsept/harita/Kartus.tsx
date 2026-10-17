import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { HARITA_RENK } from './palet';
import type { GirisProps } from './hareket';

/**
 * Kartuş: haritanın başlık bloğu. Beyaz dikdörtgen, ince mürekkep kontur,
 * kaymış düz gölge (gölge yalnızca burada). Üst etiket kullanıcının
 * başlığıdır; harf büyüklüğüne dokunulmaz.
 */
export interface KartusProps {
  baslik: string;
  adlar: string[];
  altBaslik: string;
  /** Hazır biçimlenmiş tarih ("12 Şubat 2027 · Cuma"); boşsa satır çizilmez. */
  tarih: string;
  giris: GirisProps;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/** Adların toplam uzunluğuna göre boy: kısa ad iri, uzun ad iki satıra sığar. */
function adBoyu(adlar: string[]): string {
  const uzunluk = adlar.join(' ').length;
  if (uzunluk <= 16) return 'text-[40px] @3xl:text-[54px]';
  if (uzunluk <= 30) return 'text-[34px] @3xl:text-[50px]';
  return 'text-[30px] @3xl:text-[40px]';
}

/** Kartuşun içindeki küçük rota: başlık bloğunu haritanın diline bağlar. */
function RotaSusu() {
  return (
    <svg aria-hidden="true" viewBox="0 0 96 6" width="96" height="6" className="my-3.5 @3xl:my-5 block">
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={3 + i * 11} cy="3" r="2.2" fill={HARITA_RENK.rotaAcik} />
      ))}
    </svg>
  );
}

export function Kartus({ baslik, adlar, altBaslik, tarih, giris, className, ref }: KartusProps) {
  const gosterilen = adlar.length ? adlar : ['Davetlisiniz'];
  return (
    <motion.div
      ref={ref}
      {...giris}
      className={cn(
        'relative bg-white border-[1.5px] border-[#23303A] [box-shadow:4px_4px_0_#23303A] px-5 pt-4 pb-5 @3xl:px-7 @3xl:pt-6 @3xl:pb-7',
        className
      )}
    >
      {baslik && (
        <p className="[font-family:var(--hr-etiket)] font-semibold text-[12px] @3xl:text-[13px] leading-snug tracking-[0.18em] text-[#A8321F] mb-2.5 @3xl:mb-3.5">
          {baslik}
        </p>
      )}
      {/* Satır yüksekliği boydan SONRA: twMerge boyu sonra görürse `leading`'i atar. */}
      <h1 className={cn('[font-family:var(--hr-italik)] italic font-medium text-[#23303A] [text-wrap:balance] break-words', adBoyu(gosterilen), 'leading-[1.06]')}>
        {gosterilen.map((ad, i) => (
          <span key={`${ad}-${i}`} className="block">
            {i > 0 && (
              <>
                {' '}
                <span className="text-[#A8321F] text-[0.72em]">&amp;</span>{' '}
              </>
            )}
            {ad}
          </span>
        ))}
      </h1>
      <RotaSusu />
      {altBaslik && <p className="text-[15px] @3xl:text-[16px] leading-normal text-[#4E5B63] max-w-[30rem]">{altBaslik}</p>}
      {tarih && (
        <p className="mt-3 [font-family:var(--hr-etiket)] font-semibold text-[15px] @3xl:text-[16px] uppercase tracking-[0.14em] text-[#23303A] [font-variant-numeric:lining-nums_tabular-nums]">
          {tarih}
        </p>
      )}
    </motion.div>
  );
}
