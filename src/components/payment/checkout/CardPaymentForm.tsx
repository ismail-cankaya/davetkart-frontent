import React, { useId, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Loader2, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CheckoutConsent } from './CheckoutConsent';
import { type CheckoutContext, useCheckoutStore } from '../../../stores/useCheckoutStore';
import { toast } from '../../ui/Toast';
import { formatTryMinor } from '../../../utils/currency';
import { toDisplayError } from '../../../utils/toDisplayError';
import { gesture } from '../../../utils/motion';

interface CardPaymentFormProps {
  context: CheckoutContext;
  /**
   * Gösterim tutarı, **kuruş**. Faz 11: hediye kodu varsa indirimli toplam.
   * Tahsil edilen tutarı backend belirler ve imzanın içine koyar.
   */
  amountMinor: number;
}

/**
 * Kartla ödeme — Faz 12: kart Shopier'in güvenli sayfasında yazılır.
 *
 * 🔴 **Bu bileşende kart alanı YOK.** Kart numarası, son kullanma ve CVC hiçbir
 * bileşenin state'ine, store'a, URL'ye ya da API'mize girmez (PCI DSS: kart
 * verisine dokunan her sistem denetim kapsamına girer; biz hiç dokunmuyoruz).
 * Düğme siparişi açar (`POST …/checkout`) ve sağlayıcıya geçer
 * (`goToProvider`: imzalı form otomatik POST edilir).
 *
 * | Sağlayıcı akışı | Durum |
 * |---|---|
 * | Barındırılan sayfa (Shopier klasik form) | ✅ **Faz 12** — alanlar kalktı, düğme "Güvenli ödeme sayfasına geç" |
 * | Doğrudan gönderim / tokenizasyon | Kullanılmıyor. Seçilirse alanlar geri gelir ve kart tarayıcıdan **doğrudan sağlayıcıya** gider, API'mize yalnızca jeton |
 *
 * Eski kart arayüzünün parçaları (`CardPreview`, `CardBrandMark`,
 * `utils/paymentCard`) artık kullanılmıyor; silinmeleri ayrı bir karar.
 */
export function CardPaymentForm({ context, amountMinor }: CardPaymentFormProps) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const isProcessing = useCheckoutStore((s) => s.isProcessing);
  const pendingOrder = useCheckoutStore((s) => s.pendingOrder);
  const termsAccepted = useCheckoutStore((s) => s.termsAccepted);
  const startCardCheckout = useCheckoutStore((s) => s.startCardCheckout);
  const goToProvider = useCheckoutStore((s) => s.goToProvider);

  const uid = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setSubmitted(true);
    if (!termsAccepted) return;

    try {
      const result = await startCardCheckout(context);
      if (!result) return;

      // Sayfa sağlayıcıya geçiyor; burada başka bir şey yapılmaz.
      if (goToProvider(result)) return;

      // Sipariş açıldı ama sağlayıcı sayfası gelmedi: "ödendi" demek yanlış olur.
      toast(t('providerCheckout.notStarted'), 'info');
    } catch (error) {
      toast(toDisplayError(error), 'error');
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} noValidate className="space-y-7">
      <div className="rounded-3xl bg-gradient-to-b from-brand/[0.05] via-champagne/20 to-transparent px-6 py-7 text-center space-y-3">
        <span className="w-12 h-12 mx-auto rounded-2xl bg-white border border-brand/10 flex items-center justify-center text-brand shadow-sm">
          <ShieldCheck size={22} />
        </span>
        <p className="text-[11px] font-bold text-muted uppercase tracking-wide">{t('providerCheckout.amountLabel')}</p>
        <p className="font-serif text-3xl font-bold text-ink">{formatTryMinor(amountMinor)}</p>
        <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto">{t('providerCheckout.explainer')}</p>
      </div>

      {/* 🔴 Sipariş açıldı ama yönlendirme olmadı: ortada ÖDENMEMİŞ bir sipariş
          var. Geçici bir toast bunu taşıyamaz; ekranda duran bir not gerekir. */}
      {pendingOrder && pendingOrder.status !== 'paid' && (
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold text-amber-900">{t('providerCheckout.pendingTitle')}</p>
          <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
            {t('providerCheckout.pendingBody', { orderId: pendingOrder.orderId })}
          </p>
        </div>
      )}

      <div className="space-y-5 pt-1">
        <CheckoutConsent id={`${uid}-consent`} invalid={submitted} />

        <motion.button
          type="submit"
          disabled={isProcessing}
          whileHover={isProcessing ? undefined : { y: -2, transition: gesture.hover }}
          whileTap={isProcessing ? undefined : { scale: 0.985, transition: gesture.press }}
          className="relative overflow-hidden w-full inline-flex items-center justify-center gap-2.5 bg-brand text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-brand-soft transition-colors duration-300 shadow-lg shadow-brand/20 disabled:cursor-wait disabled:opacity-80 cursor-pointer"
        >
          <span className="absolute inset-0 animate-shimmer pointer-events-none" />
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t('providerCheckout.processing')}
            </>
          ) : (
            <>
              <ExternalLink size={15} />
              {t('providerCheckout.button')}
            </>
          )}
        </motion.button>

        <p className="flex items-start justify-center gap-2 text-[11px] text-muted leading-relaxed text-center">
          <ShieldCheck size={14} className="text-brand shrink-0 mt-px" />
          {t('providerCheckout.note')}
        </p>
      </div>
    </form>
  );
}
