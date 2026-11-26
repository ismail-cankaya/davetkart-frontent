# `src/routes.tsx` · `src/App.tsx`

> **Faz:** 19.21 — `FE-02` · **Karar:** K222

## Neden ayrı dosya

Rota tablosu `App.tsx`'te `createBrowserRouter` çağrısının içindeydi; modül yüklenince tarayıcı
geçmişi gerekiyordu. Tablo artık `routes` olarak dışa aktarılıyor: `App.tsx` onu tarayıcı
yönlendiricisine, `verify:render` aynı tabloyu bellek yönlendiricisine veriyor. Test kopya değil,
gerçek tabloyu sınar.

## Hata sınırları (katmanlar)

| Katman | `errorElement` | Sonuç |
|---|---|---|
| Layout rotası | `<RouteError />` | `AppLayout` (başlık/alt bilgi) düşerse tam sayfa |
| Yolsuz iç rota (`appPages`'in ebeveyni) | `<RouteError />` | Sayfa düşerse başlık ve alt bilgi kalır |
| `/create` | `<RouteError scope="editor" />` | Kaydetme durumu notu |
| `/invite/:id` | `<RouteError scope="guest" />` | Markasız çerçeve, site bağlantısı yok |

Hata en yakın `errorElement`'e çıkar; `/hesap` alt bölümleri de iç rotanın sınırını kullanır.

## Sık hata

Yeni sayfayı `routes`'un en üst düzeyine eklemek: yalnızca `appPages`'e eklenen sayfa iç sınırı alır.
Kendi metni gereken bölge (ör. ödeme) için rotaya `errorElement` + yeni `scope` ekle.

## Bilinmeyen adres (Faz 20, `FE-06`)

En dıştaki `*` → `<Navigate to="/">` kaldırıldı; `appPages`'in son satırı `{ path: '*', element: <NotFoundPage /> }`.
Böylece 404 kartı başlık ve alt bilgiyle çizilir. Ayrıntı: [`pages/NotFoundPage.md`](pages/NotFoundPage.md).
