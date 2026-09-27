import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Wifi } from 'lucide-react';
import { CardBrandMark } from './CardBrandMark';
import { type CardBrand, formatExpiry, previewCardNumber } from '../../../utils/paymentCard';
import { duration, ease } from '../../../utils/motion';

interface CardPreviewProps {
  holderName: string;
  number: string;
  expiry: string;
  cvc: string;
  cvcLength: number;
  brand: CardBrand;
  /** Güvenlik kodu alanı odaktayken kart arka yüzünü gösterir. */
  flipped: boolean;
}

const faceClass = 'absolute inset-0 rounded-[1.4rem] overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]';

/**
 * Formun canlı kart önizlemesi: yazılan her hane yerine oturur, güvenlik
 * kodu alanına geçildiğinde kart döner.
 *
 * Yalnızca görseldir — değerleri form bileşeninden prop olarak alır, hiçbir
 * şey saklamaz. Dönüş `rotateY` bir transform olduğundan "hareketi azalt"
 * tercihinde Motion onu atlar ve yüz anında değişir (App.tsx `MotionConfig`).
 */
export function CardPreview({ holderName, number, expiry, cvc, cvcLength, brand, flipped }: CardPreviewProps) {
  const digits = previewCardNumber(number);
  const name = holderName.trim().toLocaleUpperCase('tr-TR');
  const expiryText = formatExpiry(expiry);

  return (
    <div className="w-full max-w-[22rem] mx-auto [perspective:1400px]" aria-hidden>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: duration.panel + 0.2, ease: ease.inOut }}
        className="relative w-full aspect-[1.586/1] [transform-style:preserve-3d]"
      >
        {/* ——— Ön yüz ——— */}
        <div className={`${faceClass} bg-gradient-to-br from-brand-deep via-brand to-brand-soft shadow-2xl shadow-brand/30`}>
          <div className="absolute -top-16 -right-10 w-56 h-56 bg-gold/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl" />
          {/* İnce gravür dokusu */}
          <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(135deg,#fff_0_1px,transparent_1px_9px)]" />

          <div className="relative h-full flex flex-col justify-between p-5 md:p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Çip */}
                <span className="relative w-10 h-7.5 rounded-md bg-gradient-to-br from-champagne via-gold to-[#9c7c3c] shadow-inner overflow-hidden">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
                  <span className="absolute inset-y-0 left-1/3 w-px bg-black/20" />
                  <span className="absolute inset-y-0 right-1/3 w-px bg-black/20" />
                </span>
                <Wifi size={18} className="rotate-90 text-white/60" />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={brand}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
                  exit={{ opacity: 0, y: 6, transition: { duration: duration.fast, ease: ease.in } }}
                  className="h-7 flex items-center"
                >
                  {brand === 'unknown' ? (
                    <span className="font-serif italic text-champagne/80 text-sm">Davetkart</span>
                  ) : (
                    <CardBrandMark brand={brand} variant="onCard" />
                  )}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="font-mono text-[1.15rem] md:text-[1.35rem] tracking-[0.12em] whitespace-nowrap drop-shadow-sm">
              {digits.split('').map((char, index) => (
                // Anahtar karakteri içerir: `•` bir haneye dönüştüğünde yeni
                // span doğar ve yerine süzülür; aynı kalan karakter kıpırdamaz.
                <motion.span
                  key={`${index}-${char}`}
                  initial={char === '•' || char === ' ' ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: char === '•' ? 0.45 : 1, y: 0 }}
                  transition={{ duration: duration.base, ease: ease.out }}
                  className="inline-block"
                >
                  {char === ' ' ? ' ' : char}
                </motion.span>
              ))}
            </p>

            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">Kart Sahibi</p>
                <p className="text-sm font-semibold tracking-wide truncate">{name || 'AD SOYAD'}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">Son Kul.</p>
                <p className="text-sm font-semibold font-mono tracking-wider">{expiryText || 'AA/YY'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ——— Arka yüz ——— */}
        <div className={`${faceClass} [transform:rotateY(180deg)] bg-gradient-to-br from-brand-soft via-brand to-brand-deep shadow-2xl shadow-brand/30`}>
          <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(45deg,#fff_0_1px,transparent_1px_9px)]" />
          <div className="relative h-full flex flex-col pt-6">
            <div className="h-11 bg-ink/90" />
            <div className="px-5 md:px-6 mt-5">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 text-right mb-1">Güvenlik Kodu</p>
              <div className="flex items-center h-10 rounded-md overflow-hidden">
                <div className="flex-1 h-full bg-[repeating-linear-gradient(90deg,#efe2c1_0_6px,#e4d4ac_6px_12px)]" />
                <div className="h-full min-w-16 px-3 bg-white flex items-center justify-center font-mono font-bold text-ink tracking-[0.2em]">
                  {cvc.padEnd(cvcLength, '•')}
                </div>
              </div>
            </div>
            <p className="mt-auto px-5 md:px-6 pb-5 text-[9px] leading-relaxed text-white/45">
              Kart bilgileriniz ve güvenlik kodunuz Davetkart sunucularında saklanmaz.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
