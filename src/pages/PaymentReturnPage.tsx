import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  LayoutDashboard,
  Loader2,
  LucideIcon,
  Mail,
  RefreshCw,
  Rocket,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data';
import { OrderStatus, PaymentReturnOutcome } from '../types';
import { PaymentReturnModel, usePaymentReturn } from '../hooks/usePaymentReturn';
import { EmblemTone, PaymentStatusEmblem } from '../components/payment/return/PaymentStatusEmblem';
import { OrderReceipt } from '../components/payment/return/OrderReceipt';
import { ConfirmationSteps } from '../components/payment/return/ConfirmationSteps';
import { duration, ease } from '../utils/motion';

// ————— Metin —————

interface ViewCopy {
  tone: EmblemTone;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
}

/** Başlığın vurgulu yarısı — markanın italik serif imzası. */
function Accent({ children }: { children: React.ReactNode }) {
  return <span className="italic text-brand font-medium">{children}</span>;
}

function describe(model: PaymentReturnModel): ViewCopy {
  const plan = model.tier ? SUBSCRIPTION_PLANS.find((p) => p.id === model.tier) : undefined;
  const planLabel = plan ? `${plan.name} Paket` : 'Paketiniz';

  switch (model.view) {
    case 'missing':
      return {
        tone: 'missing',
        eyebrow: 'Ödeme Dönüşü',
        title: <>Sipariş bilgisi <Accent>bulunamadı</Accent></>,
        body: 'Bu bağlantıda geçerli bir sipariş numarası yok. Ödemelerinizin ve davetiyelerinizin durumunu panelinizden takip edebilirsiniz.'
      };

    case 'confirming':
      return {
        tone: 'progress',
        eyebrow: 'Onay Bekleniyor',
        title: <>Ödemeniz <Accent>onaylanıyor</Accent></>,
        body: 'Ödeme sağlayıcısından gelecek onayı bekliyoruz. Bu genellikle birkaç saniye sürer.'
      };

    case 'paid':
      return {
        tone: 'success',
        eyebrow: 'Ödeme Onaylandı',
        title: <>Her şey <Accent>hazır</Accent></>,
        // 🔴 K67: ödeme yayınlamaz. Metin bunu açıkça söyler; kullanıcı
        // davetiyesinin kendiliğinden yayına çıktığını sanmamalı.
        body:
          typeof model.invitationId === 'string'
            ? `${planLabel} davetiyenize tanımlandı. Davetiyeniz siz yayınlayana kadar yayına çıkmaz — hazır olduğunuzda tek tıkla yayınlayın.`
            : model.invitationId === null
              ? `${planLabel} hesabınıza tanımlandı. Davetiyelerinizi panelinizden yayınlayabilirsiniz.`
              : `${planLabel} tanımlandı. Davetiyenizi panelinizden açıp yayınlayabilirsiniz.`
      };

    case 'delayed':
      return {
        tone: 'warning',
        eyebrow: 'Onay Gecikiyor',
        title: <>Onay <Accent>biraz gecikiyor</Accent></>,
        body: 'Ödeme sağlayıcısının onayı henüz bize ulaşmadı. Bu nadiren birkaç dakika sürebilir; onay geldiğinde davetiyenizi yayınlayabilirsiniz.'
      };

    case 'failed':
      if (model.failureReason === 'expired') {
        return {
          tone: 'danger',
          eyebrow: 'Ödeme Tamamlanamadı',
          title: <>Ödeme süresi <Accent>doldu</Accent></>,
          body: 'Ödeme sayfası zamanında tamamlanmadığı için sipariş kapatıldı ve tahsilat yapılmadı. Dilediğiniz an yeni bir ödeme başlatabilirsiniz.'
        };
      }
      if (model.failureReason === 'refunded') {
        return {
          tone: 'unknown',
          eyebrow: 'Sipariş İade Edildi',
          title: <>Bu sipariş <Accent>iade edildi</Accent></>,
          body: 'Bu siparişin ödemesi iade edildi ve paket hakkı geri alındı. Bir sorunuz varsa sipariş numaranızla bize yazabilirsiniz.'
        };
      }
      return {
        tone: 'danger',
        eyebrow: 'Ödeme Tamamlanamadı',
        title: <>Ödemeniz <Accent>alınamadı</Accent></>,
        body: 'Ödeme sağlayıcısı işlemi onaylamadı; bu sipariş için tahsilat yapılmadı. Tasarımınız olduğu gibi duruyor, dilediğiniz an tekrar deneyebilirsiniz.'
      };

    case 'unverified':
      return {
        tone: 'unknown',
        eyebrow: 'Doğrulanamadı',
        title: <>Ödeme durumunu <Accent>doğrulayamadık</Accent></>,
        body: model.canPublish
          ? 'Sipariş bilgilerinize şu an ulaşamıyoruz. Yayınlamayı denediğinizde ödemenizi sunucumuz doğrular; onay henüz yoksa sizi bilgilendiririz.'
          : 'Sipariş bilgilerinize şu an ulaşamıyoruz. Ödemeniz onaylandıysa davetiyenizi panelinizden yayınlayabilirsiniz.'
      };
  }
}

