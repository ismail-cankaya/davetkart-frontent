import React from 'react';
import { useTranslation } from 'react-i18next';
import { BadgePercent, RefreshCw } from 'lucide-react';
import { PlanPrice, PlanPromotion } from '../../types';
import type { PricingStatus } from '../../stores/usePricingStore';
import { formatTryMinor } from '../../utils/currency';
import { cn } from '../../utils/cn';

/**
 * Kampanya bitişinin gösterildiği saat dilimi. Backend kampanyayı işletmenin
 * saatine göre "o günün sonu" olarak kurar (`--until=2027-01-07` → İstanbul
 * 23:59:59); başka bir saat dilimindeki ziyaretçi "8 Ocak" görmesin.
 */
const BUSINESS_TIME_ZONE = 'Europe/Istanbul';

/** "7 Ocak" — kullanıcının dilinde, işletmenin saatinde. */
export function formatPromotionEnd(endsAt: string, language: string): string {
  return new Date(endsAt).toLocaleDateString(language, { day: 'numeric', month: 'long', timeZone: BUSINESS_TIME_ZONE });
}

/** İndirimin rozet metni: "İlk yayına %60 indirim" · "%20 kampanya indirimi · 7 Ocak tarihine kadar". */
export function usePromotionLabel(): (promotion: PlanPromotion) => string {
  const { t, i18n } = useTranslation();

  return (promotion) => {
    const label = t(`pricing.badge.${promotion.kind}`, { percent: promotion.percent });
    return promotion.endsAt
      ? `${label} · ${t('pricing.until', { date: formatPromotionEnd(promotion.endsAt, i18n.language) })}`
      : label;
  };
}

interface PlanPriceTagProps {
  price: PlanPrice | null;
  status: PricingStatus;
  /** Fiyatın yanındaki küçük yazı ("/ tek seferlik"). */
  suffix?: string;
  /** Koyu zeminli kart (fiyat sayfasının öne çıkan paketi). */
  inverted?: boolean;
  size?: 'md' | 'lg';
  onRetry?: () => void;
}

/**
 * Bir paketin fiyatı: indirim varsa üstü çizili liste fiyatı + ödenecek tutar
 * + rozet (Faz 13).
 *
 * 🔴 HİÇBİR sayı burada hesaplanmaz. Üstü çizili sayı `priceMinor`, büyük
 * sayı `totalMinor`: ikisi de backend'in tahsil edeceği hesaptan (K128).
 * Katalog yoksa sayı UYDURULMAZ: yükleniyor iskeleti ya da "gösterilemiyor".
 * Ayrıntılı açıklama: docs/rehber/src/components/payment/PlanPriceTag.md
 */
export function PlanPriceTag({ price, status, suffix, inverted = false, size = 'md', onRetry }: PlanPriceTagProps) {
  const { t } = useTranslation();
  const promotionLabel = usePromotionLabel();
  const muted = inverted ? 'text-emerald-100/60' : 'text-muted';

  if (!price) {
    if (status === 'error') {
      return (
        <div className={cn('flex items-center gap-2 text-xs', muted)} role="status">
          <span>{t('pricing.unavailable')}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 cursor-pointer"
            >
              <RefreshCw size={12} />
              {t('pricing.retry')}
            </button>
          )}
        </div>
      );
    }

    return (
      <div aria-busy="true" aria-label={t('pricing.loading')} className="space-y-2">
        <span className={cn('block rounded-lg animate-pulse', size === 'lg' ? 'h-10 w-32' : 'h-8 w-24', inverted ? 'bg-white/10' : 'bg-ink/[0.06]')} />
      </div>
    );
  }

  const discounted = price.discountMinor > 0;

  return (
    <div className="space-y-1.5">
      {discounted && (
        <p className={cn('text-xs line-through decoration-1', muted)}>
          <span className="sr-only">{t('pricing.listPrice')}: </span>
          {formatTryMinor(price.priceMinor)}
        </p>
      )}
      <p className="flex items-baseline gap-1.5">
        <span className={cn('font-serif font-bold', size === 'lg' ? 'text-4xl' : 'text-3xl', !inverted && 'text-ink')}>
          {formatTryMinor(price.totalMinor)}
        </span>
        {suffix && <span className={cn('text-[11px]', muted)}>{suffix}</span>}
      </p>
      {price.promotion && (
        <p
          className={cn(
            'inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1',
            inverted ? 'bg-gold/15 text-gold' : 'bg-emerald-50 text-emerald-700 border border-emerald-100',
          )}
        >
          <BadgePercent size={12} className="shrink-0" />
          {promotionLabel(price.promotion)}
        </p>
      )}
    </div>
  );
}
