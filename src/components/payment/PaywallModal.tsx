import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BadgeCheck, Check, Crown, Feather, Gem, Loader2, Lock, Minus, ShieldCheck, X } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../data';
import { TIER_RANK, useSubscriptionStore } from '../../stores/useSubscriptionStore';
import { SubscriptionTier } from '../../types';
import { toast } from '../ui/Toast';
import { toDisplayError } from '../../utils/toDisplayError';
import { backdropVariants, duration, ease, gesture, modalVariants } from '../../utils/motion';

const PLAN_ICONS: Record<SubscriptionTier, typeof Crown> = {
  standart: Feather,
  gold: Crown,
  elit: Gem
};

/**
 * Yayınlama 402 ile reddedildiğinde açılan plan duvarı.
 *
 * 🔴 Bu ekran bir ödeme ekranı DEĞİLDİR. Buradaki eylem bir sipariş başlatır
 * (`status: 'pending'`) ve kullanıcıyı sağlayıcının ödeme sayfasına
 * gönderir; tahsilat uygulamanın dışında, webhook ile tamamlanır. Bu yüzden
 * hiçbir metin "ödendi" ya da "yayınlandı" demez — eski "Satın Al ve Yayınla"
 * düğmesi tutamayacağı bir söz veriyordu.
 *
 * Duvarın açılma sebebi iki türlüdür ve metinler ona göre değişir:
 * *"önce bir plan al"* ile *"planını yükselt"* aynı cümle değildir.
 *
 * 🔴 `document.body`'ye PORTAL ile basılır. EditorWorkspace'in sarmalayıcısı
 * Motion'ın giriş `transform`'unu taşır; bu, `fixed` konumlu bir torunu ekrana
 * değil sayfaya hapseder — katman sayfa boyu uzar ve kaydırılacak bir şey
 * kalmaz (bkz. ThemePickerModal / MapPickerModal'daki aynı ders).
 */
