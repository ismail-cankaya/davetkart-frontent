# F8 — Uçtan Uca Doğrulama Senaryosu

> **Amaç:** F1–F7'de yazılan kodun backend sözleşmesini gerçekten konuştuğunu
> kanıtlamak. Denetim betikleri (`npm run verify`) sözleşmenin *şeklini*
> doğrular; bu belge *akışını* doğrular.
>
> **Neden ayrı:** yanlış bir uç derleme hatası vermez, eksik bir çeviri
> kusursuz bir cümleye düşer, ölü bir ETag hiçbir şeyi kırmaz. Bu sınıf
> hataların tek görünür olduğu yer, akışın elle koşulmasıdır.

---

## 0. Hazırlık

| Ne | Komut / Değer |
|---|---|
| Backend | `php artisan serve` → `http://localhost:8000` |
| Frontend | `npm run dev` → `http://localhost:3000` |
| Ödeme sürücüsü | `config/payment.php` → `fake` (dış ağa çıkmaz) |
| Webhook imzası | `hash_hmac('sha256', gövde, APP_KEY)`, başlık `X-Signature` |

### Sahte ödemeyi tamamlama (senaryo 6 ve sonrası için gerekli)

`FakeGateway` gerçek bir imza doğrular, yani webhook elle tetiklenebilir.
Backend dizininde:

```bash
php artisan tinker --execute="
  \$o = App\Models\Order::latest()->first();
  \$body = json_encode(['providerRef' => \$o->provider_ref, 'status' => 'paid']);
  \$sig = hash_hmac('sha256', \$body, config('app.key'));
  echo \$body . PHP_EOL . \$sig . PHP_EOL;
"
```

Çıkan gövde ve imzayla:

```bash
curl -X POST http://localhost:8000/api/public/payments/webhook \
  -H 'Content-Type: application/json' \
  -H 'X-Signature: <imza>' \
  -d '<gövde>'
```

> 🔴 İmza tutmazsa backend **404** döner (sessiz red), 401 değil. Bu kasıtlı:
> webhook ucunun varlığını doğrulamamak da bir savunmadır.

---

## 1. Senaryolar

Her satırda: **ne yapılacak**, **ne beklenecek**, ve **kırılırsa ne anlama
geldiği**. Son sütun asıl değerli olan — bir testin faydası, başarısızlığının
ne söylediği kadardır.

### Kimlik ve tasarım

| # | Adım | Beklenen | Kırılırsa |
|---|---|---|---|
| **1** | Kayıt ol → giriş yap → davetiye oluştur → bir alanı değiştir, 2 sn bekle | Editörde "kaydedildi" durumu; `PUT /invitations/{id}` 200 | Autosave zinciri kopuk; F3'ün yayınlama adımı da çalışmaz (yayın kaydedilmiş kayıt ister) |
| **2** | Galeriye fotoğraf yükle | `POST /invitations/{id}/media` → `{data:{id,url}}`; görsel ızgarada belirir | `POST /media/upload`'a gidiyorsa F2.1 uygulanmamış → **404** |

### Yayınlama ve ödeme (ticari çekirdek)

| # | Adım | Beklenen | Kırılırsa |
|---|---|---|---|
| **3** | Hiç ödeme yokken "Tasarımını Yayınla" | **402** `PAYMENT_REQUIRED`; paywall *"önce bir plan al"* metniyle açılır | Paywall hiç açılmıyorsa `activeTier` mock'u hâlâ devrede; yayınlanmış görünüp yayınlanmamış olur |
| **4** | Galerili davetiyeye Gold ödeyip yayınlamayı dene | **402** `PAYWALL_TIER_INSUFFICIENT`, `requiredTier: 'elit'`; paywall *"planını yükselt"* metniyle açılır | İki 402 aynı ekranı açıyorsa backend'in kod ayrımı çöpe gitmiş (K74) |
| **5** | Paywall'dan bir plan seç → "Ödemeye Geç" | `POST /invitations/{id}/checkout` → **201**, `status: 'pending'`; kullanıcı `redirectUrl`'e gider. **"Ödeme tamamlandı" YAZMAMALI** | "Ödendi" diyorsa planın en pahalı maddesi geri gelmiş: kullanıcı ödediğini sanıp 402 alır |
| **6** | Webhook'u tetikle (§0) → tekrar yayınla | **200**, `status: 'published'`; panele yönlendirme | 402 geliyorsa webhook siparişi `paid`'e çevirmemiş |
| **7** | Aynı davetiyeyi ikinci kez yayınla | **409** `INVITATION_ALREADY_PUBLISHED`; *"zaten yayında"* bilgisi + panele gidiş | Hata gibi gösteriliyorsa kullanıcı hedefine ulaşmışken tekrar denemeye itilir |

