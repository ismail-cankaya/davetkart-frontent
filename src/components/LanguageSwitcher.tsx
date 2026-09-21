import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { duration, ease } from '../utils/motion';

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.base, ease: ease.out, staggerChildren: 0.025 }
  },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: duration.fast, ease: ease.in } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: duration.base, ease: ease.out } }
};

interface LanguageSwitcherProps {
  /**
   * 'dropdown' (default): the compact globe pill with a floating menu, for
   * the desktop header. 'inline': a flat chip grid that renders fully inside
   * clipping containers (the mobile hamburger menu has overflow-hidden, so a
   * floating dropdown would be cut off there).
   */
  variant?: 'dropdown' | 'inline';
}

export const LanguageSwitcher = React.memo(function LanguageSwitcher({ variant = 'dropdown' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCode = (i18n.resolvedLanguage ?? i18n.language ?? 'en').split('-')[0];

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectLanguage = (code: string) => {
    // No page reload: react-i18next re-renders every consumer instantly and
    // the languagedetector persists the choice to localStorage.
    i18n.changeLanguage(code);
    setOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3 text-muted">
          <Globe size={14} className="shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-[0.12em]">Dil / Language</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {SUPPORTED_LANGUAGES.map(lang => {
            const active = lang.code === currentCode;
            return (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                title={lang.nativeName}
                aria-pressed={active}
                className={`h-9 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition duration-300 cursor-pointer ${
                  active
                    ? 'bg-brand text-white border-brand shadow-md shadow-brand/20'
                    : 'bg-white/70 border-ink/10 text-muted hover:text-brand hover:border-brand/25 hover:bg-white'
                }`}
              >
                {lang.code}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className={`flex items-center gap-1.5 h-9 ps-3 pe-2.5 rounded-full border text-xs font-bold tracking-wider uppercase transition duration-300 cursor-pointer ${
          open
            ? 'border-brand/25 bg-brand/[0.06] text-brand'
            : 'border-ink/10 bg-white/60 text-muted hover:text-brand hover:border-brand/20 hover:bg-white'
        }`}
      >
        <Globe size={14} className="shrink-0" />
        <span>{currentCode}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex">
          <ChevronDown size={13} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute end-0 top-full mt-2 w-48 max-h-[70vh] overflow-y-auto origin-top rounded-2xl border border-ink/8 bg-white/95 backdrop-blur-xl shadow-xl shadow-ink/10 p-1.5 z-50"
          >
            {SUPPORTED_LANGUAGES.map(lang => {
              const active = lang.code === currentCode;
              return (
                <motion.li key={lang.code} variants={itemVariants}>
                  <button
                    role="option"
                    aria-selected={active}
                    onClick={() => selectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm transition-colors duration-200 cursor-pointer ${
                      active
                        ? 'bg-brand/[0.07] text-brand font-semibold'
                        : 'text-muted hover:text-brand hover:bg-brand/[0.04]'
                    }`}
                  >
                    <span className="flex items-baseline gap-2 text-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted/70 w-5 shrink-0">
                        {lang.code}
                      </span>
                      {lang.nativeName}
                    </span>
                    {active && <Check size={14} className="text-gold shrink-0" />}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
});