export function PaywallModal() {
  const isOpen = useSubscriptionStore((s) => s.isPaywallOpen);
  const requiredTier = useSubscriptionStore((s) => s.requiredTier);
  const selectedTier = useSubscriptionStore((s) => s.selectedTier);
  const isProcessing = useSubscriptionStore((s) => s.isProcessing);
  const reason = useSubscriptionStore((s) => s.reason);
  const pendingOrder = useSubscriptionStore((s) => s.pendingOrder);
  const closePaywall = useSubscriptionStore((s) => s.closePaywall);
  const selectTier = useSubscriptionStore((s) => s.selectTier);
  const startCheckout = useSubscriptionStore((s) => s.startCheckout);

  const recommendedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === requiredTier);
  const isUpgrade = reason === 'upgrade';

  // The page behind the wall must not scroll while the modal is up.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePaywall();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closePaywall]);

  const handleCheckout = async (tier: SubscriptionTier) => {
    selectTier(tier);

    try {
      const result = await startCheckout(tier);
      if (!result) return;

      // 🔴 `redirectUrl` opsiyoneldir: yoksa anahtar HİÇ GELMEZ, `null`
      // gelmez (C7). Bu yüzden kontrol `undefined` üzerinedir.
      if (result.redirectUrl !== undefined) {
        // Uygulamadan ayrılıyoruz; ödeme sağlayıcının sayfasında tamamlanır.
        window.location.href = result.redirectUrl;
        return;
      }

      // Sipariş oluştu ama ödeme sayfası gelmedi. Kullanıcıya "tamamlandı"
      // demek yanlış olurdu — sipariş `pending` ve hiçbir hak doğmadı.
      toast('Siparişiniz oluşturuldu, ancak ödeme sayfası açılamadı. Lütfen birazdan tekrar deneyin.', 'info');
    } catch (error) {
      toast(toDisplayError(error), 'error');
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        // 🔴 Kaydırma kabı TEK ve o da bu katmandır. Küçük ekranda üç plan
        // kartı alt alta dizilir ve pencere ekrandan uzun olur:
        //  - `data-lenis-prevent` olmadan Lenis tekerlek/trackpad olayını
        //    `preventDefault` ile yutar ve kilitli sayfayı kaydırmaya çalışır;
        //    pencere hiç kaymaz.
        //  - Kart `max-h-full` ile kendi içinde kaydığında, kartın dışındaki
        //    boşluktan başlayan dokunuş hiçbir şeyi kaydırmıyordu. Kart doğal
        //    boyunda kalır, katmanın tamamı kayar; `overscroll-contain` sonda
        //    arkadaki sayfaya taşmayı keser.
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="shown"
          exit="exit"
          onClick={closePaywall}
          data-lenis-prevent
          className="fixed inset-0 z-[90] bg-ink/45 backdrop-blur-md flex justify-center p-4 md:p-8 overflow-y-auto overscroll-contain"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="shown"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            // `my-auto`: sığdığında dikeyde ortalar, sığmadığında üstten başlar
            // (`items-center` taşan kartın tepesini ulaşılamaz yapardı).
            className="relative w-full max-w-5xl bg-cream rounded-[2rem] shadow-2xl shadow-ink/30 border border-white/40 my-auto"
          >
            {/* Close */}
            <motion.button
              // Kapat düğmeleri tek dilde konuşur (bkz. ConfirmDialog): hover renk, basış küçülme.
              whileTap={{ scale: 0.92, transition: gesture.press }}
              onClick={closePaywall}
              disabled={isProcessing}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white border border-ink/10 text-muted hover:text-ink shadow-sm transition-colors cursor-pointer disabled:opacity-40"
            >
              <X size={16} />
            </motion.button>

            <div className="p-6 md:p-10">
              {/* Header */}
              <div className="text-center mb-8 md:mb-10">
                <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
                  {isUpgrade ? 'Planınızı Yükseltin' : 'Yayınlamaya Bir Adım Kaldı'}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink">
                  {isUpgrade ? (
                    <>
                      Mevcut planınız <span className="italic text-brand font-medium">bu davetiyeye yetmiyor</span>
                    </>
                  ) : (
                    <>
                      Davetiyenize uygun <span className="italic text-brand font-medium">paketi seçin</span>
                    </>
                  )}
                </h2>
                <p className="text-muted text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                  {isUpgrade ? (
                    <>
                      Davetiyenizde açık olan modüller{' '}
                      <span className="font-semibold text-ink">{recommendedPlan?.name} Paket</span> gerektiriyor.
                      Yükseltme tek seferlik ödemedir.
                    </>
                  ) : (
                    <>
                      Davetiyenizde kullandığınız modüllere göre sizin için{' '}
                      <span className="font-semibold text-ink">{recommendedPlan?.name} Paket</span>&apos;i öneriyoruz.
                      Tüm paketler tek seferlik ödemedir.
                    </>
                  )}
                </p>

                {/* 🔴 Ödemenin nerede tamamlandığı ÖNCEDEN söylenir. Kullanıcı
                    sağlayıcının sayfasına gittiğinde şaşırmamalı. */}
                <p className="text-[11px] text-muted/80 mt-4 max-w-md mx-auto leading-relaxed">
                  Ödeme, güvenli ödeme sayfasında tamamlanır. Ödemeniz onaylandıktan sonra
                  davetiyenizi yayınlayabilirsiniz.
                </p>

                {/* 🔴 Sipariş açıldı ama kullanıcı hâlâ burada: yönlendirme
                    gerçekleşmedi. Geçici bir toast bu durumu taşıyamaz —
                    ekranda duran bir uyarı gerekir, çünkü ortada ÖDENMEMİŞ bir
                    sipariş var ve kullanıcının bunu bilmesi gerekiyor. */}
                {pendingOrder && pendingOrder.status !== 'paid' && (
                  <div className="mt-6 mx-auto max-w-md rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-left">
                    <p className="text-xs font-semibold text-amber-900">
                      Ödemeniz henüz tamamlanmadı
                    </p>
                    <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
                      <span className="font-mono">{pendingOrder.orderId}</span> numaralı siparişiniz
                      oluşturuldu. Ödeme sayfasına ulaşılamadığı için tahsilat yapılmadı; aşağıdan
                      tekrar deneyebilirsiniz.
                    </p>
                  </div>
                )}
              </div>

              {/* Plan cards */}
              <div className="grid md:grid-cols-3 gap-4 md:gap-5 items-stretch">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const Icon = PLAN_ICONS[plan.id];
                  const isRecommended = plan.id === requiredTier;
                  const isSelected = plan.id === selectedTier;
                  const isLocked = TIER_RANK[plan.id] < TIER_RANK[requiredTier];
                  const isBuying = isProcessing && isSelected;

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: duration.panel, ease: ease.out, delay: TIER_RANK[plan.id] * 0.05 }}
                      onClick={() => !isLocked && !isProcessing && selectTier(plan.id)}
                      className={`relative flex flex-col rounded-3xl border-2 p-5 md:p-6 pt-7 transition duration-300 ease-luxe ${
                        isLocked
                          ? 'bg-white/50 border-ink/[0.05] opacity-55'
                          : isSelected
                            ? 'bg-white border-brand shadow-xl shadow-brand/10 cursor-pointer'
                            : 'bg-white border-ink/[0.06] shadow-md shadow-ink/[0.04] hover:border-brand/35 hover:-translate-y-1 cursor-pointer'
                      }`}
                    >
                      {isRecommended && (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap inline-flex items-center gap-1.5 bg-brand text-white text-[10px] font-bold tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-full shadow-md shadow-brand/25">
                          <BadgeCheck size={12} />
                          Tavsiye Edilen
                        </span>
                      )}

                      {/* Plan identity */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            plan.id === 'elit'
                              ? 'bg-ink text-champagne'
                              : plan.id === 'gold'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          <Icon size={18} />
                        </span>
                        <div>
                          <h3 className="font-serif text-lg font-bold text-ink leading-tight">{plan.name} Paket</h3>
                          <p className="text-[11px] text-muted leading-snug">{plan.tagline}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 mb-5">
                        <span className="font-serif text-3xl font-bold text-ink">₺{plan.price}</span>
                        <span className="text-[11px] text-muted">/ tek seferlik</span>
                      </div>

                      {/* Feature list */}
                      <ul className="space-y-2.5 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature.label} className="flex items-start gap-2 text-xs">
                            {feature.included ? (
                              <Check size={14} className="text-emerald-500 shrink-0 mt-px" strokeWidth={3} />
                            ) : (
                              <Minus size={14} className="text-stone-300 shrink-0 mt-px" />
                            )}
                            <span className={feature.included ? 'text-ink/80' : 'text-stone-400 line-through decoration-stone-300'}>
                              {feature.label}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Buy */}
                      <div className="mt-auto">
                        {isLocked ? (
                          <div className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-400 px-5 py-3.5 rounded-xl font-semibold text-xs cursor-not-allowed">
                            <Lock size={13} />
                            Seçtiğiniz modüller için yetersiz
                          </div>
                        ) : (
                          <motion.button
                            whileHover={isProcessing ? undefined : { y: -2 }}
                            whileTap={isProcessing ? undefined : { scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleCheckout(plan.id);
                            }}
                            disabled={isProcessing}
                            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-xs transition-colors duration-300 cursor-pointer disabled:cursor-wait ${
                              isSelected
                                ? 'bg-brand text-white hover:bg-brand-soft shadow-lg shadow-brand/20'
                                : 'bg-white text-brand border border-brand/25 hover:border-brand/60'
                            } ${isProcessing && !isBuying ? 'opacity-50' : ''}`}
                          >
                            {isBuying ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Ödeme sayfası hazırlanıyor…
                              </>
                            ) : (
                              /* "Satın Al ve Yayınla" DEĞİL: bu düğme ne satın
                                 almayı bitirir ne de yayınlar. */
                              isUpgrade ? 'Yükselt ve Ödemeye Geç' : 'Ödemeye Geç'
                            )}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <p className="text-muted text-[11px] flex items-center justify-center gap-1.5 mt-7">
                <ShieldCheck size={13} className="text-brand" />
                256-bit SSL ile güvenli ödeme — davetiyeniz ödeme sonrası anında yayına alınır.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
