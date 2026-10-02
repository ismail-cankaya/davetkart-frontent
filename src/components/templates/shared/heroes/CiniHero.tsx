import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { displayText, formatDateStr } from '../../utils';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';
import { ease } from '../../../../utils/motion';

/**
 * Çini hero — davetiye bir sayfa değil, duvara döşenmiş bir PANO.
 *
 * Arkada karo duvar, önde sivri kemerli bir niş: Rüstem Paşa'nın ya da
 * Topkapı'nın duvarlarındaki çini panoların kuruluşu. Projedeki diğer
 * malzeme dilleri (Kağıt, Mermer, Terrazzo) yüzeyi TEK parça kurar; çininin
 * tanımlayıcı özelliği ise TEKRARDIR. Duvardaki her karo aynı çizimi taşır
 * ama komşusunun aynasıdır — dört karo bir araya gelince köşelerde tam
 * madalyonlar, ortada sivri kafesli (ogival) bir ağ belirir. Desen hiçbir
 * karoda tek başına yoktur; ancak döşendiğinde var olur.
 *
 * Nişin içindeki buket (vazodan çıkan lale, karanfil, sümbül ve saz yaprağı)
 * İznik'in klasik "dört çiçek" repertuvarıdır. Saplar çizilerek, çiçekler
 * tabanlarından açılarak belirir: fırça önce hattı, sonra boyayı koyar.
 *
 * Renk rolleri sabit, değerleri şablonun: `cobalt` ana hat ve zemin, `turquoise`
 * ikincil sır, `coral` İznik'in kabarık mercan kırmızısı, `leaf` yaprak.
 * Koyu bir temada (Parti) "kobalt" rolüne altın verilir; rol adları rengi
 * değil, desendeki GÖREVİ anlatır.
 */

/** Tek bir karonun çizimi (100×100). Komşu karolar bunun aynasıdır. */
function TileArt({
  glaze,
  cobalt,
  turquoise,
  coral,
  leaf
}: {
  glaze: string;
  cobalt: string;
  turquoise: string;
  coral: string;
  leaf: string;
}) {
  /** Ağın göz merkezine düşen madalyonun çeyreği; dördü bir madalyon kurar. */
  const medallion = (cx: number, cy: number) => (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r="30" fill={cobalt} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * 30} cy={Math.sin(a) * 30} r="7" fill={cobalt} />;
      })}
      <circle r="20" fill={glaze} />
      <circle r="17" fill={turquoise} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        return <circle key={i} cx={Math.cos(a) * 11} cy={Math.sin(a) * 11} r="3.4" fill={glaze} />;
      })}
      <circle r="6" fill={coral} />
    </g>
  );

  /** Dalların kesiştiği düğüm. */
  const knot = (cx: number, cy: number) => (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r="13" fill="none" stroke={cobalt} strokeWidth="2" />
      <circle r="8.5" fill={coral} stroke={glaze} strokeWidth="2" />
    </g>
  );

  return (
    <>
      <rect width="100" height="100" fill={glaze} />
      <path d="M0 0 C38 14 62 86 100 100" fill="none" stroke={cobalt} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M50 50 C54 40 60 34 70 30 C66 40 60 46 50 50 Z" fill={leaf} />
      <path d="M50 50 C46 60 40 66 30 70 C34 60 40 54 50 50 Z" fill={leaf} />
      {medallion(100, 0)}
      {medallion(0, 100)}
      {knot(0, 0)}
      {knot(100, 100)}
    </>
  );
}

/**
 * Karo duvar. Desen tek bir SVG `<pattern>` olarak döşenir — 60 ayrı karo
 * düğümü yerine tarayıcının bir kez boyayıp tekrarladığı tek bir dolgu.
 * Desen hücresi 2×2 karodur: sağdaki yatay, alttaki dikey, çaprazdaki iki
 * yönde ayna. Derz, karolar arasında bırakılan 1 px'lik boşluktur.
 */
