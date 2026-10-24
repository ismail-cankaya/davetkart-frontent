# `src/utils/toDisplayError.ts` — hata kodu → metin

> **Kod dosyası:** `src/utils/toDisplayError.ts` · **Doğrulama:** `npm run verify:errors`
> Bu kılavuz Faz 11'de açıldı; dosyanın tamamı değil, Faz 11 değişikliği anlatılıyor.

---

## 1. Ne yapar?

Backend metin döndürmez, kod döndürür (K20). Bu modül kodu ve beyaz listelenmiş
parametreleri i18n `errors` namespace'inden bir cümleye çevirir. Anahtar zinciri:
`codes.X.detailed` (bütün parametreler varsa) → `codes.X.base` → `codes.X` → `unknown`.

## 2. 🆕 Faz 11: hediye kodu hataları

Backend `contracts/error-codes.json` 22'den 25 koda çıktı; dosya `src/contracts/`'a tek yönlü
kopyalandı (K31).

| Kod | Metin (tr) | Parametre |
|---|---|---|
| `GIFT_CODE_INVALID` | "Bu hediye kodu geçerli değil…" | yok. Yok/kapalı/süresi dolmuş/tükenmiş **aynı** metni alır (backend K113) |
| `GIFT_CODE_ALREADY_USED` | "Bu hediye kodunu daha önce kullandınız…" | yok |
| `GIFT_CODE_NOT_APPLICABLE` | `base` / `detailed`: "…yalnızca {{tier}} paketinde geçerli." | `tier` |

### `tier` parametresi etikete çevrilir

`presentParams()` önce yalnızca `requiredTier`'ı (402) etikete çeviriyordu. `tier` aynı türden
bir değer (plan kimliği): ham hâliyle "yalnızca **gold** paketinde" yazardı. Artık iki anahtar
da `tiers.*` sözlüğünden geçer ("Gold").

`verify:errors` bunu sınıyor: `GIFT_CODE_NOT_APPLICABLE { tier: 'gold' }` metninde ham `gold`
kalırsa kırmızı. Mutasyon denemesi (23 Ekim 2026): `tier` listeden çıkarılınca iki dilde de
kırmızı.

`ALREADY_USED` metni bilerek uzun: kodla başlatılıp yarım bırakılan bir ödeme kodu 30 dakika
tutar (backend K110). Kullanıcı "ben kullanmadım ki" demesin.

`fields.giftCode` / `fields.code` eklendi: 65 karakterlik bir kod `VALIDATION_FAILED` alırsa
metin "Hediye kodu en fazla 64 karakter…" olur.