// ————— Eylemler —————

interface Action {
  label: string;
  icon: LucideIcon;
  /** Verilirse bağlantı; verilmezse `onClick` çalışır. */
  to?: string;
  onClick?: () => void;
  busy?: boolean;
  busyLabel?: string;
}

const DASHBOARD: Action = { label: 'Panelime Git', icon: LayoutDashboard, to: '/dashboard' };

function actionsFor(model: PaymentReturnModel): { primary?: Action; secondary?: Action } {
  const recheck: Action = { label: 'Tekrar Kontrol Et', icon: RefreshCw, onClick: model.recheck };

  switch (model.view) {
    case 'missing':
      return { primary: DASHBOARD, secondary: { label: 'Ana Sayfaya Dön', icon: ArrowRight, to: '/' } };

    case 'confirming':
      return { secondary: DASHBOARD };

    case 'paid':
      return model.canPublish
        ? {
            primary: {
              label: 'Davetiyeyi Şimdi Yayınla',
              icon: Rocket,
              onClick: () => void model.publish(),
              busy: model.isPublishing,
              busyLabel: 'Yayınlanıyor…'
            },
            secondary: DASHBOARD
          }
        : { primary: DASHBOARD };

    case 'delayed':
      return { primary: recheck, secondary: DASHBOARD };

    case 'failed':
      if (model.canRetry) {
        return {
          primary: {
            label: 'Ödemeyi Tekrar Dene',
            icon: RotateCcw,
            onClick: () => void model.retry(),
            busy: model.isRetrying,
            busyLabel: 'Ödeme sayfası hazırlanıyor…'
          },
          secondary: DASHBOARD
        };
      }
      return model.failureReason === 'refunded'
        ? { primary: DASHBOARD, secondary: { label: 'Bize Yazın', icon: Mail, to: '/contact' } }
        : { primary: DASHBOARD };

    case 'unverified':
      if (model.canPublish) {
        return {
          primary: {
            label: 'Yayınlamayı Dene',
            icon: Rocket,
            onClick: () => void model.publish(),
            busy: model.isPublishing,
            busyLabel: 'Doğrulanıyor…'
          },
          secondary: model.canRecheck ? recheck : DASHBOARD
        };
      }
      return model.canRecheck ? { primary: recheck, secondary: DASHBOARD } : { primary: DASHBOARD };
  }
}

const ACTION_BASE =
  'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm cursor-pointer ' +
  'transition duration-300 ease-luxe hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ' +
  'disabled:cursor-wait disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60';

const ACTION_VARIANT = {
  primary: 'bg-brand text-white hover:bg-brand-soft shadow-lg shadow-brand/20',
  secondary: 'bg-white text-brand border border-brand/20 hover:border-brand/50'
} as const;

