import React from 'react';

/**
 * Sihirbaz rotası: ince kabuk (Faz 28). Sihirbaz stüdyoyla parça paylaşır; asıl sayfa ikinci tembel sınırın arkasında
 * ki ortak parçaların ön yükleme listesi ilk yükleme paketine girmesin (K237 bütçesi). Ayrıntı: docs/rehber/src/pages/CreatePage.md
 */
const CreateWizard = React.lazy(() => import('../components/create/CreateWizard'));

export default function CreatePage() {
  return (
    <React.Suspense fallback={<div className="min-h-[60vh]" />}>
      <CreateWizard />
    </React.Suspense>
  );
}
