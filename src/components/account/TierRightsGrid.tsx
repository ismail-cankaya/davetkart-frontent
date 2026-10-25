import React from 'react';
import { motion } from 'motion/react';
import { TierEntitlementCounts } from '../../types';
import { PLAN_ICONS, PLAN_ICON_TONES } from '../payment/planVisuals';
import { TIER_LABEL } from '../../utils/accountLabels';
import { cn } from '../../utils/cn';
import { duration, ease } from '../../utils/motion';

interface TierRightsGridProps {
  tiers: TierEntitlementCounts[];
  /** Genel bakışta yalnızca büyük sayı; Planlarım'da kovaların dökümü de. */
  compact?: boolean;
}

/**
 * Üç plan kartı: büyük sayı = KULLANILABİLİR hak (Faz 14, K140).
 *
 * Sayılar backend'den gelir; burada toplama/çıkarma yok. "2 aldı, 1'ini iptal
 * etti" gibi bir durumun doğru sayısı sunucunun kural kümesinde (iade, yanma,
 * dondurma) — burada yeniden hesaplanırsa iki kural ayrışır.
 */
export function TierRightsGrid({ tiers, compact = false }: TierRightsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {tiers.map((tier, index) => {
        const Icon = PLAN_ICONS[tier.tier];
        const details = [
          { label: 'Kullanımda', value: tier.inUse },
          { label: 'İptal bekliyor', value: tier.refundRequested },
          { label: 'Ödeme bekliyor', value: tier.pending },
          { label: 'Kullanıldı', value: tier.consumed },
          { label: 'İade edildi', value: tier.refunded },
        ].filter(detail => detail.value > 0);

        return (
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.out, delay: index * 0.05 }}
            className={cn(
              'rounded-2xl border p-5 space-y-4 transition-colors duration-300',
              tier.available > 0 ? 'bg-white border-brand/15 shadow-sm' : 'bg-cream/60 border-ink/[0.06]',
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn('w-9 h-9 rounded-xl flex items-center justify-center', PLAN_ICON_TONES[tier.tier])}>
                <Icon size={16} aria-hidden />
              </span>
              <span className="text-xs font-bold tracking-[0.12em] uppercase text-muted">{TIER_LABEL[tier.tier]}</span>
            </div>

            <div>
              <motion.p
                key={tier.available}
                initial={{ opacity: 0.4, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: duration.base, ease: ease.out }}
                className={cn('font-serif text-4xl font-bold', tier.available > 0 ? 'text-brand' : 'text-ink/30')}
              >
                {tier.available}
              </motion.p>
              <p className="text-xs text-muted mt-1">kullanılabilir hak</p>
            </div>

            {!compact && details.length > 0 && (
              <ul className="pt-3 border-t border-ink/[0.06] space-y-1 text-xs text-muted">
                {details.map(detail => (
                  <li key={detail.label} className="flex justify-between">
                    <span>{detail.label}</span>
                    <span className="font-semibold text-ink">{detail.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