### Misafir yüzeyi

| # | Adım | Beklenen | Kırılırsa |
|---|---|---|---|
| **8** | Gizli sekmede `/invite/{id}` aç | Davetiye çizilir; `GET /public/invitations/{id}` yanıtında **ETag** başlığı | ETag yoksa F5 ölü; her okuma tam gövde çeker |
| **9** | 🔴 `response.headers.etag` **üretim origin'inden** okunabiliyor mu | Değer dolu | `undefined` ise backend `config/cors.php` → `exposed_headers: ['ETag']` eksik. Aynı kaynakta (proxy) bu hata **görünmez** |
| **10** | Misafir olarak LCV gönder + fotoğraf ekle | Yükleme `POST /public/invitations/{id}/media` → `id`; LCV gövdesinde `photoMediaId` gider; panelde fotoğraf görünür | Sadece `url` saklanıyorsa fotoğraf LCV'ye **hiçbir zaman** bağlanamaz |
| **11** | Honeypot'u doldurup gönder (aşağıdaki curl) | **204**, kayıt **oluşmaz**, liste değişmez | 201 dönüyorsa tuzak kurulmamış; 422 dönüyorsa bota yakalandığı söylenmiş (L2 ihlali) |

```bash
curl -i -X POST http://localhost:8000/api/public/invitations/<ID>/rsvps \
  -H 'Content-Type: application/json' \
  -d '{"guestName":"Bot Test","guestCount":1,"status":"attending","website":"http://spam.example"}'
```

### Panel ve asistan

| # | Adım | Beklenen | Kırılırsa |
|---|---|---|---|
| **12** | Panelde ağ sekmesini aç, 30 sn bekle | 15 sn'de bir istek; **ikincisi 304** ve gövdesiz | Hepsi 200 ise `If-None-Match` gitmiyor. `catch`e düşüyorsa `validateStatus` eksik |
| **13** | Çıkış yap, asistan düğmesine bas | Sohbet yerine *"giriş yap"* ekranı | Sohbet açılıyorsa auth'lu uca anonim istek gider → 401; ve backend'in maliyet kontrolü boşa çıkar (K72) |
| **14** | Giriş yapıp 30 mesaj gönder | **429** `ASSISTANT_QUOTA_EXCEEDED`; *"günlük hakkın doldu"* + yazma alanı kapanır | *"Çok hızlısın"* yazıyorsa iki 429 karıştırılmış |
| **15** | İletişim formunu gönder | `POST /public/contact` → **204**; teşekkür mesajı | `/contact`'a gidiyorsa **404** |

### Silme ve hak devri

| # | Adım | Beklenen | Kırılırsa |
|---|---|---|---|
| **16** | Yayınlanmış davetiyeyi sil | Modal açılır; 3 günlük pencere uyarısı **görünür** | `window.confirm` çıkıyorsa F7.3 uygulanmamış; uyarı yoksa kullanıcı parasının akıbetini öğrenemeden siler |
| **17** | Yeni davetiye oluştur → yayınla | Serbest kalan hak bağlanır, **200** (ödeme istenmez) | 402 geliyorsa `ClaimReleasedOrderAction` hakkı bağlamamış |

---

## 2. Bilinen sınırlar

| Senaryo | Sınır |
|---|---|
| **9** | Yerelde vite proxy her şeyi aynı kaynak yapar; CORS hiç devreye girmez. Bu madde **yalnızca gerçek üretim origin'inden** anlamlı sınanır |
| **14** | 30 mesaj göndermek elle pratik değil; `config/davetkart.php` → `daily_message_limit_per_user` geçici olarak 2'ye çekilerek sınanır |
| **16** | Uyarı bugün **tarihsiz**: `InvitationResource` `publishedAt` göndermiyor (bkz. F7 açık maddesi). Pencerenin dolup dolmadığı doğrulanamaz |

---

## 3. Sonuç kaydı — 15 Eylül 2026, otomatik koşum

Backend `localhost:8000`, frontend `localhost:3001`, sürücü `fake`.

