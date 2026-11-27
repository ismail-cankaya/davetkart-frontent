import React from 'react';
import { motion } from 'motion/react';
import { PhoneFrame } from '../../ui/PhoneFrame';
import { cn } from '../../../utils/cn';
import { SHOWCASE_IMAGE, showcaseImageUrl, type ShowcaseSlide } from './showcaseSlides';
import type { PhoneMotion } from './useShowcaseMotion';

interface ShowcasePhoneProps {
  slide: ShowcaseSlide;
  label: string;
  motionValues: PhoneMotion;
  onSelect: (slide: ShowcaseSlide) => void;
}

/** Vitrinin tek telefonu: çerçeve + kaydırmayla ekran içinde kayan davetiye görseli. Bir düğmedir. */
export const ShowcasePhone = React.memo(function ShowcasePhone({ slide, label, motionValues, onSelect }: ShowcasePhoneProps) {
  const isCenter = slide.role === 'center';
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={() => onSelect(slide)}
      style={{ transform: motionValues.transform, opacity: motionValues.opacity }}
      className={cn(
        'group absolute left-1/2 top-0 ml-[calc(var(--w)/-2)] w-[var(--w)] cursor-pointer rounded-[13%/6.2%] will-change-transform',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-cream',
        isCenter ? 'z-20' : 'z-10'
      )}
    >
      <PhoneFrame className="transition-[translate] duration-300 ease-luxe group-hover:-translate-y-1.5">
        <motion.img
          src={showcaseImageUrl(slide.presetId)}
          width={SHOWCASE_IMAGE.width}
          height={SHOWCASE_IMAGE.height}
          alt=""
          draggable={false}
          decoding="async"
          // Orta telefon hero'dan sonraki ilk görüntü; yanlar onun arkasında, birkaç yüz ms sonra görünür.
          loading={isCenter ? 'eager' : 'lazy'}
          style={{ transform: motionValues.screen }}
          className="block h-auto w-full select-none will-change-transform"
        />
      </PhoneFrame>
    </motion.button>
  );
});
