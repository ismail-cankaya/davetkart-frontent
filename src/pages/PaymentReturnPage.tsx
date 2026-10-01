import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  RotateCcw,
  SearchX,
  Undo2,
  XCircle,
} from 'lucide-react';
import { paymentService } from '../services/payments';
import { apiErrorCode } from '../services/api';
import { OrderRecord } from '../types';
import { checkoutHref } from '../utils/checkoutRoute';
import {
  POLL_INTERVAL_MS,
  ReturnKind,
  ReturnView,
  orderIdFrom,
  returnViewFor,
  shouldKeepPolling,
} from '../utils/paymentReturn';
import { toDisplayError } from '../utils/toDisplayError';
import { duration, ease } from '../utils/motion';

interface PaymentReturnPageProps {
  /** Sağlayıcının kullanıcıyı gönderdiği adres: `/odeme/basarili` ya da `/odeme/hata`. */
  kind: ReturnKind;
}

interface PollState {
  order: OrderRecord | null;
  error: unknown;
  settled: boolean;
}

/**
 * Ödeme dönüş sayfası — Faz 10, 10.27 (yalnızca oturum açık).
 *
 * Sağlayıcı ödeme sonrası kullanıcıyı `/odeme/basarili?order=01j…` ya da
 * `/odeme/hata?order=…` adresine gönderir (backend `payment.return_urls`).
 * Bu sayfa gelene kadar o adresler yoktu ve `*` rotası kullanıcıyı sessizce
 * ana sayfaya atıyordu.
 *
 * 🔴 Adres bir İPUCUDUR. Ödemenin sonucu siparişin backend'deki durumudur ve o
 * durumu sağlayıcının webhook'u yazar — dönüşten önce de sonra da gelebilir.
 * Sayfa bu yüzden `GET /orders/{id}`'yi birkaç saniye yoklar.
 *
 * 🔴 Ödeme davetiyeyi YAYINLAMAZ (K67). "Onaylandı" ekranı kullanıcıyı
 * yayınlamaya yönlendirir, yayınlandı demez.
 *
 * Neyin gösterileceği `utils/paymentReturn.ts`'te (saf, `verify:payment` sınar).
 */
export default function PaymentReturnPage({ kind }: PaymentReturnPageProps) {
  const [searchParams] = useSearchParams();
  const orderId = useMemo(() => orderIdFrom(searchParams), [searchParams]);

  // "Tekrar kontrol et" yoklamayı baştan başlatır.
  const [run, setRun] = useState(0);
  const [poll, setPoll] = useState<PollState>({ order: null, error: null, settled: false });

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;
    let timer: number | undefined;
    let attempts = 0;

    setPoll({ order: null, error: null, settled: false });

    const tick = async () => {
      try {
        const order = await paymentService.getOrder(orderId);
        if (cancelled) return;

        attempts += 1;
        const keepPolling = shouldKeepPolling(order.status, kind, attempts);
        setPoll({ order, error: null, settled: !keepPolling });

        if (keepPolling) timer = window.setTimeout(() => void tick(), POLL_INTERVAL_MS);
      } catch (error) {
        if (!cancelled) setPoll({ order: null, error, settled: true });
      }
    };

    void tick();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [orderId, kind, run]);

  const retry = () => setRun((n) => n + 1);

  if (!orderId) return <MissingOrder />;

  if (poll.error) {
    return apiErrorCode(poll.error) === 'RESOURCE_NOT_FOUND'
      ? <MissingOrder />
      : <Unreachable message={toDisplayError(poll.error)} onRetry={retry} />;
  }

  if (!poll.order) return <ReturnCard view="verifying" order={null} onRecheck={retry} />;

  const view = returnViewFor(poll.order.status, { kind, settled: poll.settled });
  return <ReturnCard view={view} order={poll.order} onRecheck={retry} />;
}

// --------------------------------------------------------------- görünümler

interface ViewCopy {
  icon: React.ReactNode;
  title: React.ReactNode;
  body: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
}

const TONE_CLASSES: Record<ViewCopy['tone'], string> = {
  brand: 'bg-brand/[0.06] text-brand border-brand/10',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/70',
  danger: 'bg-rose-50 text-rose-700 border-rose-200/70',
};

/** Her görünümün metni. `Record` eksik bir görünümü derleme hatasına çevirir. */
const COPY: Record<ReturnView, ViewCopy> = {
  verifying: {
    icon: <Loader2 size={24} className="animate-spin" />,
    title: <>Ödemen <span className="italic text-brand font-medium">doğrulanıyor</span></>,
    body: 'Ödeme sağlayıcısından onay bekliyoruz. Bu genellikle birkaç saniye sürer; lütfen sayfayı kapatma.',
    tone: 'brand',
  },
  confirmed: {
    icon: <CheckCircle2 size={24} />,
    title: <>Ödemen <span className="italic text-brand font-medium">onaylandı</span></>,
    body: 'Planın tanımlandı. Davetiyeni artık yayınlayabilirsin — ödeme davetiyeyi kendiliğinden yayınlamaz, son adım sende.',
    tone: 'success',
  },
  delayed: {
    icon: <Clock size={24} />,
    title: <>Onay biraz <span className="italic text-brand font-medium">gecikti</span></>,
    body: 'Ödemen alındıysa birkaç dakika içinde onaylanır. Bu sayfayı kapatabilirsin: panelinden yayınlamayı denediğinde planın tanınır.',
    tone: 'warning',
  },
  expired: {
    icon: <Clock size={24} />,
    title: <>Ödeme süresi <span className="italic text-brand font-medium">doldu</span></>,
    body: 'Bu sipariş için ödeme penceresi kapandı. Ödemen alındıysa yine de onaylanır ve panelinde görünür; alınmadıysa yeniden deneyebilirsin.',
    tone: 'warning',
  },
  failed: {
    icon: <XCircle size={24} />,
    title: <>Ödeme <span className="italic text-brand font-medium">tamamlanamadı</span></>,
    body: 'Ödeme sağlayıcısı işlemi onaylamadı. Tekrar deneyebilir ya da ödeme sayfasında Havale/EFT seçeneğini kullanabilirsin.',
    tone: 'danger',
  },
  refunded: {
    icon: <Undo2 size={24} />,
    title: <>Bu ödeme <span className="italic text-brand font-medium">iade edildi</span></>,
    body: 'Sipariş iade edildiği için bu ödeme bir yayın hakkı sağlamıyor.',
    tone: 'warning',
  },
};

