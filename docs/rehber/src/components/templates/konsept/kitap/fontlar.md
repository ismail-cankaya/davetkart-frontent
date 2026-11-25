# `konsept/kitap/fontlar.ts` — Libre Caslon yükleme

> **SEC-12 (Faz 19.17):** Google Fonts `<link>`'i kalktı; aileler yerel `/fonts/templates.css`'te, yükleme `src/utils/templateFonts.ts` (`loadTemplateFonts`). Aşağıdaki Google sorgusu anlatımı tarihçedir. Ayrıntı: [`docs/rehber/src/styles/fonts.md`](/docs/rehber/src/styles/fonts.md).

> **Tarih:** 2026-10-17 · dal `design/kitap` · Denetim: [KITAP-KONSEPTI §3](../../../../../tasarim/KITAP-KONSEPTI.md),
> [font-denetimi/kitap.png](../../../../../tasarim/font-denetimi/kitap.png)

---

## 1. Aileler

| Yığın | Font | Kural |
|---|---|---|
| `BASLIK_YIGINI` | Libre Caslon Display 400 | Kapak adları, bölüm başlıkları, başharf; **≥ 32 px** |
| `METIN_YIGINI` | Libre Caslon Text 400 / 700 / italik | Gövde, etiketler, `&` |

İki aile tek `<link>` ile istenir (`display=swap`). Genel `index.css` `@import`'una eklenmedi.

## 2. `useKitapFontlari()`

`KitapKok` çağırır. Etki içinde çalışır; sunucu çiziminde hiçbir şey yapmaz. Bağlantı `id="kt-font"`
ile bir kez eklenir; stil dosyasının yüklenmesi modül düzeyinde bir sözle paylaşılır.

## 3. `useBaslikFontuHazir(sinirMs = 400)`

Adlar Georgia'dan Caslon Display'e geçerken satır boyu değişir. Kapak ve iç kapak içeriği bu kancayı
bekler: önce stil dosyası, sonra `document.fonts.load('40px "Libre Caslon Display"')`. Sınır dolunca
yine `true` döner; 0.5 s'lik girişle içerik en geç 0.9 s'de tam görünür (≤ 1 s kuralı).

## 4. Sınırlar

- Fontlar yereldir: `/fonts/templates.css` + `public/fonts/` (SEC-12, K226); Google'a istek yok. Stil dosyası yüklenemezse Georgia görünür.
- Caslon'un fleuron glifleri denetlenmedi; süsler bu yüzden SVG'dir (`Fleuron.tsx`).
