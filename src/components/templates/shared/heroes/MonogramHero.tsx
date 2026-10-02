import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { displayText, formatDateStr } from '../../utils';
import { splitNames } from '../../../../utils/names';
import { HeroRenderProps } from '../InvitationComposition';
import { TemplateFlavor } from '../flavor';
import { useCountdown } from '../useCountdown';
import { PaperGrain } from '../effects';
import { ease } from '../../../../utils/motion';

/**
 * Varak Monogram hero — ince kırtasiyenin en eski imzası: arma.
 *
 * Kağıt & Mühür kartı BASAR (letterpress, mum mührü); bu dil kartı
 * KAPLAR: baş harfler varakla (sıcak folyo) yaldızlanır, ışık yüzeyde
 * gezince yalnızca varak parlar, kağıt sönük kalır. Çerçeve mürekkepsiz
 * kör kabartmadır (blind deboss) ve kartın kenarı boyalıdır (edge
 * painting) — ikisi de pahalı kartı ucuzundan ayıran, ama ilk bakışta
 * fark edilmeyen ayrıntılar.
 *
 * İç içe harf (interlace) gerçek bir glif birleştirmesi değildir: ikinci
 * harf, kağıt renginde kalın bir konturla birinci harfin ÜSTÜNE yazılır.
 * Kontur, kesiştikleri yerde birinci harfi keser ve ikinci harf onun
 * üzerinden geçiyormuş gibi okunur — gravürcülerin asırlık hilesi.
 */

/**
 * Armaya hangi harflerin gireceği kategoriye göre değişir: çiftte iki
 * ismin baş harfi; doğum günü ve mezuniyette yalnızca kişinin adı ve
 * soyadı (ikinci alan okul/ev sahibidir); baby shower'da bebeğin adı.
 */
type MonogramSource = 'both' | 'first' | 'second-or-first';

const MONOGRAM_SOURCE: Record<string, MonogramSource> = {
  dugun: 'both',
  kina: 'both',
  nisan: 'both',
  sunnet: 'both',
  parti: 'both',
  'dogum-gunu': 'first',
  mezuniyet: 'first',
  kurumsal: 'first',
  'baby-shower': 'second-or-first'
};

const initial = (word: string) => word.trim().charAt(0).toLocaleUpperCase('tr-TR');

/** Bir ismin baş harfleri: ilk ve son kelime ("Ayşe Nur Yılmaz" → "AY"). */
function personInitials(name: string): string[] {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  if (words.length === 1) return [initial(words[0])];
  return [initial(words[0]), initial(words[words.length - 1])];
}

export function monogramLetters(names: string, categoryId: string): string[] {
  const [first, second] = splitNames(names);
  const source = MONOGRAM_SOURCE[categoryId] ?? 'both';

  if (source === 'second-or-first' && second) return personInitials(second).slice(0, 1);
  if (source === 'both' && first && second) return [initial(first), initial(second)];
  return personInitials(first || second);
}

