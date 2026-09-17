import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Invitation } from '../../../types';
import { cn } from '../../../utils/cn';
import { hasTimelineEventContent } from '../../../utils/timelineEvents';
import { displayText } from '../utils';
import { SectionTheme, EASE_LUXE } from './palette';
import { TemplateFlavor } from './flavor';
import { ClockIcon } from './icons';

interface TimelineProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
  /** The invitation's own scroll container — drives the line-drawing progress. */
  scrollContainer: React.RefObject<HTMLDivElement | null>;
}

/**
 * Program flow — Aceternity-style vertical timeline. The gradient spine is
 * drawn in sync with scrolling and each event card slides in as it enters
 * the viewport.
 *
 * 🔴 Yalnızca en az bir alanı dolu adımlar çizilir. Sihirbaz iki boş adımla
 * açılır; onlar kullanıcının dolduracağı form satırlarıdır, misafire boş kart
 * olarak gösterilmez. Hiç dolu adım yoksa bölüm başlığıyla birlikte gizlenir.
 */
export function Timeline({ invitation, theme, flavor, scrollContainer }: TimelineProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer,
    offset: ['start 0.75', 'end 0.45']
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  const events = (invitation.timelineEvents ?? []).filter(hasTimelineEventContent).map((event) => ({
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
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        className="text-center mb-12"
      >
        <span className={cn('text-[10px] font-semibold tracking-[0.3em] uppercase', theme.accent)}>
          Program Akışı
        </span>
        <h2 className={cn('font-serif text-2xl md:text-3xl font-bold mt-2', theme.heading)}>
          {flavor.headings.timeline}
        </h2>
      </motion.div>

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
              initial={{ opacity: 0, x: index % 2 === 0 ? 36 : -36, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.85, ease: EASE_LUXE }}
              className="relative pl-12"
            >
              {/* Node dot */}
              <span
                className={cn(
                  'absolute left-0 top-1 w-8 h-8 rounded-full border flex items-center justify-center',
                  theme.surface,
                  theme.border
                )}
              >
                <span className={cn('w-2 h-2 rounded-full', theme.accentBg)} />
              </span>

              <div
                className={cn(
                  'rounded-2xl border p-4 transition-shadow duration-500 hover:shadow-lg',
                  theme.surface,
                  theme.border
                )}
              >
                {event.time && (
                  <div className={cn('flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase', theme.accent)}>
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
    </section>
  );
}
