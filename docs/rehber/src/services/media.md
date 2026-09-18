# `src/services/media.ts` — Galeri ve LCV medya yüklemeleri

> **Kod dosyaları:** `src/services/media.ts`, `src/services/api.ts`,
> `src/components/create/GalleryUploader.tsx`, `src/components/templates/shared/Gallery.tsx`
> **Backend karşılığı:** `MediaController`, `StoreUploadedMediaAction`,
> `DeleteGalleryMediaAction` (backend `docs/rehber/app/…`)
> **Denetim:** `npm run verify:endpoints`, backend `tests/Feature/MediaTest.php`

---

## 1. Belirti: "Fotoğraflar yüklenmiyor"

Galeriye seçilen her fotoğraf sunucudan **422** alıyordu. Hata mesajı dosyanın
eksik olduğunu söylüyordu, oysa dosya seçilmişti.

### 🔴 Kök neden: istemci genelindeki JSON başlığı

`api.ts` içindeki axios örneği şöyle kuruluydu:

```ts
axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } }); // ❌
```

axios'un `transformRequest` adımı gövde bir `FormData` olsa bile önce
`Content-Type` başlığına bakar. Başlık JSON diyorsa `FormData`'yı **JSON'a
çevirir**. `File` nesnesi JSON'da temsil edilemediği için sunucuya `{}` gider,
Laravel de `file` alanını boş görür.

Hata hiçbir yerde hata gibi görünmüyordu: istek gidiyor, yanıt geliyor, yalnızca
içerik yanlış.

### Düzeltme (iki katman)

| Katman | Değişiklik | Neden |
|---|---|---|
| `api.ts` | Varsayılan `Content-Type` kaldırıldı | axios düz nesneyi zaten JSON olarak gönderir ve başlığı kendisi yazar; genel başlığa ihtiyaç yoktu |
| `media.ts` | Yükleme isteği `Content-Type: multipart/form-data` ile gönderilir | Biri ileride genel JSON başlığını geri eklese bile yükleme bozulmaz |

Tarayıcıda axios, gövde `FormData` olduğunda bu başlığı **düşürür** ve
`boundary` değerini tarayıcı yazar. Başlığı elle `multipart/form-data;
boundary=…` diye yazmaya çalışmayın: sınır değeri gövdeyle eşleşmezse sunucu
gövdeyi hiç çözemez.

> **Doğrulandı:** Gerçek tarayıcıda (XHR adaptörü) istek
> `multipart/form-data; boundary=…` ile gidiyor. Gövdede dosya parçası
> (`filename=`), JPEG baytları ve `kind=gallery` alanı var.
> `verify:endpoints` da gövdenin `FormData` olduğunu, içinde `File`
> bulunduğunu ve başlığın JSON olmadığını sınar.

---

## 2. Uçlar

| İşlem | Uç | Kim |
|---|---|---|
| Galeriye yükle | `POST /invitations/{id}/media` (`kind=gallery`) | Sahip (auth) |
| Galeriden sil | `DELETE /invitations/{id}/media/{mediaId}` → `204` | Sahip (auth) |
| LCV fotoğraf/video | `POST /public/invitations/{id}/media` (`rsvp_photo`, `rsvp_video`) | Misafir |

Başka bir davetiyenin fotoğrafı ya da bir LCV dosyası silinmek istenirse sunucu
**404** döner. Kaynağın varlığı bile açığa çıkmaz.

---

## 3. 🔴 Galeri sırası sunucuya aittir

`galleryImages` artık `string[]` değil, `GalleryImage[]`:

```ts
interface GalleryImage { id: string | null; url: string }
```

| Nerede | `id` |
|---|---|
| Sahip yanıtı (`InvitationPayloadResource`) | Medya ULID'si — silme bunu kullanır |
| Misafir yanıtı (`PublicInvitationResource`) | Gelmez; frontend `null` yazar |