function TileWall({
  size,
  grout,
  gloss,
  ...colors
}: {
  size: number;
  grout: string;
  /** Sırın parlaklığı; koyu sırda düşük tutulur, yoksa karolar puslu görünür. */
  gloss: number;
  glaze: string;
  cobalt: string;
  turquoise: string;
  coral: string;
  leaf: string;
}) {
  const uid = React.useId().replace(/:/g, '');
  const tileId = `cini-tile-${uid}`;
  const clipId = `cini-clip-${uid}`;
  const patternId = `cini-wall-${uid}`;
  const sheenId = `cini-sheen-${uid}`;

  const s = (size - 1) / 100;
  const far = size * 2 - 0.5;
  // Işık her karoya aynı yönden düşer — ayna yalnızca çizime uygulanır,
  // sırın parlamasına değil; aksi hâlde komşu karolar zıt yönden aydınlanırdı.
  const cells = [
    { x: 0, y: 0 },
    { x: size, y: 0 },
    { x: 0, y: size },
    { x: size, y: size }
  ];

  return (
    <svg aria-hidden="true" className="absolute inset-0 w-full h-full">
      <defs>
        <clipPath id={clipId}>
          <rect width="100" height="100" />
        </clipPath>
        <g id={tileId} clipPath={`url(#${clipId})`}>
          <TileArt {...colors} />
        </g>
        <radialGradient id={sheenId} cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={gloss} />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <pattern id={patternId} width={size * 2} height={size * 2} patternUnits="userSpaceOnUse">
          <rect width={size * 2} height={size * 2} fill={grout} />
          <use href={`#${tileId}`} transform={`translate(0.5 0.5) scale(${s})`} />
          <use href={`#${tileId}`} transform={`translate(${far} 0.5) scale(${-s} ${s})`} />
          <use href={`#${tileId}`} transform={`translate(0.5 ${far}) scale(${s} ${-s})`} />
          <use href={`#${tileId}`} transform={`translate(${far} ${far}) scale(${-s} ${-s})`} />
          {cells.map((c) => (
            <rect
              key={`${c.x}-${c.y}`}
              x={c.x + 0.5}
              y={c.y + 0.5}
              width={size - 1}
              height={size - 1}
              fill={`url(#${sheenId})`}
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/** Nişin içindeki buket: vazo, lale, iki karanfil, iki sümbül, iki saz yaprağı. */
function Bouquet({
  glaze,
  cobalt,
  turquoise,
  coral,
  leaf
}: {
  glaze: string;
  cobalt: string;
  turquoise: string;
  coral: string;
  leaf: string;
}) {
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { duration: 0.9, ease: ease.out, delay }, opacity: { duration: 0.2, delay } }
  });

  /** Tabanından açılan çiçek: SVG'de motion orijini çizimin kendi kutusuna göredir. */
  const bloom = (delay: number) => ({
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, ease: ease.out, delay },
    style: { originX: 0.5, originY: 1 }
  });

  // Sağ yarı, sol yarının yatay aynası: buketin simetrisi çininin kendi kuralıdır.
  const half = (mirror: boolean) => (
    <g transform={mirror ? 'matrix(-1 0 0 1 200 0)' : undefined}>
      {/* Saz yaprağı: ucu kıvrılan uzun yaprak, ortasında sırla ayrılmış damar. */}
      <motion.g
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: ease.out, delay: 0.95 }}
        style={{ originX: 1, originY: 0.5 }}
      >
        <path
          d="M98 100 C80 88 56 84 38 92 C33 94 31 99 34 102 C35 98 38 96 42 96 C60 92 78 96 98 102 Z"
          fill={leaf}
        />
        <path d="M96 100 C80 92 60 89 42 94" fill="none" stroke={glaze} strokeWidth="0.6" strokeOpacity="0.7" />
      </motion.g>
      {/* Orta sapın yaprağı */}
      <motion.path
        d="M100 82 C95 78 91 74 90 68 C95 71 98 76 100 82 Z"
        fill={leaf}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: ease.out, delay: 1.05 }}
        style={{ originX: 1, originY: 1 }}
      />
      {/* Sümbül sapı ve çanakları */}
      <motion.path d="M100 98 C97 84 91 70 87 56" fill="none" stroke={leaf} strokeWidth="1.3" strokeLinecap="round" {...draw(0.75)} />
      <motion.g {...bloom(1.45)}>
        {[
          [87, 50, 2.6],
          [84, 55, 2.3],
          [89.6, 56, 2.3],
          [85, 61, 2.1],
          [90, 62, 2]
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={cobalt} />
        ))}
      </motion.g>
      {/* Karanfil sapı ve çiçeği */}
      <motion.path d="M100 98 C93 88 79 82 71 72" fill="none" stroke={leaf} strokeWidth="1.4" strokeLinecap="round" {...draw(0.7)} />
      {/* Karanfil: tırtıklı yelpaze; lalenin kadehinden ayrılsın diye geniş açılır. */}
      <g transform="translate(66 64) rotate(-34)">
        <motion.g {...bloom(1.3)}>
          <path d="M-2.6 0 C-3 4 -1.5 8 0 9 C1.5 8 3 4 2.6 0 Z" fill={leaf} />
          <path
            d="M-2.6 0 C-8 -3 -12 -9 -12 -15 L-9 -13.5 L-8 -17.5 L-5 -15 L-3 -19.5 L0 -16 L3 -19.5 L5 -15 L8 -17.5 L9 -13.5 L12 -15 C12 -9 8 -3 2.6 0 Z"
            fill={coral}
            stroke={glaze}
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          <path d="M0 -1 L-6 -13 M0 -1 L0 -15 M0 -1 L6 -13" stroke={glaze} strokeWidth="0.7" strokeLinecap="round" />
        </motion.g>
      </g>
      {/* Boşlukta süzülen küçük hatayi */}
      <motion.g
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: ease.out, delay: 1.6 }}
      >
        <g transform="translate(56 40)">
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 4} cy={Math.sin(a) * 4} r="2.6" fill={turquoise} />;
          })}
          <circle r="2.4" fill={coral} />
        </g>
      </motion.g>
    </g>
  );

  return (
    <g>
      {half(false)}
      {half(true)}

      {/* Lale: ortada, en uzun sapta — buketin ekseni. */}
      <motion.path d="M100 98 C100 82 100 66 100 50" fill="none" stroke={leaf} strokeWidth="1.5" strokeLinecap="round" {...draw(0.6)} />
      <motion.g {...bloom(1.15)}>
        <path d="M100 50 C91 49 86 40 88 30 C92 37 96 43 100 50 Z" fill={coral} stroke={glaze} strokeWidth="0.6" />
        <path d="M100 50 C109 49 114 40 112 30 C108 37 104 43 100 50 Z" fill={coral} stroke={glaze} strokeWidth="0.6" />
        <path d="M100 24 C95 31 95 43 100 50 C105 43 105 31 100 24 Z" fill={coral} stroke={glaze} strokeWidth="0.6" />
      </motion.g>

      {/* Vazo: buketin tek dayanağı, en önce gelir. */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.out, delay: 0.4 }}
      >
        <path
          d="M91 118 C88 112 90 106 95 103 C93 101 94 98 96 98 H104 C106 98 107 101 105 103 C110 106 112 112 109 118 Z"
          fill={cobalt}
        />
        <path d="M92.6 110 H107.4" stroke={turquoise} strokeWidth="2" />
      </motion.g>
    </g>
  );
}

