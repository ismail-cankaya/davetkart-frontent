# `src/utils/currency.ts` — Türk lirası gösterimi

> **Doğrulama:** `npm run verify:payment` → "Hediye kodu (Faz 11)"

| Fonksiyon | Girdi | Çıktı |
|---|---|---|
| `formatTry(399)` | TL | `₺399` |
| `formatTry(399, true)` | TL | `₺399,00` (havale ekranı: kullanıcı tutarı bankasına elle yazar) |
| 🆕 `formatTryMinor(19950)` | **kuruş** | `₺199,50` |
| 🆕 `formatTryMinor(39900)` | kuruş | `₺399` |

## Neden ayrı bir fonksiyon?

Faz 11'e kadar ekrandaki her tutar katalogdan geliyordu ve tam liraydı. Hediye kodu kuruşlu
tutar üretebiliyor (%50 × 399 = 199,50). `formatTry(199.5)` kuruşsuz biçimle **₺200** yazar:
kullanıcı ödeyeceğinden fazlasını görür. `formatTryMinor` kuruş varsa kuruşlu, yoksa tam yazar.

`/ 100` bölmesi yalnızca **gösterim** içindir. Hesap backend'de tam sayıyla yapılır; frontend
hiçbir tutarı kendisi hesaplamaz.
