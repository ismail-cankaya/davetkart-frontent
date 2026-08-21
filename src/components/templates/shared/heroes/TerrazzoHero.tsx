import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Terrazzo hero — dokusunu bir görselden değil, DAĞILIMDAN alan dil.
 *
 * Mermer damarını taklit eder, Suluboya pigmenti yayar; ikisi de sürekli bir
 * yüzeydir. Terrazzo ise süreksizdir: kırık taş parçaları rastgele saçılır ve
 * güzellik parçaların kendisinde değil, aralarındaki boşluğun ritmindedir.
 * Bu yüzden buradaki çakıllar bir resim dosyası değil, tohumdan üretilen
 * deterministik bir saçılım — her şablon aynı tohumla her açılışta birebir
 * aynı desene sahip olur, ama iki kategori asla aynı görünmez.
 *
 * Çakıl biçimleri 8 değerli `border-radius` kısayoluyla kurulur: dört köşenin
 * yatay ve dikey yarıçapları ayrı ayrı sapınca daire, organik bir taşa döner.
 * SVG poligonuna göre çok daha ucuz ve gerçek çakıla daha yakın.
 */

/** Tohumdan türeyen hafif PRNG — render'lar arası desen sabit kalsın diye. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Chip {
  top: number;
  left: number;
  size: number;
  color: string;
  radius: string;
  rotate: number;
  drift: number;
  duration: number;
  delay: number;
}

function buildChips(colors: readonly string[], seed: number, count: number): Chip[] {
  const rand = mulberry32(seed);
  const chips: Chip[] = [];

  for (let i = 0; i < count; i += 1) {
    // Yarıçapların dördü de bağımsız sapar; simetri kırıldıkça taş "kırık"
    // görünür. 34–66 aralığı: daireden kopar ama tanınmaz hale gelmez.
    const r = () => 34 + Math.floor(rand() * 32);

    chips.push({
      top: rand() * 100,
      left: rand() * 100,
      // Küçük çakıllar çoğunlukta, iri olanlar seyrek: gerçek terrazzoda da
      // dağılım böyledir ve kalabalık hissi vermeden doku üretir.
      size: 8 + Math.floor(rand() * rand() * 46),
      color: colors[Math.floor(rand() * colors.length)],
      radius: `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`,
      rotate: rand() * 360,
      drift: 2 + rand() * 5,
      duration: 9 + rand() * 8,
      delay: rand() * 4
    });
  }

  return chips;
}

export interface TerrazzoHeroProps extends HeroRenderProps {
  /** Çakıl paleti — kategorinin renk kimliği buradan okunur. */
  chips?: readonly string[];
  /** Çakılların üzerine döküldüğü harç zemini. */
  slab?: string;
  /** Saçılım tohumu; kategoriler arasında deseni ayırmak için değiştirilir. */
  seed?: number;
  /** Çakıl sayısı — dar kadrajlarda kalabalık yapmasın diye ayarlanabilir. */
  density?: number;
}

