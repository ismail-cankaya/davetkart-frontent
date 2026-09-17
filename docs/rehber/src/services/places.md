# `src/services/places.ts` — Konum arama ve harita seçimi

> **Kod dosyaları:** `src/services/places.ts`, `src/hooks/usePlaceSearch.ts`,
> `src/utils/mapLocation.ts`, `src/components/create/location/`
> **Durum:** Frontend hazır. Backend ucu **henüz yazılmadı**; frontend
> `VITE_PLACES_SEARCH_ENABLED=false` iken ağa hiç çıkmaz.
> **Denetim:** `npm run verify:content`

Bu belge, konum aramasının backend entegrasyonunu yapacak kişi için bir
**devir notudur**: frontend'in bugün ne yaptığını, uçtan ne beklediğini ve
entegrasyon bittiğinde neyin açılacağını anlatır.

---

## 1. Kullanıcı ne görüyor?

Sihirbazın "Konum ve Ulaşım" grubunda iki alan var:

| Alan | Veri | Önizlemede |
|---|---|---|
| **Davet Konumu** | `venue` — serbest metin | Hero'da ve "Mekan" satırında |
| **Ulaşım Bilgileri** | `mapUrl` — seçilen konumun Google Haritalar yol tarifi bağlantısı | "Yol Tarifi Al" düğmesi |

"Ulaşım Bilgileri" alanında:

1. Kullanıcı yer adını yazar → backend'in Google Haritalar vekilinden gelen
   **öneriler** listelenir (uç hazır olana kadar liste boştur).
2. Listenin sonunda **her zaman** "Harita üzerinden konum seç" bulunur.
3. O seçenek (ya da alanın sağındaki harita ikonu) bir pencere açar: üstte
   harita, **en altta koordinat girişi**.
4. Bir öneri ya da koordinat seçilince `mapUrl`'e yol tarifi bağlantısı yazılır.

🔴 Yazılan metin tek başına **kaydedilmez** — bir yer adı konum değildir.
Kullanıcı seçim yapmadan alandan çıkarsa uyarı görür; metni tamamen silmek
seçili konumu kaldırır.

---

## 2. Neden anahtar frontend'de değil?

`VITE_` önekli her değişken derlemeye gömülür ve herkes okuyabilir. Places API
ücretli bir kotadır; anahtarı tarayıcıya koymak kotayı herkese açmak demektir.
Asistan çağrısı nasıl `POST /api/assistant/chat` üzerinden vekilleniyorsa,
konum araması da backend üzerinden gider.

---

## 3. 🔴 Backend sözleşmesi (yazılacak)

### İstek

```
GET /api/public/places/search?query=Çırağan%20Sarayı
```

| Kural | Değer | Neden |
|---|---|---|
| Rota grubu | `Route::prefix('public')` | Sihirbaz giriş yapmadan kullanılabiliyor; diğer anonim uçlarla (`/public/contact`) aynı yer |
| `query` | zorunlu, `string`, 3–120 karakter | Frontend bu aralığın dışındaki sorguyu hiç göndermez |
| Hız sınırı | yeni bir `throttle:places` kovası (IP başına) | Anonim uç + ücretli sağlayıcı; `throttle:rsvp`/`throttle:contact` deseni |
| Dil / bölge | `tr` / `TR` | Türkçe adresler, Türkiye öncelikli sonuçlar |

Frontend yazma durduktan **300 ms** sonra sorar, yeni sorgu başlayınca eskisini
iptal eder (`AbortController`). Yine de uç tuş vuruşu hızında çağrılmaya hazır
olmalı.

### Başarılı yanıt — `200`

```json
{
  "data": [
    {
      "placeId": "ChIJ…",
      "name": "Çırağan Palace Kempinski Istanbul",
      "address": "Çırağan Cd. No:32, 34349 Beşiktaş/İstanbul",
      "location": { "lat": 41.0431, "lng": 29.0154 }
    }
  ]
}
```

| Alan | Tip | Not |
|---|---|---|
| `placeId` | `string` | Liste anahtarı ve yol tarifi bağlantısındaki `destination_place_id` |
| `name` | `string` | Birincil satır; seçilince alanda bu görünür |
| `address` | `string` | İkincil satır |
| `location.lat` / `location.lng` | `number` | WGS84 derece |

- Sonuç yoksa **boş dizi** dönün, `404` değil.
- Liste en fazla ~5–8 öğe olsun; açılır listede daha fazlası okunmaz.
- Frontend ağ sınırında doğrular (`isPlaceSuggestion`): biçimi bozuk öğe
  sessizce elenir, listenin geri kalanı gösterilir.

### Hata yanıtları

Projenin hata zarfı (K20) aynen geçerli: `{ "error": { "code": "…" } }`.
Frontend bu uçtaki hiçbir hatayı kullanıcıya bildirim olarak **göstermez**
(öneri listesi bir kolaylıktır; harita seçimi her durumda çalışır), yalnızca
geliştirme ortamında konsola yazar. Yine de doğru kodlar izleme için önemli:

| Durum | Yanıt |
|---|---|
| Doğrulama (`query` eksik/kısa/uzun) | `422 VALIDATION_FAILED` |
| Hız sınırı | `429 RATE_LIMITED` |
| Sağlayıcıya ulaşılamadı / kota | `503 PROVIDER_UNAVAILABLE` — sağlayıcının ham hatası dışarı sızmamalı |

### Sağlayıcı tarafı (öneri)

Sözleşme her öneride koordinat taşıdığı için tek çağrıyla koordinat dönen
**Places API (New) — Text Search** en doğrudan eşleşmedir:

