import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { PaperGrain } from '../effects';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Herbaryum hero — daveti bir DUYURU değil, bir KAYIT olarak kuran dil.
 *
 * Kağıt dili daveti henüz açılmamış bir zarf, Posta ise yolculuğunu tamamlamış
 * bir mektup yapar; ikisi de "şimdi"ye bakar. Herbaryum bambaşka bir zaman
 * kipindedir: bu sayfa, olayın ARŞİVLENMİŞ hâlidir. Bir tür preslenip föye
 * bantlanır, altına etiketi yazılır ve koleksiyona girer.
 *
 * Kompozisyonun merkezinde bu yüzden isim değil ÖRNEK vardır — kategori
 * ornament'i bir dalın ucunda preslenmiş gibi durur. İsim, etiket kartının
 * ilk satırı olarak, yani kayıt formunun bir alanı olarak görünür. Bant
 * şeritleri kasten eğridir: arşivde hiçbir şey milimetrik yapıştırılmaz.
 */

/** Föye bantlanmış şeffaf bant şeridi. */
function Tape({
  color,
  className,
  rotate,
  delay = 0
}: {
  color: string;
  className?: string;
  rotate: number;
  delay?: number;
}) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE_LUXE, delay }}
      className={cn('absolute block pointer-events-none', className)}
      style={{
        rotate,
        background: color,
        // Kenarlardaki dikey tırtık: bandın elle koparılmış ucu.
        backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 5px)`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)'
      }}
    />
  );
}

/** Preslenmiş dal: gövde + karşılıklı yapraklar, çizilerek belirir. */
function Sprig({ color, flip }: { color: string; flip?: boolean }) {
  // Yaprakların gövde üzerindeki konumu ve boyu; aşağıdan yukarı küçülür,
  // gerçek bir dalın büyüme ritmi böyledir.
  const leaves = [
    { t: 0.16, len: 20, tilt: 34 },
    { t: 0.34, len: 17, tilt: 30 },
    { t: 0.52, len: 14, tilt: 26 },
    { t: 0.7, len: 10, tilt: 22 }
  ];

  return (
    <svg
      viewBox="0 0 60 120"
      className="w-full h-full overflow-visible"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <motion.path
        d="M30 118 C 26 86, 32 54, 30 6"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.85"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: EASE_LUXE, delay: 0.3 }}
      />
      {leaves.map((leaf, i) => {
        const y = 118 - leaf.t * 112;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_LUXE, delay: 0.7 + i * 0.12 }}
            style={{ transformOrigin: `30px ${y}px` }}
          >
            {[1, -1].map((dir) => (
              <path
                key={dir}
                d={`M30 ${y} q ${dir * leaf.len * 0.6} ${-leaf.tilt * 0.35} ${dir * leaf.len} ${-leaf.tilt * 0.75} q ${-dir * leaf.len * 0.15} ${leaf.tilt * 0.55} ${-dir * leaf.len} ${leaf.tilt * 0.75} z`}
                fill={color}
                fillOpacity="0.5"
                stroke={color}
                strokeWidth="0.7"
                strokeOpacity="0.7"
              />
            ))}
          </motion.g>
        );
      })}
    </svg>
  );
}

export interface HerbaryumHeroProps extends HeroRenderProps {
  /** Föy (montaj kağıdı) rengi. */
  sheet?: string;
  /** Bant şeritlerinin rengi — yarı saydam olmalı. */
  tape?: string;
  /** Preslenmiş bitkinin mürekkebi. */
  specimen?: string;
  /** Etiket kartının zemini; föyden bir ton ayrılır. */
  label?: string;
  /** Kayıt numarası damgası. */
  accession?: string;
}

export function HerbaryumHero({
  invitation,
  theme,
  flavor,
  sheet = '#f7f3e8',
  tape = 'rgba(214,199,164,0.55)',
  specimen = '#6b7f5c',
  label = '#fffdf6',
  accession = 'No. 001'
}: HerbaryumHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours } = useCountdown(invitation.date);

  const dateParts = formatDateStr(invitation.date).split(' ');
  const dateText = dateParts.slice(0, 3).join(' ');
  const timeText = dateParts.length > 3 ? dateParts.slice(-1)[0] : '';

  const fields: Array<[string, string]> = [
    ['Tür', invitation.names || 'Davetlisiniz'],
    ['Tarih', timeText ? `${dateText} · ${timeText}` : dateText],
    ['Lokasyon', invitation.venue]
  ];

  if (invitation.showTimer && valid) {
    fields.push(['Kalan', `${days} gün ${String(hours).padStart(2, '0')} saat`]);
  }

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 py-12 @sm:py-16">
      <motion.article
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_LUXE }}
        className={cn('relative w-full max-w-[21rem] @sm:max-w-sm border px-6 @sm:px-8 pt-10 @sm:pt-12 pb-7', theme.border)}
        style={{ background: sheet, boxShadow: '0 24px 48px -30px rgba(0,0,0,0.4)' }}
      >
        <PaperGrain opacity={0.35} />

        {/* Dört köşe bandı — hepsi farklı açıda. */}
        <Tape color={tape} rotate={-38} className="-top-2 -left-5 w-20 h-6" delay={0.15} />
        <Tape color={tape} rotate={38} className="-top-2 -right-5 w-20 h-6" delay={0.22} />
        <Tape color={tape} rotate={40} className="-bottom-2 -left-5 w-16 h-5" delay={0.29} />
        <Tape color={tape} rotate={-40} className="-bottom-2 -right-5 w-16 h-5" delay={0.36} />

        {/* Kayıt damgası: föyün sağ üstünde, hafif eğik mürekkep kutusu. */}
        <motion.span
          initial={{ opacity: 0, scale: 1.3, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: -6 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.9 }}
          className="absolute top-3 right-4 px-2 py-1 border text-[7px] font-bold uppercase tracking-[0.18em]"
          style={{ borderColor: specimen, color: specimen, opacity: 0.8 }}
        >
          {accession}
        </motion.span>

        <header className="relative text-center">
          <span className={cn('block text-[8px] font-semibold uppercase tracking-[0.3em]', theme.body)}>
            Herbaryum · {flavor.envelopeLabel}
          </span>
        </header>

        {/* Örnek: iki dal arasında preslenmiş kategori simgesi. */}
        <div className="relative mt-5 flex items-end justify-center gap-1 h-32 @sm:h-36">
          <div className="w-10 @sm:w-12 h-full opacity-90">
            <Sprig color={specimen} />
          </div>

          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_LUXE, delay: 1 }}
            className="mb-8 @sm:mb-10"
            style={{ color: specimen }}
          >
            <Ornament size={40} />
          </motion.span>

          <div className="w-10 @sm:w-12 h-full opacity-90">
            <Sprig color={specimen} flip />
          </div>
        </div>

        {invitation.subtitle && (
          <p className={cn('relative text-[11.5px] font-light italic leading-relaxed mt-2 text-center mx-auto max-w-[17rem]', theme.body)}>
            {invitation.subtitle}
          </p>
        )}

        {/* Etiket kartı: föye sonradan yapıştırılmış kayıt formu. Eğikliği ve
            kendi bandı, onu sayfanın parçası değil ÜZERİNDEKİ bir nesne
            yapar — herbaryumun tanımlayıcı jesti. */}
        <motion.div
          initial={{ opacity: 0, y: 16, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -1.4 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.55 }}
          className="relative mt-6 border px-4 pt-4 pb-3"
          style={{ background: label, borderColor: `${specimen}55`, boxShadow: '0 8px 18px -12px rgba(0,0,0,0.4)' }}
        >
          <Tape color={tape} rotate={-6} className="-top-2.5 left-1/2 -translate-x-1/2 w-14 h-4" delay={0.8} />

          <dl className="relative">
            {fields.map(([name, value], i) => (
              <div
                key={name}
                className="flex items-baseline gap-3 py-1.5"
                style={{
                  borderBottom: i === fields.length - 1 ? 'none' : `1px dashed ${specimen}33`
                }}
              >
                <dt
                  className="w-14 shrink-0 text-[7px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: specimen }}
                >
                  {name}
                </dt>
                <dd
                  className={cn(
                    'min-w-0 break-words leading-snug',
                    i === 0 ? 'font-serif text-[15px] @sm:text-base' : 'text-[11px] font-medium',
                    theme.heading
                  )}
                >
                  {value || '—'}
                </dd>
              </div>
            ))}
          </dl>

          <span
            className="relative block mt-2 pt-2 text-[6.5px] font-semibold uppercase tracking-[0.24em] text-center opacity-60"
            style={{ borderTop: `1px solid ${specimen}33`, color: specimen }}
          >
            Koleksiyon · DavetKart Arşivi
          </span>
        </motion.div>
      </motion.article>
    </section>
  );
}
