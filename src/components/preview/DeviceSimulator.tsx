import React, { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Laptop, LucideIcon, Maximize2, Smartphone, Tablet } from 'lucide-react';
import { RsvpModal } from './RsvpModal';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useUIStore } from '../../stores/useUIStore';
import { useRsvpStore } from '../../stores/useRsvpStore';
import { PreviewDevice } from '../../types';
import { withShowcaseContent } from '../../utils/showcase';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

interface DeviceSpec {
  label: string;
  icon: LucideIcon;
  /** Outer frame width in px per breakpoint. */
  width: { mobile: number; desktop: number };
  /** Outer frame aspect ratio (width / height). */
  aspect: number;
  /** Outer shell radius in px (animated between devices). */
  frameRadius: number;
  /** Screen (inner) radius in px. */
  screenRadius: number;
  /** Bezel thickness in px. */
  framePadding: number;
}

/** Mockup geometry per device — phone 9:19 portrait, tablet 3:4, laptop 16:10. */
const DEVICE_SPECS: Record<PreviewDevice, DeviceSpec> = {
  phone: {
    label: 'Telefon',
    icon: Smartphone,
    width: { mobile: 272, desktop: 330 },
    aspect: 9 / 19,
    frameRadius: 42,
    screenRadius: 26,
    framePadding: 12
  },
  tablet: {
    label: 'Tablet',
    icon: Tablet,
    width: { mobile: 310, desktop: 430 },
    aspect: 3 / 4,
    frameRadius: 30,
    screenRadius: 16,
    framePadding: 15
  },
  laptop: {
    label: 'Bilgisayar',
    icon: Laptop,
    width: { mobile: 320, desktop: 620 },
    aspect: 16 / 10,
    frameRadius: 16,
    screenRadius: 8,
    framePadding: 11
  }
};

const DEVICE_ORDER: PreviewDevice[] = ['phone', 'tablet', 'laptop'];

/**
 * 🔴 Giriş animasyonları bağımsız `y`/`scale` değerleriyle değil tek bir
 * `transform` dizesiyle yazılır. Motion yalnızca `transform` ve `opacity`'yi
 * tarayıcının compositor'ına (WAAPI) devredebilir; `y`, `scale` gibi değerleri
 * her karede JavaScript'te hesaplayıp inline style olarak yazar. Bu bölüm
 * ana sayfadaki ilk kaydırmada ekrana girdiği için o kareler zaten doluydu.
 * Fonksiyon listeleri iki uçta aynı sırada tutulur ki ara değerler doğrusal
 * interpolasyonla hesaplansın.
 */
const RISE_HIDDEN = { opacity: 0, transform: 'translateY(10px)' };
const RISE_SHOWN = { opacity: 1, transform: 'translateY(0px)' };

interface DeviceSimulatorProps {
  simulatorRef: React.RefObject<HTMLDivElement>;
  /**
   * Ana sayfa tanıtımı. Yeni davetiye boş doğduğu için, taslak henüz içerik
   * taşımıyorsa önizlemeye örnek içerik bindirilir (store'a yazılmaz).
   * Tasarım stüdyosu bunu geçmez: orada yalnızca kullanıcının girdiği görünür.
   */
  showcase?: boolean;
}

/**
 * Multi-device preview simulator — renders the live invitation inside a
 * phone, tablet or laptop mockup and animates the frame between them.
 */