const PRIMARY_BUTTON =
  'w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-brand-soft transition duration-300 ease-luxe shadow-md shadow-brand/15 hover:-translate-y-0.5';
const SECONDARY_BUTTON =
  'w-full sm:w-auto inline-flex items-center justify-center gap-2 text-brand px-6 py-3.5 rounded-full font-semibold text-sm border border-brand/20 hover:border-brand/50 bg-white transition duration-300 ease-luxe cursor-pointer';

function formatPaidAt(iso: string | null): string | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'short' }).format(parsed);
}

interface ReturnCardProps {
  view: ReturnView;
  order: OrderRecord | null;
  onRecheck: () => void;
}

function ReturnCard({ view, order, onRecheck }: ReturnCardProps) {
  const copy = COPY[view];
  const paidAt = view === 'confirmed' ? formatPaidAt(order?.paidAt ?? null) : null;
  const canRetryCheckout = order !== null && (view === 'failed' || view === 'expired');

  return (
    <Frame>
      <span className={`w-14 h-14 mx-auto rounded-2xl border flex items-center justify-center ${TONE_CLASSES[copy.tone]}`}>
        {copy.icon}
      </span>

      {/* Ekran okuyucu durum değişimini duyurur: yoklama sessizce sonuçlanmasın. */}
      <div role="status" aria-live="polite" className="space-y-3">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink">{copy.title}</h1>
        <p className="text-sm text-muted leading-relaxed">{copy.body}</p>
        {paidAt && <p className="text-xs text-muted">Ödeme zamanı: {paidAt}</p>}
      </div>

      {view !== 'verifying' && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {canRetryCheckout && order && (
            <Link to={checkoutHref({ tier: order.tier, invitationId: order.invitationId })} className={PRIMARY_BUTTON}>
              <RotateCcw size={15} />
              Tekrar Dene
            </Link>
          )}

          <Link to="/dashboard" className={canRetryCheckout ? SECONDARY_BUTTON : PRIMARY_BUTTON}>
            <LayoutDashboard size={15} />
            {view === 'confirmed' ? 'Panele Git ve Yayınla' : 'Panelime Git'}
          </Link>

          {view === 'delayed' && (
            <button type="button" onClick={onRecheck} className={SECONDARY_BUTTON}>
              <RefreshCw size={15} />
              Tekrar Kontrol Et
            </button>
          )}
        </div>
      )}
    </Frame>
  );
}

/**
 * `?order=` yok ya da sipariş bulunamadı (404).
 *
 * 🔴 Başkasının siparişi ile var olmayan sipariş backend'de AYNI 404'ü döner
 * (H7). Burada da ayrılmaz: ikisi de "bulamadık".
 */
function MissingOrder() {
  return (
    <Frame>
      <span className={`w-14 h-14 mx-auto rounded-2xl border flex items-center justify-center ${TONE_CLASSES.brand}`}>
        <SearchX size={22} />
      </span>
      <h1 className="font-serif text-2xl font-bold text-ink">
        Sipariş <span className="italic text-brand font-medium">bulunamadı</span>
      </h1>
      <p className="text-sm text-muted leading-relaxed">
        Bu bağlantıdaki siparişi hesabında bulamadık. Ödemeni tamamladıysan, panelinden davetiyeni yayınlamayı
        denediğinde planın tanınır.
      </p>
      <Link to="/dashboard" className={PRIMARY_BUTTON}>
        <LayoutDashboard size={15} />
        Panelime Git
      </Link>
    </Frame>
  );
}

function Unreachable({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Frame>
      <span className={`w-14 h-14 mx-auto rounded-2xl border flex items-center justify-center ${TONE_CLASSES.warning}`}>
        <Clock size={22} />
      </span>
      <h1 className="font-serif text-2xl font-bold text-ink">
        Durumu <span className="italic text-brand font-medium">okuyamadık</span>
      </h1>
      <p className="text-sm text-muted leading-relaxed">{message}</p>
      <button type="button" onClick={onRetry} className={PRIMARY_BUTTON}>
        <RefreshCw size={15} />
        Tekrar Dene
      </button>
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex-grow bg-cream flex items-center justify-center px-4 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.panel, ease: ease.out }}
        className="max-w-md w-full text-center rounded-[2rem] bg-white border border-ink/[0.06] shadow-xl shadow-ink/[0.04] p-8 md:p-10 space-y-5"
      >
        {children}
      </motion.div>
    </section>
  );
}
