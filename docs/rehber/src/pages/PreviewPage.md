# `src/pages/PreviewPage.tsx` · `src/components/preview/PhonePreview.tsx`

Faz 29.4 (K328). `/preview/:id?expires&signature`: imzalı önizleme. Sayfa ince kabuk, asıl bileşen `PhonePreview` (tembel).

- Sorgu dizesi olduğu gibi `GET /api/public/invitations/{id}/preview`'a taşınır (backend göreli imza).
- Davetiye misafir sayfası gibi canlı kipte çizilir; LCV kapsamı boş (hiçbir şey gerçek davetiyeye yazılmaz).
- Üstte "Önizleme · misafirler bu hâli henüz görmüyor" şeridi; `<meta name="robots" content="noindex">`.
- Bozuk ya da süresi dolmuş bağlantı: "süresi dolmuş ya da bağlantı hatalı" ekranı.
