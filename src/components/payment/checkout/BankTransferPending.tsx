import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Hourglass, LayoutDashboard } from 'lucide-react';
import { useCheckoutStore } from '../../../stores/useCheckoutStore';
import { CopyField } from '../../ui/CopyField';
import { formatTry } from '../../../utils/currency';
import { duration, ease, spring } from '../../../utils/motion';

interface BankTransferPendingProps {
  amount: number;
  reference: string;
}

/**
 * "Havaleyi Yaptım"dan sonraki ekran.
 *
 * 🔴 Metin bilerek "bildiriminiz alındı" ya da "ödemeniz alındı" DEMEZ:
 * bugün sunucuya hiçbir şey gitmiyor (bkz. `useCheckoutStore.confirmBankTransfer`)
 * ve havalenin gerçekten yapıldığını yalnızca hesap hareketi gösterir.
 * Söylenen yalnızca sıradaki adım ve eşleştirmenin neye dayandığıdır.
 */
export function BankTransferPending({ amount, reference }: BankTransferPendingProps) {
  const reviewBankTransfer = useCheckoutStore((s) => s.reviewBankTransfer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.panel, ease: ease.out }}
      className="text-center py-6 md:py-10 space-y-7"
    >
      <div className="relative w-20 h-20 mx-auto">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring.soft, delay: 0.1 }}
          className="absolute inset-0 rounded-full bg-champagne/60 border border-gold/40"
        />
        <motion.span
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: duration.panel, ease: ease.out, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center text-brand"
        >
          <Hourglass size={30} />
        </motion.span>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink">
          Son adım <span className="italic text-brand font-medium">bizde</span>
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          Havaleniz hesabımıza ulaştığında açıklamadaki referans koduyla eşleştirilir ve paketiniz tanımlanır.
          Ardından davetiyenizi panelinizden yayınlayabilirsiniz.
        </p>
      </div>

      <div className="max-w-sm mx-auto grid grid-cols-2 gap-3 text-left">
        <CopyField label="Tutar" display={formatTry(amount, true)} copyValue={amount.toFixed(2).replace('.', ',')} />
        <CopyField label="Referans" display={reference} mono />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-brand-soft transition duration-300 ease-luxe shadow-md shadow-brand/15 hover:-translate-y-0.5"
        >
          <LayoutDashboard size={15} />
          Panelime Git
        </Link>
        <button
          type="button"
          onClick={reviewBankTransfer}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-brand px-6 py-3.5 rounded-full font-semibold text-sm border border-brand/20 hover:border-brand/50 bg-white transition duration-300 ease-luxe cursor-pointer"
        >
          <ArrowLeft size={15} />
          Hesap bilgilerini tekrar göster
        </button>
      </div>
    </motion.div>
  );
}
