import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Vitray hero — ışığın ARKADAN geldiği kurşun camlı kemer.
 *
 * Mevcut dillerin hepsi ışığı önden kurar: Aurora'da renk lekeleri metnin
 * arkasında yüzer, Noir'da tek bir spot metni yalar. Vitray bunu tersine
 * çevirir — kompozisyonun kendisi bir pencere, renk ise camdan SÜZÜLEN ışık.
 * Bu yüzden paneller opak boya gibi değil, üst üste binen saydam mürekkepler
 * gibi davranır; arkalarındaki hale onları içeriden aydınlatır.
 *
 * Kemer `rounded-t-full` ile kurulur, SVG maskesiyle değil: kutu ne kadar
 * uzarsa uzasın tepe her zaman genişliğin yarısı yarıçapında kusursuz bir
 * yarım daire kalır. Uzun isimlerde kemer bozulmaz, yalnızca gövde uzar.
 */

/** Küçük, tekrarlanabilir PRNG — vitray deseni her açılışta aynı olsun diye. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) >>> 0;
    let t = Math.imul(a ^ (a >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

/** Kutupsal koordinattan kartezyene — gül pencerenin dilimleri için. */
function polar(cx: number, cy: number, r: number, angle: number): [number, number] {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

/** İki yarıçap ve iki açı arasındaki halka dilimi (gül pencere yaprağı). */
function wedge(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r0, a0);
  const [x1, y1] = polar(cx, cy, r1, a0);
  const [x2, y2] = polar(cx, cy, r1, a1);
  const [x3, y3] = polar(cx, cy, r0, a1);
  return (
    `M${x0.toFixed(2)} ${y0.toFixed(2)} L${x1.toFixed(2)} ${y1.toFixed(2)} ` +
    `A${r1} ${r1} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} ` +
    `L${x3.toFixed(2)} ${y3.toFixed(2)} ` +
    `A${r0} ${r0} 0 0 0 ${x0.toFixed(2)} ${y0.toFixed(2)} Z`
  );
}

interface GlassProps {
  /** Üç cam mürekkebi — kategori kimliğini taşıyan tek parametre. */
  colors: readonly [string, string, string];
  /** Kurşun (lead) çizgilerinin rengi. */
  lead: string;
  seed: number;
}

/**
 * Gövde camı — baklava (lozenge) örgüsü.
 *
 * Kare ızgara kullanılmadı: gerçek vitrayda paneller şaşırtmalı dizilir,
 * kare ızgara ekran kağıdı gibi okunur. Tek sıra kaydırma bile deseni el
 * işi tarafına çeker.
 *
 * Kurşun çizgileri `vector-effect="non-scaling-stroke"` taşır — SVG dikeyde
 * gerildiğinde çizgi kalınlığı sabit kalır; yoksa yatay kurşunlar
 * dikeylerden kalın görünürdü.
 */
