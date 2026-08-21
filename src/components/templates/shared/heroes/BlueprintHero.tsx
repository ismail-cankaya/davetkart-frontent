import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { formatDateStr } from '../../utils';
import { EASE_LUXE } from '../palette';
import { HeroRenderProps } from '../InvitationComposition';
import { useCountdown } from '../useCountdown';

/**
 * Blueprint hero — daveti bir DUYURU değil, bir PROJE olarak sunan dil.
 *
 * Kütüphanedeki her dil olayı anlatmaya çalışır: kağıt onu yollanmış bir
 * mektup, film bir sahne, plak bir gece yapar. Teknik çizim ise olayı
 * KURGULANMIŞ bir yapı gibi ele alır — tarih ve mekân süslenecek bilgiler
 * değil, kotalanacak ölçülerdir. Bu yüzden burada başlık bir ölçü çizgisinin
 * altında durur ve sayfanın altında gerçek bir antet (title block) vardır.
 *
 * Çizgi kalınlığı hiyerarşinin tamamıdır: 0.5px ızgara → 1px kot → 1.5px
 * çerçeve. Renk neredeyse hiç kullanılmaz; vurgu rengi yalnızca "revizyon"
 * bilgisine, yani değişebilen tek veriye (geri sayım) ayrılmıştır.
 */

export interface BlueprintHeroProps extends HeroRenderProps {
  /** Ozalit zemini — klasik siyanotipte koyu mavi, beyaz baskıda açık gri. */
  paper?: string;
  /** Çizgi mürekkebi: ızgara, çerçeve ve kot çizgileri. */
  line?: string;
  /** Yalnızca revizyon/geri sayım için ayrılmış vurgu. */
  accent?: string;
  /** Antetteki proje kodu. */
  sheetCode?: string;
}

/** Kot çizgisi: iki ucunda dikey serif, ortasında etiket. */
function DimensionLine({ label, color, delay = 0 }: { label: string; color: string; delay?: number }) {
  return (
    <div className="flex items-center gap-2 w-full" aria-hidden="true">
      <span className="block h-2.5 w-px shrink-0" style={{ background: color }} />
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: EASE_LUXE, delay }}
        className="block h-px flex-1 origin-left"
        style={{ background: color }}
      />
      <span className="text-[7.5px] font-semibold uppercase tracking-[0.22em] shrink-0" style={{ color }}>
        {label}
      </span>
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: EASE_LUXE, delay }}
        className="block h-px flex-1 origin-right"
        style={{ background: color }}
      />
      <span className="block h-2.5 w-px shrink-0" style={{ background: color }} />
    </div>
  );
}

/** Antet hücresi: üstte alan adı, altta değer. */
function BlockCell({
  label,
  value,
  color,
  strong,
  className
}: {
  label: string;
  value: string;
  color: string;
  strong?: string;
  className?: string;
}) {
  return (
    <div className={cn('px-2.5 py-2 min-w-0', className)} style={{ borderColor: `${color}55` }}>
      <span className="block text-[6.5px] font-semibold uppercase tracking-[0.2em] opacity-60" style={{ color }}>
        {label}
      </span>
      <span
        className="block mt-1 text-[10px] font-medium leading-tight truncate"
        style={{ color: strong || color }}
        title={value}
      >
        {value || '—'}
      </span>
    </div>
  );
}