- **Yükleme** fotoğrafı galerinin sonuna **sunucu** ekler. Bunu davetiye satırını
  kilitleyerek, aynı işlem içinde yapar.
- **Kaydetme gövdesi** (`toPayload`) galeriyi **göndermez**. Göndermiş olsaydı,
  yükleme sürerken tetiklenen bir otomatik kaydetme eski listeyi sunucuya geri
  yazıp yeni fotoğrafı silebilirdi. Backend de alanı zaten kabul etmez.
- Yerel liste `applyGallery(recordId, update)` ile güncellenir. Yanıt
  geldiğinde başka bir davetiye açılmışsa güncelleme **atlanır**.

---

## 4. `GalleryUploader` davranışı

| Durum | Sonuç |
|---|---|
| Giriş yapılmamış | İstek atılmaz; "Fotoğraf eklemek için giriş yapmanız gerekiyor. Tasarımınız korunur." |
| Tür/boyut uygun değil | JPG, PNG, WEBP ve en fazla 5 MB dışındakiler elenir, uyarı gösterilir |
| Kayıt henüz yok | Önce davetiye kaydedilir, sonra yüklenir |
| Birden çok dosya | Sırayla yüklenir; ilk hatada durur (sıra korunur) |
| Silme 404 | Dosya sunucuda zaten yok: yerel listeden de çıkarılır |

En fazla 8 fotoğraf eklenebilir.

---

## 5. Önizleme galerisi

`Gallery.tsx` görüntülenen konumu her çizimde listenin boyuna sıkıştırır. Liste
küçüldüğünde (fotoğraf silme, başka kayıt yükleme) konum listenin dışında
kalırsa `images[index].url` tanımsız olurdu ve önizleme **çökerdi**. Tarayıcıda
3/3 konumundayken liste tek fotoğrafa indirildi; önizleme 1/1'e geçti ve
çökmedi.

---

## 6. Sık yapılan hatalar

| Hata | Sonuç |
|---|---|
| `api.ts`'e genel `Content-Type: application/json` eklemek | Tüm yüklemeler `{}` gönderir → 422 |
| Başlığa elle `boundary` yazmak | Sunucu gövdeyi çözemez |
| `toPayload`'a `galleryImages` eklemek | Otomatik kaydetme yeni yüklenen fotoğrafı silebilir |
| Galeri anahtarı olarak dizi sırasını kullanmak | Silmeden sonra yanlış öğenin durumu (spinner) yanlış satıra geçer; `id ?? url` kullanın |

---

## 🆕 Faz 9 — yüklemeden önce tarayıcıda küçültme

> **Yeni kod dosyaları:** `src/utils/compressImage.ts`,
> `scripts/verify-image-compression.ts`
> **Denetim:** `npm run verify:image`

### 1. Belirti: 2 MB üstü her fotoğraf hata veriyordu

Sebep istemcide değildi: sunucunun PHP ayarı (`upload_max_filesize = 2M`)
dosyayı Laravel'e ulaşmadan atıyordu. Ayar yükseltildi (25 MB) ve uygulama
sınırı 5 MB'dan **15 MB**'a çıktı.

Ama sınırı yükseltmek tek başına yeni bir sorun üretiyordu: **mobil yükleme
süresi.** 8-15 MB'lık bir telefon fotoğrafı 4G'de 10-30 saniye sürer, genel
axios zaman aşımı ise 15 saniyedir.

### 2. Sıra kararı: önce tarayıcı, sonra sunucu

| | Yalnızca sunucu | Önce tarayıcı ✅ |
|---|---|---|
| Giden veri | 8-15 MB | ~0,3-1 MB |
| Mobil yükleme | 10-30 sn | 1-2 sn |
| Sunucu işlemcisi | Fotoğraf başına ~0,5 sn | Neredeyse sıfır — dosya hedefte olduğu için kuyruktaki iş görseli **hiç çözmez** |

