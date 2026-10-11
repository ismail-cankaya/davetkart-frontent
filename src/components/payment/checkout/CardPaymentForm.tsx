import React, { useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CreditCard, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { CardPreview } from './CardPreview';
import { CardBrandMark } from './CardBrandMark';
import { CheckoutConsent } from './CheckoutConsent';
import { type CheckoutContext, useCheckoutStore } from '../../../stores/useCheckoutStore';
import { toast } from '../../ui/Toast';
import {
  type CardDetails,
  type CardField,
  MAX_CARD_DIGITS,
  cvcLengthFor,
  detectCardBrand,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  isCardNumberComplete,
  validateCard
} from '../../../utils/paymentCard';
import { formatTry } from '../../../utils/currency';
import { toDisplayError } from '../../../utils/toDisplayError';
import { cn } from '../../../utils/cn';
import { duration, ease, gesture } from '../../../utils/motion';

interface CardPaymentFormProps {
  context: CheckoutContext;
  /** Gösterim tutarı (düğme metni). Tahsil edilen tutarı backend belirler. */
  amount: number;
}

const EMPTY_CARD: CardDetails = { holderName: '', number: '', expiry: '', cvc: '' };

/** Hata olduğunda odağın gideceği sıra — ekrandaki sırayla aynı. */
const FIELD_ORDER: CardField[] = ['number', 'holderName', 'expiry', 'cvc'];

const INPUT_CLASS =
  'w-full bg-cream/60 border border-ink/10 rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition duration-300 disabled:opacity-60';

const INPUT_ERROR_CLASS = 'border-rose-300 bg-rose-50/40 focus:border-rose-400 focus:ring-rose-100';

/**
 * Kartla ödeme formu.
 *
 * 🔴 **Sağlayıcı bağlantısı henüz yok — kart bilgisi hiçbir yere gitmez.**
 * Alanlar bu bileşenin yerel state'inde yaşar; store'a, URL'ye, kalıcı
 * depoya ya da bizim API'mize **asla** yazılmaz (PCI DSS: kart numarasına
 * dokunan her sunucu denetim kapsamına girer). "Öde" bugün yalnızca
 * siparişi açar (`POST …/checkout`) ve sağlayıcının `redirectUrl`'ine gider.
 *
 * Sağlayıcı seçildiğinde bu dosyada değişecek olan yalnızca `handleSubmit`:
 *
 * | Sağlayıcı akışı | Ne olur |
 * |---|---|
 * | Barındırılan sayfa (Shopier klasik form) | Kart, sağlayıcının sayfasında yazılır. Buradaki alanlar kalkar; düğme "Güvenli ödeme sayfasına geç" olur (10.74: imzalı form otomatik POST edilir) |
 * | Doğrudan gönderim / tokenizasyon | Alanlar kalır; `handleSubmit` kartı tarayıcıdan **doğrudan sağlayıcıya** gönderir, API'mize yalnızca dönen jeton gider |
 */
export function CardPaymentForm({ context, amount }: CardPaymentFormProps) {
  const [card, setCard] = useState<CardDetails>(EMPTY_CARD);
  const [touched, setTouched] = useState<Partial<Record<CardField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [cvcFocused, setCvcFocused] = useState(false);

  const isProcessing = useCheckoutStore((s) => s.isProcessing);
  const pendingOrder = useCheckoutStore((s) => s.pendingOrder);
  const termsAccepted = useCheckoutStore((s) => s.termsAccepted);
  const startCardCheckout = useCheckoutStore((s) => s.startCardCheckout);

  const uid = useId();
  const ids: Record<CardField, string> = {
    number: `${uid}-number`,
    holderName: `${uid}-name`,
    expiry: `${uid}-expiry`,
    cvc: `${uid}-cvc`
  };
  const refs = {
    number: useRef<HTMLInputElement>(null),
    holderName: useRef<HTMLInputElement>(null),
    expiry: useRef<HTMLInputElement>(null),
    cvc: useRef<HTMLInputElement>(null)
  } satisfies Record<CardField, React.RefObject<HTMLInputElement | null>>;

  const brand = detectCardBrand(card.number);
  const cvcLength = cvcLengthFor(brand);
  const errors = useMemo(() => validateCard(card), [card]);

  /** Hata, alan bir kez terk edildikten ya da gönderim denendikten sonra görünür — yazarken değil. */
  const errorOf = (field: CardField) => (touched[field] || submitted ? errors[field] : undefined);

  const update = (field: CardField, value: string) => setCard((prev) => ({ ...prev, [field]: value }));
  const markTouched = (field: CardField) => setTouched((prev) => ({ ...prev, [field]: true }));

  /** Tamamlanan alandan sonraki ilk BOŞ alana geçer; dolu alanı ezmez. */
  const advanceFrom = (field: CardField, next: CardDetails) => {
    const after = FIELD_ORDER.slice(FIELD_ORDER.indexOf(field) + 1);
    const target = after.find((f) => next[f].length === 0);
    if (target) refs[target].current?.focus();
  };

  const handleNumber = (raw: string) => {
    const number = digitsOnly(raw).slice(0, MAX_CARD_DIGITS);
    const next = { ...card, number };
    setCard(next);
    if (isCardNumberComplete(number)) advanceFrom('number', next);
  };

  const handleExpiry = (raw: string) => {
    let expiry = digitsOnly(raw).slice(0, 4);
    // "3" yazan kullanıcı Mart'ı kastediyor: 30. ay yok.
    if (expiry.length === 1 && Number(expiry) > 1) expiry = `0${expiry}`;
    const next = { ...card, expiry };
    setCard(next);
    if (expiry.length === 4) advanceFrom('expiry', next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setSubmitted(true);

    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }
    if (!termsAccepted) return;

    try {
      // Kart bilgisi BİLEREK geçirilmiyor — bkz. dosya başı.
      const result = await startCardCheckout(context);
      if (!result) return;

      // 🔴 `redirectUrl` opsiyoneldir: yoksa anahtar HİÇ GELMEZ (C7).
      if (result.redirectUrl !== undefined) {
        window.location.href = result.redirectUrl;
        return;
      }

      // Sipariş açıldı ama sağlayıcı sayfası gelmedi: "ödendi" demek yanlış olur.
      toast('Siparişiniz oluşturuldu, ancak ödeme adımı başlatılamadı. Lütfen birazdan tekrar deneyin.', 'info');
    } catch (error) {
      toast(toDisplayError(error), 'error');
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} noValidate className="space-y-7">
      {/* Canlı kart önizlemesi */}
      <div className="relative rounded-3xl bg-gradient-to-b from-brand/[0.05] via-champagne/20 to-transparent px-4 pt-8 pb-6">
        <CardPreview
          holderName={card.holderName}
          number={card.number}
          expiry={card.expiry}
          cvc={card.cvc}
          cvcLength={cvcLength}
          brand={brand}
          flipped={cvcFocused}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        <Field id={ids.number} label="Kart Numarası" error={errorOf('number')} className="col-span-2">
          <div className="relative">
            <input
              ref={refs.number}
              id={ids.number}
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              value={formatCardNumber(card.number)}
              onChange={(e) => handleNumber(e.target.value)}
              onBlur={() => markTouched('number')}
              disabled={isProcessing}
              aria-invalid={Boolean(errorOf('number'))}
              aria-describedby={errorOf('number') ? `${ids.number}-error` : undefined}
              className={cn(INPUT_CLASS, 'pr-16 font-mono tracking-wider', errorOf('number') && INPUT_ERROR_CLASS)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={brand}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: duration.fast, ease: ease.out } }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: duration.press, ease: ease.in } }}
                  className="flex"
                >
                  {brand === 'unknown' ? <CreditCard size={18} className="text-muted/60" /> : <CardBrandMark brand={brand} />}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </Field>

        <Field id={ids.holderName} label="Kart Üzerindeki İsim" error={errorOf('holderName')} className="col-span-2">
          <input
            ref={refs.holderName}
            id={ids.holderName}
            type="text"
            autoComplete="cc-name"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="Kartta yazdığı gibi"
            value={card.holderName}
            onChange={(e) => update('holderName', e.target.value.slice(0, 40))}
            onBlur={() => markTouched('holderName')}
            disabled={isProcessing}
            aria-invalid={Boolean(errorOf('holderName'))}
            aria-describedby={errorOf('holderName') ? `${ids.holderName}-error` : undefined}
            className={cn(INPUT_CLASS, 'uppercase placeholder:normal-case', errorOf('holderName') && INPUT_ERROR_CLASS)}
          />
        </Field>

        <Field id={ids.expiry} label="Son Kullanma" error={errorOf('expiry')}>
          <input
            ref={refs.expiry}
            id={ids.expiry}
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="AA/YY"
            value={formatExpiry(card.expiry)}
            onChange={(e) => handleExpiry(e.target.value)}
            onBlur={() => markTouched('expiry')}
            disabled={isProcessing}
            aria-invalid={Boolean(errorOf('expiry'))}
            aria-describedby={errorOf('expiry') ? `${ids.expiry}-error` : undefined}
            className={cn(INPUT_CLASS, 'font-mono tracking-wider', errorOf('expiry') && INPUT_ERROR_CLASS)}
          />
        </Field>

        <Field id={ids.cvc} label="Güvenlik Kodu" error={errorOf('cvc')}>
          <input
            ref={refs.cvc}
            id={ids.cvc}
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder={'•'.repeat(cvcLength)}
            value={card.cvc}
            onChange={(e) => update('cvc', digitsOnly(e.target.value).slice(0, cvcLength))}
            onFocus={() => setCvcFocused(true)}
            onBlur={() => {
              setCvcFocused(false);
              markTouched('cvc');
            }}
            disabled={isProcessing}
            aria-invalid={Boolean(errorOf('cvc'))}
            aria-describedby={errorOf('cvc') ? `${ids.cvc}-error` : `${ids.cvc}-hint`}
            className={cn(INPUT_CLASS, 'font-mono tracking-[0.3em]', errorOf('cvc') && INPUT_ERROR_CLASS)}
          />
          {!errorOf('cvc') && (
            <p id={`${ids.cvc}-hint`} className="text-[11px] text-muted/80">
              Kartın {brand === 'amex' ? 'ön' : 'arka'} yüzündeki {cvcLength} hane
            </p>
          )}
        </Field>
      </div>

      {/* 🔴 Sipariş açıldı ama yönlendirme olmadı: ortada ÖDENMEMİŞ bir sipariş
          var. Geçici bir toast bunu taşıyamaz; ekranda duran bir not gerekir. */}
      {pendingOrder && pendingOrder.status !== 'paid' && (
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold text-amber-900">Ödemeniz henüz tamamlanmadı</p>
          <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
            <span className="font-mono">{pendingOrder.orderId}</span> numaralı siparişiniz oluşturuldu, ancak ödeme
            adımına geçilemediği için tahsilat yapılmadı. Tekrar deneyebilirsiniz.
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
              Ödeme başlatılıyor…
            </>
          ) : (
            <>
              <Lock size={15} />
              {formatTry(amount)} Öde
            </>
          )}
        </motion.button>

        <p className="flex items-start justify-center gap-2 text-[11px] text-muted leading-relaxed text-center">
          <ShieldCheck size={14} className="text-brand shrink-0 mt-px" />
          Kart bilgileriniz Davetkart sunucularına gönderilmez; ödeme, anlaşmalı ödeme kuruluşunun güvenli altyapısında
          tamamlanır.
        </p>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="text-[11px] font-bold text-ink uppercase tracking-wide">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } }}
            exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
            className="text-[11px] text-rose-600 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
