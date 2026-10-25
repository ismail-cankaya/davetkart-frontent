import React, { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Check, Gift, Link2Off, Lock, ShieldCheck, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EVENT_CATEGORIES, SUBSCRIPTION_PLANS } from '../data';
import { useAuthStore } from '../stores/useAuthStore';
import { useCheckoutStore } from '../stores/useCheckoutStore';
import { useInvitationStore } from '../stores/useInvitationStore';
import { bankTransferReference } from '../services/bankTransfer';
import { usePricing } from '../hooks/usePricing';
import { planPriceOf } from '../stores/usePricingStore';
import { formatTryMinor } from '../utils/currency';
import { PaymentMethodSelector } from '../components/payment/checkout/PaymentMethodSelector';
import { CardPaymentForm } from '../components/payment/checkout/CardPaymentForm';
import { BankTransferPanel } from '../components/payment/checkout/BankTransferPanel';
import { BankTransferPending } from '../components/payment/checkout/BankTransferPending';
import { InvitationSummary, OrderSummary } from '../components/payment/checkout/OrderSummary';
import { GiftCodeField } from '../components/payment/checkout/GiftCodeField';
import { FreeActivationPanel } from '../components/payment/checkout/FreeActivationPanel';
import { parseCheckoutSearch } from '../utils/checkoutRoute';
import { displayNames } from '../utils/names';
import { cn } from '../utils/cn';
import { duration, ease } from '../utils/motion';

const STEPS = ['Paket', 'Ödeme', 'Yayın'] as const;
/** Bu sayfanın adım göstergesindeki yeri. */
const CURRENT_STEP = 1;

/**
 * Ödeme sayfası — `/odeme?tier=gold&invitation=01J…` (yalnızca oturum açık).
 *
 * Plan duvarındaki "Ödemeye Geç" buraya getirir. İki yöntem:
 *  - **Kart** → sipariş açılır, sağlayıcının sayfasına gidilir (Shopier ya da
 *    muadili bağlanana kadar kart bilgisi hiçbir yere gönderilmez).
 *  - **Havale/EFT** → backend'in verdiği hesap, tutar ve referans kodu gösterilir.
 *
 * Bağlam (paket, davetiye) URL'dedir, store'da değil: yenileme ya da yeni
 * sekme aynı ekranı geri kurar. Fiyat URL'den OKUNMAZ.
 *
 * Faz 13 (backend K128, K134): fiyat, indirim (ilk yayın / kampanya), açık
 * ödeme yöntemleri ve havale hesabı backend'in fiyat kataloğundan gelir —
 * sayfa her açılışta kataloğu TAZELER (`force`): ilk yayın indirimi başka bir
 * sekmede az önce kullanılmış olabilir. Kart ve havale kapalıysa (bugünkü
 * `PAYMENT_METHODS=gift_code`) yalnızca hediye kodu alanı ve bir açıklama
 * görünür.
 *
 * Faz 11: "Hediye kodum var" alanı. Geçerli bir önizleme varken tutarlar
 * önizlemeden (kuruş) çizilir; toplam 0 ise kart ve havale yerine "Ücretsiz
 * etkinleştir" paneli gelir. Hediye kodu yalnızca kartla geçerli: havalede
 * sipariş açılmadığı için kod ayrılamaz.
 */
