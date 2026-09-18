import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../utils/cn';
import { SwitchTrack } from '../ui/Switch';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

interface ToggleRowProps {
  /** Wizard question, e.g. "Geri sayım sayacı eklensin mi?" */
  question: string;
  /** Short helper line under the question. */
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Extra fields revealed while the module is enabled. */
  children?: React.ReactNode;
}

/**
 * One Grup C wizard row: a module question with an on/off switch and an
 * animated collapsible area for the module's detail fields.
 */
export function ToggleRow({ question, hint, checked, onChange, children }: ToggleRowProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-colors duration-500',
        checked ? 'border-gold/30 bg-white/[0.05]' : 'border-white/10 bg-white/[0.02]'
      )}
    >
      {/* Satırın kendisi anahtardır: erişilebilir adı soru + ipucu metnidir.
          İçeride ikinci bir <button> (Switch) olamaz — görseli SwitchTrack çizer. */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
      >
        <span>
          <span className="block text-sm font-semibold text-white">{question}</span>
          {hint && <span className="block text-xs text-white/45 mt-0.5 leading-relaxed">{hint}</span>}
        </span>
        <SwitchTrack checked={checked} />
      </button>

      <AnimatePresence initial={false}>
        {checked && children && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_LUXE }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-4 border-t border-white/5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
