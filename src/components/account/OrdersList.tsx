import React from 'react';
import { motion } from 'motion/react';
import { OrderRecord } from '../../types';
import { PLAN_ICONS, PLAN_ICON_TONES } from '../payment/planVisuals';
import { formatTryMinor } from '../../utils/currency';
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, TIER_LABEL, formatAccountDate } from '../../utils/accountLabels';
import { cn } from '../../utils/cn';
import { duration, ease } from '../../utils/motion';

const PROMOTION_LABEL = { first_publish: 'İlk yayın indirimi', campaign: 'Kampanya indirimi' } as const;

/**
 * Sipariş geçmişi (Faz 14, `GET /orders`). Tutarlar siparişe DONDURULMUŞ
 * dökümden okunur (K128): kampanya bitse de o günkü fiyat görünür.
 * Alanlar eski backend için isteğe bağlı; yoksa satır tutarsız gösterilir.
 */
export function OrdersList({ orders }: { orders: OrderRecord[] }) {
  return (
    <ul className="divide-y divide-ink/[0.06]">
      {orders.map((order, index) => {
        const Icon = PLAN_ICONS[order.tier];
        const discount = order.discountMinor ?? 0;
        const giftShare = discount - (order.promotion?.discountMinor ?? 0);

        return (
          <motion.li
            key={order.orderId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.out, delay: Math.min(index, 8) * 0.03 }}
            className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className={cn('w-9 h-9 shrink-0 rounded-xl flex items-center justify-center', PLAN_ICON_TONES[order.tier])}>
                <Icon size={15} aria-hidden />
              </span>
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-semibold text-ink flex flex-wrap items-center gap-2">
                  {TIER_LABEL[order.tier]} plan
                  <span className={cn('text-[11px] font-semibold px-2.5 py-0.5 rounded-full border', ORDER_STATUS_TONE[order.status])}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </p>
                <p className="text-xs text-muted">{formatAccountDate(order.createdAt, true)}</p>
                {order.promotion && (
                  <p className="text-xs text-emerald-800">
                    {PROMOTION_LABEL[order.promotion.kind]}: −{formatTryMinor(order.promotion.discountMinor)}
                  </p>
                )}
                {giftShare > 0 && <p className="text-xs text-emerald-800">Hediye kodu: −{formatTryMinor(giftShare)}</p>}
                <p className="text-[11px] text-muted/80 font-mono">#{order.orderId.slice(-8).toUpperCase()}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              {order.totalMinor !== undefined && (
                <p className="text-sm font-semibold text-ink">
                  {order.totalMinor === 0 ? 'Ücretsiz' : formatTryMinor(order.totalMinor)}
                </p>
              )}
              {order.priceMinor !== undefined && order.totalMinor !== undefined && order.priceMinor > order.totalMinor && (
                <p className="text-xs text-muted line-through">{formatTryMinor(order.priceMinor)}</p>
              )}
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
