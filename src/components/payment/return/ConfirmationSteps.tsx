import React from 'react';
import { motion } from 'motion/react';
import { Check, Hourglass, Loader2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../../data';
import { SubscriptionTier } from '../../../types';
import { duration, ease } from '../../../utils/motion';

type StepState = 'done' | 'active' | 'stalled' | 'upcoming';

interface Step {
  label: string;
  detail: string;
  state: StepState;
}

function StepMarker({ state }: { state: StepState }) {
  switch (state) {
    case 'done':
      return (
        <span className="w-8 h-8 rounded-full bg-brand text-champagne flex items-center justify-center shadow-md shadow-brand/20">
          <Check size={15} strokeWidth={3} />
        </span>
      );
    case 'active':
      return (
        <span className="w-8 h-8 rounded-full bg-white border-2 border-brand/25 text-brand flex items-center justify-center">
          <Loader2 size={15} className="animate-spin motion-reduce:animate-none" />
        </span>
      );
    case 'stalled':
      return (
        <span className="w-8 h-8 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-600 flex items-center justify-center">
          <Hourglass size={14} />
        </span>
      );
    case 'upcoming':
      return <span className="block w-8 h-8 rounded-full bg-white border-2 border-dashed border-ink/15" />;
  }
}

interface ConfirmationStepsProps {
  tier: SubscriptionTier | null;
  /** Yoklama bütçesi bitti, onay hâlâ gelmedi. */
  stalled: boolean;
}

/**
 * Sağlayıcıdan dönüş ile onay arasındaki boşluğu görünür kılar.
 *
 * 🔴 Kullanıcı *"ödeme sayfası bitti ama neden hâlâ bekliyorum?"* diye sorar.
 * Cevap, ödemenin iki ayrı olay olmasıdır: tarayıcının geri dönmesi ve
 * sağlayıcının sunucuya haber vermesi (webhook). Adımlar bu ayrımı teknik
 * terim kullanmadan anlatır.
 */
export function ConfirmationSteps({ tier, stalled }: ConfirmationStepsProps) {
  const plan = tier ? SUBSCRIPTION_PLANS.find((p) => p.id === tier) : undefined;

  const steps: Step[] = [
    {
      label: 'Sipariş oluşturuldu',
      detail: plan ? `${plan.name} Paket · ₺${plan.price}` : 'Seçtiğiniz paket',
      state: 'done'
    },
    { label: 'Ödeme sayfası tamamlandı', detail: 'Güvenli ödeme sağlayıcısından dönüldü', state: 'done' },
    {
      label: 'Ödeme onayı',
      detail: stalled ? 'Beklenenden uzun sürüyor' : 'Sağlayıcıdan onay bekleniyor…',
      state: stalled ? 'stalled' : 'active'
    },
    { label: 'Yayına hazır', detail: 'Onaydan sonra davetiyenizi tek tıkla yayınlayın', state: 'upcoming' }
  ];

  return (
    <ol className="bg-white rounded-3xl border border-ink/[0.06] shadow-xl shadow-ink/[0.05] p-5 md:p-6">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <motion.li
            key={step.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: duration.base, ease: ease.out, delay: 0.1 + i * 0.06 }}
            className="relative flex gap-4"
          >
            {/* Bağlantı çizgisi: tamamlanan adımdan sonra dolu, kalanlarda kesik. */}
            {!isLast && (
              <span
                aria-hidden
                className={`absolute left-4 top-9 bottom-1 -translate-x-1/2 ${
                  step.state === 'done' ? 'w-px bg-brand/30' : 'w-0 border-l border-dashed border-ink/15'
                }`}
              />
            )}
            <span className="relative shrink-0">
              <StepMarker state={step.state} />
            </span>
            <div className={`min-w-0 ${isLast ? '' : 'pb-5'}`}>
              <p
                className={`text-sm font-semibold leading-8 ${
                  step.state === 'upcoming' ? 'text-ink/40' : step.state === 'stalled' ? 'text-amber-800' : 'text-ink'
                }`}
              >
                {step.label}
              </p>
              <p className="text-xs text-muted leading-relaxed -mt-1">{step.detail}</p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