export function DeviceSimulator({ simulatorRef, showcase = false }: DeviceSimulatorProps) {
  const storedInvitation = useInvitationStore(s => s.invitation);
  const invitation = useMemo(
    () => (showcase ? withShowcaseContent(storedInvitation) : storedInvitation),
    [showcase, storedInvitation]
  );
  const activePresetId = useInvitationStore(s => s.activePresetId);
  const isMobile = useUIStore(s => s.isMobile);
  const isRsvpModalOpen = useUIStore(s => s.isRsvpModalOpen);
  const setRsvpModalOpen = useUIStore(s => s.setRsvpModalOpen);
  const device = useUIStore(s => s.previewDevice);
  const setPreviewDevice = useUIStore(s => s.setPreviewDevice);
  const setInvitationScope = useRsvpStore(s => s.setInvitationScope);

  const screenRef = useRef<HTMLDivElement>(null);
  // Hareketi azaltmayı seçen kullanıcıda girişler atlanır (bkz. TemplateGrid).
  const reduceMotion = useReducedMotion();

  // 🔴 Simülatör tanımı gereği bir ÖNIZLEMEDIR: içindeki davetiyenin sunucuda
  // bir karşılığı olmayabilir (tasarım editörü) ya da hiç olmaz (ana sayfa
  // tanıtımı). Kapsamı açıkça boşaltmak, kullanıcının az önce ziyaret ettiği
  // gerçek bir davetiyeden kalan kimliğin burada yanlışlıkla kullanılmasını
  // engeller — önizlemede doldurulan form gerçek bir davetiyeye LCV yazardı.
  useEffect(() => {
    setInvitationScope(null);
  }, [setInvitationScope]);

  const spec = DEVICE_SPECS[device];
  const frameWidth = isMobile ? spec.width.mobile : spec.width.desktop;
  const frameHeight = Math.round(frameWidth / spec.aspect);

  const handleFullscreen = () => {
    const el = screenRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  return (
    <div
      ref={simulatorRef}
      className={`w-full flex flex-col items-center justify-center min-h-[400px] lg:min-h-[550px] perspective-container transition-[width] duration-700 ${
        device === 'laptop' ? 'lg:w-3/5' : 'lg:w-1/2'
      }`}
    >
      {/* Device frame entrance */}
      <motion.div
        initial={reduceMotion ? false : {
          opacity: 0,
          transform: isMobile
            ? 'translateY(30px) scale(0.95) rotateX(0deg)'
            : 'translateY(60px) scale(0.7) rotateX(15deg)'
        }}
        whileInView={{ opacity: 1, transform: 'translateY(0px) scale(1) rotateX(0deg)' }}
        viewport={{ once: true, margin: '0px' }}
        transition={{ duration: 1.2, ease: EASE_LUXE }}
        className="relative will-change-transform max-w-full"
      >
        {/* Ambient glow behind device */}
        <div className="absolute -inset-4 md:-inset-8 bg-gradient-to-b from-emerald-200/25 via-champagne/25 to-emerald-200/10 rounded-[60px] blur-xl md:blur-2xl pointer-events-none" />

        {/* Nefes alan gölge: iki gölge durumu çerçevenin arkasında ayrı
            katmanlarda durur, yalnızca opaklıkları değişir (bkz. index.css). */}
        <motion.span
          aria-hidden="true"
          animate={{ borderRadius: spec.frameRadius, height: frameHeight }}
          initial={false}
          transition={{ duration: 0.8, ease: EASE_LUXE }}
          className="device-glow-rest absolute left-0 top-0 w-full"
        />
        <motion.span
          aria-hidden="true"
          animate={{ borderRadius: spec.frameRadius, height: frameHeight }}
          initial={false}
          transition={{ duration: 0.8, ease: EASE_LUXE }}
          className="device-glow-peak absolute left-0 top-0 w-full"
        />

        {/* Actual device frame — width/height/radius glide between mockups */}
        <motion.div
          animate={{
            width: frameWidth,
            height: frameHeight,
            borderRadius: spec.frameRadius,
            padding: spec.framePadding
          }}
          initial={false}
          transition={{ duration: 0.8, ease: EASE_LUXE }}
          className="relative bg-slate-900 overflow-hidden border-[3px] lg:border-4 border-slate-800"
        >
          {/* Device-specific chrome: notch (phone) / camera dot (tablet, laptop) */}
          <AnimatePresence>
            {device === 'phone' && (
              <motion.div
                key="phone-notch"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE_LUXE }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center"
              >
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-full ml-2" />
              </motion.div>
            )}
            {device !== 'phone' && (
              <motion.div
                key="camera-dot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-[5px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-700 rounded-full z-40"
              />
            )}
          </AnimatePresence>

          {/* High quality screen area */}
          <motion.div
            ref={screenRef}
            data-lenis-prevent
            animate={{ borderRadius: spec.screenRadius }}
            initial={false}
            transition={{ duration: 0.8, ease: EASE_LUXE }}
            className="w-full h-full overflow-hidden relative bg-emerald-950 flex flex-col"
          >
            {/* Dynamically render the selected template */}
            <TemplateRenderer
              templateId={activePresetId}
              invitation={invitation}
              onRsvpClick={() => setRsvpModalOpen(true)}
              mode="preview"
            />

            {/* RSVP Modal */}
            <AnimatePresence>
              {isRsvpModalOpen && <RsvpModal />}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Laptop base deck under the screen */}
        <AnimatePresence>
          {device === 'laptop' && (
            <motion.div
              key="laptop-deck"
              initial={{ opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.7 }}
              transition={{ duration: 0.5, ease: EASE_LUXE, delay: 0.25 }}
              className="relative w-[114%] -ml-[7%] h-3.5 lg:h-4 rounded-b-2xl rounded-t-[3px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 lg:w-24 h-1.5 bg-slate-950/80 rounded-b-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Device switcher — phone / tablet / laptop */}
      <motion.div
        initial={reduceMotion ? false : RISE_HIDDEN}
        whileInView={RISE_SHOWN}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE_LUXE }}
        className="mt-6 flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-brand/10 rounded-full p-1 shadow-sm"
        role="tablist"
        aria-label="Önizleme cihazı seçimi"
      >
        {DEVICE_ORDER.map((id) => {
          const { label, icon: Icon } = DEVICE_SPECS[id];
          const isActive = device === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setPreviewDevice(id)}
              className={`relative flex items-center gap-1.5 px-3.5 lg:px-4 py-2 rounded-full text-[11px] font-semibold cursor-pointer transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-muted hover:text-brand'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="device-switch-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 bg-brand rounded-full shadow-md shadow-brand/25"
                />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Tam Ekranda Görüntüle Button */}
      <motion.div
        initial={reduceMotion ? false : RISE_HIDDEN}
        whileInView={RISE_SHOWN}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXE }}
        className="w-full mt-4 flex justify-center"
      >
        <button
          onClick={handleFullscreen}
          className="w-full max-w-[280px] lg:max-w-[335px] bg-white/80 hover:bg-white text-brand border border-brand/10 hover:border-brand/25 py-3 rounded-xl font-bold text-xs shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Maximize2 size={16} />
          Tam Ekranda Görüntüle
        </button>
      </motion.div>

      {/* Animated scroll label - desktop only */}
      <motion.div
        initial={reduceMotion ? false : RISE_HIDDEN}
        whileInView={RISE_SHOWN}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE_LUXE }}
        className="hidden lg:flex gap-2 items-center text-muted text-xs font-semibold mt-6"
      >
        <div className="animate-bob-up-4">
          <Smartphone size={14} />
        </div>
        <span>Önizleme üzerinde deneyin! Katılım Bildir butonuna basıp form doldurabilirsiniz.</span>
      </motion.div>
    </div>
  );
}