export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const context = useMemo(() => parseCheckoutSearch(searchParams), [searchParams]);

  const method = useCheckoutStore((s) => s.method);
  const bankTransferConfirmed = useCheckoutStore((s) => s.bankTransferConfirmed);
  const giftPreview = useCheckoutStore((s) => s.giftPreview);
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const recordId = useInvitationStore((s) => s.recordId);
  const invitation = useInvitationStore((s) => s.invitation);

  const selectMethod = useCheckoutStore((s) => s.selectMethod);
  const { catalog, status, reload } = usePricing({ force: true });
  const { t } = useTranslation();

  // Faz 13: yöntemler ve havale hesabı backend'den (K134–K135).
  const bankAccount = catalog?.bankTransfer ?? null;
  const cardEnabled = catalog?.paymentMethods.includes('card') ?? false;
  const giftEnabled = catalog?.paymentMethods.includes('gift_code') ?? false;

  // Seçili yöntem kapalıysa açık olana geçilir (varsayılan 'card').
  useEffect(() => {
    if (!catalog) return;
    if (method === 'card' && !cardEnabled && bankAccount) selectMethod('bank_transfer');
    if (method === 'bank_transfer' && !bankAccount && cardEnabled) selectMethod('card');
  }, [catalog, method, cardEnabled, bankAccount, selectMethod]);

  // Sayfadan çıkınca her şey (hediye kodu dahil) sıfırlanır.
  useEffect(() => () => useCheckoutStore.getState().reset(), []);

  // Başka bir paket/davetiye için açılan sayfa, öncekinin durumunu taşımasın.
  // Faz 11: uygulanan hediye kodu KALIR ve yeni plan için yeniden hesaplanır.
  const tier = context?.tier;
  const invitationId = context?.invitationId;
  useEffect(() => {
    const { reset, refreshGiftCode } = useCheckoutStore.getState();
    reset({ keepGiftCode: true });
    if (tier) void refreshGiftCode(tier);
  }, [tier, invitationId]);

  if (!context) return <InvalidCheckout />;

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === context.tier);
  if (!plan) return <InvalidCheckout />;

  // Davetiye özeti yalnızca editördeki kayıtla eşleşiyorsa gösterilir; başka
  // bir davetiyenin adını bu siparişin üstüne yazmaktansa hiç yazmamak iyidir.
  const knownInvitation = context.invitationId !== null && context.invitationId === recordId;
  const invitationSummary: InvitationSummary | null = knownInvitation
    ? {
        names: displayNames(invitation.names),
        categoryLabel: EVENT_CATEGORIES.find((c) => c.id === invitation.categoryId)?.label ?? null
      }
    : null;

  // Önizleme bu plan içinse tutarlar ondan (kuruş); yoksa backend kataloğundan.
  const price = planPriceOf(catalog, plan.id);
  const preview = giftPreview && giftPreview.tier === plan.id ? giftPreview : null;
  const totalMinor = preview ? preview.totalMinor : (price?.totalMinor ?? null);
  const isFree = preview !== null && preview.totalMinor === 0;
  // Havalede kod geçmez (sipariş açılmıyor): tutar kodsuz döküm.
  const bankAmount = price ? price.totalMinor / 100 : null;

  const reference = bankTransferReference(context.invitationId ?? userId ?? '');
  const back = knownInvitation
    ? { to: '/create', label: 'Tasarıma dön' }
    : { to: '/dashboard', label: 'Panelime dön' };

  return (
    <section className="relative bg-cream overflow-hidden">
      {/* Ortam ışığı */}
      <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-[26rem] h-[26rem] bg-champagne/35 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-20 md:pb-28">
        {/* Üst şerit */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: ease.out }}
          className="flex items-center justify-between gap-4 mb-8 md:mb-10"
        >
          <Link
            to={back.to}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand transition-colors duration-300"
          >
            <ArrowLeft size={16} className="transition-transform duration-300 ease-luxe group-hover:-translate-x-1" />
            {back.label}
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand bg-white/80 border border-brand/10 rounded-full px-3 py-1.5 shadow-sm">
            <Lock size={12} />
            Güvenli ödeme
          </span>
        </motion.div>

        {/* Başlık + adımlar */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.panel, ease: ease.out }}
          className="text-center mb-10 md:mb-14"
        >
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink leading-tight">
            Ödemenizi <span className="italic text-brand font-medium">tamamlayın</span>
          </h1>
          <p className="text-muted text-sm md:text-base mt-3 max-w-lg mx-auto leading-relaxed">
            Size uygun ödeme yöntemini seçin. Ödemeniz onaylandığında davetiyenizi hemen yayınlayabilirsiniz.
          </p>
          <CheckoutSteps />
        </motion.header>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Sipariş özeti — mobilde üstte, masaüstünde sağda ve yapışkan */}
          <div className="lg:col-span-5 lg:order-2 lg:sticky lg:top-28">
            <OrderSummary plan={plan} price={price} invitation={invitationSummary} giftPreview={preview} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.panel, ease: ease.out, delay: 0.05 }}
            className="lg:col-span-7 lg:order-1 rounded-[2rem] bg-white/90 backdrop-blur-sm border border-ink/[0.06] shadow-xl shadow-ink/[0.04] p-5 md:p-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              {bankTransferConfirmed && bankAccount && bankAmount !== null ? (
                <BankTransferPending key="pending" amount={bankAmount} reference={reference} />
              ) : (
                <motion.div
                  key="methods"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: duration.base, ease: ease.out } }}
                  exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
                  className="space-y-7"
                >
                  {giftEnabled && <GiftCodeField tier={context.tier} />}

                  {isFree ? (
                    <FreeActivationPanel context={context} />
                  ) : !catalog || totalMinor === null ? (
                    <CatalogPending failed={status === 'error'} onRetry={reload} />
                  ) : !cardEnabled && !bankAccount ? (
                    <MethodsClosedNotice
                      giftEnabled={giftEnabled}
                      remainderMinor={preview ? preview.totalMinor : null}
                    />
                  ) : (
                    <>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted mb-3">Ödeme Yöntemi</p>
                        <PaymentMethodSelector cardAvailable={cardEnabled} bankTransferAvailable={bankAccount !== null} />
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />

                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={method}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: duration.panel, ease: ease.out } }}
                          exit={{ opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.in } }}
                        >
                          {method === 'bank_transfer' && bankAccount && bankAmount !== null ? (
                            <BankTransferPanel account={bankAccount} amount={bankAmount} reference={reference} />
                          ) : cardEnabled ? (
                            <CardPaymentForm context={context} amountMinor={totalMinor} />
                          ) : null}
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Katalog yüklenirken ya da yüklenemediğinde: tutar UYDURULMAZ, ödeme düğmesi çizilmez. */
function CatalogPending({ failed, onRetry }: { failed: boolean; onRetry: () => void }) {
  const { t } = useTranslation();

  if (!failed) {
    return (
      <div aria-busy="true" className="space-y-3">
        <span className="block h-24 rounded-3xl bg-ink/[0.04] animate-pulse" />
        <span className="block h-12 rounded-2xl bg-ink/[0.04] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink/[0.07] bg-cream/60 p-6 text-center space-y-3" role="alert">
      <WifiOff size={20} className="mx-auto text-muted" />
      <p className="text-sm text-muted">{t('pricing.unavailable')}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 bg-brand text-white px-6 py-2.5 rounded-full font-semibold text-xs hover:bg-brand-soft transition-colors duration-300 cursor-pointer"
      >
        {t('pricing.retry')}
      </button>
    </div>
  );
}

/**
 * Kart ve havale kapalı (Faz 13, `PAYMENT_METHODS=gift_code`).
 *
 * Kod alanı üstte zaten açık. Kısmi bir kod uygulandıysa kalan tutarın neden
 * ödenemediği söylenir: aksi hâlde kullanıcı indirimi görür ama ilerleyemez.
 */
function MethodsClosedNotice({ giftEnabled, remainderMinor }: { giftEnabled: boolean; remainderMinor: number | null }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-gold/25 bg-gold/[0.06] p-5 md:p-6 flex items-start gap-4" role="status">
      <span className="w-11 h-11 rounded-2xl bg-white text-brand border border-brand/10 flex items-center justify-center shrink-0">
        {giftEnabled ? <Gift size={19} /> : <Lock size={18} />}
      </span>
      <div className="space-y-1.5">
        <p className="font-serif text-base font-bold text-ink">
          {giftEnabled ? t('pricing.checkout.giftOnlyTitle') : t('pricing.checkout.noneTitle')}
        </p>
        <p className="text-xs text-muted leading-relaxed">
          {!giftEnabled
            ? t('pricing.checkout.noneBody')
            : remainderMinor !== null && remainderMinor > 0
              ? t('pricing.checkout.remainderBlocked', { amount: formatTryMinor(remainderMinor) })
              : t('pricing.checkout.giftOnlyBody')}
        </p>
      </div>
    </div>
  );
}

