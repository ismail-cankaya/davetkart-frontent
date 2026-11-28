import React, { Suspense, createContext, lazy, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'motion/react';
import { useFixedText } from '../../invitationText/InvitationTextContext';

/** Pencere yalnızca açılınca iner: misafir sayfasının iskeletine girmez (paket bütçesi, K237). */
const ReportDialog = lazy(() => import('./ReportDialog'));

/**
 * Misafir sayfasının bağlamı (Faz 25, K313): yalnızca `InvitePage` verir. Önizlemeler ve editör vermez,
 * bu yüzden "bildir" bağlantısı yalnızca yayındaki davetiyenin misafir sayfasında görünür.
 */
const GuestPageContext = createContext<{ invitationId: string } | null>(null);

export function GuestPageProvider({ invitationId, children }: { invitationId: string; children: React.ReactNode }) {
  return <GuestPageContext.Provider value={{ invitationId }}>{children}</GuestPageContext.Provider>;
}

/**
 * Davetiyenin alt bilgisindeki küçük "bu davetiyeyi bildir" bağlantısı. Metinleri davetiyenin dilinde
 * (misafirin gördüğü sayfa, `fixed` metinler); düzenlenemez.
 */
export function ReportInvitationLink({ className }: { className?: string }) {
  const guest = useContext(GuestPageContext);
  const fixed = useFixedText();
  const [open, setOpen] = useState(false);
  if (!guest) return null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {fixed('report.link')}
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <Suspense key="report" fallback={null}>
              <ReportDialog invitationId={guest.invitationId} onClose={() => setOpen(false)} />
            </Suspense>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