/** Armanın varak basılan bütün çizimi. Maske için siyah/beyaz da çizilir. */
function CrestArt({
  letters,
  ringText,
  textPathId,
  ink,
  solid,
  halo,
  revealed,
  Ornament
}: {
  letters: string[];
  ringText: string;
  textPathId: string;
  /** Varak dolgusu (gradyan) ya da maskede beyaz. */
  ink: string;
  /** Kategori süsünün düz rengi: süs `currentColor` çizer, gradyan alamaz. */
  solid: string;
  Ornament: TemplateFlavor['Ornament'];
  /** İç içe geçişte kesik açan kontur: kağıt rengi, maskede siyah. */
  halo: string;
  /** Giriş animasyonu yalnızca görünen kopyada oynar. */
  revealed: boolean;
}) {
  // Defne: alt yayda iki dal, uçları yukarı. Yapraklar dal boyunca küçülür.
  const leaves = Array.from({ length: 7 }, (_, i) => i);
  const branch = (side: 1 | -1) =>
    leaves.map((i) => {
      // Açı (derece): sağ dal 18°'den 82°'ye, sol dal ayna.
      const deg = 22 + i * 9.5;
      const a = ((side === 1 ? deg : 180 - deg) * Math.PI) / 180;
      const x = 100 + Math.cos(a) * 70;
      const y = 100 + Math.sin(a) * 70;
      // Yaprak dalın UCUNA bakar (dipte buluşan iki dal yukarı uzanır): sağ
      // dalda açı azalan, sol dalda artan yön. Teğetle 35° açı, biri dışa biri içe.
      const tangent = (Math.atan2(Math.cos(a), -Math.sin(a)) * 180) / Math.PI;
      const along = side === 1 ? tangent + 180 : tangent;
      const size = 1 - i * 0.06;
      return (
        <motion.g
          key={`${side}-${i}`}
          initial={revealed ? { opacity: 0, scale: 0.2 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: ease.out, delay: 1.3 - i * 0.08 }}
        >
          {[1, -1].map((dir) => (
            <ellipse
              key={dir}
              cx="0"
              cy="0"
              rx={6.4 * size}
              ry={2.3 * size}
              fill={ink}
              transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(along + dir * 35).toFixed(1)}) translate(${(5 * size).toFixed(2)} 0)`}
            />
          ))}
        </motion.g>
      );
    });

  const [a, b] = letters;
  const single = letters.length < 2;
  // Yazı üst yarım daireye (≈240 birim) sığmalı; uzadıkça önce aralık,
  // sonra punto daralır. Yarım daireyi aşan yazı kenarlardan aşağı akardı.
  const long = ringText.length > 24;
  const fontSize = long ? 7.6 : ringText.length > 18 ? 9.2 : 10.5;
  const tracking = long ? 1.6 : 3.4;

  return (
    <g>
      <circle cx="100" cy="100" r="93" fill="none" stroke={ink} strokeWidth="1.3" />
      <circle cx="100" cy="100" r="88" fill="none" stroke={ink} strokeWidth="0.5" />

      <text
        fill={ink}
        fontSize={fontSize}
        letterSpacing={tracking}
        textAnchor="middle"
        style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
      >
        <textPath href={`#${textPathId}`} startOffset="50%">
          {ringText}
        </textPath>
      </text>

      {/* Dallar: dipte buluşan iki yay, uçları ~20°'de. */}
      {['M100 170 A70 70 0 0 0 165.8 123.9', 'M100 170 A70 70 0 0 1 34.2 123.9'].map((d) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={ink}
          strokeWidth="0.9"
          strokeLinecap="round"
          initial={revealed ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: ease.out, delay: 0.6 }}
        />
      ))}
      {/* Dalların buluştuğu yerde küçük bir eşkenar dörtgen. */}
      <path d="M100 166 L103 170 L100 174 L97 170 Z" fill={ink} />
      {branch(1)}
      {branch(-1)}

      {letters.length === 0 ? (
        // Henüz isim yok (editörde ilk açılış): boş bir arma yerine kategori süsü.
        <g transform="translate(70 70)" style={{ color: solid }}>
          <Ornament size={60} />
        </g>
      ) : single ? (
        <text
          x="100"
          y="100"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize="78"
          fill={ink}
          style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontWeight: 500 }}
        >
          {a ?? ''}
        </text>
      ) : (
        <>
          <text
            x="84"
            y="92"
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="90"
            fill={ink}
            style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontWeight: 500 }}
          >
            {a}
          </text>
          {/* İkinci harf: kağıt renginde kontur birinciyi keserek üstten geçer. */}
          <text
            x="118"
            y="112"
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="80"
            fill={ink}
            stroke={halo}
            strokeWidth="6"
            paintOrder="stroke"
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 500 }}
          >
            {b}
          </text>
        </>
      )}
    </g>
  );
}

export interface MonogramHeroProps extends HeroRenderProps {
  /** Kart kağıdı. */
  paper?: string;
  /** Boyalı kenar rengi. */
  edge?: string;
  /** Varak gradyanının üç durağı: gölge, ana ton, parlak. */
  foil?: [string, string, string];
  /** Kör kabartma koyu kağıtta ters ışık ister. */
  stock?: 'light' | 'dark';
}

