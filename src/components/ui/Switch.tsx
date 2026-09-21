import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';
import { spring } from '../../utils/motion';

interface SwitchTrackProps {
  checked: boolean;
  disabled?: boolean;
}

/**
 * Anahtarın yalnızca GÖRSELİ — etkileşimsiz ve erişilebilirlik ağacında yok.
 *
 * 🔴 Tıklanabilir bir satırın İÇİNDE `Switch` kullanılamaz: `Switch` bir
 * `<button>`'dır ve `<button>` içinde `<button>` geçersiz HTML'dir. React
 * konsola hata yazar, klavyede sekme iki ayrı denetime uğrar ve içteki anahtar
 * hiçbir şey yapmaz. O durumda satırın kendisi `role="switch"` olur ve görseli
 * bu bileşen çizer (bkz. `create/ToggleRow`).
 */
export function SwitchTrack({ checked, disabled = false }: SwitchTrackProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300',
        checked ? 'bg-gold border-gold' : 'bg-white/10 border-white/15',
        disabled && 'opacity-50'
      )}
    >
      <motion.span
        layout
        transition={spring.snappy}
        className={cn(
          'inline-block h-[18px] w-[18px] rounded-full shadow-sm',
          checked ? 'bg-brand-deep ml-[22px]' : 'bg-white/80 ml-[3px]'
        )}
      />
    </span>
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name for the control. */
  label: string;
  disabled?: boolean;
}

/**
 * Minimal shadcn-style toggle switch, themed for the dark wizard form.
 */
export function Switch({ checked, onChange, label, disabled = false }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex shrink-0 rounded-full cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
        disabled && 'cursor-not-allowed'
      )}
    >
      <SwitchTrack checked={checked} disabled={disabled} />
    </button>
  );
}