🔴 Bu bir **tekrar değildir** ve sunucudaki katman yerinde duruyor: istemci
kodu atlanabilir (`curl`, eski bir sekme, başka bir istemci). Sunucu hâlâ 15 MB
ve 8192 px sınırlarını uyguluyor ve gelen dosyayı küçültüyor. Tarayıcı katmanı
**kullanıcıyı bekletmemek** için var, savunma için değil.

### 3. Kararlar backend ile aynı sayılar

| Karar | Değer | Backend karşılığı |
|---|---|---|
| En uzun kenar | 2000 px | `media.optimize.max_edge_px` |
| Hedef boyut | 2 MB | `media.optimize.target_kb` |
| Kalite basamakları | 0,82 → 0,72 → 0,62 | `jpeg_quality` → `min_quality` |
| Çıktı biçimi | JPEG→JPEG, PNG/WebP→WebP | `targetMimeType()` |
| Üst sınır | 15 MB (video 20 MB) | `media.<tür>.max_size_kb` |

İki taraf ayrışırsa kullanıcı ya boşuna engellenir ya da dosyayı yükledikten
**sonra** 422 alır; ikincisi mobil bağlantıda dakikalar demek.

### 4. 🔴 EXIF yönü

Telefon fotoğrafı *"gösterirken 90 derece çevir"* notuyla gelir. Canvas'a
çizerken bu not uygulanmazsa yüklenen fotoğraf **yan yatar** — ve kullanıcı
bunu yükleme bittikten sonra görür.

```ts
await createImageBitmap(file, { imageOrientation: 'from-image' });
```

Seçenek desteklenmiyorsa `<img>` yoluna düşülüyor: tarayıcılar bir `<img>`
elemanını canvas'a çizerken yönü zaten uygular.

### 5. Hata hâlinde **orijinal** gönderilir

Çözme hatası, bellek, canvas sınırı, biçim desteği — hepsinde `catch` bloğu
orijinal dosyayı döndürür ve işi sunucu yapar. Sıkıştırma bir kolaylıktır;
kullanıcının yüklemesini engellemesi kabul edilemez. Aynı gerekçeyle: sonuç
orijinalden **küçük değilse** de orijinal gönderilir.

### 6. Sınır nerede uygulanıyor?

`GalleryUploader` artık dosya boyutuna **bakmıyor**. Seçilen dosyanın orijinal
boyutuna bakıp elemek, sıkıştırıldıktan sonra rahatça sığacak 12 MB'lık bir
fotoğrafı reddetmek olurdu. Sınır sıkıştırmadan **sonra**, serviste uygulanıyor:

```ts
if (prepared.size > MEDIA_UPLOAD_LIMIT_BYTES[kind]) throw new MediaTooLargeError(...);
```

`toDisplayError` bu hatayı sunucunun aynı durumda döndürdüğü kodun metnine
(`FILE_TOO_LARGE`) çeviriyor — kullanıcı için ikisi aynı olaydır.

### 7. Zaman aşımı yalnızca yüklemede gevşetildi

Genel 15 saniye **sunucunun işleme süresi** içindir (15 saniye kuralı: ağır iş
kuyruğa gider, istek hemen döner). Dosya **aktarımı** o bütçeye sığmaz; bu
yüzden yalnızca yükleme isteği `timeout: 120_000` alıyor.

### 8. Sık yapılan hatalar

| Hata | Sonuç |
|---|---|
| Sıkıştırmayı bileşenin içine yazmak | Misafirin LCV fotoğrafı (`useRsvpStore`) kapsam dışı kalır |
| EXIF yönünü uygulamamak | Dikey fotoğraflar yan yatar |
| Sonucu boyut karşılaştırmadan kullanmak | Küçük dosyalar yeniden kodlanıp **büyür** |
| Hata hâlinde exception fırlatmak | Yükleme hiç denenmez; oysa sunucu bunu yapabilirdi |
| `toBlob`'un biçimini kontrol etmemek | Safari WebP üretemediğinde sessizce PNG gider |
