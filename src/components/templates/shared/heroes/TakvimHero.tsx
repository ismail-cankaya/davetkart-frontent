import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { displayText } from '../../utils';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';
import { PaperGrain } from '../effects';
import { ease } from '../../../../utils/motion';

/**
 * Takvim hero — "tarihi kaydet" kartının en bilinen hâli: duvar takvimi.
 *
 * Diğer diller tarihi bir METİN olarak yazar ("14 Kasım 2026"). Burada tarih
 * bir YER'dir: ayın ızgarasında bir hücre. Misafir günü okumaz, bulur —
 * haftanın hangi gününe denk geldiği, ayın başında mı sonunda mı olduğu,
 * hafta sonu mu olduğu tek bakışta görünür. Bu, metin tarihin veremediği
 * bilgidir.
 *
 * Giriş koreografisi takvimin kendi hareketidir: önceki iki ayın yaprağı
 * spiralin üstünden çevrilir, etkinlik ayına gelinir ve gün elle, mürekkeple
 * daire içine alınır. Daire bilerek kusurludur — başladığı yeri geçer,
 * tam kapanmaz; elle çizildiğini söyleyen şey budur.
 *
 * 🔴 Tarih metni bir DUVAR SAATİDİR (`2026-11-14T19:00`); ay ızgarası
 * parçalardan kurulur, `new Date(metin)` ile ayrıştırılmaz (bkz.
 * utils/eventTime). Haftanın günü yalnızca takvim hesabı için yerel
 * `new Date(y, m, 1)` ile bulunur; bu, saat diliminden bağımsızdır.
 */

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

interface MonthGrid {
  year: number;
  /** 0-11 */
  month: number;
  day: number | null;
  time: string;
  /** Ayın ilk gününden önceki boş hücre sayısı (Pazartesi = 0). */
  offset: number;
  days: number;
}

/** Duvar saatinden ay ızgarası; tarih yoksa `null`. */
function monthGrid(wallClock: string | null | undefined): MonthGrid | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}:\d{2}))?/.exec(wallClock?.trim() ?? '');
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;

  return {
    year,
    month,
    day,
    time: match[4] ?? '',
    offset: (new Date(year, month, 1).getDay() + 6) % 7,
    days: new Date(year, month + 1, 0).getDate()
  };
}

/** Çift telli spiral: her halka iki ince tel; ortada askı. */
function Binding({ metal, paper }: { metal: string; paper: string }) {
  const loops = 14;
  const wire = `linear-gradient(90deg, rgba(0,0,0,0.35), rgba(255,255,255,0.6) 45%, rgba(0,0,0,0.3)), ${metal}`;

  return (
    <div aria-hidden="true" className="absolute -top-2.5 inset-x-5 h-6 flex justify-between pointer-events-none">
      {Array.from({ length: loops }, (_, i) => {
        // Askının geçtiği ortada halka yok.
        if (i === loops / 2 - 1 || i === loops / 2) return <span key={i} className="w-[7px]" />;
        return (
          <span key={i} className="relative w-[7px] h-full">
            {/* Kağıttaki delik */}
            <span
              className="absolute left-1/2 -translate-x-1/2 top-[13px] w-[7px] h-[5px] rounded-full"
              style={{ background: 'rgba(0,0,0,0.55)', boxShadow: `0 1px 0 ${paper}` }}
            />
            <span className="absolute left-0 top-0 w-[2.5px] h-[18px] rounded-full" style={{ background: wire }} />
            <span className="absolute right-0 top-0 w-[2.5px] h-[18px] rounded-full" style={{ background: wire }} />
          </span>
        );
      })}
      {/* Askı */}
      <span
        className="absolute left-1/2 -translate-x-1/2 -top-3 w-9 h-6 rounded-t-full border-[2px] border-b-0"
        style={{ borderColor: metal }}
      />
    </div>
  );
}