/** Sivri kemerli niş: kemer içi sırlı zemin, köşelikler kobalt, altta sövesi. */
function Niche(colors: { glaze: string; cobalt: string; turquoise: string; coral: string; leaf: string }) {
  const { glaze, cobalt, turquoise, coral } = colors;
  const arch = 'M22 118 V70 C22 42 58 22 100 8 C142 22 178 42 178 70 V118';

  return (
    <svg viewBox="0 0 200 124" className="block w-full h-auto" aria-hidden="true">
      {/* Köşelikler: dikdörtgenden kemer çıkarılır (evenodd). */}
      <path d={`M0 0 H200 V118 H0 Z ${arch} Z`} fill={cobalt} fillRule="evenodd" />
      {[
        [11, 12],
        [189, 12],
        [11, 60],
        [189, 60]
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
          {Array.from({ length: 5 }, (_, i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={Math.cos(a) * 3.2} cy={Math.sin(a) * 3.2} r="1.9" fill={glaze} />;
          })}
          <circle r="1.5" fill={coral} />
        </g>
      ))}
      {/* Kemer içindeki ince mercan hat: nişin derinliği. */}
      <path d="M28 118 V71 C28 45 62 27 100 14 C138 27 172 45 172 71 V118" fill="none" stroke={coral} strokeWidth="0.9" />
      <path d={arch} fill="none" stroke={turquoise} strokeWidth="1.6" />
      <Bouquet {...colors} />
      {/* Söve: vazonun oturduğu taban bandı. */}
      <rect x="0" y="118" width="200" height="6" fill={cobalt} />
      <rect x="0" y="116.6" width="200" height="1.4" fill={turquoise} />
    </svg>
  );
}

