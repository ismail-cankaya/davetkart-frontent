import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, type MotionValue } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { getLanguageDirection } from '../../../i18n';
import { getCategoryLabel } from '../../../data';
import { getPresetForCategory } from '../../../templateCatalog';
import { cn } from '../../../utils/cn';
import { ShowcasePhone } from './ShowcasePhone';
import { SHOWCASE_HEIGHT_CLASS, SHOWCASE_SECTION_ID, useShowcaseMode, type ShowcaseMode } from './showcaseLayout';
import { SHOWCASE_SLIDES } from './showcaseSlides';
import { useShowcaseMotion } from './useShowcaseMotion';
import { useShowcaseSelect } from './useShowcaseSelect';

/**
 * Ana sayfa vitrin sahnesi (Faz 23, yön A "Üçlü Sahne"): hero'nun altında sabitlenen sahne; ortada ana
 * davetiye, kaydırdıkça yanlarda iki telefon açılır, ekranlardaki davetiyeler içeride kayar.
 * Ayrıntı: docs/rehber/src/components/home/showcase.md
 */
export function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mode = useShowcaseMode();
  const { i18n } = useTranslation();
  const rtl = getLanguageDirection(i18n.resolvedLanguage ?? i18n.language) === 'rtl';
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  return (
    <section
      ref={sectionRef}
      id={SHOWCASE_SECTION_ID}
      aria-labelledby="vitrin-baslik"
      // Negatif scroll-margin: snap, başlık payını (useLenis HEADER_OFFSET) geri alır ve tam sahnenin başına iner.
      className={cn('relative bg-cream -scroll-mt-[76px]', SHOWCASE_HEIGHT_CLASS)}
    >
      <ShowcaseStage key={`${mode}-${rtl ? 'rtl' : 'ltr'}`} progress={scrollYProgress} mode={mode} rtl={rtl} />
    </section>
  );
}

interface ShowcaseStageProps {
  progress: MotionValue<number>;
  mode: ShowcaseMode;
  rtl: boolean;
}

function ShowcaseStage({ progress, mode, rtl }: ShowcaseStageProps) {
  const { t } = useTranslation();
  const motionValues = useShowcaseMotion(progress, mode, rtl);
  const onSelect = useShowcaseSelect();

  return (
    <div
      className={cn(
        'sticky top-0 flex h-[100svh] flex-col items-center overflow-hidden pt-[calc(72px+3svh)] pb-[4svh]',
        // Telefon genişliği ekran yüksekliğine sığar: başlık, alt metin ve bağlantı için ~330 px ayrılır.
        '[--w:min(300px,62vw,calc((100svh_-_330px)*9/19))]',
        // Sabitleme yok: hareketi azalt ve alçak ekran (yatay telefon). Sahne son hâlinde, sayfa akışında.
        'motion-reduce:static motion-reduce:h-auto motion-reduce:py-20 motion-reduce:[--w:min(260px,58vw)]',
        '[@media(max-height:559px)]:static [@media(max-height:559px)]:h-auto [@media(max-height:559px)]:py-16 [@media(max-height:559px)]:[--w:min(220px,30vw)]'
      )}
    >
      <motion.div style={motionValues.head} className="relative z-30 px-4 text-center">
        <h2
          id="vitrin-baslik"
          className="font-serif text-[clamp(2rem,5.2vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-ink text-balance"
        >
          {t('showcase.title.lead')} <em className="font-medium text-brand">{t('showcase.title.accent')}</em>
        </h2>
        <p className="mx-auto mt-3 max-w-[38ch] text-sm text-muted md:text-base">{t('showcase.subtitle')}</p>
      </motion.div>

      <div className="relative mt-[4svh] h-[calc(var(--w)*19/9)] w-full shrink-0 [perspective:1400px]">
        {SHOWCASE_SLIDES.map((slide) => {
          const preset = getPresetForCategory(slide.presetId, slide.categoryId);
          const label = t('showcase.phoneLabel', {
            category: getCategoryLabel(slide.categoryId),
            name: preset?.name ?? slide.presetId
          });
          return (
            <ShowcasePhone
              key={slide.presetId}
              slide={slide}
              label={label}
              motionValues={motionValues.phones[slide.role]}
              onSelect={onSelect}
            />
          );
        })}
      </div>

      <motion.div style={motionValues.cta} className="relative z-30 mt-auto pt-6">
        <a
          href="#animasyon-ve-onizleme"
          className="group inline-flex items-center gap-2 border-b border-current pb-0.5 text-sm font-semibold text-ink transition-colors duration-200 hover:text-brand md:text-base"
        >
          {t('showcase.cta')}
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 ease-luxe group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
          />
        </a>
      </motion.div>
    </div>
  );
}