```
POST https://places.googleapis.com/v1/places:searchText
X-Goog-Api-Key: <backend .env>
X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.location

{ "textQuery": "Çırağan Sarayı", "languageCode": "tr", "regionCode": "TR" }
```

Eşleme: `id → placeId`, `displayName.text → name`,
`formattedAddress → address`, `location.latitude/longitude → location.lat/lng`.

> Uç ve alan adlarını entegrasyon anında Google'ın güncel belgesiyle
> doğrulayın. **Autocomplete** tercih edilirse öneriler koordinat taşımaz;
> sözleşmeye seçim anında çağrılacak bir ayrıntı ucu eklenmeli ve
> `LocationSearchField` içindeki `choose` bu çağrıyı yapacak şekilde
> genişletilmelidir.

Anahtar yalnızca backend'in `.env`'inde durur (ör. `GOOGLE_MAPS_API_KEY`,
`config/services.php` üzerinden okunur). Aynı sorgunun tekrarı için önbellek
kullanılacaksa süresini Google Maps Platform koşullarına göre belirleyin.

---

## 4. Seçilen konum nerede saklanıyor?

**Şema değişikliği gerekmez.** Konum, var olan `mapUrl` alanına resmî bir
Google Maps URLs bağlantısı olarak yazılır:

```
https://www.google.com/maps/dir/?api=1&destination=41.043100,29.015400
https://www.google.com/maps/dir/?api=1&destination=41.043100,29.015400&destination_place_id=ChIJ…
```

| Özellik | Sonuç |
|---|---|
| Backend `invitation.mapUrl` kuralı: `url`, `max:2048` | Bağlantı doğrulamadan geçer |
| Misafir sayfası | "Yol Tarifi Al" doğrudan rotayı başlatır, anahtar gerekmez |
| Editör | Koordinat bağlantıdan geri okunur (`readMapLocation`) |
| Eski kayıtlar | Elle yapıştırılmış bağlantılar (`maps.app.goo.gl/…`) aynen gösterilir ve çalışır |

İleride koordinat ya da `placeId` ayrı kolonlarda tutulmak istenirse
değişecek yerler: `types.ts → Invitation`, `services/invitations.ts` (wire
biçimi), backend'de `InvitationRequest::COLUMN_MAP` + kurallar,
`InvitationPayloadResource`, `PublicInvitationResource` ve bir migration.
Bilinmeyen alanı backend **sessizce düşürür** (beyaz liste) — yalnızca
frontend'e alan eklemek veri kaybıdır.

---

## 5. Seçim penceresindeki harita

Bugün **OpenStreetMap gömme sayfası** kullanılıyor (`buildMapEmbedUrl`):
anahtarsız ve resmî tek gömme yolu. Nokta seçilmemişken Türkiye kadrajı,
geçerli koordinat girilince iğneli mahalle ölçeği gösterilir. Harita, yazma
durduktan 450 ms sonra güncellenir; her güncellemede iframe yeniden kurulur
(`key`), böylece tarayıcı geçmişi kirlenmez.

Google haritasına geçilmek istenirse değişecek yerler yalnızca
`utils/mapLocation.ts → buildMapEmbedUrl` ve `MapPickerModal`'ın harita
alanıdır. Seçenekler:

| Seçenek | Not |
|---|---|
| Maps Embed API | Anahtar iframe adresinde tarayıcıya iner (HTTP referrer kısıtlı olsa da) — proje kuralıyla birlikte değerlendirilmeli |
| Backend'in ürettiği statik harita | `GET /public/places/static-map?lat&lng` gibi bir uç, imzalı Static Maps görseli döner; anahtar sunucuda kalır |
| Etkileşimli harita (tıklayarak seçme) | Bir harita kütüphanesi gerekir; pencere `React.lazy` ile yalnızca açıldığında yüklenmeli |

---

## 6. Entegrasyon bitince

1. Backend ucunu yazın (§3), `throttle:places` kovasını tanımlayın.
2. Frontend ortam dosyasına ekleyin ve Vite'ı yeniden başlatın:
   ```
   VITE_PLACES_SEARCH_ENABLED=true
   ```
3. Elle doğrulayın:

| # | Adım | Beklenen |
|---|---|---|
| 1 | `/create` → Düğün → bir tema | Form açılır, "Ulaşım Bilgileri" boş |
| 2 | "Çırağan" yazın | 300 ms sonra tek istek: `GET /api/public/places/search?query=Çırağan` |
| 3 | Hızlıca yazmaya devam edin | Önceki istek **iptal** edilir (Network: *canceled*) |
| 4 | Bir öneri seçin | Alanda yer adı; altında "Misafirleriniz “Yol Tarifi Al” ile…" |
| 5 | Önizlemede "Ne Zaman & Nerede" | "Yol Tarifi Al" doğru rotayı açar |
| 6 | Backend'i durdurup tekrar yazın | Hata bildirimi **yok**; "Harita üzerinden konum seç" çalışır |
| 7 | Giriş yapmadan aynı akış | Öneriler gelir (uç kimlik istemez) |

---

## 7. Sık yapılan hatalar

| # | Hata | Ne olur |
|---|---|---|
| 1 | Places anahtarını `VITE_` değişkenine koymak | Anahtar derlemeye gömülür, kota herkese açılır |
| 2 | Ucu `auth:sanctum` arkasına almak | Giriş yapmamış tasarımcı öneri göremez |
| 3 | Sonuç yokken `404` dönmek | Arayüz "bulunamadı" yerine hata yolu işletir |
| 4 | Yazılan metni `mapUrl`'e kaydetmek | Backend `url` kuralı `422` verir, otomatik kaydetme her seferinde düşer |
| 5 | Koordinat için yalnızca frontend'e alan eklemek | Backend beyaz listesi alanı sessizce düşürür |