export function BlueprintHero({
  invitation,
  theme,
  flavor,
  paper = '#10233f',
  line = '#cfe3ff',
  accent = '#ffd08a',
  sheetCode = 'DK-01'
}: BlueprintHeroProps) {
  const { Ornament } = flavor;
  const { valid, days, hours } = useCountdown(invitation.date);

  const dateParts = formatDateStr(invitation.date).split(' ');
  const dateText = dateParts.slice(0, 3).join(' ');
  const timeText = dateParts.length > 3 ? dateParts.slice(-1)[0] : '';

  return (
    <section className="relative flex-1 flex items-center justify-center px-4 @sm:px-6 py-10 @sm:py-14">
      {/* Izgara: iki ölçekli. İnce ağ 8px'te dokuyu, kalın ağ 48px'te sayfanın
          modülünü verir — gerçek milimetrik kağıdın mantığı. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: paper,
          backgroundImage: `
            linear-gradient(${line}0f 1px, transparent 1px),
            linear-gradient(90deg, ${line}0f 1px, transparent 1px),
            linear-gradient(${line}1c 1px, transparent 1px),
            linear-gradient(90deg, ${line}1c 1px, transparent 1px)
          `,
          backgroundSize: '8px 8px, 8px 8px, 48px 48px, 48px 48px'
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_LUXE }}
        className="relative w-full max-w-[23rem] @sm:max-w-md"
      >
        {/* Çerçeve: mürekkep gerçekten ÇİZİLİR (pathLength). Sayfa hazır
            gelmez, gözünüzün önünde kurulur. */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.rect
            x="0.6"
            y="0.6"
            width="98.8"
            height="98.8"
            fill="none"
            stroke={line}
            strokeWidth="0.35"
            strokeOpacity="0.75"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: EASE_LUXE, delay: 0.15 }}
          />
        </svg>

        {/* Köşe nişan işaretleri: çerçevenin dışına taşan artılar. */}
        {[
          ['-top-1.5 -left-1.5', ''],
          ['-top-1.5 -right-1.5', ''],
          ['-bottom-1.5 -left-1.5', ''],
          ['-bottom-1.5 -right-1.5', '']
        ].map(([pos], i) => (
          <span key={i} className={cn('absolute w-3 h-3 pointer-events-none', pos)} aria-hidden="true">
            <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2" style={{ background: line, opacity: 0.6 }} />
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: line, opacity: 0.6 }} />
          </span>
        ))}

        <div className="relative px-5 @sm:px-7 py-6 @sm:py-8">
          {/* Üst şerit: ölçek ve pafta — mühendislik sayfasının künyesi. */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[7.5px] font-semibold uppercase tracking-[0.24em] opacity-70" style={{ color: line }}>
              Ölçek 1:1
            </span>
            <span style={{ color: line }} className="opacity-80">
              <Ornament size={18} />
            </span>
            <span className="text-[7.5px] font-semibold uppercase tracking-[0.24em] opacity-70" style={{ color: line }}>
              Pafta {sheetCode}
            </span>
          </div>

          {/* Kot çizgisi başlığın ÜSTÜNDE: isim böylece ölçülmüş bir açıklık
              gibi okunur, serbest bir yazı gibi değil. */}
          <div className="mt-6">
            <DimensionLine label={flavor.envelopeLabel} color={line} delay={0.5} />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.65 }}
            className="font-sans font-light uppercase leading-[1.02] tracking-[0.02em] mt-4 text-center break-words"
            style={{ color: line, fontSize: 'clamp(1.6rem, 9.5cqw, 2.6rem)' }}
          >
            {invitation.names || 'Davetlisiniz'}
          </motion.h1>

          <div className="mt-4">
            <DimensionLine label={invitation.title || 'Davet'} color={line} delay={0.75} />
          </div>

          {invitation.subtitle && (
            <p
              className="text-[11px] font-light leading-relaxed mt-6 text-center mx-auto max-w-[18rem] opacity-75"
              style={{ color: line }}
            >
              {invitation.subtitle}
            </p>
          )}

          {/* Referans notları: numaralı balonlar ve kesik çizgili çeken
              çizgiler — planda bir detaya işaret etmenin standart yolu. */}
          <div className="mt-7 space-y-3">
            {[
              { n: '01', label: 'Tarih', value: timeText ? `${dateText} / ${timeText}` : dateText },
              { n: '02', label: 'Konum', value: invitation.venue }
            ].map((note, i) => (
              <motion.div
                key={note.n}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.9 + i * 0.12 }}
                className="flex items-center gap-2.5"
              >
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[7.5px] font-bold tabular-nums"
                  style={{ border: `1px solid ${line}`, color: line, opacity: 0.85 }}
                >
                  {note.n}
                </span>
                <span
                  className="block w-5 shrink-0 h-px"
                  style={{ backgroundImage: `repeating-linear-gradient(90deg, ${line} 0 3px, transparent 3px 6px)`, opacity: 0.6 }}
                />
                <span className="min-w-0">
                  <span className="block text-[6.5px] font-semibold uppercase tracking-[0.22em] opacity-55" style={{ color: line }}>
                    {note.label}
                  </span>
                  <span className="block text-[11.5px] font-medium leading-snug break-words" style={{ color: line }}>
                    {note.value || '—'}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>

          {/* Antet: sayfanın imzası. Üç hücre, aralarında tek piksel kural. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_LUXE, delay: 1.15 }}
            className="mt-7 grid grid-cols-3 border"
            style={{ borderColor: `${line}55` }}
          >
            <BlockCell label="Proje" value={flavor.envelopeLabel} color={line} className="border-r" />
            <BlockCell label="Tarih" value={dateText} color={line} className="border-r" />
            <BlockCell
              label={invitation.showTimer && valid ? 'Kalan' : 'Durum'}
              value={invitation.showTimer && valid ? `${days} G ${String(hours).padStart(2, '0')} S` : 'Onaylandı'}
              color={line}
              strong={accent}
            />
          </motion.div>

          {/* theme yalnızca gövde bölümlerini sürer; hero'da tek dokunuşu bu
              ince alt kural olsun ki palet değişimi burada da hissedilsin. */}
          <span className={cn('block h-px mt-4 opacity-40', theme.divider)} aria-hidden="true" />
        </div>
      </motion.div>
    </section>
  );
}
