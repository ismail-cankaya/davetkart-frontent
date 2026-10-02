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
- **Yedekler:** silinen veri yedeklerde yaşamaya devam eder; yedek saklama süresi deploy fazında.
- **Çerez Politikası:** misafirin LCV düzenleme kodu (`davetkart_rsvp_receipt:*`, FE 10.18) tarayıcıda
  saklanıyor ama `CookiesPage`'in yerel depolama listesinde yok.