export function TerrazzoHero({
  invitation,
  theme,
  flavor,
  chips = ['#c9a227', '#b04a5a', '#7d8c74', '#d9cfc0', '#2b2620'],
  slab = '#f6f2ec',
  seed = 7,
  density = 26
}: TerrazzoHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);

  const pebbles = React.useMemo(() => buildChips(chips, seed, density), [chips, seed, density]);

  const dateParts = formatDateStr(invitation.date).split(' ');

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 py-12 @sm:py-16">
      {/* Harç + çakıl katmanı. Kartın ARKASINDA durur; kart yarı saydam
          olduğu için taşlar camın altından hayal meyal okunur. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ background: slab }}>
        {pebbles.map((chip, i) => (
          <motion.span
            key={i}
            className="absolute block"
            style={{
              top: `${chip.top}%`,
              left: `${chip.left}%`,
              width: chip.size,
              height: chip.size * 0.86,
              background: chip.color,
              borderRadius: chip.radius,
              rotate: chip.rotate,
              opacity: 0.72
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 0.72,
              // Taş yüzmez; sadece ışık altında hafifçe kayar gibi görünür.
              y: [0, -chip.drift, 0]
            }}
            transition={{
              scale: { duration: 0.7, ease: EASE_LUXE, delay: i * 0.018 },
              opacity: { duration: 0.7, delay: i * 0.018 },
              y: { duration: chip.duration, ease: 'easeInOut', repeat: Infinity, delay: chip.delay }
            }}
          />
        ))}
      </div>

      <motion.article
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE_LUXE, delay: 0.15 }}
        className={cn(
          'relative w-full max-w-[21rem] @sm:max-w-sm rounded-[2.25rem] border px-6 @sm:px-8 py-9 @sm:py-11 text-center',
          theme.border,
          theme.surface
        )}
        style={{ boxShadow: '0 30px 60px -34px rgba(0,0,0,0.35)' }}
      >
        {/* Ornament kendi çakılının içinde: kategori simgesi de mozaiğin bir
            parçası gibi davranır. */}
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
          className="mx-auto flex items-center justify-center w-14 h-14 @sm:w-16 @sm:h-16"
          style={{
            background: chips[0],
            borderRadius: '52% 48% 44% 56% / 46% 54% 46% 54%',
            color: slab
          }}
        >
          <Ornament size={26} />
        </motion.span>

        <span className={cn('block mt-5 text-[9.5px] font-semibold uppercase tracking-[0.28em]', theme.body)}>
          {invitation.title || flavor.envelopeLabel}
        </span>

        <h1
          className={cn('font-serif font-normal leading-[1.08] mt-3 break-words', theme.heading)}
          style={{ fontSize: 'clamp(1.9rem, 10cqw, 3rem)' }}
        >
          {invitation.names || 'Davetlisiniz'}
        </h1>

        {/* Ayraç: çizgi yerine üç çakıl. Dilin kendi grameriyle konuşan bir
            bölme işareti. */}
        <span className="mt-5 flex items-center justify-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block"
              style={{
                width: i === 1 ? 12 : 7,
                height: i === 1 ? 10 : 6,
                background: chips[(i + 1) % chips.length],
                borderRadius: '58% 42% 46% 54% / 48% 56% 44% 52%'
              }}
            />
          ))}
        </span>

        {invitation.subtitle && (
          <p className={cn('text-[12px] @sm:text-[12.5px] font-light leading-relaxed mt-5 mx-auto max-w-[17rem]', theme.body)}>
            {invitation.subtitle}
          </p>
        )}

        <div className={cn('mt-6 pt-5 border-t space-y-2.5', theme.border)}>
          <p className={cn('font-serif italic text-[15px] @sm:text-base', theme.heading)}>
            {dateParts.slice(0, 3).join(' ')}
            {dateParts.length > 3 && <span className={theme.body}> · {dateParts.slice(-1)[0]}</span>}
          </p>
          <p className={cn('text-[11.5px] font-medium leading-snug', theme.body)}>{invitation.venue}</p>
        </div>

        {invitation.showTimer && valid && (
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {[
              { v: days, l: 'Gün' },
              { v: hours, l: 'Saat' },
              { v: minutes, l: 'Dakika' }
            ].map((unit, i) => (
              <motion.div
                key={unit.l}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_LUXE, delay: 0.6 + i * 0.08 }}
                className="py-2.5 px-1"
                style={{
                  background: `${chips[(i + 2) % chips.length]}22`,
                  borderRadius: '46% 54% 52% 48% / 54% 46% 54% 46%'
                }}
              >
                <span className={cn('block font-serif font-bold tabular-nums leading-none text-lg @sm:text-xl', theme.heading)}>
                  {String(unit.v).padStart(2, '0')}
                </span>
                <span className={cn('block mt-1 text-[7.5px] font-semibold uppercase tracking-[0.16em]', theme.body)}>
                  {unit.l}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.article>
    </section>
  );
}
