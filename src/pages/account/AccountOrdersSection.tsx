import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReceiptText } from 'lucide-react';
import { AccountCard } from '../../components/account/AccountCard';
import { OrdersList } from '../../components/account/OrdersList';
import { paymentService } from '../../services/payments';
import { OrderRecord } from '../../types';
import { toDisplayError } from '../../utils/toDisplayError';

/**
 * `/hesap/siparisler` — sipariş geçmişi (Faz 14). Uç Faz 10'dan beri vardı
 * (`GET /orders`), ekranı yoktu. Sıralamayı backend verir (en yeni üstte).
 */
export default function AccountOrdersSection() {
  const [orders, setOrders] = useState<OrderRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    paymentService
      .listOrders()
      .then(list => active && setOrders(list))
      .catch(err => active && setError(toDisplayError(err)));
    return () => {
      active = false;
    };
  }, []);

  return (
    <AccountCard
      icon={ReceiptText}
      title="Siparişlerim"
      description="Bütün ödeme denemeleriniz. Tutarlar sipariş anındaki fiyattır."
    >
      {error ? (
        <p className="text-sm text-rose-700">{error}</p>
      ) : orders === null ? (
        <div className="h-40 rounded-2xl bg-cream animate-pulse" aria-label="Yükleniyor" />
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted">
          Henüz bir siparişiniz yok.{' '}
          <Link to="/pricing" className="text-brand font-semibold hover:underline">
            Planlara göz atın
          </Link>
          .
        </p>
      ) : (
        <OrdersList orders={orders} />
      )}
    </AccountCard>
  );
}