/** Paket ✓ — Ödeme ● — Yayın: kullanıcı yolun neresinde olduğunu ve ödemenin son adım olmadığını görür. */
function CheckoutSteps() {
  return (
    <ol className="mt-8 flex items-center justify-center gap-2 md:gap-3" aria-label="Adımlar">
      {STEPS.map((label, index) => {
        const done = index < CURRENT_STEP;
        const current = index === CURRENT_STEP;
        return (
          <li key={label} className="flex items-center gap-2 md:gap-3" aria-current={current ? 'step' : undefined}>
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1.5 text-xs font-semibold border transition-colors duration-300',
                current && 'bg-brand text-white border-brand shadow-md shadow-brand/20',
                done && 'bg-white text-brand border-brand/15',
                !done && !current && 'bg-white/60 text-muted border-ink/[0.06]'
              )}
            >
              <span
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                  current && 'bg-white/20',
                  done && 'bg-brand text-champagne',
                  !done && !current && 'bg-ink/5'
                )}
              >
                {done ? <Check size={11} strokeWidth={3.5} /> : index + 1}
              </span>
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <span className={cn('w-6 md:w-10 h-px', done ? 'bg-brand/40' : 'bg-ink/10')} aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** URL'deki paket tanınmadı: fiyatsız bir özet çizmek yerine yol gösterilir. */
function InvalidCheckout() {
  return (
    <section className="flex-grow bg-cream flex items-center justify-center px-4 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.panel, ease: ease.out }}
        className="max-w-md w-full text-center rounded-[2rem] bg-white border border-ink/[0.06] shadow-xl shadow-ink/[0.04] p-8 md:p-10 space-y-5"
      >
        <span className="w-14 h-14 mx-auto rounded-2xl bg-brand/[0.06] text-brand border border-brand/10 flex items-center justify-center">
          <Link2Off size={22} />
        </span>
        <h1 className="font-serif text-2xl font-bold text-ink">
          Ödeme bağlantısı <span className="italic text-brand font-medium">geçersiz</span>
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Hangi paketi almak istediğinizi okuyamadık. Davetiyenizi yayınlamayı tekrar denediğinizde paket seçimi
          yeniden açılır.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 bg-brand text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-brand-soft transition duration-300 ease-luxe shadow-md shadow-brand/15 hover:-translate-y-0.5"
        >
          <ShieldCheck size={15} />
          Panelime Git
        </Link>
      </motion.div>
    </section>
  );
}
