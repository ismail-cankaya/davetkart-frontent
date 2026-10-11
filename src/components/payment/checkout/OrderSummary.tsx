import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, LifeBuoy, Lock, MailOpen, ShieldCheck } from 'lucide-react';
import { SubscriptionPlan } from '../../../types';
import { PLAN_ICONS, PLAN_ICON_TONES } from '../planVisuals';
import { formatTry } from '../../../utils/currency';
import { cn } from '../../../utils/cn';
import { duration, ease } from '../../../utils/motion';

export interface InvitationSummary {
  /** Ekrana hazır isimler (`displayNames` uygulanmış). */
  names: string;
  categoryLabel: string | null;
}

interface OrderSummaryProps {
  plan: SubscriptionPlan;
  /** Davetiye tanınıyorsa gösterilir; hesap paketinde ya da bilinmiyorsa `null`. */
  invitation: InvitationSummary | null;
}

/**
 * Sağ sütundaki sipariş özeti: ne alınıyor, hangi davetiye için, toplam ne.
 *
 * 🔴 Fiyat buradan **gösterilir**, tahsil edilmez. Tahsil edilen tutarı
 * backend kendi config'inden okur (M6); `data.ts` kataloğu yalnızca vitrin.
 */
export function OrderSummary({ plan, invitation }: OrderSummaryProps) {
  const Icon = PLAN_ICONS[plan.id];
  const included = plan.features.filter((f) => f.included);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.panel, ease: ease.out, delay: 0.1 }}
      className="rounded-[2rem] bg-white border border-ink/[0.06] shadow-xl shadow-ink/[0.04] overflow-hidden"
    >
      <div className="p-6 md:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted mb-4">Sipariş Özeti</p>

        {/* Paket */}
        <div className="flex items-center gap-3.5">
          <span className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', PLAN_ICON_TONES[plan.id])}>
            <Icon size={20} />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-bold text-ink leading-tight">{plan.name} Paket</h2>
            <p className="text-xs text-muted leading-snug">{plan.tagline}</p>
          </div>
        </div>

        {invitation && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-cream/80 border border-ink/[0.05] px-4 py-3">
            <MailOpen size={16} className="text-brand shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Davetiye</p>
              <p className="text-sm font-semibold text-ink truncate">
                {invitation.names || 'İsimsiz davetiye'}
                {invitation.categoryLabel && <span className="text-muted font-normal"> · {invitation.categoryLabel}</span>}
              </p>
            </div>
          </div>
        )}

        {/* Paket içeriği — mobilde gizli: kullanıcı bu listeyi az önce plan duvarında gördü. */}
        <ul className="hidden lg:block mt-6 space-y-2.5">
          {included.map((feature, index) => (
            <motion.li
              key={feature.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: duration.base, ease: ease.out, delay: 0.2 + index * 0.04 }}
              className="flex items-start gap-2.5 text-[13px] text-ink/80"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-px">
                <Check size={10} strokeWidth={3.5} />
              </span>
              {feature.label}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Tutar */}
      <div className="border-t border-dashed border-ink/10 bg-cream/50 px-6 md:px-7 py-5 space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Paket bedeli</span>
          <span className="font-semibold text-ink">{formatTry(plan.price, true)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Ödeme türü</span>
          <span className="font-semibold text-ink">Tek seferlik</span>
        </div>
        <div className="flex items-end justify-between pt-3 mt-1 border-t border-ink/[0.06]">
          <span className="text-sm font-bold text-ink">Toplam</span>
          <span className="font-serif text-3xl font-bold text-brand leading-none">{formatTry(plan.price)}</span>
        </div>
      </div>

      {/* Güven satırı */}
      <div className="px-6 md:px-7 py-4 grid grid-cols-2 gap-3 border-t border-ink/[0.05]">
        <p className="flex items-center gap-2 text-[11px] text-muted leading-tight">
          <ShieldCheck size={15} className="text-brand shrink-0" />
          256-bit SSL ile şifreli bağlantı
        </p>
        <p className="flex items-center gap-2 text-[11px] text-muted leading-tight">
          <Lock size={14} className="text-brand shrink-0" />
          Kart bilgileri saklanmaz
        </p>
      </div>

      <Link
        to="/contact"
        target="_blank"
        rel="noopener"
        className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-deep text-emerald-100/70 text-xs hover:text-champagne transition-colors duration-300"
      >
        <LifeBuoy size={14} className="text-gold transition-transform duration-500 ease-luxe group-hover:rotate-90" />
        Ödemeyle ilgili bir sorun mu var? Bize yazın
      </Link>
    </motion.aside>
  );
}
