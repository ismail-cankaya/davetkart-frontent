# `src/legal/retention.ts`

> SEC-11 · Faz 19.18 · K231

## 1. Ne işe yarar

Gizlilik metnindeki "silinen veri yedeklerden en geç **N gün** içinde silinir" cümlesinin **N**'i tek yerde
durur: `BACKUP_PURGE_DAYS`. Metin (`PrivacyPage`) sayıyı buradan alır, `scripts/verify-render.tsx` metnin
bu sayıyı gerçekten söylediğini denetler. Sayı elle metne yazılırsa doğrulama kırmızıya döner.

## 2. Sayı nereden geliyor

En uzun yaşayan kopya belirler (silme bir an değil, süreçtir):

| Kopya | Süre | Kaynak |
|---|---|---|
| Gece `pg_dump` dökümü (S3, sürümlemeli) | 30 gün geçerli + 7 gün eski sürüm ≈ **37 gün** | K152 · `operations/deployment/YEDEK-VE-GERI-YUKLEME.md` §2 |
| Lightsail disk görüntüsü | 7 gün (dökümle paralel) | Y4.4 |
| Medya bucket'ında silinen dosyanın eski sürümü | 7 gün | Y3.1 |

S3 ömür kuralları günde bir kez işlediği için bir gün daha gecikebilir (~38). **40** yuvarlama payıdır.

## 3. Ne zaman değişir

Yedek bucket'ının ömür kuralı ya da Lightsail görüntü saklama süresi değişirse önce burası, sonra
`verify-render` kendiliğinden yeni sayıyı bekler. Sayı **küçülürse** AWS panelindeki kural önce değişmeli;
metin gerçekten uzun bir süre söz veremez.

## 4. Açık kalanlar

- AWS panelinde ömür kuralının gerçekten 30 + 7 gün olduğu bu fazda doğrulanmadı (K152 ⚠️ bucket henüz açılmadı).

## 5. `GUEST_DATA_MONTHS_AFTER_EVENT` (FE-52 · Faz 19.19 · K232)

Misafir verisinin (LCV yanıtları + misafir dosyaları) etkinlik tarihinden kaç ay sonra silindiği: **6** (K98,
backend `data:purge`). Gizlilik metni (`PrivacyPage`) ve fiyat sayfası SSS'si (`PricingPage`) bu sabiti kullanır;
`verify-render` ikisini de denetler. Backend'deki süre değişirse önce backend, sonra burası.

## `UNDATED_GUEST_DATA_MONTHS` (B-E8, 25 Kasım 2026)

K257: etkinlik tarihi olmayan davetiyede misafir verisi yayın (yoksa oluşturma) tarihinden 12 ay sonra silinir
(backend `PurgeExpiredData::UNDATED_FALLBACK_MONTHS`). Gizlilik metni ve fiyat sayfası SSS'si sayıyı bu sabitten
yazar; `verify-render` ikisini de sabitle karşılaştırır. Önce SSS bu kuralı hiç söylemiyordu.