export interface CiniHeroProps extends HeroRenderProps {
  /** Sır: karonun beyaz zemini. */
  glaze?: string;
  /** Ana hat ve köşelik zemini. */
  cobalt?: string;
  /** İkincil sır rengi. */
  turquoise?: string;
  /** Kabarık mercan kırmızısı — çiçekler ve düğümler. */
  coral?: string;
  /** Yaprak ve sap. */
  leaf?: string;
  /** Karolar arasındaki derz. */
  grout?: string;
  /** Duvardaki karonun ekran boyu (px). */
  tileSize?: number;
}

export function CiniHero({
  invitation,
  theme,
  flavor,
  glaze = '#fbf9f3',
  cobalt = '#1d3f8f',
  turquoise = '#1f9aa5',
  coral = '#c8412f',
  leaf = '#3d7a4a',
  grout = '#e4ddcc',
  tileSize = 64
}: CiniHeroProps) {
  // Sonsuz döngü açıkça korunur; MotionConfig'e güvenilmez (bkz. MermerHero).
  const reduced = useReducedMotion();
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date, invitation.timezone);
  const dateLabel = formatDateStr(invitation.date);
  const venue = displayText(invitation.venue);
  const colors = { glaze, cobalt, turquoise, coral, leaf };

  const names = invitation.names || 'Davetlisiniz';
  const nameParts = names.split(/\s*&\s*/);
  // Koyu sırda beyaz parlama sis gibi okunur; ışık orada çok daha sönük.
  const dark = theme.id === 'midnight';

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 py-12 @sm:py-16">
      {/* Karo duvar: pano duvara döşenmiş gibi dursun diye tüm hero'yu kaplar. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: ease.out }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 78%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 78%, transparent)'
        }}
      >
        <TileWall size={tileSize} grout={grout} gloss={dark ? 0.08 : 0.32} {...colors} />
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: ease.out, delay: 0.15 }}
        className="relative w-full max-w-[21rem] @sm:max-w-sm p-[9px] rounded-[3px]"
        style={{
          // Bordür: kobalt bant üzerinde sırlı inci dizisi.
          background: cobalt,
          backgroundImage: `radial-gradient(circle, ${glaze} 1.25px, transparent 1.6px)`,
          backgroundSize: '9px 9px',
          backgroundPosition: '4.5px 4.5px',
          boxShadow: `0 0 0 1px ${coral}, 0 0 0 3px ${grout}, 0 28px 56px -26px rgba(0,0,0,0.55)`
        }}
      >
        {/* Bordürün dört köşesindeki mercan göbekler. */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={cn('absolute w-[9px] h-[9px] rounded-full', pos)}
            style={{ background: coral, boxShadow: `0 0 0 1.5px ${glaze}` }}
          />
        ))}

        <div
          className="relative overflow-hidden rounded-[1px]"
          style={{ background: glaze, boxShadow: `inset 0 0 0 1px ${turquoise}` }}
        >
          <Niche {...colors} />

          {/* Sır parlaması: sırlı yüzeyde ara ara gezen ışık. */}
          <motion.div
            aria-hidden="true"
            initial={{ x: '-120%' }}
            animate={reduced ? undefined : { x: '260%' }}
            transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity, repeatDelay: 9, delay: 2.4 }}
            className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
            style={{ background: `linear-gradient(100deg, transparent, rgba(255,255,255,${dark ? 0.1 : 0.45}), transparent)` }}
          />

          <div className="relative px-7 @sm:px-9 pt-6 pb-8 flex flex-col items-center text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: ease.out, delay: 0.9 }}
              className="text-[9px] font-semibold uppercase tracking-[0.38em]"
              style={{ color: cobalt }}
            >
              {invitation.title}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: ease.out, delay: 1.05 }}
              className={cn('font-serif font-normal leading-[1.1] mt-3 text-[1.85rem] @sm:text-[2.3rem] break-words', theme.heading)}
            >
              {nameParts.map((part, i) => (
                <React.Fragment key={i}>
                  {/* Boşluklar gerçek karakter olmalı: margin satır kırılımı açmaz,
                      uzun bir isim çifti (kurumsal) kartın dışına taşardı. */}
                  {i > 0 && (
                    <>
                      {' '}
                      <span className="italic" style={{ color: coral }}>
                        &amp;
                      </span>{' '}
                    </>
                  )}
                  {part}
                </React.Fragment>
              ))}
            </motion.h1>

            {/* Ara süs: iki kobalt hat arasında kategori simgesi. */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, ease: ease.out, delay: 1.25 }}
              className="flex items-center gap-3 my-5"
            >
              <span className="h-px w-12" style={{ background: cobalt, opacity: 0.45 }} />
              <span style={{ color: coral }}>
                <Ornament size={18} />
              </span>
              <span className="h-px w-12" style={{ background: cobalt, opacity: 0.45 }} />
            </motion.div>

            {invitation.subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: ease.out, delay: 1.35 }}
                className={cn('text-[12.5px] leading-[1.8] font-light max-w-[16rem]', theme.body)}
              >
                {invitation.subtitle}
              </motion.p>
            )}

            {(dateLabel || venue) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: ease.out, delay: 1.5 }}
                className="mt-6 flex flex-col items-center gap-1.5"
              >
                {dateLabel && <span className={cn('font-serif italic text-lg @sm:text-xl', theme.heading)}>{dateLabel}</span>}
                {venue && (
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em]" style={{ color: cobalt }}>
                    {venue}
                  </span>
                )}
              </motion.div>
            )}

            {/* Geri sayım: her birim kendi karosunda. */}
            {invitation.showTimer && valid && (
              <div className="mt-7 flex items-center gap-2.5">
                {[
                  { v: days, l: 'Gün' },
                  { v: hours, l: 'Saat' },
                  { v: minutes, l: 'Dakika' }
                ].map((unit, i) => (
                  <motion.div
                    key={unit.l}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: ease.out, delay: 1.65 + i * 0.1 }}
                    className="relative w-[3.6rem] h-[3.6rem] flex flex-col items-center justify-center rounded-[2px]"
                    style={{ background: glaze, boxShadow: `inset 0 0 0 1px ${cobalt}, inset 0 0 0 3px ${glaze}, inset 0 0 0 4px ${turquoise}` }}
                  >
                    {/* Karonun dört köşesinde çeyrek göbek. */}
                    {['top-[3px] left-[3px]', 'top-[3px] right-[3px]', 'bottom-[3px] left-[3px]', 'bottom-[3px] right-[3px]'].map((pos) => (
                      <span key={pos} aria-hidden="true" className={cn('absolute w-1 h-1 rounded-full', pos)} style={{ background: coral }} />
                    ))}
                    <span className="font-serif tabular-nums text-lg leading-none" style={{ color: cobalt }}>
                      {String(unit.v).padStart(2, '0')}
                    </span>
                    <span className={cn('mt-1 text-[7px] font-semibold uppercase tracking-[0.2em]', theme.body)}>{unit.l}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.article>
    </section>
  );
}
