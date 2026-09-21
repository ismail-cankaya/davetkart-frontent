import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WandSparkles } from 'lucide-react';
import { useCreateWizardStore } from '../../stores/useCreateWizardStore';
import { scrollToTarget } from '../../hooks/useLenis';
import { duration, ease } from '../../utils/motion';

const LOADING_MESSAGES = [
  'Tasarımınız hazırlanıyor...',
  'Yapay zeka şablonu özelleştiriyor...',
  'Renk paleti ve tipografi uygulanıyor...',
  'Son dokunuşlar ekleniyor...'
] as const;

/**
 * Sahnelenmiş "üretim" süresi. İlk seferde tam gösteri kişiselleştirme anını
 * hissettirir; aynı cihazda ikinci davetiyeyi oluşturan kullanıcıyı aynı
 * 2.8 sn'lik gösteriye yeniden oturtmak ise yalnızca gecikmedir.
 */
const FIRST_RUN_MS = 2800;
const REPEAT_RUN_MS = 1200;
const SEEN_KEY = 'davetkart_generation_seen';
/**
 * Mesaj değişimi (çıkış + giriş, mode="wait") ~0.56 sn sürer; daha sık
 * değişen mesajlar birbirini yutardı. Kısa gösteride bu yüzden iki mesaj okunur.
 */
const MIN_MESSAGE_MS = 600;

function hasSeenGeneration(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markGenerationSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Private-mode/quota failures only cost the shorter repeat run.
  }
}

/**
 * Wizard step 3 — theatrical loading screen between the form and the editor.
 * The delay is intentional: it sells the personalization moment.
 */
export function GenerationLoader() {
  const completeGeneration = useCreateWizardStore(s => s.completeGeneration);
  const [messageIndex, setMessageIndex] = useState(0);
  // Mount'ta bir kez okunur: gösteri ortasında süre değişmez.
  const [runMs] = useState(() => (hasSeenGeneration() ? REPEAT_RUN_MS : FIRST_RUN_MS));

  useEffect(() => {
    scrollToTarget(0, { immediate: true });
    markGenerationSeen();
    // Mesajlar sürenin tamamına yayılır, ama biri okunmadan diğeri gelmez.
    const messageTimer = window.setInterval(
      () => setMessageIndex(i => Math.min(i + 1, LOADING_MESSAGES.length - 1)),
      Math.max(runMs / LOADING_MESSAGES.length, MIN_MESSAGE_MS)
    );
    const doneTimer = window.setTimeout(completeGeneration, runMs);
    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(doneTimer);
    };
  }, [completeGeneration, runMs]);

  return (
    <motion.section
      className="min-h-[calc(100dvh-76px)] bg-gradient-to-b from-brand-deep via-emerald-950 to-brand-deep text-white flex flex-col items-center justify-center relative overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.panel, ease: ease.out }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-800/25 rounded-full blur-3xl animate-float-gentle" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Spinner: slow gold ring + counter-rotating dashed ring + pulsing core */}
        <div className="relative w-28 h-28 mb-10">
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold border-r-gold/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="absolute inset-3 rounded-full border border-dashed border-champagne/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-champagne"
            animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <WandSparkles size={30} strokeWidth={1.6} />
          </motion.span>
        </div>

        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
          Davetiyeniz <span className="italic text-champagne font-medium">hazırlanıyor</span>
        </h2>

        {/* Rotating status line */}
        <div className="h-6 relative w-72 md:w-96">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="absolute inset-0 text-emerald-100/70 text-sm"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress shimmer bar */}
        <div className="w-56 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
          {/* scaleX, width değil: gösteri boyunca her karede layout yerine
              yalnızca transform. Uç yuvarlaklığını kapsayıcının kırpması verir. */}
          <motion.span
            className="block h-full w-full origin-left rtl:origin-right bg-gradient-to-r from-gold via-champagne to-gold"
            initial={{ scaleX: 0.05 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: runMs / 1000, ease: ease.inOut }}
          />
        </div>
      </div>
    </motion.section>
  );
}