function ActionButton({ action, variant, disabled }: { action: Action; variant: keyof typeof ACTION_VARIANT; disabled: boolean }) {
  const className = `${ACTION_BASE} ${ACTION_VARIANT[variant]}`;
  const Icon = action.busy ? Loader2 : action.icon;
  const content = (
    <>
      <Icon size={16} className={action.busy ? 'animate-spin' : undefined} />
      {action.busy ? (action.busyLabel ?? action.label) : action.label}
    </>
  );

  if (action.to) {
    return (
      <Link to={action.to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={action.onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}

// ————— Ek bilgiler —————

function DelayedNotice() {
  return (
    <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3.5 flex gap-3 text-left">
      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold text-amber-900">Lütfen tekrar ödeme yapmayın</p>
        <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
          Siparişiniz kayıtlı. Onay geldiğinde paketiniz kendiliğinden tanımlanır; bu sayfayı kapatsanız bile
          davetiyenizi daha sonra panelinizden yayınlayabilirsiniz.
        </p>
      </div>
    </div>
  );
}

const DECLINE_HINTS = [
  'Kart limitiniz veya bakiyeniz yeterli olmayabilir',
  '3D Secure doğrulaması tamamlanmamış olabilir',
  'Kartınız internet alışverişine kapalı olabilir'
];

function DeclineHints() {
  return (
    <div className="rounded-2xl border border-ink/[0.06] bg-white/60 px-5 py-4 text-left">
      <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.14em] mb-2.5">Sık karşılaşılan nedenler</p>
      <ul className="space-y-1.5">
        {DECLINE_HINTS.map((hint) => (
          <li key={hint} className="flex items-start gap-2 text-xs text-ink/75 leading-relaxed">
            <span className="w-1 h-1 rounded-full bg-gold mt-[7px] shrink-0" aria-hidden />
            {hint}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ————— Sayfa —————

/** Başarısızlık ekranında sunucu henüz `pending` diyorsa çip sağlayıcının sözünü taşır. */
function receiptStatus(model: PaymentReturnModel): OrderStatus | null {
  if (model.view === 'failed' && (!model.order || model.order.status === 'pending')) return 'failed';
  return model.order?.status ?? null;
}

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.panel, ease: ease.out, delay } },
  exit: { opacity: 0, y: -6, transition: { duration: duration.fast, ease: ease.in } }
});

/** Ton başına sayfanın tepesindeki renkli ışık. */
const GLOW: Record<EmblemTone, string> = {
  progress: 'bg-[radial-gradient(closest-side,rgba(4,56,43,0.10),transparent)]',
  success: 'bg-[radial-gradient(closest-side,rgba(201,169,97,0.22),transparent)]',
  warning: 'bg-[radial-gradient(closest-side,rgba(251,191,36,0.16),transparent)]',
  danger: 'bg-[radial-gradient(closest-side,rgba(244,63,94,0.10),transparent)]',
  unknown: 'bg-[radial-gradient(closest-side,rgba(120,113,108,0.10),transparent)]',
  missing: 'bg-[radial-gradient(closest-side,rgba(120,113,108,0.10),transparent)]'
};

interface PaymentReturnPageProps {
  /** Hangi rotadan gelindi: `/odeme/basarili` ya da `/odeme/hata`. */
  outcome: PaymentReturnOutcome;
}

/**
 * Ödeme sağlayıcısının kullanıcıyı geri gönderdiği sayfa (F8 · B1).
 *
 * Tüm karar `usePaymentReturn`'dedir; bu bileşen yalnızca ekranı seçer ve
 * çizer. Ekranlar arası geçiş (onaylanıyor → onaylandı) sayfa yenilenmeden,
 * yerinde olur: amblem, metin ve kart ayrı ayrı çekilip yerlerine oturur.
 */
export default function PaymentReturnPage({ outcome }: PaymentReturnPageProps) {
  const model = usePaymentReturn(outcome);
  const copy = describe(model);
  const { primary, secondary } = actionsFor(model);
  const isBusy = model.isPublishing || model.isRetrying;

  const panel =
    model.view === 'confirming' || model.view === 'delayed'
      ? 'steps'
      : model.orderId && model.view !== 'missing'
        ? 'receipt'
        : 'none';

  return (
    <section className="relative flex-grow min-h-[calc(100dvh-72px)] overflow-hidden flex justify-center px-4 py-14 md:py-20">
      {/* Ortam ışığı: tonla birlikte renk değiştirir (yalnızca opaklık geçişi). */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[560px] pointer-events-none">
        <AnimatePresence initial={false}>
          <motion.div
            key={copy.tone}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: duration.stage, ease: ease.out } }}
            exit={{ opacity: 0, transition: { duration: duration.panel, ease: ease.in } }}
            className={`absolute left-1/2 -translate-x-1/2 -top-40 w-[760px] h-[760px] ${GLOW[copy.tone]}`}
          />
        </AnimatePresence>
      </div>

      <div className="relative w-full max-w-xl my-auto">
        <motion.div {...reveal(0)}>
          <PaymentStatusEmblem tone={copy.tone} />
        </motion.div>

        {/* Durum değiştiğinde ekran okuyucuya duyurulur. */}
        <div role="status" aria-live="polite" className="mt-8 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${model.view}-${model.failureReason}`} {...reveal(0.06)}>
              <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block">
                {copy.eyebrow}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink mt-5 leading-tight">{copy.title}</h1>
              <p className="text-muted text-sm md:text-[15px] mt-4 max-w-md mx-auto leading-relaxed">{copy.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {panel !== 'none' && (
            <motion.div key={panel} {...reveal(0.12)} className="mt-9">
              {panel === 'steps' ? (
                <ConfirmationSteps tier={model.tier} stalled={model.view === 'delayed'} />
              ) : (
                model.orderId && (
                  <OrderReceipt
                    orderId={model.orderId}
                    tier={model.tier}
                    status={receiptStatus(model)}
                    paidAt={model.order?.paidAt}
                  />
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {model.view === 'delayed' && (
            <motion.div key="delayed" {...reveal(0.16)} className="mt-4">
              <DelayedNotice />
            </motion.div>
          )}
          {model.view === 'failed' && model.failureReason === 'declined' && (
            <motion.div key="hints" {...reveal(0.16)} className="mt-4">
              <DeclineHints />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={model.view} {...reveal(0.2)} className="mt-8">
            {(primary || secondary) && (
              // Mobilde birincil eylem üstte, başparmağın ilk değdiği yerde.
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-3">
                {secondary && <ActionButton action={secondary} variant="secondary" disabled={isBusy} />}
                {primary && <ActionButton action={primary} variant="primary" disabled={isBusy} />}
              </div>
            )}
            {model.view === 'confirming' && (
              <p className="text-center text-[11px] text-muted/80 mt-4">Bu sayfadan ayrılsanız bile onay işlenir.</p>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          {...reveal(0.28)}
          className="mt-12 pt-6 border-t border-ink/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted"
        >
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-brand" />
            Ödemeler 256-bit SSL ile korunur
          </span>
          <span>
            Bir sorun mu var?{' '}
            <Link to="/contact" className="font-semibold text-brand hover:text-brand-soft underline-offset-4 hover:underline">
              Sipariş numaranızla bize yazın
            </Link>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
