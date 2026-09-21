import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Crosshair, ExternalLink, MapPinned, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { GeoPoint } from '../../../types';
import { cn } from '../../../utils/cn';
import {
  buildMapEmbedUrl,
  buildMapSearchUrl,
  formatCoordinates,
  parseCoordinates,
  readMapLocation
} from '../../../utils/mapLocation';
import { backdropVariants, ease, modalVariants } from '../../../utils/motion';

/** Harita, yazma durunca güncellenir: her tuşta iframe yeniden yüklenmesin. */
const PREVIEW_DEBOUNCE_MS = 450;

const samePoint = (a: GeoPoint | null, b: GeoPoint | null): boolean =>
  a === b || (a !== null && b !== null && a.lat === b.lat && a.lng === b.lng);

interface MapPickerModalProps {
  open: boolean;
  /** Pencere açılırken işaretli nokta; yoksa koordinat alanı boş başlar. */
  initialPoint: GeoPoint | null;
  onClose: () => void;
  onConfirm: (point: GeoPoint) => void;
}

/**
 * "Harita üzerinden konum seç" penceresi: üstte harita, en altta koordinat girişi.
 *
 * 🔴 `document.body`'ye PORTAL ile basılır. Alan sihirbaz formunun içinde
 * duruyor ve o form `backdrop-filter` taşıyor; bu özellik `fixed`
 * konumlu torunlar için yeni bir kapsayıcı kurar ve pencere ekranı değil
 * formu kaplardı. Ayrıca form içinde form HTML'de geçersizdir.
 */
export function MapPickerModal({ open, initialPoint, onClose, onConfirm }: MapPickerModalProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <MapPickerDialog key="map-picker" initialPoint={initialPoint} onClose={onClose} onConfirm={onConfirm} />
      )}
    </AnimatePresence>,
    document.body
  );
}

function MapPickerDialog({ initialPoint, onClose, onConfirm }: Omit<MapPickerModalProps, 'open'>) {
  const titleId = useId();
  const inputId = useId();
  const hintId = useId();

  const [input, setInput] = useState(() => (initialPoint ? formatCoordinates(initialPoint) : ''));
  const [showError, setShowError] = useState(false);

  // Kullanıcı koordinat çifti de yapıştırabilir, koordinat taşıyan bir Google
  // Haritalar bağlantısı da (ör. `…/@41.0431,29.0154,17z`).
  const point = useMemo(() => parseCoordinates(input) ?? readMapLocation(input), [input]);
  const [previewPoint] = useDebounce(point, PREVIEW_DEBOUNCE_MS, { equalityFn: samePoint });
  const embedUrl = buildMapEmbedUrl(previewPoint);
  const invalid = point === null;

  // Escape kapatır; açıkken arkadaki sayfa kaymaz (ConfirmHost ile aynı sözleşme).
  // Kapatma işleyicisi ref'te tutulur: her render'da değişen bir ok fonksiyonu
  // efekti yeniden kurup kaydırma kilidini açıp kapatmasın.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 🔴 Portal DOM'da formun dışında ama React ağacında sihirbaz formunun
    // İÇİNDE: olay durdurulmazsa "submit" React ağacında yukarı kabarır ve
    // "Davetiyeni Oluştur"u tetiklerdi.
    e.stopPropagation();

    if (point) onConfirm(point);
    else setShowError(true);
  };

  const errorVisible = showError && invalid;

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="shown"
      exit="exit"
      onClick={onClose}
      data-lenis-prevent
      className="fixed inset-0 z-[110] bg-ink/50 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        variants={modalVariants}
        initial="hidden"
        animate="shown"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-xl bg-cream rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-ink/30 border border-white/40 overflow-hidden"
      >
        {/* ——— Başlık ——— */}
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <span className="w-10 h-10 shrink-0 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
              <MapPinned size={18} />
            </span>
            <div className="min-w-0 pt-0.5">
              <h2 id={titleId} className="font-serif text-lg font-bold text-ink leading-snug">
                Harita Üzerinden Konum Seç
              </h2>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">
                Koordinatı girdiğinizde nokta haritada işaretlenir.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="shrink-0 p-1.5 rounded-full text-muted hover:text-ink hover:bg-ink/5 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* ——— Harita ——— */}
        <div className="relative h-56 sm:h-80 bg-stone-200 border-y border-ink/10">
          {/* `key`: adres değişince iframe yeniden kurulur. Yalnızca `src`
              değişseydi her yeni nokta sayfanın geçmişine bir kayıt eklerdi ve
              "geri" tuşu önce haritayı geri sarardı. */}
          <iframe
            key={embedUrl}
            title="Konum haritası"
            src={embedUrl}
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
          />
          <AnimatePresence>
            {!previewPoint && (
              <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: ease.out }}
                className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/80 text-cream text-[11px] font-medium px-3 py-1.5 shadow-lg"
              >
                Koordinat girildiğinde konum burada işaretlenir
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* ——— Koordinat girişi (en altta) ——— */}
        <form onSubmit={handleSubmit} noValidate className="px-5 sm:px-6 pt-4 pb-5 space-y-2.5">
          <label htmlFor={inputId} className="block text-[11px] font-bold tracking-wider uppercase text-brand">
            Konum Koordinatları
          </label>

          <div className="relative">
            <Crosshair
              size={15}
              className={cn(
                'absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300',
                point ? 'text-brand' : 'text-muted/60'
              )}
            />
            <input
              id={inputId}
              type="text"
              autoFocus
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowError(false);
              }}
              onBlur={() => setShowError(input.trim() !== '' && invalid)}
              placeholder="Enlem, boylam — ör. 41.0431, 29.0154"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={errorVisible}
              aria-describedby={hintId}
              className={cn(
                'w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm text-ink font-mono placeholder:font-sans placeholder:text-muted/50',
                'focus:outline-none focus:ring-2 transition duration-300',
                errorVisible
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                  : 'border-ink/15 focus:border-brand focus:ring-brand/15'
              )}
            />
          </div>

          <p
            id={hintId}
            aria-live="polite"
            className={cn('text-[11px] leading-relaxed min-h-[1.25rem]', errorVisible ? 'text-rose-600' : 'text-muted')}
          >
            {errorVisible ? (
              'Geçerli bir koordinat girin: enlem ve boylamı virgülle ayırın (ör. 41.0431, 29.0154).'
            ) : point ? (
              <>
                Seçilen nokta: <span className="font-mono text-ink">{formatCoordinates(point)}</span>
                {' · '}
                <a
                  href={buildMapSearchUrl(point)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
                >
                  Google Haritalar'da gör
                  <ExternalLink size={11} />
                </a>
              </>
            ) : (
              "Google Haritalar'da konuma sağ tıklayıp koordinatı kopyalayarak buraya yapıştırabilirsiniz."
            )}
          </p>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-ink bg-white border border-ink/10 hover:border-ink/25 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <motion.button
              type="submit"
              aria-disabled={invalid}
              whileHover={invalid ? undefined : { y: -2 }}
              whileTap={invalid ? undefined : { scale: 0.98 }}
              className={cn(
                'px-5 py-2.5 rounded-full text-xs font-semibold text-white shadow-lg transition-colors cursor-pointer',
                invalid
                  ? 'bg-brand/40 shadow-transparent'
                  : 'bg-brand hover:bg-brand-soft shadow-brand/25'
              )}
            >
              Konumu Kaydet
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
