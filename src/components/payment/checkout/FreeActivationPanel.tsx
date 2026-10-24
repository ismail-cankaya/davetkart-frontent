import React, { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Gift, Loader2, Sparkles } from 'lucide-react';
import { CheckoutConsent } from './CheckoutConsent';
import { type CheckoutContext, useCheckoutStore } from '../../../stores/useCheckoutStore';
import { toast } from '../../ui/Toast';
import { toDisplayError } from '../../../utils/toDisplayError';
import { duration, ease, gesture } from '../../../utils/motion';

interface FreeActivationPanelProps {
  context: CheckoutContext;
}

/**
 * Hediye kodu toplamı **0**'a indirdiğinde kart ve havale yerine çizilen panel (Faz 11).
 *
 * Düğme aynı checkout'u çağırır (`startCardCheckout`); backend tutarın 0
 * olduğunu GÖRÜR ve siparişi sağlayıcıya gitmeden `paid` açar (K107). Panel
 * "bedava" kararını kendisi vermez: önizleme yalnızca ekranı değiştirir,
 * sonucu checkout yanıtındaki `status` söyler. Yanıt `pending` dönerse (kod
 * arada değişmiş) kullanıcı kart formuna geri döner.
 * Ayrıntılı açıklama: docs/rehber/src/components/payment/checkout/GiftCodeField.md §4
 */
export function FreeActivationPanel({ context }: FreeActivationPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const uid = useId();

  const isProcessing = useCheckoutStore((s) => s.isProcessing);
  const termsAccepted = useCheckoutStore((s) => s.termsAccepted);
  const startCardCheckout = useCheckoutStore((s) => s.startCardCheckout);
  const refreshGiftCode = useCheckoutStore((s) => s.refreshGiftCode);

  const handleActivate = async () => {
    if (isProcessing) return;
    setSubmitted(true);
    if (!termsAccepted) return;

    try {
      const result = await startCardCheckout(context);
      if (!result) return;

      // Kod arada değişti, sipariş ödenmemiş açıldı: sağlayıcıya GİDİLMEZ
      // (kullanıcı bedava bekliyordu). Önizleme yenilenir, gerçek toplam görünür.
      if (result.status !== 'paid') {
        toast(t('giftCode.free.changed'), 'info');
        await refreshGiftCode(context.tier);
        return;
      }

      if (!result.redirectUrl) return;

      // Hediye siparişinin adresi uygulama içi (`/odeme/basarili?order=…`):
      // sayfa yeniden yüklenmeden gidilir. Dış bir adres gelirse tam geçiş.
      if (result.redirectUrl.startsWith('/')) {
        navigate(result.redirectUrl);
      } else {
        window.location.href = result.redirectUrl;
      }
    } catch (error) {
      // Kod tükendiyse store önizlemeyi düşürür ve sayfa kart formuna döner.
      toast(toDisplayError(error), 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: duration.panel, ease: ease.out } }}
      className="space-y-6"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-deep text-white px-6 py-7 md:px-8">
        <Sparkles size={80} className="absolute -right-4 -top-4 text-white/[0.06]" />
        <span className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-champagne">
          <Gift size={22} />
        </span>
        <h2 className="font-serif text-2xl font-bold mt-4">{t('giftCode.free.title')}</h2>
        <p className="text-sm text-emerald-50/80 mt-2 leading-relaxed max-w-md">{t('giftCode.free.body')}</p>
      </div>

      <CheckoutConsent id={`${uid}-consent`} invalid={submitted} />

      <motion.button
        type="button"
        onClick={() => void handleActivate()}
        disabled={isProcessing}
        whileHover={isProcessing ? undefined : { y: -2, transition: gesture.hover }}
        whileTap={isProcessing ? undefined : { scale: 0.985, transition: gesture.press }}
        className="relative overflow-hidden w-full inline-flex items-center justify-center gap-2.5 bg-brand text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-brand-soft transition-colors duration-300 shadow-lg shadow-brand/20 disabled:cursor-wait disabled:opacity-80 cursor-pointer"
      >
        <span className="absolute inset-0 animate-shimmer pointer-events-none" />
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t('giftCode.free.processing')}
          </>
        ) : (
          <>
            <Gift size={15} />
            {t('giftCode.free.button')}
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