/** Önceki ayın yaprağı: spiralin üstünden çevrilip kaybolur. */
function TurningPage({
  label,
  paper,
  toneClass,
  delay
}: {
  label: string;
  paper: string;
  /** Yaprağın yazı rengi — temanın başlık rengi. */
  toneClass: string;
  delay: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 rounded-[3px] pointer-events-none"
      style={{
        background: paper,
        originY: 0,
        backfaceVisibility: 'hidden',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)'
      }}
      initial={{ rotateX: 0 }}
      animate={{ rotateX: 120 }}
      transition={{ duration: 0.75, ease: ease.in, delay }}
    >
      <PaperGrain opacity={0.3} />
      <div className={cn('relative px-6 @sm:px-8 pt-[4.4rem]', toneClass)}>
        <span className="font-serif text-[2.5rem] @sm:text-[2.9rem] leading-none">{label}</span>
        <div className="mt-8 grid grid-cols-7 gap-y-5">
          {Array.from({ length: 35 }, (_, i) => (
            <span key={i} className="mx-auto h-[3px] w-4 rounded-full bg-current opacity-15" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export interface TakvimHeroProps extends HeroRenderProps {
  /** Takvim yaprağı. */
  paper?: string;
  /** Mürekkep: daire, Pazar sütunu, yıl. */
  ink?: string;
  /** Spiral teli. */
  metal?: string;
  /** Yapışkan notun kağıdı. */
  note?: string;
  /** Notun üstündeki yazı rengi. */
  noteInk?: string;
}

export function TakvimHero({
  invitation,
  theme,
  flavor,
  paper = '#fbfaf7',
  ink = '#b0413e',
  metal = '#b9a06a',
  note = '#f5e6c8',
  noteInk = '#3a3128'
}: TakvimHeroProps) {
  const reduced = useReducedMotion();
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date, invitation.timezone);
  const grid = monthGrid(invitation.date);
  const venue = displayText(invitation.venue);

  // Tarih seçilmemişse ızgara yine çizilir ama soluk ve işaretsiz: hiçbir
  // gün "seçilmiş" gibi görünmemeli.
  const cells = grid
    ? [...Array.from({ length: grid.offset }, () => null), ...Array.from({ length: grid.days }, (_, i) => i + 1)]
    : Array.from({ length: 35 }, (_, i) => (i < 31 ? i + 1 : null));

  const previous = grid ? [MONTHS[(grid.month + 10) % 12], MONTHS[(grid.month + 11) % 12]] : [];
  const flipping = Boolean(grid) && !reduced;
  // Daire, yapraklar çevrildikten sonra çizilir.
  const circleDelay = flipping ? 1.75 : 0.7;

  return (
    <section className="relative flex-1 flex items-center justify-center px-5 @sm:px-8 pt-14 pb-12 @sm:pt-16 @sm:pb-16">
      <motion.article
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: ease.out }}
        className="relative w-full max-w-[21rem] @sm:max-w-sm"
        style={{ perspective: 1400 }}
      >
        <div
          className="relative rounded-[3px]"
          style={{
            background: paper,
            // Alttaki yaprakların kalınlığı: iki ince kenar.
            boxShadow: '0 2px 0 -1px rgba(0,0,0,0.08), 0 4px 0 -2px rgba(0,0,0,0.06), 0 28px 50px -26px rgba(0,0,0,0.45)'
          }}
        >
          <PaperGrain opacity={theme.id === 'midnight' ? 0.12 : 0.3} />

          <div className="relative px-6 @sm:px-8 pt-10 pb-8">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: ease.out, delay: 0.3 }}
              className={cn('block text-center text-[9px] font-semibold uppercase tracking-[0.36em]', theme.body)}
            >
              {invitation.title}
            </motion.span>

            {/* Ay başlığı */}
            <div className={cn('mt-5 flex items-end justify-between border-b pb-2', theme.border)}>
              <span className={cn('font-serif text-[2.5rem] @sm:text-[2.9rem] leading-none', theme.heading)}>
                {grid ? MONTHS[grid.month] : 'Takvim'}
              </span>
              {grid && (
                <span className="text-sm font-light tabular-nums tracking-[0.2em]" style={{ color: ink }}>
                  {grid.year}
                </span>
              )}
            </div>

            {/* Haftanın günleri */}
            <div className="mt-4 grid grid-cols-7">
              {WEEKDAYS.map((w, i) => (
                <span
                  key={w}
                  className={cn('text-center text-[8.5px] font-semibold uppercase tracking-[0.14em]', i === 6 ? '' : theme.body)}
                  style={i === 6 ? { color: ink } : undefined}
                >
                  {w}
                </span>
              ))}
            </div>

            {/* Ay ızgarası */}
            <div className={cn('mt-2 grid grid-cols-7 gap-y-1', !grid && 'opacity-30')}>
              {cells.map((day, i) => {
                const marked = grid && day === grid.day;
                const sunday = i % 7 === 6;
                return (
                  <span
                    key={i}
                    className={cn(
                      'relative h-8 flex items-center justify-center text-[13px] tabular-nums',
                      marked ? 'font-semibold' : 'font-light',
                      !marked && !sunday && theme.heading
                    )}
                    style={marked || sunday ? { color: ink } : undefined}
                  >
                    {day ?? ''}
                    {marked && (
                      <>
                        <svg
                          viewBox="0 0 60 50"
                          className="absolute -inset-x-1 -inset-y-1.5 w-[calc(100%+8px)] h-[calc(100%+12px)] overflow-visible pointer-events-none"
                          aria-hidden="true"
                        >
                          <motion.path
                            d="M47 13 C40 4 15 4 8 17 C2 31 15 46 31 45 C48 44 57 31 52 19 C50 13 44 8 35 7"
                            fill="none"
                            stroke={ink}
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                              pathLength: { duration: 0.85, ease: ease.inOut, delay: circleDelay },
                              opacity: { duration: 0.1, delay: circleDelay }
                            }}
                          />
                        </svg>
                        <motion.span
                          aria-hidden="true"
                          className="absolute -top-3 -right-3"
                          style={{ color: ink, rotate: 14 }}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: circleDelay + 0.7 }}
                        >
                          <Ornament size={17} />
                        </motion.span>
                      </>
                    )}
                  </span>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: ease.out, delay: flipping ? 1.5 : 0.5 }}
              className="mt-7 flex flex-col items-center text-center"
            >
              <h1
                className={cn('italic leading-[1.1] text-[2rem] @sm:text-[2.4rem] break-words', theme.heading)}
                style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 500 }}
              >
                {invitation.names || 'Davetlisiniz'}
              </h1>

              {invitation.subtitle && (
                <p className={cn('mt-3 text-[12.5px] leading-[1.8] font-light max-w-[16rem]', theme.body)}>{invitation.subtitle}</p>
              )}

              {(grid?.time || venue) && (
                <div className="mt-5 flex flex-col items-center gap-1">
                  {grid?.time && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: ink }}>
                      Saat {grid.time}
                    </span>
                  )}
                  {venue && <span className={cn('text-[10px] uppercase tracking-[0.24em] max-w-[16rem]', theme.body)}>{venue}</span>}
                </div>
              )}
            </motion.div>

            {/* Geri sayım: yaprağa yapıştırılmış not. */}
            {invitation.showTimer && valid && (
              <motion.div
                initial={{ opacity: 0, y: -10, rotate: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, rotate: -2.5, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: circleDelay + 0.9 }}
                className="relative mx-auto mt-7 w-fit min-w-[10.5rem] px-6 pt-5 pb-3.5 text-center"
                style={{
                  background: `linear-gradient(180deg, ${note}, ${note})`,
                  boxShadow: '0 10px 18px -12px rgba(0,0,0,0.45), 0 1px 0 rgba(0,0,0,0.06)'
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 rotate-[3deg]"
                  style={{ background: 'rgba(255,255,255,0.55)', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
                />
                <span
                  className="flex items-baseline justify-center gap-1.5 italic leading-none whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600, color: noteInk }}
                >
                  <span className="text-[2.1rem] tabular-nums">{days}</span>
                  <span className="text-lg">gün kaldı</span>
                </span>
                <span className="block mt-1.5 text-[9px] uppercase tracking-[0.2em]" style={{ color: noteInk, opacity: 0.7 }}>
                  {String(hours).padStart(2, '0')} saat · {String(minutes).padStart(2, '0')} dakika
                </span>
              </motion.div>
            )}
          </div>

          {/* Önceki iki ayın yaprakları: üstteki önce çevrilir. */}
          {flipping && (
            <>
              <TurningPage label={previous[1]} paper={paper} toneClass={theme.heading} delay={0.95} />
              <TurningPage label={previous[0]} paper={paper} toneClass={theme.heading} delay={0.55} />
            </>
          )}
        </div>

        <Binding metal={metal} paper={paper} />
      </motion.article>
    </section>
  );
}
