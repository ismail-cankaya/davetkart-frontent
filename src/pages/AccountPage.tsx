import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { AccountNav } from '../components/account/AccountNav';
import { useAuthStore } from '../stores/useAuthStore';
import { fullName } from '../utils/user';
import { duration, ease } from '../utils/motion';

/**
 * Hesap ayarları kabuğu — `/hesap/*` (Faz 14; Faz 10'da tek sayfaydı).
 *
 * Bölümler alt yollar: `/hesap/planlarim` paylaşılabilir ve geri tuşu çalışır.
 * Bölüm içeriği `<Outlet />`'te, `pages/account/` altında. Her bölüm kendi
 * verisini kendisi ister (Planlarım açılmadan oturum listesi istenmez).
 */
export default function AccountPage() {
  const user = useAuthStore(s => s.user);
  const location = useLocation();

  return (
    <section className="flex-grow bg-cream px-4 py-14 md:py-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.panel, ease: ease.out }}
        >
          <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Hesabım
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink">
            Hesap <span className="italic text-brand font-medium">Ayarları</span>
          </h1>
          {user && <p className="text-sm text-muted mt-2">{fullName(user)} · {user.email}</p>}
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-[15rem_1fr] gap-8 lg:gap-12 items-start">
          <aside className="lg:sticky lg:top-28">
            <AccountNav />
          </aside>

          {/* Anahtar yol: bölüm değişince içerik yeniden girer. AnimatePresence
              YOK — Outlet çıkış animasyonu sırasında zaten yeni bölümü çizerdi.
              Bölümler ayrı parçalar (lazy): Suspense burada, kabuk yerinde kalsın. */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="space-y-6 min-w-0"
          >
            <React.Suspense fallback={<div className="h-64 rounded-[1.5rem] bg-white/60 animate-pulse" />}>
              <Outlet />
            </React.Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
