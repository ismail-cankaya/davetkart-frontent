# `src/pages/legal/PrivacyPage.tsx` — Saklama Süreleri

> **Faz:** 10 — FE 10.22 · **Kararlar:** K97 (hesap silme) · K98 (saklama süreleri)
> **Doğrulama:** `npm run verify:render` → *"Gizlilik metni"*

---

## 1. Sorun

Dilim D'de kod saklama sürelerini uygulamaya başladı ama metin eski kaldı (FAZ-10-PLANI §9.4):

| Metin (1 Temmuz 2026) | Kod |
|---|---|
| Hesap verileri silinmeden itibaren *"yasal zamanaşımı süresi boyunca"* | Hesap silinince her şey **hemen** gider (K97) |
| Davetli verisi *"yayın bitiminden itibaren 6 ay"* | **Etkinlik tarihinden** 6 ay, yalnızca misafir verisi (K98) |
| — | Silinen davetiye 30 gün çöp kutusunda (K98) |
| — | İletişim mesajı 12 ay (K98) |

## 2. Metnin her maddesi koddaki hangi kurala dayanıyor?

| Madde | Kural | Kod |
|---|---|---|
| Hesap: üyelik süresince, silinince derhal | K97 | `DeleteAccountAction` |
| Davetiye içeriği: siz silene kadar | — | Otomatik silme yok |
| Silinen davetiye: 30 gün | K98 | `retention.deleted_invitation_days` · `data:purge` |
| Misafir verisi: etkinlikten 6 ay; tarih yoksa davetiye/hesap silinene kadar | K98 · S33 | `retention.guest_data_months_after_event` · `data:purge` |
| İletişim mesajı: 12 ay | K98 | `retention.contact_message_months` |
| İşlem kayıtları: 10 yıl, hesap silinince bağlantı kaldırılır | K82 · K97 | `orders.user_id` → `NULL` |

🔴 Backend'deki bir sayı değişirse bu metin de değişir. `verify:render` metnin bugünkü sayıları
söylediğini denetliyor; backend'in config'ini göremez (ayrı depo).

## 3. Hukuki not

Metni koda uydurmak bir **yön** seçimi: kod İsmail'in K97/K98 kararlarını uyguluyor, metin onları
anlatıyor. Metnin hukuken yeterli olup olmadığı (ör. 10 yılın dayanağı, yedeklerdeki kopyalar) bir
hukukçunun işi; yayından önce okutulmalı.

## 4. Açık kalanlar (B6)

- **10 yıl sonra silme yok:** `orders` satırları hiç silinmiyor. Metin 10 yıl diyor; süre dolunca
  silen bir iş henüz yok (on yıl sonra gereken bir iş, ama söz verilmiş).
- ~~**Yedekler:** silinen veri yedeklerde yaşamaya devam eder~~ → SEC-11 (19.18, K231) ile kapandı: §5.
- ~~**Çerez Politikası:** misafirin LCV düzenleme kodu (`davetkart_rsvp_receipt:*`, FE 10.18) tarayıcıda
  saklanıyor ama `CookiesPage`'in yerel depolama listesinde yok.~~ → B-H5 (25 Kasım 2026) ile kapandı: "Kesinlikle
  Gerekli Çerezler" listesinde ad (`RSVP_RECEIPT_KEY_PREFIX`), amaç, süre; `verify-render` denetler.

## 5. SEC-11 (Faz 19.18, K231): yedekler, veri işleyenler, tarihsiz davetiye

- **Yedekler.** "Derhal silinir" yalnızca canlı sistem için doğruydu; gece dökümü, Lightsail disk görüntüsü
  ve medya bucket'ının eski sürümleri silinen veriyi bir süre daha taşıyor. Metin artık iki adımı ayrı söylüyor:
  canlıdan hemen, yedeklerden en geç `BACKUP_PURGE_DAYS` (40) gün içinde. Sayının dayanağı:
  [`../../legal/retention.md`](../../legal/retention.md).
- **Veri işleyenler** (`veri-isleyenler` bölümü). Her satır: ad · amaç · yer · veri. Kaynaklar: AWS bölgesi
  Y1.5 (`eu-central-1`), SES Y2.1, medya CloudFront Y3.2, Natro DNS + posta `YAYIN-DEVIR.md`, Shopier
  alanları `ShopierGateway::buyerFields()` (yer tutucular gerçek veri değil, SEC-10), Sentry
  `send_default_pii=false`, Gemini `AskAssistantAction` (yalnızca mesaj). Sentry ve Gemini koşullu yazıldı
  (Y11.3 / Y11.4 henüz açılmadı). Google Fonts yok: fontlar SEC-12 (K226) ile kendi sunucumuzda.
- **Tarihsiz davetiye** (K257, SEC-13): misafir verisi yayından, yayınlanmadıysa oluşturmadan 12 ay sonra silinir.
- **Hukuki çerçeve korunur.** Yalnızca teknik gerçekler eklendi; aktarımın hukuki dayanağı (KVKK m. 9) ve
  ifadelerin uygunluğu yayından önce bir hukukçuya okutulmalı.
- **Kilit.** `verify-render` §3: "canlı sistemden derhal silinir", "yedeklerden de en geç {sabit} gün",
  K257 cümlesi ve yedi sağlayıcının adı (liste testte ayrı yazılı: sayfadaki listeden ad silinirse kırmızı).
