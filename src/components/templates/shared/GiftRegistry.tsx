import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Invitation } from '../../../types';
import { cn } from '../../../utils/cn';
import { SectionTheme } from './palette';
import { TemplateFlavor } from './flavor';
import { GiftIcon, CopyIcon, CheckIcon } from './icons';
import { ease } from '../../../utils/motion';

interface GiftRegistryProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
}

/**
 * Gift / IBAN section — shadcn-minimal card with a one-tap IBAN copy button
 * and optional pre-set gift amount chips.
 */
export function GiftRegistry({ invitation, theme, flavor }: GiftRegistryProps) {
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const handleCopy = async () => {
    if (!invitation.iban) return;
    try {
      await navigator.clipboard.writeText(invitation.iban.replace(/\s+/g, ''));
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard access denied — the IBAN is still selectable as text.
    }
  };

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);

  return (
    <section className={cn('relative px-6 py-16', theme.page)}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: ease.out }}
        className="text-center mb-10"
      >
        <span className={cn('text-[10px] font-semibold tracking-[0.3em] uppercase', theme.accent)}>
          Hediye Takdiri
        </span>
        <h2 className={cn('font-serif text-2xl md:text-3xl font-bold mt-2', theme.heading)}>
          {flavor.headings.gift}
        </h2>
        <p className={cn('text-[13px] font-light mt-3 max-w-xs mx-auto leading-relaxed', theme.body)}>
          Varlığınız en büyük hediyemiz; yine de takdirinizi iletmek isterseniz hesap bilgilerimizi aşağıda bulabilirsiniz.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.95, ease: ease.out, delay: 0.1 }}
        className={cn('max-w-md mx-auto rounded-3xl border p-6 space-y-5', theme.surface, theme.border)}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              theme.accentSoft,
              theme.accent
            )}
          >
            <GiftIcon size={18} />
          </span>
          <div className="min-w-0">
            <p className={cn('font-semibold text-sm truncate', theme.heading)}>
              {invitation.bankName || 'Banka'}
            </p>
            <p className={cn('text-xs truncate', theme.body)}>{invitation.accountHolder || 'Hesap Sahibi'}</p>
          </div>
        </div>

        <div className={cn('h-px w-full', theme.divider)} />

        {/* IBAN row */}
        <div className={cn('rounded-xl border px-4 py-3 flex items-center justify-between gap-3', theme.border)}>
          <div className="min-w-0">
            <p className={cn('text-[9px] font-semibold tracking-[0.25em] uppercase', theme.body)}>IBAN</p>
            <p className={cn('font-mono text-[13px] tracking-wide truncate mt-0.5', theme.heading)}>
              {invitation.iban || 'TR__ ____ ____ ____ ____ ____ __'}
            </p>
          </div>
          <motion.button
            type="button"
            onClick={handleCopy}
            whileTap={{ scale: 0.92 }}
            aria-label="IBAN'ı kopyala"
            className={cn(
              'shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold transition-colors duration-300 cursor-pointer',
              copied ? 'bg-emerald-500/15 text-emerald-500' : theme.buttonGhost
            )}
          >
            {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </motion.button>
        </div>

        {/* Pre-set amounts */}
        {invitation.giftOptions.length > 0 && (
          <div>
            <p className={cn('text-[10px] font-semibold tracking-[0.2em] uppercase mb-2.5', theme.body)}>
              Hediye Miktarı Önerileri
            </p>
            <div className="flex flex-wrap gap-2">
              {invitation.giftOptions.map((amount) => {
                const isActive = selectedAmount === amount;
                return (
                  <motion.button
                    key={amount}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setSelectedAmount(isActive ? null : amount)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-xs font-bold transition duration-300 cursor-pointer',
                      isActive
                        ? cn(theme.accentBg, theme.id === 'midnight' ? 'text-slate-950 border-transparent' : 'text-stone-50 border-transparent')
                        : cn(theme.border, theme.heading, 'hover:opacity-80')
                    )}
                  >
                    {formatAmount(amount)}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
