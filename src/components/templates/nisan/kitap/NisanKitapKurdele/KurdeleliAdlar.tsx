import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';
import { ease } from '../../../../../utils/motion';
import { adlarBoyu } from '../../../konsept/kitap';

/**
 * Kurdeleli adlar: iki ad, aralarında sayfayı enine geçen ayraç kurdelesi.
 * Kurdele ortadan kesiktir; kesik uçlar (kırlangıç kuyruğu) birbirine bakar ve
 * aradaki boşlukta Caslon italik `&` durur — nişanda yüzükleri bağlayan
 * kurdele kesilir, söz kesilir.
 *
 * Kurdele kabın (`@container`, ekran) bir kenarından öbürüne uzanır; satır
 * kabın iki yanından 0.5 em taşar, kesitin dışı bölümün `overflow`'una kalır.
 * Kalınlık ve kesik `Ayrac` ile aynı: 14 px, 9 px kertik, kenarda koyu kılçizgi.
 *
 * Hareket (bir kez, `hazir` olunca): iki yarı bitişik başlar, 0.05 s sonra
 * 0.4 s'de ±0.45 em açılır; `&` aynı anda belirir. Font beklemesiyle (≤ 0.4 s)
 * en geç 0.85 s'de biter. Yalnızca transform ve
 * opaklık; hareket azaltılmışken yarılar yerinde, `&` görünür.
 *
 * Tek ad ya da ad yok: kurdele kesilmez — adın altında tek parça durur.
 * Erişilebilir ad "A & B"dir (`&` metindir); kurdele `aria-hidden`.
 */
interface KurdeleliAdlarProps {
  /** `kisiler(names)` çıktısı. */
  adlar: string[];
  /** Başlık fontu hazır mı (giriş buna bağlı). */
  hazir: boolean;
  bos?: string;
  className?: string;
}

const KURDELE = 'h-[14px] bg-[#8C2F2F]';
const KILCIZGI = 'linear-gradient(180deg, rgba(0,0,0,0.22) 0 1px, transparent 1px calc(100% - 1px), rgba(0,0,0,0.22) calc(100% - 1px))';
const SOL_KESIK = 'polygon(0 0, 100% 0, calc(100% - 9px) 50%, 100% 100%, 0 100%)';
const SAG_KESIK = 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 9px 50%)';
const ACILMA = '0.45em';

/** Satırı kabın iki kenarına (ve 0.5 em ötesine) yayar. */
const ENINE = 'relative ml-[calc(50%-50cqi-0.5em)] w-[calc(100cqi+1em)]';

export function KurdeleliAdlar({ adlar, hazir, bos = 'Davetlisiniz', className }: KurdeleliAdlarProps) {
  const parcalar = adlar.length ? adlar : [bos];
  const [ilk, ...kalan] = parcalar;
  const ikinci = kalan.join(' & ');
  const gecis = { duration: 0.4, delay: 0.05, ease: ease.inOut };

  return (
    <h1
      className={cn('w-full leading-[1.08] text-[#231F1A] [text-wrap:balance] [overflow-wrap:break-word]', className)}
      style={{ fontFamily: 'var(--kt-baslik-font)', fontSize: adlarBoyu(parcalar, 64, 13.5) }}
    >
      <span className="block">{ilk}</span>{' '}
      {ikinci ? (
        <>
          <span className={cn(ENINE, 'my-[0.3em] flex items-center')}>
            <motion.span
              aria-hidden="true"
              className={cn(KURDELE, 'block flex-1')}
              style={{ clipPath: SOL_KESIK, backgroundImage: KILCIZGI }}
              initial={{ x: ACILMA }}
              animate={{ x: hazir ? '0em' : ACILMA }}
              transition={gecis}
            />
            <motion.span
              className="block px-[0.36em] italic leading-none text-[#8C2F2F]"
              style={{ fontFamily: 'var(--kt-metin-font)', fontSize: '0.7em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: hazir ? 1 : 0 }}
              transition={gecis}
            >
              &amp;
            </motion.span>
            <motion.span
              aria-hidden="true"
              className={cn(KURDELE, 'block flex-1')}
              style={{ clipPath: SAG_KESIK, backgroundImage: KILCIZGI }}
              initial={{ x: `-${ACILMA}` }}
              animate={{ x: hazir ? '0em' : `-${ACILMA}` }}
              transition={gecis}
            />
          </span>{' '}
          <span className="block">{ikinci}</span>
        </>
      ) : (
        <span aria-hidden="true" className={cn(ENINE, KURDELE, 'mt-[0.4em] block')} style={{ backgroundImage: KILCIZGI }} />
      )}
    </h1>
  );
}
