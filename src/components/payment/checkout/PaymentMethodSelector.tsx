import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Landmark } from 'lucide-react';
import { PaymentMethod } from '../../../types';
import { useCheckoutStore } from '../../../stores/useCheckoutStore';
import { CardBrandMark } from './CardBrandMark';
import { cn } from '../../../utils/cn';
import { spring } from '../../../utils/motion';

interface PaymentMethodSelectorProps {
  /** Havale hesabı yapılandırılmamışsa seçenek kapalı görünür. */
  bankTransferAvailable: boolean;
}

interface MethodOption {
  id: PaymentMethod;
  title: string;
  description: string;
  icon: typeof CreditCard;
}

const OPTIONS: MethodOption[] = [
  {
    id: 'card',
    title: 'Banka / Kredi Kartı',
    description: 'Visa, Mastercard ve Troy kartlarla güvenli ödeme',
    icon: CreditCard
  },
  {
    id: 'bank_transfer',
    title: 'Havale / EFT',
    description: 'Banka uygulamanızdan IBAN’ımıza gönderin',
    icon: Landmark
  }
];

/**
 * İki büyük seçim kartı. Seçili kartın çerçevesi tek bir öğedir ve
 * `layoutId` ile kartlar arasında kayar — iki ayrı çerçevenin söner/yanar
 * geçişi yerine seçimin "yer değiştirdiği" hissedilir.
 */
export function PaymentMethodSelector({ bankTransferAvailable }: PaymentMethodSelectorProps) {
  const method = useCheckoutStore((s) => s.method);
  const isProcessing = useCheckoutStore((s) => s.isProcessing);
  const selectMethod = useCheckoutStore((s) => s.selectMethod);

  return (
    <div role="radiogroup" aria-label="Ödeme yöntemi" className="grid sm:grid-cols-2 gap-3 md:gap-4">
      {OPTIONS.map((option) => {
        const active = method === option.id;
        const unavailable = option.id === 'bank_transfer' && !bankTransferAvailable;
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={unavailable || isProcessing}
            onClick={() => selectMethod(option.id)}
            className={cn(
              'group relative text-left rounded-3xl border bg-white p-5 transition duration-300 ease-luxe',
              active ? 'border-transparent shadow-xl shadow-brand/10' : 'border-ink/[0.07] shadow-sm',
              !active && !unavailable && 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/[0.06] hover:border-brand/25 cursor-pointer',
              unavailable && 'opacity-55 cursor-not-allowed',
              isProcessing && !active && 'opacity-50'
            )}
          >
            {active && (
              <motion.span
                layoutId="checkout-method-ring"
                transition={spring.snappy}
                className="absolute inset-0 rounded-3xl border-2 border-brand pointer-events-none"
              />
            )}

            <div className="flex items-start gap-4">
              <span
                className={cn(
                  'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300',
                  active ? 'bg-brand text-champagne' : 'bg-brand/[0.06] text-brand border border-brand/10'
                )}
              >
                <Icon size={19} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-serif text-base font-bold text-ink leading-tight">{option.title}</p>
                  {/* Radyo noktası */}
                  <span
                    aria-hidden
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300',
                      active ? 'border-brand' : 'border-ink/15'
                    )}
                  >
                    <motion.span
                      initial={false}
                      animate={{ scale: active ? 1 : 0 }}
                      transition={spring.snappy}
                      className="w-2.5 h-2.5 rounded-full bg-brand"
                    />
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {unavailable ? 'Şu an kullanılamıyor' : option.description}
                </p>

                {option.id === 'card' && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <CardBrandMark brand="visa" />
                    <CardBrandMark brand="mastercard" />
                    <CardBrandMark brand="troy" />
                  </div>
                )}
                {option.id === 'bank_transfer' && !unavailable && (
                  <p className="inline-flex items-center mt-3 text-[10px] font-semibold tracking-wide text-brand bg-brand/[0.05] border border-brand/10 rounded-full px-2.5 py-1 whitespace-nowrap">
                    Tüm bankalardan
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