function LatticeGlass({ colors, lead, seed }: GlassProps) {
  const random = rng(seed);
  const cols = 5;
  const rows = 8;
  const w = 100 / cols;
  const h = 100 / rows;

  const panes: { d: string; fill: string; opacity: number }[] = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const cx = c * w + (r % 2 ? w / 2 : 0);
      const cy = r * h;
      const fill = colors[Math.floor(random() * colors.length)];
      // Aşağı indikçe sönümlenen opaklık: ışık tepeden girer, dibe kadar
      // inmez. Metin gövdenin alt yarısında oturduğu için okunabilirlik
      // desenin kendisinden gelir; ayrıca bir kutu çizmeye gerek kalmaz.
      const falloff = 1 - (r / rows) * 0.55;
      panes.push({
        d:
          `M${cx.toFixed(2)} ${(cy - h / 2).toFixed(2)} ` +
          `L${(cx + w / 2).toFixed(2)} ${cy.toFixed(2)} ` +
          `L${cx.toFixed(2)} ${(cy + h / 2).toFixed(2)} ` +
          `L${(cx - w / 2).toFixed(2)} ${cy.toFixed(2)} Z`,
        fill,
        opacity: (0.2 + random() * 0.5) * falloff
      });
    }
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
    >
      {panes.map((pane, i) => (
        <path
          key={i}
          d={pane.d}
          fill={pane.fill}
          fillOpacity={pane.opacity}
          stroke={lead}
          strokeWidth={1.1}
          strokeOpacity={0.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/**
 * Gül pencere — kemerin tepesindeki dairesel odak.
 *
 * Ayrı ve KARE bir SVG'de çizilir; gövde camı gibi gerilseydi daire elipse
 * dönerdi. "Bu bir pencere" sinyalini taşıyan asıl öğe budur, geometrisi
 * bozulamaz.
 */
function RoseWindow({ colors, lead, seed }: GlassProps) {
  const random = rng(seed + 101);
  const petals = 12;
  const step = (Math.PI * 2) / petals;

  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
      <circle cx="50" cy="50" r="46" fill={colors[2]} fillOpacity={0.16} />

      {/* Dış taç yaprakları */}
      {Array.from({ length: petals }, (_, i) => (
        <path
          key={`outer-${i}`}
          d={wedge(50, 50, 26, 46, i * step, (i + 1) * step)}
          fill={colors[i % colors.length]}
          fillOpacity={0.3 + random() * 0.4}
          stroke={lead}
          strokeWidth={1.2}
          strokeOpacity={0.55}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* İç halka — dış yaprakların yarısı sayıda ve yarım adım kaymış.
          Kaymasaydı radyal kurşunlar üst üste biner, pencere tekerlek gibi
          okunurdu. */}
      {Array.from({ length: petals / 2 }, (_, i) => (
        <path
          key={`inner-${i}`}
          d={wedge(50, 50, 11, 26, i * step * 2 + step / 2, (i + 1) * step * 2 + step / 2)}
          fill={colors[(i + 1) % colors.length]}
          fillOpacity={0.35 + random() * 0.35}
          stroke={lead}
          strokeWidth={1.2}
          strokeOpacity={0.55}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Göbek: pencerenin en parlak noktası, arkadaki halenin çıkış deliği. */}
      <circle cx="50" cy="50" r="11" fill={colors[1]} fillOpacity={0.85} />
      <circle
        cx="50"
        cy="50"
        r="11"
        fill="none"
        stroke={lead}
        strokeWidth={1.4}
        strokeOpacity={0.6}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export interface VitrayHeroProps extends HeroRenderProps {
  /** Üç cam mürekkebi; kategori kimliği bu üçlüyle kurulur. */
  glass?: readonly [string, string, string];
  /** Kurşun çizgi rengi — koyu temada neredeyse siyah, açıkta sıcak gri. */
  lead?: string;
  /** Camın arkasından vuran ışığın rengi; verilmezse ikinci cam rengi. */
  glow?: string;
  /** Desen tohumu: aynı dilin iki kategorisi aynı deseni tekrarlamasın. */
  seed?: number;
}

export function VitrayHero({
  invitation,
  theme,
  flavor,
  glass = ['#d98fa0', '#e8c88a', '#8f7fc4'],
  lead,
  glow,
  seed = 31
}: VitrayHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);
  const dark = theme.id === 'midnight';
  const leadColor = lead ?? (dark ? '#0a0810' : '#4a4038');
  const glowColor = glow ?? glass[1];

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 py-12 @sm:py-16">
      {/* Arkadan gelen ışık: pencerenin var olma sebebi. Kemerin ARDINDA
          durduğu için camdan taşan kısmı duvara vuran leke gibi okunur. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_LUXE }}
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[88%] max-w-md aspect-square rounded-full blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glowColor}55, transparent 68%)` }}
      />

      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE_LUXE }}
        className="relative w-full max-w-[21rem] @sm:max-w-[23rem] rounded-t-full rounded-b-xl overflow-hidden border-2"
        style={{
          borderColor: leadColor,
          boxShadow: dark
            ? `0 0 60px -12px ${glowColor}66, 0 22px 44px -20px rgba(0,0,0,0.75)`
            : `0 0 50px -14px ${glowColor}55, 0 20px 40px -22px rgba(60,42,28,0.4)`
        }}
      >
        <LatticeGlass colors={glass} lead={leadColor} seed={seed} />

        {/* Gül pencere kemerin tepesine oturur: genişliğin %62'si çapında,
            üstten %4 boşlukla — yarım dairenin merkezine denk gelir. */}
        <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-[62%] aspect-square pointer-events-none">
          <RoseWindow colors={glass} lead={leadColor} seed={seed} />
        </div>

        {/* Okunabilirlik: cam alta doğru koyulaşır. Metnin arkasına ayrı bir
            kutu koymak vitray etkisini öldürürdü; bunun yerine ışığın doğal
            sönümü kullanılıyor. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: dark
              ? 'linear-gradient(to top, rgba(6,5,10,0.93) 18%, rgba(6,5,10,0.58) 52%, rgba(6,5,10,0) 78%)'
              : 'linear-gradient(to top, rgba(255,253,248,0.95) 18%, rgba(255,253,248,0.62) 52%, rgba(255,253,248,0) 78%)'
          }}
        />

        {/* Işık süpürmesi — bulut geçen bir öğle sonrası. Tek yönlü ve çok
            yavaş; hızlandırılsa "parlama efekti" ucuzluğuna düşerdi. */}
        <motion.div
          aria-hidden="true"
          initial={{ x: '-70%' }}
          animate={{ x: '170%' }}
          transition={{ duration: 13, ease: 'linear', repeat: Infinity, repeatDelay: 4 }}
          className="absolute inset-y-0 w-1/3 pointer-events-none"
          style={{
            background: `linear-gradient(100deg, transparent, ${glowColor}40, transparent)`,
            mixBlendMode: dark ? 'screen' : 'multiply'
          }}
        />

        <div className="relative px-7 @sm:px-9 pt-[58%] pb-9 @sm:pb-11 flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.5 }}
            className={cn('text-[9px] font-semibold uppercase tracking-[0.4em]', theme.accent)}
          >
            {invitation.title}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE_LUXE, delay: 0.62 }}
            className={cn(
              'font-serif font-normal leading-[1.08] mt-3.5 text-[1.75rem] @sm:text-[2.3rem] break-words',
              theme.heading
            )}
          >
            {invitation.names || 'Davetlisiniz'}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.8 }}
            className={cn('my-4', theme.accent)}
          >
            <Ornament size={24} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 0.9 }}
            className={cn('text-[12.5px] leading-relaxed font-light max-w-[15rem]', theme.body)}
          >
            {invitation.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_LUXE, delay: 1.02 }}
            className="mt-6 flex flex-col items-center gap-1.5"
          >
            <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)}>
              {formatDateStr(invitation.date)}
            </span>
            <span className={cn('text-[10px] uppercase tracking-[0.24em]', theme.body)}>
              {invitation.venue}
            </span>
          </motion.div>

          {/* Sayaç pencerenin "denizliği": kemerin dibinde yatay bir şerit.
              Rakamlar tabular-nums ile sabit genişlikte, dakika değişince
              şerit oynamaz. */}
          {invitation.showTimer && valid && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE_LUXE, delay: 1.15 }}
              className={cn(
                'mt-7 w-full flex items-center justify-center gap-5 py-2.5 rounded-md border',
                theme.border,
                theme.surface
              )}
            >
              {[
                { v: days, l: 'Gün' },
                { v: hours, l: 'Saat' },
                { v: minutes, l: 'Dakika' }
              ].map((unit) => (
                <span key={unit.l} className="flex flex-col items-center leading-none">
                  <span className={cn('font-serif text-base @sm:text-lg tabular-nums', theme.heading)}>
                    {String(unit.v).padStart(2, '0')}
                  </span>
                  <span className={cn('text-[8px] uppercase tracking-[0.18em] mt-1', theme.body)}>
                    {unit.l}
                  </span>
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.article>
    </section>
  );
}
