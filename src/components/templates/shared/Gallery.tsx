import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { Invitation } from '../../../types';
import { cn } from '../../../utils/cn';
import { ease } from '../../../utils/motion';
import { SectionTheme } from './palette';
import { TemplateFlavor } from './flavor';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { SectionHeading, sectionMotion } from './SectionHeading';

interface GalleryProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
}

/**
 * Yön, variant FONKSİYONLARI üzerinden okunur. Çıkan görsel ağaçtan
 * düştüğünde prop'ları son render'ında donar; güncel yön ona yalnızca
 * `AnimatePresence custom` ile ulaşır ve `custom` yalnızca fonksiyon
 * variant'lara iletilir. Düz nesne yazılırsa İleri → Geri geçişinde eski
 * görsel önceki yönde çıkar ve yenisiyle aynı tarafta üst üste biner.
 *
 * `dragX`: sürüklemeyle geçildiğinde yeni kare çerçevenin kenarından değil,
 * bırakılan karenin hemen yanından (px cinsinden) gelir; iki kare parmağın
 * bıraktığı yerde bitişik kalır.
 */
interface SlideCustom {
  dir: number;
  /** Bırakılan karenin görünen kayması (px); düğmeyle geçişte 0. */
  dragX: number;
  /** Çerçeve genişliği (px); ölçülemezse 0 ve yüzde kullanılır. */
  width: number;
}

const DRAG_ELASTIC = 0.6;

const slideVariants: Variants = {
  enter: ({ dir, dragX, width }: SlideCustom) => ({
    x: width > 0 ? (dir >= 0 ? width : -width) + dragX : dir >= 0 ? '100%' : '-100%',
    opacity: 0.4,
    scale: 1.05
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: ({ dir }: SlideCustom) => ({ x: dir >= 0 ? '-30%' : '30%', opacity: 0 })
};

/**
 * Photo gallery — a swipeable, minimal slider with directional slide
 * transitions and dot navigation.
 */
export function Gallery({ invitation, theme, flavor }: GalleryProps) {
  const images = invitation.galleryImages;
  const [[storedIndex, slide], setIndex] = useState<[number, SlideCustom]>([0, { dir: 0, dragX: 0, width: 0 }]);
  const frameRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  // Galeri artık görüntülenirken küçülebilir (fotoğraf silme, başka kayıt
  // yükleme). Saklı konum listenin dışında kalırsa `images[index]` tanımsız
  // olur ve önizleme çöker; konum her çizimde listeye sıkıştırılır.
  const index = Math.min(storedIndex, images.length - 1);

  const goTo = (resolve: (current: number) => number, dir: number, dragX = 0) => {
    const width = frameRef.current?.offsetWidth ?? 0;
    setIndex(([current]) => [resolve(Math.min(current, images.length - 1)), { dir, dragX, width }]);
  };

  const paginate = (dir: number, dragX = 0) => {
    goTo((current) => (current + dir + images.length) % images.length, dir, dragX);
  };

  // Galeri kartı kaymaz, ölçeklenir; temadan yalnızca süre alınır.
  const card = sectionMotion(theme, { duration: 0.9, distance: 0 });

  return (
    <section className={cn('relative px-6 py-16 overflow-hidden', theme.page)}>
      <SectionHeading
        theme={theme}
        eyebrow={flavor.eyebrows?.gallery ?? 'Özel Anlarımız'}
        title={flavor.headings.gallery}
        amount={0.5}
        className="mb-10"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: card.duration, ease: ease.out }}
        className="max-w-md mx-auto"
      >
        <div ref={frameRef} className={cn('relative aspect-[4/5] rounded-3xl overflow-hidden border', theme.border)}>
          <AnimatePresence initial={false} custom={slide}>
            <motion.img
              key={index}
              src={images[index].url}
              alt={`Galeri fotoğrafı ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              custom={slide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: ease.out }}
              drag={images.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={DRAG_ELASTIC}
              onDragEnd={(_, info) => {
                // Elastik sürüklemede kare, parmağın yalnızca DRAG_ELASTIC katı kadar kayar.
                const dragX = info.offset.x * DRAG_ELASTIC;
                if (info.offset.x < -60) paginate(1, dragX);
                else if (info.offset.x > 60) paginate(-1, dragX);
              }}
            />
          </AnimatePresence>

          {/* Soft bottom vignette + counter. Sayaç düz koyu çipin üstünde:
              fotoğraf bembeyaz olsa da AA geçer. */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
          <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-white">
            {index + 1} / {images.length}
          </span>

          {/* Oklar: tıklama alanı 44 px, görünen daire 36 px. */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Önceki fotoğraf"
                onClick={() => paginate(-1)}
                className="group absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
              >
                <span className="w-9 h-9 rounded-full bg-black/30 group-hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-colors duration-300">
                  <ChevronLeftIcon size={17} />
                </span>
              </button>
              <button
                type="button"
                aria-label="Sonraki fotoğraf"
                onClick={() => paginate(1)}
                className="group absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
              >
                <span className="w-9 h-9 rounded-full bg-black/30 group-hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-colors duration-300">
                  <ChevronRightIcon size={17} />
                </span>
              </button>
            </>
          )}
        </div>

        {/* Dot navigation — her nokta 44 × 44 düğme, görünen nokta aynı. Üst
            boşluk düğmenin fazlası kadar kısalır, alttaki fazlalık geri alınır:
            noktanın dikey yeri ve bölümün yüksekliği değişmez. */}
        {images.length > 1 && (
          <div className="flex items-center justify-center mt-px -mb-[19px]">
            {images.map((image, dotIndex) => (
              <button
                key={image.id ?? image.url}
                type="button"
                aria-label={`${dotIndex + 1}. fotoğrafa git`}
                onClick={() => {
                  if (dotIndex !== index) goTo(() => dotIndex, dotIndex > index ? 1 : -1);
                }}
                className="min-w-11 h-11 flex items-center justify-center rounded-full cursor-pointer"
              >
                <span
                  className={cn(
                    'h-1.5 rounded-full transition-[width,opacity] duration-300 ease-luxe',
                    dotIndex === index ? cn('w-6', theme.accentBg) : cn('w-1.5 opacity-40', theme.accentBg)
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
