import React, { useId, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck, Info, Landmark, PenLine, Send } from 'lucide-react';
import { BankTransferAccount } from '../../../types';
import { useCheckoutStore } from '../../../stores/useCheckoutStore';
import { CopyField } from '../../ui/CopyField';
import { CheckoutConsent } from './CheckoutConsent';
import { formatIban } from '../../../utils/iban';
import { formatTry } from '../../../utils/currency';
import { duration, ease, gesture } from '../../../utils/motion';

interface BankTransferPanelProps {
  account: BankTransferAccount;
  /** Gösterim tutarı — kullanıcı bunu bankasına elle yazar. */
  amount: number;
  /** Havale açıklamasına yazılacak kod (`bankTransferReference`). */
  reference: string;
}

const STEPS = [
  { icon: Send, title: 'Tutarı gönderin', text: 'Banka uygulamanızdan yukarıdaki IBAN’a tutarın tamamını gönderin.' },
  { icon: PenLine, title: 'Referans kodunu yazın', text: 'Açıklama alanına referans kodunuzu yazın — ödemenizi onunla buluruz.' },
  { icon: BadgeCheck, title: 'Onaydan sonra yayınlayın', text: 'Ödemeniz hesabımıza ulaşıp onaylandığında davetiyenizi yayınlayabilirsiniz.' }
];

/**
 * Havale/EFT bilgileri: hesap, tutar, referans kodu ve adımlar.
 *
 * Hesap bilgisi `.env`'den gelir (`services/bankTransfer.ts`); bu bileşen
 * yalnızca gösterir. Kopyalanan IBAN boşluksuz hâlidir — bazı bankaların
 * IBAN alanı gruplanmış metni kabul etmez.
 */
export function BankTransferPanel({ account, amount, reference }: BankTransferPanelProps) {
  const termsAccepted = useCheckoutStore((s) => s.termsAccepted);
  const confirmBankTransfer = useCheckoutStore((s) => s.confirmBankTransfer);
  const [attempted, setAttempted] = useState(false);
  const uid = useId();

  const handleConfirm = () => {
    setAttempted(true);
    if (!termsAccepted) return;
    confirmBankTransfer();
  };

  return (
    <div className="space-y-7">
      {/* Alıcı hesap kartı */}
      <div className="rounded-3xl overflow-hidden border border-ink/[0.06] shadow-sm">
        <div className="relative flex items-center gap-3 bg-brand-deep px-5 py-4 overflow-hidden">
          <div className="absolute -top-12 -right-8 w-40 h-40 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          <span className="relative w-10 h-10 rounded-xl bg-white/5 border border-gold/25 text-gold flex items-center justify-center shrink-0">
            <Landmark size={18} />
          </span>
          <div className="relative min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/50">Alıcı Banka</p>
            <p className="font-serif text-lg font-bold text-white leading-tight truncate">{account.bankName}</p>
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 space-y-3">
          <CopyField label="Hesap Sahibi" display={account.accountHolder} />
          <CopyField label="IBAN" display={formatIban(account.iban)} copyValue={account.iban} mono />
          <div className="grid sm:grid-cols-2 gap-3">
            <CopyField
              label="Tutar"
              display={formatTry(amount, true)}
              copyValue={amount.toFixed(2).replace('.', ',')}
              emphasis
            />
            <CopyField label="Açıklama (Referans Kodu)" display={reference} mono emphasis />
          </div>
        </div>
      </div>

      {/* Adımlar */}
      <ol className="grid sm:grid-cols-3 gap-3">
        {STEPS.map((step, index) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.out, delay: 0.08 + index * 0.06 }}
            className="relative rounded-2xl bg-cream/70 border border-ink/[0.05] p-4"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-7 h-7 rounded-lg bg-brand text-champagne flex items-center justify-center text-[11px] font-bold shrink-0">
                {index + 1}
              </span>
              <step.icon size={15} className="text-brand" />
            </div>
            <p className="text-[13px] font-bold text-ink leading-snug">{step.title}</p>
            <p className="text-[11px] text-muted leading-relaxed mt-1">{step.text}</p>
          </motion.li>
        ))}
      </ol>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3">
        <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900/90 leading-relaxed">
          Açıklamasında <span className="font-mono font-semibold">{reference}</span> kodu olmayan ödemeleri davetiyenizle
          eşleştiremeyebiliriz. Tutarın eksiksiz gönderildiğinden emin olun.
        </p>
      </div>

      <div className="space-y-5">
        <CheckoutConsent id={`${uid}-consent`} invalid={attempted} />

        <motion.button
          type="button"
          onClick={handleConfirm}
          whileHover={{ y: -2, transition: gesture.hover }}
          whileTap={{ scale: 0.985, transition: gesture.press }}
          className="group relative overflow-hidden w-full inline-flex items-center justify-center gap-2.5 bg-brand text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-brand-soft transition-colors duration-300 shadow-lg shadow-brand/20 cursor-pointer"
        >
          <span className="absolute inset-0 animate-shimmer pointer-events-none" />
          Havaleyi Yaptım
          <ArrowRight size={16} className="transition-transform duration-300 ease-luxe group-hover:translate-x-1" />
        </motion.button>
      </div>
    </div>
  );
}
