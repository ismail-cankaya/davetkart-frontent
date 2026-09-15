import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ChevronUp } from 'lucide-react';
import { BrandMark } from '../ui/BrandMark';
import { AssistantChat } from './AssistantChat';
import { AssistantLoginCta } from './AssistantLoginCta';
import { useAssistantChat } from './useAssistantChat';
import { AssistantWindowState } from './types';
import { useAuthStore } from '../../stores/useAuthStore';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

/**
 * Sağ altta yaşayan asistan: yuvarlak buton (FAB), Messenger tarzı açılır
 * sohbet penceresi, simge durumuna küçültülmüş mini bar ve tam ekran modu.
 * Uygulamanın geri kalanından tamamen bağımsızdır; App.tsx yalnızca
 * <AssistantWidget /> olarak bağlar.
 */
export function AssistantWidget() {
  const [windowState, setWindowState] = useState<AssistantWindowState>('closed');
  const chat = useAssistantChat();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const isOpen = windowState === 'open' || windowState === 'fullscreen';
  const isFullscreen = windowState === 'fullscreen';

  return (
    <>
      {/* Tam ekran arka plan karartması */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWindowState('open')}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[80]"
          />
        )}
      </AnimatePresence>

      {/* Sohbet penceresi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="assistant-window"
            layout
            initial={{ opacity: 0, y: 24, scale: 0.92, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.45, ease: EASE_LUXE }}
            className={`fixed z-[90] overflow-hidden bg-cream shadow-2xl shadow-ink/25 border border-ink/10 flex flex-col ${
              isFullscreen
                ? 'inset-2 md:inset-x-auto md:inset-y-6 md:right-6 md:w-[min(560px,calc(100vw-3rem))] rounded-2xl md:rounded-3xl'
                : 'bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] max-w-[380px] h-[min(560px,calc(100dvh-8rem))] rounded-3xl'
            }`}
          >
            {/* 🔴 Giriş duvarı (K72): asistan ucu auth'ludur çünkü her çağrı
                paradır ve harcama bir kimliğe yazılabilmelidir. Widget'ı
                tamamen gizlemek yerine sohbeti kapatıp sebebini söylüyoruz —
                gizlenen bir özellik kullanıcıya hiçbir şey anlatmaz. */}
            {isAuthenticated ? (
              <AssistantChat
                messages={chat.messages}
                isTyping={chat.isTyping}
                block={chat.block}
                isFullscreen={isFullscreen}
                onSend={chat.sendMessage}
                onMinimize={() => setWindowState('minimized')}
                onToggleFullscreen={() => setWindowState(isFullscreen ? 'open' : 'fullscreen')}
                onClose={() => setWindowState('closed')}
              />
            ) : (
              <AssistantLoginCta
                isFullscreen={isFullscreen}
                onMinimize={() => setWindowState('minimized')}
                onToggleFullscreen={() => setWindowState(isFullscreen ? 'open' : 'fullscreen')}
                onClose={() => setWindowState('closed')}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simge durumuna küçültülmüş mini bar */}
      <AnimatePresence>
        {windowState === 'minimized' && (
          <motion.button
            key="assistant-minibar"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.35, ease: EASE_LUXE }}
            onClick={() => setWindowState('open')}
            className="fixed bottom-24 right-4 md:right-6 z-[90] flex items-center gap-2.5 bg-gradient-to-r from-brand-deep to-brand text-white pl-2.5 pr-4 py-2 rounded-full shadow-xl shadow-brand/25 border border-gold/20 hover:-translate-y-0.5 transition-transform duration-300 cursor-pointer"
            aria-label="Sohbeti geri aç"
          >
            <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-champagne">
              <BrandMark size={15} />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border-2 border-brand rounded-full" />
            </span>
            <span className="font-serif font-bold text-xs">DavetKart Asistanı</span>
            <ChevronUp size={14} className="text-champagne/80" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Yuvarlak asistan butonu (FAB) */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.button
            key="assistant-fab"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: EASE_LUXE, delay: 0.2 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setWindowState(isOpen ? 'closed' : 'open')}
            aria-label={isOpen ? 'Asistanı kapat' : 'Asistanı aç'}
            className="fixed bottom-5 right-4 md:bottom-6 md:right-6 z-[95] w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-deep text-champagne shadow-xl shadow-brand/35 border border-gold/25 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 animate-shimmer pointer-events-none opacity-50" />
            {/* Nefes alan halka */}
            {!isOpen && (
              <motion.span
                animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-gold/50"
              />
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? 'close' : 'chat'}
                initial={{ opacity: 0, rotate: -50, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 50, scale: 0.6 }}
                transition={{ duration: 0.25 }}
                className="relative flex"
              >
                {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
