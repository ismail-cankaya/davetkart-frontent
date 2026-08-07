import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Yıldız Haritası hero — davetin kendi gökyüzü.
 *
 * Aurora ve Krom'da gökyüzü atmosferdir: yayılan renk, uçuşan toz. Burada
 * gökyüzü bir VERİ nesnesine dönüşür — daire kadraj, derece taksimatı, yön
 * harfleri ve birbirine bağlanmış yıldızlardan oluşan bir harita.
 *
 * Yıldız dizilimi davetin İSMİ VE TARİHİNDEN türetilir: aynı davetiye her
 * açılışta aynı gökyüzünü, farklı davetiye farklı gökyüzünü gösterir. Bu
 * yüzden desen rastgele değil, davete ait.
 *
 * Bilinçli olarak YAPILMAYAN şey: sahte koordinat basmak. Gerçek enlem/boylam
 * verisi elimizde yok; "41.0082° K" gibi bir satır gerçek veri gibi
 * okunurdu. Halkadaki etiket bu yüzden tarihin kendisi.
 */

/** Küçük, tekrarlanabilir PRNG. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) >>> 0;
    let t = Math.imul(a ^ (a >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

/** Davetin kimliğinden (isim + tarih) sayısal tohum üretir. */
function hashSeed(input: string): number {
  return Math.abs(input.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 17)) || 1;
}

export interface YildizHeroProps extends HeroRenderProps {
  /** Yıldız ve çizgi rengi. */
  star?: string;
  /** Takımyıldız çizgilerinin rengi; verilmezse yıldız rengi. */
  line?: string;
}

export function YildizHero({ invitation, theme, flavor, star = '#ffffff', line }: YildizHeroProps) {
  const reduced = useReducedMotion();
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);
  const lineColor = line ?? star;

  const { stars, constellation, ticks } = React.useMemo(() => {
    const random = rng(hashSeed(`${invitation.names}|${invitation.date}`));

    // Yıldızlar birim daire İÇİNE serpilir: kare alana serpilseydi köşelerde
    // yığılma olur, kadrajın dairesel olduğu okunmazdı.
    const points = Array.from({ length: 84 }, () => {
      const angle = random() * Math.PI * 2;
      // sqrt: eşit alan dağılımı — yoksa merkez kalabalıklaşır.
      const radius = Math.sqrt(random()) * 41;
      return {
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        r: 0.25 + random() * 0.85,
        o: 0.3 + random() * 0.7
      };
    });

    // Takımyıldız: merkeze yakın 7 yıldız, açıya göre sıralanıp bağlanır.
    // Sıralanmasaydı çizgiler kendini keser, "takımyıldız" değil karalama
    // gibi görünürdü.
    const inner = points
      .map((p, i) => ({ ...p, i, d: Math.hypot(p.x - 50, p.y - 50) }))
      .filter((p) => p.d < 30)
      .slice(0, 7)
      .sort((a, b) => Math.atan2(a.y - 50, a.x - 50) - Math.atan2(b.y - 50, b.x - 50));

    const path = inner.length
      ? inner.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
      : '';

    // Derece taksimatı: her 5°'de bir çizgi, 90°'lerde uzun.
    const marks = Array.from({ length: 72 }, (_, i) => {
      const angle = (i / 72) * Math.PI * 2 - Math.PI / 2;
      const long = i % 18 === 0;
      const r0 = long ? 43.5 : 45;
      return {
        x1: 50 + Math.cos(angle) * r0,
        y1: 50 + Math.sin(angle) * r0,
        x2: 50 + Math.cos(angle) * 47,
        y2: 50 + Math.sin(angle) * 47,
        long
      };
    });

    return { stars: points, constellation: path, ticks: marks };
  }, [invitation.names, invitation.date]);

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-6 @sm:px-10 py-12 @sm:py-16 gap-7">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE_LUXE }}
        className="relative w-[min(74%,18rem)] @sm:w-[min(68%,20rem)] aspect-square"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
          {/* Kadraj halkası */}
          <circle cx="50" cy="50" r="47" fill="none" stroke={lineColor} strokeOpacity={0.25} strokeWidth={0.4} />
          <circle cx="50" cy="50" r="43" fill="none" stroke={lineColor} strokeOpacity={0.12} strokeWidth={0.3} />

          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={lineColor}
              strokeOpacity={t.long ? 0.45 : 0.2}
              strokeWidth={t.long ? 0.5 : 0.3}
            />
          ))}

          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={star} fillOpacity={s.o} />
          ))}

          {/* Takımyıldız kendini çizer — haritanın "okunma" anı. */}
          {constellation && (
            <motion.path
              d={constellation}
              fill="none"
              stroke={lineColor}
              strokeWidth={0.45}
              strokeOpacity={0.75}
              strokeLinecap="round"
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.4, ease: EASE_LUXE, delay: 0.6 }}
            />
          )}
        </svg>

        {/* Yön harfleri halkanın dışında, kadrajı harita yapan işaretler. */}
        {[
          { l: 'K', className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
          { l: 'D', className: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2' },
          { l: 'G', className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
          { l: 'B', className: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2' }
        ].map((dir) => (
          <span
            key={dir.l}
            className={cn('absolute text-[9px] font-semibold tracking-[0.2em]', theme.accent, dir.className)}
          >
            {dir.l}
          </span>
        ))}

        {/* Merkez süsü: haritanın odak noktası. */}
        <span className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', theme.accent)}>
          <Ornament size={22} />
        </span>
      </motion.div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.4 }}
          className={cn('text-[9px] font-semibold uppercase tracking-[0.4em]', theme.accent)}
        >
          {invitation.title}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE_LUXE, delay: 0.5 }}
          className={cn(
            'font-serif font-normal leading-[1.1] mt-3 text-[1.9rem] @sm:text-[2.4rem] break-words',
            theme.heading
          )}
        >
          {invitation.names || 'Davetlisiniz'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.65 }}
          className={cn('text-[12.5px] leading-relaxed font-light mt-4 max-w-[16rem]', theme.body)}
        >
          {invitation.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.78 }}
          className={cn('mt-6 flex flex-col items-center gap-1.5 pt-5 border-t w-full max-w-[15rem]', theme.border)}
        >
          <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)}>
            {formatDateStr(invitation.date)}
          </span>
          <span className={cn('text-[10px] uppercase tracking-[0.24em]', theme.body)}>{invitation.venue}</span>
        </motion.div>

        {invitation.showTimer && valid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.9 }}
            className="mt-5 flex items-baseline gap-4"
          >
            {[
              { v: days, l: 'gün' },
              { v: hours, l: 'saat' },
              { v: minutes, l: 'dk' }
            ].map((unit) => (
              <span key={unit.l} className="flex items-baseline gap-1">
                <span className={cn('font-serif tabular-nums text-lg', theme.heading)}>
                  {String(unit.v).padStart(2, '0')}
                </span>
                <span className={cn('text-[9px] uppercase tracking-[0.18em]', theme.body)}>{unit.l}</span>
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
