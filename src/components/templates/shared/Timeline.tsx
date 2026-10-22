import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Invitation } from '../../../types';
import { cn } from '../../../utils/cn';
import { hasTimelineEventContent } from '../../../utils/timelineEvents';
import { displayText } from '../utils';
import { SectionTheme } from './palette';
import { TemplateFlavor } from './flavor';
import { ClockIcon } from './icons';
import { ease } from '../../../utils/motion';
import { SectionHeading, sectionMotion } from './SectionHeading';

interface TimelineProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
  /** The invitation's own scroll container — drives the line-drawing progress. */
  scrollContainer: React.RefObject<HTMLDivElement | null>;
}

interface TimelineEntry {
  key: string;
  time: string;
  title: string;
  description: string;
}

/**
 * Program flow — Aceternity-style vertical timeline. The gradient spine is
 * drawn in sync with scrolling and each event card slides in as it enters
 * the viewport. `theme.timelineLayout: 'icindekiler'` lists the same steps as
 * a book's table of contents instead.
 *
 * 🔴 Yalnızca en az bir alanı dolu adımlar çizilir. Sihirbaz iki boş adımla
 * açılır; onlar kullanıcının dolduracağı form satırlarıdır, misafire boş kart
 * olarak gösterilmez. Hiç dolu adım yoksa bölüm başlığıyla birlikte gizlenir.
 */
export function Timeline({ invitation, theme, flavor, scrollContainer }: TimelineProps) {
  const events: TimelineEntry[] = (invitation.timelineEvents ?? []).filter(hasTimelineEventContent).map((event) => ({
    // `id` kaydedilmemiş adımlarda null'dır ve birden çok adımda çakışırdı;
    // `localKey` her adımda benzersizdir.
    key: event.localKey,
    time: displayText(event.time),
    title: displayText(event.title),
    description: displayText(event.description)
  }));
  if (events.length === 0) return null;

  return (
    <section className={cn('relative px-6 py-16 overflow-hidden', theme.page)}>
      <SectionHeading
        theme={theme}
        eyebrow={flavor.eyebrows?.timeline ?? 'Program Akışı'}
        title={flavor.headings.timeline}
        amount={0.5}
        className="mb-12"
      />

      {theme.timelineLayout === 'icindekiler' ? (
        <ContentsList events={events} theme={theme} />
      ) : (
        <CardFlow events={events} theme={theme} scrollContainer={scrollContainer} />
      )}
    </section>
  );
}

/** Varsayılan düzen: kaydırmayla çizilen omurga, düğüm ve kart. */
function CardFlow({
  events,
  theme,
  scrollContainer
}: {
  events: TimelineEntry[];
  theme: SectionTheme;
  scrollContainer: React.RefObject<HTMLDivElement | null>;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer,
    offset: ['start 0.75', 'end 0.45']
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const { duration, distance } = sectionMotion(theme, { duration: 0.85, distance: 36 });

  return (
    <div ref={sectionRef} className="relative max-w-md mx-auto">
      {/* Static faint track */}
      <div className={cn('absolute left-[15px] top-0 bottom-0 w-px', theme.divider)} />
      {/* Scroll-drawn gradient beam */}
      <motion.div
        className={cn('absolute left-[15px] top-0 bottom-0 w-px origin-top bg-gradient-to-b', theme.timelineLine)}
        style={{ scaleY: lineProgress }}
      />

      <div className="space-y-10">
        {events.map((event, index) => (
          <motion.article
            key={event.key}
            initial={{ opacity: 0, x: index % 2 === 0 ? distance : -distance }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration, ease: ease.out }}
            className="relative pl-12"
          >
            {/* Node dot — kartın köşe yuvarlaklığı (surface) düğüme geçmez. */}
            <span
              className={cn(
                'absolute left-0 top-1 w-8 h-8 rounded-full border flex items-center justify-center',
                theme.timelineNode ?? [theme.surface, theme.border, 'rounded-full']
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', theme.accentBg)} />
            </span>

            <div
              className={cn(
                'rounded-2xl border p-4 transition-shadow duration-300 hover:shadow-lg',
                theme.surface,
                theme.border
              )}
            >
              {event.time && (
                <div className={cn('flex items-center gap-1.5 text-[11px] font-semibold tracking-widest', theme.accent)}>
                  <ClockIcon size={13} />
                  {event.time}
                </div>
              )}
              {event.title && (
                <h3 className={cn('font-serif text-lg font-bold mt-1.5 first:mt-0', theme.heading)}>{event.title}</h3>
              )}
              {event.description && (
                <p className={cn('text-[13px] leading-relaxed mt-1 first:mt-0 font-light', theme.body)}>
                  {event.description}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

/**
 * İçindekiler düzeni: `Karşılama ........ 17:00`. Noktalar CSS kenarıdır ve
 * ekran okuyucudan gizlenir. Uzun başlık sarılır; saat hiç küçülmez, son
 * satırın hizasında kalır.
 */
function ContentsList({ events, theme }: { events: TimelineEntry[]; theme: SectionTheme }) {
  const { duration, distance } = sectionMotion(theme, { duration: 0.85, distance: 24 });

  return (
    <ol className="max-w-md mx-auto space-y-6">
      {events.map((event) => (
        <motion.li
          key={event.key}
          initial={{ opacity: 0, y: distance }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration, ease: ease.out }}
        >
          <div className="flex items-end gap-2">
            {event.title && (
              <h3 className={cn('min-w-0 font-serif text-lg font-bold leading-snug [overflow-wrap:anywhere]', theme.heading)}>
                {event.title}
              </h3>
            )}
            {event.time && (
              <>
                <span
                  aria-hidden="true"
                  className={cn('flex-1 min-w-6 mb-[0.45em] border-b-2 border-dotted border-current opacity-60', theme.body)}
                />
                <span className={cn('shrink-0 whitespace-nowrap font-serif text-base font-semibold leading-snug tabular-nums', theme.accent)}>
                  {event.time}
                </span>
              </>
            )}
          </div>
          {event.description && (
            <p className={cn('text-[13px] leading-relaxed mt-1 font-light', theme.body)}>{event.description}</p>
          )}
        </motion.li>
      ))}
    </ol>
  );
}
