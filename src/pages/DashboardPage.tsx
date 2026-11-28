import React from 'react';

/**
 * Panel rotası: ince kabuk (Faz 29). Panel editörle parça paylaşır (çeviriler, paylaşım, hızlı düzenleme); asıl sayfa
 * ikinci tembel sınırın arkasında ki ön yükleme listesi ilk yükleme paketine girmesin (K237). Ayrıntı:
 * docs/rehber/src/pages/DashboardPage.md
 */
const Dashboard = React.lazy(() => import('../components/dashboard/Dashboard'));

export default function DashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[60vh]" />}>
      <Dashboard />
    </React.Suspense>
  );
}