| # | Sonuç | Not |
|---|---|---|
| 1 | ⛔ | Kimlik gerektiriyor — koşulmadı |
| 2 | ⛔ | Dosya yükleme bu ortamda çalışmıyor (aşağıya bak) |
| 3 | ⛔ | Kimlik gerektiriyor |
| 4 | ⛔ | Kimlik + ödenmiş sipariş gerektiriyor |
| 5 | ⛔ | Kimlik gerektiriyor |
| 6 | ⛔ | Kimlik gerektiriyor |
| 7 | ⛔ | Kimlik gerektiriyor |
| 8 | ✅ | Misafir sayfası çiziliyor; `ETag: "d6b1a730…"` üretiliyor |
| 8b | ✅ | `If-None-Match` ile ikinci okuma → **304, 0 bayt** |
| 9 | ⚠️ | Yerelde proxy aynı kaynak yapıyor; **yalnızca üretim origin'inde** anlamlı |
| 10 | ⛔ | Yayınlanmış iki davetiyede de `show_rsvp = false`; veri uygun değil |
| 11 | ✅ | Honeypot dolu → **204**, kayıt **oluşmadı** (toplam 1 → 1) |
| 12 | ⛔ | Panel kimlik gerektiriyor |
| 13 | ✅ | Çıkış yapılmışken sohbet yok, giriş ekranı var (`hasComposer: false`) |
| 14 | ⛔ | Kimlik gerektiriyor |
| 15 | ✅ | `POST /public/contact` → kayıt veritabanında doğrulandı |
| 16 | ⛔ | Kimlik gerektiriyor |
| 17 | ⛔ | Kimlik gerektiriyor |

### Yan doğrulamalar (senaryo listesinde yok ama koşuldu)

| Ne | Sonuç |
|---|---|
| Kapalı modülün anahtarı gövdede yok (`showGallery:false` → `galleryImages` **anahtarı yok**) | ✅ Tuzak #3 doğrulandı |
| Backend `timezone` boşken varsayılanı dolduruyor (`NULL` → `Europe/Istanbul`) | ✅ F6 sözleşmesi doğrulandı |
| `date` offset'siz duvar saati geliyor (`2026-11-21T02:49`) | ✅ |
| Doğrulama zarfı kural adı taşıyor (`{"rule":"max","params":{"max":10}}`) | ✅ F1'in `byField` kararı gerçek veriyle doğrulandı |
| Honeypot DOM'da `display:none` **değil**, ekran dışında (-8760px), `tabIndex:-1` | ✅ Tuzak #8 doğrulandı |

---

## 4. Bulgular

### 🔴 B1 — Ödeme dönüş rotaları yok

`FakeGateway` kullanıcıyı `PAYMENT_SUCCESS_URL` (varsayılan `/odeme/basarili`)
adresine gönderiyor, hata durumunda `/odeme/hata`. **Frontend'de bu rotalar
tanımlı değil.** `App.tsx`'teki catch-all (`path: '*'`) ikisini de sessizce
ana sayfaya yönlendiriyor ve sorgudaki `?order=…` kayboluyor.

Doğrulandı: `/odeme/basarili?order=01TEST` → `/` (anasayfa).

**Sonucu:** kullanıcı ödemesini tamamlayıp geri döndüğünde pazarlama
anasayfasında buluyor kendini; ödemenin alınıp alınmadığını, ne yapması
gerektiğini öğrenemiyor. F3'te kurulan akışın son halkası kopuk.

### 🟡 B2 — `uploaded` kuralının çevirisi eksikti

Canlı dosya yükleme denemesi `VALIDATION_FAILED` +
`{"file":[{"rule":"uploaded"}]}` döndürdü. Bu kural `errors.json`'da yoktu ve
genel `validation.fallback` metnine düşüyordu. **Düzeltildi**; `uploaded`,
`dimensions` ve `extensions` eklendi.

### ⚙️ O1 — PHP geçici dosya dizini yazılamıyor (ortam)

`PHP Request Startup: File upload error - unable to create a temporary file`.
Frontend hatası değil; `upload_tmp_dir` ayarlanana kadar dosya yükleme
gerektiren her senaryo (2 ve 10) koşulamaz.

### ⚙️ O2 — F6 bu makinede ayırt edilemiyor

Tarayıcının saat dilimi `Europe/Istanbul` ve davetiye de İstanbul'da; naif
ayrıştırma ile doğru hesap **aynı** sonucu veriyor. Hatanın görünmesi için
tarayıcının başka bir saat diliminde olması gerekir. Matematik
`npm run verify:time` ile ayrıca kanıtlanmış durumda (16 iddia).

---

## 5. Kalanı koşmak için gerekenler

| Engel | Çözüm |
|---|---|
| Kimlik | Bir test hesabıyla tarayıcıda oturum açılması. Asistan, ödeme ve panel senaryolarının tamamı buna bağlı |
| Dosya yükleme | Backend PHP'sinde `upload_tmp_dir` yazılabilir olmalı |
| LCV senaryosu | Yayınlanmış bir davetiyede `show_rsvp` açık olmalı |
| Senaryo 14 | `daily_message_limit_per_user` geçici olarak 2'ye çekilmeli |
| Senaryo 9 | Gerçek üretim origin'i |
