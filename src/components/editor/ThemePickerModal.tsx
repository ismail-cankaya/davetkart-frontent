import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Palette, X } from 'lucide-react';
import { TemplatePreset } from '../../types';
import { useProgressiveList } from '../../hooks/useProgressiveList';
import { TemplateCover } from '../preview/TemplateCover';
import { backdropVariants, duration, ease, gesture, modalVariants } from '../../utils/motion';

const INITIAL_THEMES = 9;
const THEME_STEP = 9;

interface ThemePickerModalProps {
  open: boolean;
  templates: readonly TemplatePreset[];
  activePresetId: string | null;
  categoryLabel?: string;
  onSelect: (presetId: string) => void;
  onClose: () => void;
}

/**
 * Düzenleme panelindeki "hızlı tema seçimi" yalnızca dört kutucuk gösterir;
 * koleksiyonun tamamı buraya taşınır.
 *
 * Paneldeki dar sütuna 30 küsur tema sığdırmak, metin alanlarını ekranın çok
 * aşağısına iterdi — tema değiştirmek düzenleme akışının nadir bir adımı,
 * metin yazmak ise sürekli yapılan iş. Bu yüzden tam koleksiyon istendiğinde
 * açılan bir katmanda, kapak görselleriyle sunulur; burada da temalar partiler
 * hâlinde yüklenir.
 *
 * 🔴 `document.body`'ye PORTAL ile basılır. Panel hem `overflow-hidden` hem de
 * Motion'ın giriş `transform`'unu taşır; ikisi de `fixed` konumlu bir torunu
 * ekrana değil panele hapseder (bkz. MapPickerModal'daki aynı ders).
 */
export function ThemePickerModal({ open, ...props }: ThemePickerModalProps) {
  return createPortal(
    <AnimatePresence>
      {open && <ThemePickerDialog key="theme-picker" {...props} />}
    </AnimatePresence>,
    document.body
  );
}

/**
 * Pencere yalnızca açıkken mount edilir; böylece kademeli yükleme sayacı her
 * açılışta baştan başlar ve kullanıcı ilk partiyle karşılanır.
 */
function ThemePickerDialog({
  templates,
  activePresetId,
  categoryLabel,
  onSelect,
  onClose
}: Omit<ThemePickerModalProps, 'open'>) {
  const titleId = useId();
  // Izgara sayfanın değil, pencerenin kendi kabında kayar; sonsuz kaydırmanın
  // gözlemcisi kökü olarak bu kabı almalı.
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const selectedIndex = templates.findIndex(preset => preset.id === activePresetId);

  const {
    visible: visibleTemplates,
    hasMore,
    remaining,
    showMore,
    sentinelRef,
    batchStart
  } = useProgressiveList(templates, {
    initial: INITIAL_THEMES,
    step: THEME_STEP,
    ensureIndex: selectedIndex,
    root: scrollRef
  });

  // Escape kapatır; açıkken arkadaki sayfa kaymaz (bkz. ConfirmDialog).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="shown"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-ink/45 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="shown"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-3xl max-h-[88vh] sm:max-h-[85vh] bg-cream rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-ink/30 border border-white/40 overflow-hidden flex flex-col"
      >
        {/* Başlık — ızgara kayarken yerinde kalır */}
        <div className="shrink-0 px-5 md:px-7 pt-6 pb-4 border-b border-ink/5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-4 right-4 p-1.5 rounded-full text-muted hover:text-ink hover:bg-ink/5 transition-colors cursor-pointer z-10"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <span className="w-10 h-10 shrink-0 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
              <Palette size={18} />
            </span>
            <div className="min-w-0">
              <h2 id={titleId} className="font-serif text-lg md:text-xl font-bold text-ink leading-snug">
                Tüm temalar
              </h2>
              <p className="text-muted text-xs mt-1 leading-relaxed">
                {categoryLabel
                  ? `${categoryLabel} etkinliğiniz için ${templates.length} tema hazır.`
                  : `${templates.length} tema hazır.`}{' '}
                Bir temaya dokunmanız yeterli — önizleme anında güncellenir.
              </p>
            </div>
          </div>
        </div>

        {/* Izgara */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-5 md:px-7 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {visibleTemplates.map((preset, idx) => {
              const isActive = activePresetId === preset.id;
              // Yalnızca yeni gelen parti sırayla belirir.
              const delay = idx >= batchStart ? (idx - batchStart) * 0.045 : 0;
              return (
                <motion.button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onSelect(preset.id);
                    onClose();
                  }}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: duration.panel, ease: ease.out, delay }}
                  whileHover={{ y: -4, transition: gesture.hover }}
                  whileTap={{ scale: 0.97, transition: gesture.press }}
                  aria-pressed={isActive}
                  className={`group relative rounded-2xl overflow-hidden h-32 sm:h-40 cursor-pointer text-left transition-shadow duration-300 ${
                    isActive
                      ? 'shadow-xl shadow-brand/25 ring-2 ring-brand ring-offset-2 ring-offset-cream'
                      : 'shadow-sm hover:shadow-xl hover:shadow-ink/15'
                  }`}
                >
                  <TemplateCover
                    preset={preset}
                    alt={preset.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-luxe filter brightness-90 group-hover:brightness-95"
                  />

                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="absolute top-2.5 right-2.5 bg-brand text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10"
                    >
                      <Check size={10} strokeWidth={3} /> Seçili
                    </motion.span>
                  )}

                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-3 md:p-4">
                    <span className={`w-2.5 h-2.5 rounded-full ${preset.backgroundStyle} border border-white/40 mb-1.5 shadow-sm`} />
                    <span className="font-serif text-sm md:text-base text-white font-bold leading-tight">
                      {preset.name.split(' (')[0]}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="mt-6 flex flex-col items-center gap-2.5">
              <motion.button
                type="button"
                onClick={showMore}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2 bg-white text-brand border border-brand/20 hover:border-brand/50 px-6 py-3 rounded-full font-semibold text-xs shadow-sm hover:shadow-lg hover:shadow-ink/10 transition duration-200 ease-luxe cursor-pointer"
              >
                Daha fazla tema
                <span className="text-muted font-medium">({remaining})</span>
                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform duration-300" />
              </motion.button>
              <span className="text-muted text-[11px]">
                {visibleTemplates.length} / {templates.length} tema gösteriliyor
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
