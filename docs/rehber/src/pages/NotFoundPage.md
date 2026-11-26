# `src/pages/NotFoundPage.tsx` — bilinmeyen adres (Faz 20, `FE-06`)

> Kaynak: `AUD-2026-11-12` `FE-06` (🟢) · rota `src/routes.tsx` (`appPages` sonu, `path: '*'`) · denetim `verify:render` → *Bilinmeyen adres*

## Ne değişti

Eskiden en dıştaki `{ path: '*', element: <Navigate to="/" replace /> }` her bilinmeyen adresi **açıklamasız** ana
sayfaya atıyordu: `/fiyatlar` yazan ya da eskimiş bir bağlantıya tıklayan kullanıcı yanlış yazdığını anlayamıyordu.
Şimdi `*` rotası ortak düzenin (`AppLayout`) içinde: başlık ve alt bilgi kalır, ortada "Sayfa bulunamadı" kartı,
"Ana sayfa" ve oturum açıksa "Panelim" bağlantıları.

- **Tembel yükleme:** ilk yükleme bütçesi dar (720 kB'ın 712'si dolu); sayfa kendi parçasında.
- **Metinler `t()`'de** (`notFound.title`, `notFound.body`; düğmeler `routeError.home`, `auth.myPanel`): `verify:i18n` mandalı
  gömülü Türkçe metne izin vermez.
- **Değişmeyenler:** `/hesap/*` bilinmeyen alt sayfası `/hesap`'a döner (hesap içi, doğru davranış). Misafir sayfası
  `/invite/:id` kendi "Bu davetiye bulunamadı" metnini çizer.
- HTTP durumu 200 kalır (SPA; Nginx her yolu `index.html`'e verir). Arama motoru için gerçek 404 bu fazın işi değil.

## Denetim

`npm run verify:render` → *Bilinmeyen adres (Faz 20, FE-06)*: `/olmayan-sayfa` düzen içindeki `*` rotasına düşüyor,
`/pricing` düşmüyor, sayfa Türkçe başlığı ve `href="/"`'u çiziyor. Mutant: eski yönlendirme geri konunca ilk kontrol kırmızı.
