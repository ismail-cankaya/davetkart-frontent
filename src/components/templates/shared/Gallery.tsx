import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Invitation } from '../../../types';
import { cn } from '../../../utils/cn';
import { SectionTheme, EASE_LUXE } from './palette';
import { TemplateFlavor } from './flavor';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface GalleryProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
}

/**
 * Photo gallery — a swipeable, minimal slider with directional slide
 * transitions and dot navigation.
 */
export function Gallery({ invitation, theme, flavor }: GalleryProps) {
  const images = invitation.galleryImages;
  const [[storedIndex, direction], setIndex] = useState<[number, number]>([0, 0]);

  if (images.length === 0) return null;

  // Galeri artık görüntülenirken küçülebilir (fotoğraf silme, başka kayıt
  // yükleme). Saklı konum listenin dışında kalırsa `images[index]` tanımsız
  // olur ve önizleme çöker; konum her çizimde listeye sıkıştırılır.
  const index = Math.min(storedIndex, images.length - 1);

  const paginate = (dir: number) => {
    setIndex(([current]) => [(Math.min(current, images.length - 1) + dir + images.length) % images.length, dir]);
  };

  return (
    <section className={cn('relative px-6 py-16 overflow-hidden', theme.page)}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        className="text-center mb-10"
      >
        <span className={cn('text-[10px] font-semibold tracking-[0.3em] uppercase', theme.accent)}>
          Özel Anlarımız
        </span>
        <h2 className={cn('font-serif text-2xl md:text-3xl font-bold mt-2', theme.heading)}>
          {flavor.headings.gallery}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        className="max-w-md mx-auto"
      >
        <div className={cn('relative aspect-[4/5] rounded-3xl overflow-hidden border', theme.border)}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={index}
              src={images[index].url}
              alt={`Galeri fotoğrafı ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              custom={direction}
              initial={{ x: direction >= 0 ? '100%' : '-100%', opacity: 0.4, scale: 1.05 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: direction >= 0 ? '-30%' : '30%', opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE_LUXE }}
              drag={images.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) paginate(1);
                else if (info.offset.x > 60) paginate(-1);
              }}
            />
          </AnimatePresence>

          {/* Soft bottom vignette + counter */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
          <span className="absolute bottom-3.5 right-4 text-[10px] font-semibold tracking-widest text-white/85">
            {index + 1} / {images.length}
          </span>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Önceki fotoğraf"
                onClick={() => paginate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-colors duration-300 cursor-pointer"
              >
                <ChevronLeftIcon size={17} />
              </button>
              <button
                type="button"
                aria-label="Sonraki fotoğraf"
                onClick={() => paginate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-colors duration-300 cursor-pointer"
              >
                <ChevronRightIcon size={17} />
              </button>
            </>
          )}
        </div>

        {/* Dot navigation */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {images.map((image, dotIndex) => (
              <button
                key={image.id ?? image.url}
                type="button"
                aria-label={`${dotIndex + 1}. fotoğrafa git`}
                onClick={() => setIndex(([current]) => [dotIndex, dotIndex > current ? 1 : -1])}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500 cursor-pointer',
                  dotIndex === index ? cn('w-6', theme.accentBg) : cn('w-1.5 opacity-40', theme.accentBg)
                )}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
