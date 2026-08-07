import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Mekanik Pano hero — bilginin YERİNE OTURDUĞU düzen.
 *
 * Diğer hero'larda metin belirir (opacity) ya da kayar (translate). Havaalanı
 * panosunda ise her harf kanatları çevirerek yerini BULUR: doğru harfe kadar
 * alfabede ilerler, sonra durur. Hareketin anlamı "giriş efekti" değil,
 * "bilgi güncelleniyor"dur — davetin tarih ve mekânı gözünüzün önünde
 * yerine oturur.
 *
 * Maliyet kontrolü: kanat başına zamanlayıcı kurulmuyor. SATIR başına tek
 * interval var; her tik yalnızca "kaçıncı harf yerleşti" sayacını artırır.
 * Yerleşmemiş kanatlar bu sayaçtan türetilen deterministik bir harf gösterir,
 * böylece kendi state'leri olmadan dönüyormuş gibi görünürler.
 */

/** Kanatlarda dönen karakter kümesi — Türkçe harfler dahil. */
const GLYPHS = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789&·';

function useSettleIndex(length: number, active: boolean, stepMs: number) {
  const [settled, setSettled] = React.useState(() => (active ? 0 : length));

  React.useEffect(() => {
    if (!active) {
      setSettled(length);
      return;
    }

    setSettled(0);
    const id = window.setInterval(() => {
      setSettled((current) => {
        if (current >= length) {
          window.clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, stepMs);

    return () => window.clearInterval(id);
  }, [length, active, stepMs]);

  return settled;
}

interface FlapRowProps {
  text: string;
  /** Kanat boyu; isim satırı büyük, künye satırları küçük. */
  size: 'lg' | 'sm';
  /** Kanat gövdesinin ve yazının rengi. */
  flap: string;
  ink: string;
  /** Satırın dolmaya başlama gecikmesi (ms). */
  delay?: number;
  /** Satır başına kanat üst sınırı; taşan metin kırpılır. */
  max: number;
  className?: string;
}

function FlapRow({ text, size, flap, ink, delay = 0, max, className }: FlapRowProps) {
  const reduced = useReducedMotion();
  const [armed, setArmed] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay === 0) return;
    const id = window.setTimeout(() => setArmed(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  const chars = React.useMemo(
    () => text.toLocaleUpperCase('tr-TR').slice(0, max).split(''),
    [text, max]
  );

  const settled = useSettleIndex(chars.length, armed && !reduced, size === 'lg' ? 70 : 45);

  return (
    <div className={cn('flex flex-wrap justify-center gap-[3px] @sm:gap-1', className)}>
      {chars.map((char, i) => {
        const isSettled = i < settled;
        // Yerleşmemiş kanat: sayaç + konumdan türeyen harf. State yok,
        // her tikte satır yeniden render edildiği için harf değişir.
        const shown = isSettled ? char : GLYPHS[(settled * 7 + i * 3) % GLYPHS.length];
        const isSpace = char === ' ';

        if (isSpace) return <span key={i} className={size === 'lg' ? 'w-1.5' : 'w-1'} aria-hidden="true" />;

        return (
          <span
            key={i}
            className={cn(
              'relative rounded-[3px] overflow-hidden flex items-center justify-center font-mono font-bold tabular-nums',
              size === 'lg'
                ? 'w-[1.15rem] h-[1.7rem] @sm:w-[1.45rem] @sm:h-[2.1rem] text-[0.95rem] @sm:text-[1.2rem]'
                : 'w-[0.78rem] h-[1.1rem] @sm:w-[0.92rem] @sm:h-[1.3rem] text-[0.6rem] @sm:text-[0.72rem]'
            )}
            style={{ background: flap, color: ink, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }}
          >
            {/* key harfe bağlı: harf değişince bileşen yeniden kurulur ve
                çevrilme animasyonu baştan oynar. */}
            <motion.span
              key={shown}
              initial={reduced ? false : { rotateX: -88, opacity: 0.35 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              style={{ transformPerspective: 260, transformOrigin: 'center top' }}
            >
              {shown}
            </motion.span>

            {/* Menteşe: kanadı ikiye bölen çizgi. Panoyu "yazı" değil
                "mekanizma" yapan tek detay. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            />
          </span>
        );
      })}
    </div>
  );
}

export interface PanoHeroProps extends HeroRenderProps {
  /** Kanat gövdesi rengi. */
  flap?: string;
  /** Kanat üzerindeki harf rengi. */
  ink?: string;
}

export function PanoHero({ invitation, theme, flavor, flap = '#15171c', ink = '#f3f4f2' }: PanoHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours, minutes } = useCountdown(invitation.date);

  const dateParts = formatDateStr(invitation.date).split(' ');
  const dateText = dateParts.slice(0, 3).join(' ');
  const timeText = dateParts.slice(-1)[0];

  return (
    <section className="relative flex-1 flex items-center justify-center px-4 @sm:px-8 py-12 @sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        className={cn('relative w-full max-w-md rounded-xl border px-4 @sm:px-6 py-6 @sm:py-8', theme.border, theme.surface)}
      >
        {/* Pano başlığı: gerçek panolardaki gibi sol etiket + sağ durum. */}
        <div className="flex items-center justify-between mb-5">
          <span className={cn('text-[9px] font-semibold uppercase tracking-[0.28em]', theme.accent)}>
            {invitation.title}
          </span>
          <span className={theme.accent}>
            <Ornament size={20} />
          </span>
        </div>

        <FlapRow text={invitation.names || 'Davetlisiniz'} size="lg" flap={flap} ink={ink} max={20} />

        <div className={cn('my-5 h-px', theme.divider)} />

        <div className="space-y-3.5">
          <div>
            <span className={cn('block text-[8px] font-semibold uppercase tracking-[0.24em] mb-1.5 text-center', theme.body)}>
              Tarih
            </span>
            <FlapRow text={`${dateText} · ${timeText}`} size="sm" flap={flap} ink={ink} delay={700} max={24} />
          </div>

          <div>
            <span className={cn('block text-[8px] font-semibold uppercase tracking-[0.24em] mb-1.5 text-center', theme.body)}>
              Mekân
            </span>
            <FlapRow text={invitation.venue} size="sm" flap={flap} ink={ink} delay={1100} max={26} />
          </div>
        </div>

        <p className={cn('text-[12px] leading-relaxed font-light text-center mt-5', theme.body)}>
          {invitation.subtitle}
        </p>

        {invitation.showTimer && valid && (
          <div className={cn('mt-5 pt-4 border-t flex items-center justify-center gap-5', theme.border)}>
            {[
              { v: days, l: 'Gün' },
              { v: hours, l: 'Saat' },
              { v: minutes, l: 'Dakika' }
            ].map((unit) => (
              <span key={unit.l} className="flex items-baseline gap-1.5">
                <span className={cn('font-mono font-bold tabular-nums text-lg', theme.heading)}>
                  {String(unit.v).padStart(2, '0')}
                </span>
                <span className={cn('text-[8px] uppercase tracking-[0.18em]', theme.body)}>{unit.l}</span>
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
