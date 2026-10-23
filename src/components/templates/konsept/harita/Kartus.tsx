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
  /** `orta`: metin ve rota süsü ortalı (hazine haritasının başlık bandı). Varsayılan `sol`. */
  hizala?: 'sol' | 'orta';
  /**
   * `ilk`: ilk ad tam boy, sonrakiler küçük (doğum günü: *Sahibi & Ev sahibi* —
   * davet sahibinindir, ev sahibi ikinci satırda). Varsayılan `esit`.
   */
  vurgu?: 'esit' | 'ilk';
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
function RotaSusu({ orta }: { orta: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 96 6" width="96" height="6" className={cn('my-3.5 @3xl:my-5 block', orta && 'mx-auto')}>
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={3 + i * 11} cy="3" r="2.2" fill={HARITA_RENK.rotaAcik} />
      ))}
    </svg>
  );
}

export function Kartus({ baslik, adlar, altBaslik, tarih, giris, hizala = 'sol', vurgu = 'esit', className, ref }: KartusProps) {
  const gosterilen = adlar.length ? adlar : ['Davetlisiniz'];
  const orta = hizala === 'orta';
  // `ilk` vurguda boy yalnızca ilk addan hesaplanır: ikinci ad zaten küçük.
  const boy = adBoyu(vurgu === 'ilk' ? gosterilen.slice(0, 1) : gosterilen);
  return (
    <motion.div
      ref={ref}
      {...giris}
      className={cn(
        'relative bg-white border-[1.5px] border-[#23303A] [box-shadow:4px_4px_0_#23303A] px-5 pt-4 pb-5 @3xl:px-7 @3xl:pt-6 @3xl:pb-7',
        orta && 'text-center',
        className
      )}
    >
      {baslik && (
        <p className="[font-family:var(--hr-etiket)] font-semibold text-[12px] @3xl:text-[13px] leading-snug tracking-[0.18em] text-[#A8321F] mb-2.5 @3xl:mb-3.5">
          {baslik}
        </p>
      )}
      {/* Satır yüksekliği boydan SONRA: twMerge boyu sonra görürse `leading`'i atar. */}
      <h1 className={cn('[font-family:var(--hr-italik)] italic font-medium text-[#23303A] [text-wrap:balance] break-words', boy, 'leading-[1.06]')}>
        {gosterilen.map((ad, i) => (
          <span key={`${ad}-${i}`} className={cn('block', i > 0 && vurgu === 'ilk' && 'mt-1 text-[0.6em] leading-[1.15]')}>
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
      <RotaSusu orta={orta} />
      {altBaslik && <p className={cn('text-[15px] @3xl:text-[16px] leading-normal text-[#4E5B63] max-w-[30rem]', orta && 'mx-auto')}>{altBaslik}</p>}
      {tarih && (
        <p className="mt-3 [font-family:var(--hr-etiket)] font-semibold text-[15px] @3xl:text-[16px] uppercase tracking-[0.14em] text-[#23303A] [font-variant-numeric:lining-nums_tabular-nums]">
          {tarih}
        </p>
      )}
    </motion.div>
  );
}
