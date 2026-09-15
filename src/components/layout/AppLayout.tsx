import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLenis } from '../../hooks/useLenis';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from '../ui/Toast';
import { ConfirmHost } from '../ui/ConfirmDialog';

const AssistantWidget = React.lazy(() =>
  import('../assistant/AssistantWidget').then(m => ({ default: m.AssistantWidget }))
);

const PageSpinner = () => (
  <div className="py-32 flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Application chrome shared by every routed page: header, footer, toasts,
 * the assistant and Lenis smooth scrolling. Pages render into the Outlet.
 */
export function AppLayout() {
  useLenis();

  const { pathname } = useLocation();
  useEffect(() => {
    // New page, fresh viewport — jump instantly instead of animating across
    // the previous page's scroll distance.
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-cream text-ink font-sans relative">
      <Header />

      <main className="flex-grow flex flex-col">
        <React.Suspense fallback={<PageSpinner />}>
          <Outlet />
        </React.Suspense>
      </main>

      <Footer />
      <Toaster />
      <ConfirmHost />

      {/* Asistan: uygulamanın geri kalanından bağımsız, ayrı chunk olarak yüklenir */}
      <React.Suspense fallback={null}>
        <AssistantWidget />
      </React.Suspense>
    </div>
  );
}
