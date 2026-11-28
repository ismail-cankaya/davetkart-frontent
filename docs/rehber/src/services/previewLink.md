# `src/services/previewLink.ts`

Faz 29.4 (K328). `create(id)` → `{ url, expiresAt }`; `open(id, search)` → `Invitation`. Misafir servisini
(`publicInvitation.ts`) içe aktarmaz: o modül paylaşılırsa misafir sayfasından ayrı parçaya düşer ve misafir paketi
büyür (K237); yük biçimi aynı, küçük ayrıştırma burada tekrarlanır.
