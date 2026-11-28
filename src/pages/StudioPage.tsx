import React from 'react';

/**
 * Tasarım Stüdyosu rotası (Faz 28): ince kabuk. Asıl stüdyo ikinci bir tembel sınırın arkasında; böylece onun onlarca
 * parçalık ön yükleme listesi ilk yükleme paketinde değil stüdyonun kendi parçasında durur (K237 bütçesi).
 * Ayrıntı: docs/rehber/src/pages/StudioPage.md
 */
const StudioWorkspace = React.lazy(() => import('../components/studio/StudioWorkspace'));

export default function StudioPage() {
  return (
    <React.Suspense fallback={<div className="h-dvh w-full bg-brand-deep" />}>
      <StudioWorkspace />
    </React.Suspense>
  );
}
