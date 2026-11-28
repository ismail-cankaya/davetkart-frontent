import React from 'react';

/** "Telefonda aç" rotası (Faz 29.4): ince kabuk; sayfa tembel (ön yükleme listesi ilk yükleme paketine girmesin, K237). */
const PhonePreview = React.lazy(() => import('../components/preview/PhonePreview'));

export default function PreviewPage() {
  return (
    <React.Suspense fallback={null}>
      <PhonePreview />
    </React.Suspense>
  );
}