export function MonogramHero({
  invitation,
  theme,
  flavor,
  paper = '#f8f4ea',
  edge = '#8f6b2f',
  foil = ['#8a6a2a', '#c9a456', '#f3e2a6'],
  stock = 'light'
}: MonogramHeroProps) {
  // Sonsuz döngü açıkça korunur; MotionConfig'e güvenilmez (bkz. MermerHero).
  const reduced = useReducedMotion();
  const { valid, days, hours, minutes } = useCountdown(invitation.date, invitation.timezone);
  const uid = React.useId().replace(/:/g, '');
  const ids = {
    ring: `mono-ring-${uid}`,
    foil: `mono-foil-${uid}`,
    sheen: `mono-sheen-${uid}`,
    mask: `mono-mask-${uid}`
  };

  const names = invitation.names || '';
  const letters = monogramLetters(names, flavor.categoryId);
  // Halkada iki isim; kurum + etkinlik adı gibi çok uzun bir çift halkaya
  // sığmazsa yalnızca ilk kısım yazılır.
  const fullRing = (names || 'Davetlisiniz').replace(/\s*&\s*/g, ' · ');
  const ringText = (fullRing.length > 32 ? splitNames(names)[0] : fullRing).toLocaleUpperCase('tr-TR');
  const venue = displayText(invitation.venue);

  // Tarih kâğıt kırtasiyesindeki gibi rakamla: 14 · 11 · 2026.
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/.exec(invitation.date ?? '');
  const hasDate = Boolean(formatDateStr(invitation.date)) && dateMatch;
  const numericDate = dateMatch ? `${dateMatch[3]} · ${dateMatch[2]} · ${dateMatch[1]}` : '';
  const time = dateMatch?.[4] ?? '';

  const deboss =
    stock === 'light'
      ? 'inset 0 1px 1.5px rgba(0,0,0,0.16), 0 1px 0 rgba(255,255,255,0.75)'
      : 'inset 0 1px 1.5px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08)';

  return (
    <section className="relative flex-1 flex items-center justify-center px-6 @sm:px-8 py-12 @sm:py-16">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: ease.out }}
        className="relative w-full max-w-[20.5rem] @sm:max-w-sm rounded-[2px]"
        style={{
          background: paper,
          // Boyalı kenar: kartın kalınlığı, alt kenarda bir ton koyu görünür.
          boxShadow: `0 0 0 2px ${edge}, 0 3px 0 ${edge}, 0 30px 56px -28px rgba(0,0,0,0.5)`
        }}
      >
        <PaperGrain opacity={stock === 'light' ? 0.45 : 0.3} />

        {/* Kör kabartma çerçeve: mürekkepsiz, yalnızca gölgeyle var. */}
        <div className="absolute inset-[14px] rounded-[1px] pointer-events-none" style={{ boxShadow: deboss }} />

        <div className="relative px-8 @sm:px-10 pt-11 pb-10 flex flex-col items-center text-center">
          {/* Arma */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: ease.out, delay: 0.25 }}
            className="w-44 h-44 @sm:w-48 @sm:h-48"
            style={{ filter: `drop-shadow(0 1px 0 ${stock === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.5)'})` }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" role="img" aria-label={letters.join(' ')}>
              <defs>
                <path id={ids.ring} d="M 100 100 m -76 0 a 76 76 0 1 1 152 0" />
                <linearGradient id={ids.foil} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={foil[0]} />
                  <stop offset="38%" stopColor={foil[1]} />
                  <stop offset="52%" stopColor={foil[2]} />
                  <stop offset="68%" stopColor={foil[1]} />
                  <stop offset="100%" stopColor={foil[0]} />
                </linearGradient>
                <linearGradient id={ids.sheen} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#fff" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                {/* Işık yalnızca varağın olduğu yerde görünsün: arma kendi maskesidir. */}
                <mask id={ids.mask} maskUnits="userSpaceOnUse" x="-10" y="-10" width="220" height="220">
                  <CrestArt
                    letters={letters}
                    ringText={ringText}
                    textPathId={ids.ring}
                    ink="#fff"
                    solid="#fff"
                    halo="#000"
                    revealed={false}
                    Ornament={flavor.Ornament}
                  />
                </mask>
              </defs>

              <CrestArt
                letters={letters}
                ringText={ringText}
                textPathId={ids.ring}
                ink={`url(#${ids.foil})`}
                solid={foil[1]}
                halo={paper}
                revealed
                Ornament={flavor.Ornament}
              />

              {!reduced && (
                <g mask={`url(#${ids.mask})`}>
                  <motion.rect
                    y="-20"
                    width="70"
                    height="240"
                    fill={`url(#${ids.sheen})`}
                    initial={{ x: -110, rotate: 20 }}
                    animate={{ x: 260, rotate: 20 }}
                    transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 6, delay: 1.6 }}
                  />
                </g>
              )}
            </svg>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.75 }}
            className={cn('mt-6 text-[9px] font-semibold uppercase tracking-[0.4em]', theme.body)}
          >
            {invitation.title}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.9 }}
            className={cn('mt-3 leading-[1.15] text-[1.75rem] @sm:text-[2.1rem] break-words', theme.heading)}
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 500 }}
          >
            {invitation.names || 'Davetlisiniz'}
          </motion.h1>

          {invitation.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: ease.out, delay: 1.05 }}
              className={cn('mt-4 text-[12.5px] leading-[1.8] font-light max-w-[16rem]', theme.body)}
            >
              {invitation.subtitle}
            </motion.p>
          )}

          {(hasDate || venue) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: ease.out, delay: 1.2 }}
              className="mt-7 w-full flex flex-col items-center"
            >
              {hasDate && (
                <>
                  <span className="h-px w-16 mb-5" style={{ background: `linear-gradient(90deg, transparent, ${foil[1]}, transparent)` }} />
                  <span
                    className={cn('tabular-nums text-[1.35rem] @sm:text-2xl tracking-[0.08em]', theme.heading)}
                    style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 500 }}
                  >
                    {numericDate}
                  </span>
                  {time && (
                    <span className={cn('mt-1 text-[10px] font-medium uppercase tracking-[0.3em]', theme.body)}>Saat {time}</span>
                  )}
                </>
              )}
              {venue && (
                <span className={cn('mt-3 text-[10px] uppercase tracking-[0.26em] max-w-[16rem]', theme.body)}>{venue}</span>
              )}
            </motion.div>
          )}

          {invitation.showTimer && valid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: ease.out, delay: 1.4 }}
              className="mt-7 flex items-baseline gap-5"
            >
              {[
                { v: days, l: 'gün' },
                { v: hours, l: 'saat' },
                { v: minutes, l: 'dakika' }
              ].map((unit) => (
                <span key={unit.l} className="flex flex-col items-center">
                  <span
                    className={cn('tabular-nums text-xl leading-none', theme.heading)}
                    style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
                  >
                    {String(unit.v).padStart(2, '0')}
                  </span>
                  <span className={cn('mt-1 text-[8px] uppercase tracking-[0.24em]', theme.body)}>{unit.l}</span>
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.article>
    </section>
  );
}
