# `src/utils/autoPublish.ts` — Ödeme dönüşünde otomatik yayın kararı

> **Faz:** 21.3 · `FE-58` · **K267** (K67'yi daraltır) · **Sınayan:** `scripts/verify-payment.ts` "Ödeme dönüşünde yayın (FE-58, K267)" ve "Ödeme dönüşü: kart (FE-58)"
> **Kullanan:** [`../hooks/useAutoPublish.md`](../hooks/useAutoPublish.md) · [`../pages/PaymentReturnPage.md`](../pages/PaymentReturnPage.md)

## 1. Karar

K67 "ödeme yayınlamaz; yayın ayrı bir kullanıcı eylemidir" diyordu, ama dönüş sayfası ödeme `paid` olunca düğmesiz
`POST /invitations/{id}/publish` atıyordu (`FE-58`). Faz 21.3'te varsayılan seçildi: **otomatik yayın kalır**, K67
daraltıldı (K267):

> Ödeme **sunucuda** yayınlamaz (webhook yalnızca siparişi `paid` yapar). Frontend, yayın niyetiyle başlayan ödemenin
> (davetiyeye bağlı sipariş) dönüşünde **bir kez** yayın ister. Yetki ve plan kontrolü yine sunucuda (`402`).

Kullanıcı ödemeye editörde "Tasarımını Yayınla"dan gelir; dönüşte ikinci bir "Yayınla" istemek onu aynı soruyu iki kez
yanıtlamaya zorlardı.

## 2. Üç sonuç: `claimAutoPublish(order, memory)`

| Sonuç | Ne zaman | Sayfa ne yapar |
|---|---|---|
| `publish` | Sipariş `paid`, davetiyeye bağlı ve bu sekmede ilk kez | İstek atar; kart "yayına alınıyor → yayında / yayınlanamadı" |
| `already` | Aynı sipariş bu sekmede daha önce denendi (yenileme, geri gelme) | **İstek yok**; kart "Ödemeniz onaylandı" (`skipped`) |
| `none` | Ödenmedi ya da paket siparişi (`invitationId: null`) | Bir şey yapmaz |

`publish` dönerken sipariş belleğe yazılır; aynı çağrı bir daha `already` döner. "Sor ve yaz" tek fonksiyonda, çünkü
ikisinin arasına bir çizim girerse iki istek gidebilirdi.

### Neden `already` var? "Kullanıcıya sorulmadan yayın" riski

Panelde "Yayından kaldır" var. Kullanıcı davetiyeyi kaldırıp tarayıcı geçmişinden ya da sayfayı yenileyerek
`/odeme/basarili?order=…`'ye dönerse eski kanca davetiyeyi **yeniden yayınlardı**: kullanıcının kaldırdığı şeyi, ona
sormadan. Bellek bunu aynı sekme için kapatır.

## 3. Bellek: `sessionPublishMemory(storage)`

- `sessionStorage['davetkart-auto-published']`: sipariş kimliklerinin JSON listesi, en çok 20 (eski olan düşer).
  Kişisel veri değil; `preloadRecovery`'deki `davetkart-preload-reload` ile aynı tür teknik kayıt.
- Neden `sessionStorage`, `localStorage` değil? Kayıt yalnızca bu sekmenin ödeme dönüşünü anlatır; sekme kapanınca
  anlamı biter ve Çerez Politikası'nın "zorunlu" listesine yeni bir kalıcı anahtar eklemek gerekmez.
- Depolama yoksa ya da hata verirse (gizli kip, engelli site verisi): nesnenin kendi `Set`'i ziyaret içi bekçidir;
  hiçbir zaman çökmez.

**Neyi kapatmaz (B6):** başka bir sekmede ya da tarayıcı kapanıp açıldıktan sonra aynı dönüş adresine gelinirse istek
yine gider. Davetiye yayındaysa sunucu `409 INVITATION_ALREADY_PUBLISHED` döner, sayfa bunu başarı sayar (zararsız).
Kullanıcı davetiyeyi kaldırmışsa yeniden yayınlanır; tam kapatma için sunucunun siparişte "bu hak yayınlandı mı?"
bilgisini (`orders.first_published_at`, Faz 18.4) yanıta koyması gerekir (ayrı iş).

## 4. Kart: `returnCardView(view, order, publish)`

Eski `PaymentReturnPage::cardViewFor`; test edilebilsin diye buraya taşındı ve `skipped` kolu eklendi. Ödeme
onaylandıysa (`confirmed`) davetiyeli siparişte kartı yayın durumu belirler; `idle`/`publishing` "yayına alınıyor",
`skipped` "Ödemeniz onaylandı". Paket siparişi ve ödenmemiş durumlar dönüş görünümünü aynen taşır.

## 5. Sık yapılan hatalar

| Hata | Sonuç |
|---|---|
| Bekçiyi yalnızca `useRef` ile tutmak | Yenilemede ref sıfırlanır, istek yeniden gider |
| `already`'de durumu `idle` bırakmak | Kart sonsuza dek "yayına alınıyor" döner |
| `has()` ile `add()`'i ayrı çağrılarla yapmak | Araya giren ikinci çizim iki istek atabilir |
| Depolama okumasını `try` dışında yapmak | Engelli depolamada sayfa çöker |
