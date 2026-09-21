import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Maximize2, Minimize2, Minus, SendHorizonal, X } from 'lucide-react';
import { BrandMark } from '../ui/BrandMark';
import { AssistantBlock, AssistantMessage } from './types';
import { ASSISTANT_MAX_PROMPT_CHARS } from '../../services/assistant';
import { ease } from '../../utils/motion';

interface AssistantChatProps {
  messages: AssistantMessage[];
  isTyping: boolean;
  /** Doluysa yazma alanı kapalıdır ve sebebi altta açıklanır. */
  block: AssistantBlock | null;
  isFullscreen: boolean;
  onSend: (text: string) => void;
  onMinimize: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <span className="w-7 h-7 shrink-0 rounded-full bg-brand text-champagne flex items-center justify-center">
        <BrandMark size={14} />
      </span>
      <div className="bg-white border border-ink/[0.06] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-brand/60"
          />
        ))}
      </div>
    </div>
  );
}

/** Sohbet penceresinin iç yüzü: başlık çubuğu, mesaj listesi ve giriş alanı. */
export function AssistantChat({
  messages,
  isTyping,
  block,
  isFullscreen,
  onSend,
  onMinimize,
  onToggleFullscreen,
  onClose
}: AssistantChatProps) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Yeni mesaj geldiğinde en alta kay
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const isBlocked = block !== null;

  const handleSend = () => {
    if (!draft.trim() || isBlocked) return;
    onSend(draft);
    setDraft('');
    inputRef.current?.focus();
  };

  const headerButton =
    'w-8 h-8 rounded-full flex items-center justify-center text-champagne/80 hover:text-white hover:bg-white/10 transition-colors duration-300 cursor-pointer';

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Header */}
      <div className="relative shrink-0 bg-gradient-to-r from-brand-deep via-brand to-brand-soft text-white px-4 py-3.5 flex items-center gap-3 overflow-hidden">
        <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-40" />
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-gold/30 text-champagne shrink-0">
          <BrandMark size={20} />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-brand rounded-full" />
        </div>
        <div className="relative flex-grow min-w-0">
          <p className="font-serif font-bold text-sm leading-tight">DavetKart Asistanı</p>
          <p className="text-[10px] text-champagne/70 tracking-wide">Çevrimiçi · Genellikle anında yanıtlar</p>
        </div>
        <div className="relative flex items-center gap-0.5 shrink-0">
          <button onClick={onToggleFullscreen} className={headerButton} aria-label={isFullscreen ? 'Küçült' : 'Tam ekran'}>
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button onClick={onMinimize} className={headerButton} aria-label="Simge durumuna küçült">
            <Minus size={16} />
          </button>
          <button onClick={onClose} className={headerButton} aria-label="Kapat">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto px-4 py-5 space-y-4 bg-[radial-gradient(ellipse_at_top,rgba(4,56,43,0.04),transparent_60%)]" data-lenis-prevent>
        <p className="text-center text-[10px] text-muted/70 uppercase tracking-[0.15em] font-semibold">Bugün</p>

        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: ease.out }}
              className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {!isUser && (
                <span className="w-7 h-7 shrink-0 rounded-full bg-brand text-champagne flex items-center justify-center">
                  <BrandMark size={14} />
                </span>
              )}
              <div className={`max-w-[78%] ${isUser ? 'text-right' : ''}`}>
                <div
                  className={`inline-block px-4 py-2.5 text-[13px] leading-relaxed text-left shadow-sm ${
                    isUser
                      ? 'bg-brand text-white rounded-2xl rounded-br-md'
                      : msg.variant === 'error'
                        /* Sistem bildirimi, asistanın cevabı DEĞİL. */
                        ? 'bg-amber-50 text-amber-900 border border-amber-300/60 rounded-2xl rounded-bl-md'
                        : 'bg-white text-ink border border-ink/[0.06] rounded-2xl rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
                <p className="text-[9px] text-muted/60 mt-1 px-1">{formatTime(msg.createdAt)}</p>
              </div>
            </motion.div>
          );
        })}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-ink/[0.06] bg-white/80 backdrop-blur-sm p-3">
        {/* 🔴 Engel sebebi yazma alanının YANINDA durur. Kullanıcı neden
            yazamadığını, yazmayı denemeden önce görmeli. */}
        {isBlocked && (
          <p className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-300/50 rounded-xl px-3 py-2 mb-2.5 leading-relaxed">
            <AlertTriangle size={13} className="shrink-0 mt-px" />
            {block.message}
          </p>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            disabled={isBlocked}
            // Üst sınır backend'in `assistant.max_prompt_chars` değeriyle
            // aynı: kullanıcı 422 almak yerine sınırı yazarken görmeli.
            maxLength={ASSISTANT_MAX_PROMPT_CHARS}
            placeholder={isBlocked ? 'Şu anda mesaj gönderilemiyor' : 'Mesajınızı yazın...'}
            className="flex-grow bg-cream border border-ink/10 rounded-full px-4 py-2.5 text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <motion.button
            whileHover={isBlocked ? undefined : { scale: 1.08 }}
            whileTap={isBlocked ? undefined : { scale: 0.92 }}
            onClick={handleSend}
            disabled={!draft.trim() || isBlocked}
            aria-label="Gönder"
            className="w-10 h-10 shrink-0 rounded-full bg-brand text-white flex items-center justify-center shadow-md shadow-brand/25 hover:bg-brand-soft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors duration-300"
          >
            <SendHorizonal size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
