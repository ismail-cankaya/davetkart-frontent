import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass, Home, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * Bilinmeyen adres (Faz 20, FE-06). Eskiden açıklamasız ana sayfaya atılıyordu; kullanıcı yanlış
 * yazdığını anlayamıyordu. Görünüm `RouteError` ile aynı aile. Ayrıntı: docs/rehber/src/pages/NotFoundPage.md
 */
export default function NotFoundPage() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return (
    <section data-not-found className="min-h-[60vh] flex items-center justify-center px-4 py-24 bg-cream text-ink">
      <div className="w-full max-w-md rounded-3xl border border-ink/10 bg-white/80 p-8 shadow-xl shadow-ink/5 text-center">
        <Compass className="mx-auto mb-4 text-gold" size={32} aria-hidden />
        <h1 className="font-serif text-2xl text-brand">{t('notFound.title')}</h1>
        <p className="mt-3 text-sm text-muted">{t('notFound.body')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/" className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-brand text-white text-sm font-semibold">
            <Home size={15} aria-hidden />
            {t('routeError.home')}
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-ink/15 text-sm font-semibold">
              <LayoutDashboard size={15} aria-hidden />
              {t('auth.myPanel')}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
