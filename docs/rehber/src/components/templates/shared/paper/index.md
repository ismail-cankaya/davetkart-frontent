# `shared/paper/` — "Kâğıt / el yapımı" ortak kiti

> **Kullananlar:** kâğıt ailesinin preset'leri (kategori başına 3; Aşama 3'ten itibaren)
> **Konsept:** [KAGIT-KONSEPTI](../../../../../tasarim/KAGIT-KONSEPTI.md) · **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. Neden `shared/` altında?

27 preset aynı dokuyu, kenarı, mührü ve zarfı kullanacak. Her preset kendi dokusunu ya da mührünü
yazsaydı dokuz kategori dokuz ayrı "kâğıt" üretirdi ve bütçe (preset başına ≤ 60 KB) dokuya giderdi.
Kit bir kez yüklenir; preset yalnızca kendi düzenini ve süsünü taşır.

Mevcut `effects/textures.tsx` (PaperGrain, DeckleEdge, WaxSeal) **değiştirilmedi**: `PaperGrain`
çalışma anında `feTurbulence` kullanıyor ve 45 mevcut preset ona bağlı. Kit ayrı klasörde, kendi
kurallarıyla durur.

## 2. Dosyalar

| Dosya | Ne | Kılavuz |
|---|---|---|
| `index.ts` | Tek giriş noktası | bu dosya |
| `palet.ts` | Kâğıt, mürekkep, mum, pigment; set → CSS değişkenleri | [palet](palet.md) |
| `doku.ts` + `doku/*.webp` | Önceden üretilmiş dokular | [doku](doku.md) |
| `fontlar.ts` | El yazıları, yükleme | [fontlar](fontlar.md) |
| `tema.ts` | "Davetiye seti" `SectionTheme`'i | [tema](tema.md) |
| `KagitKok.tsx` | Değişkenleri ve fontları dağıtan kök | [KagitKok](KagitKok.md) |
| `KagitLevha.tsx` | Tırtıklı ana kart | [KagitLevha](KagitLevha.md) |
| `MumMuhur.tsx` | Mum mühür ve kırılması | [MumMuhur](MumMuhur.md) |
| `Baski.tsx` | Kabartma, mürekkep damgası | [Baski](Baski.md) |
| `SuluboyaLeke.tsx` | Renklendirilebilir leke | [SuluboyaLeke](SuluboyaLeke.md) |
| `KagitZarf.tsx` | Zarf kapısı | [KagitZarf](KagitZarf.md) |
| `Adlar.tsx` | El yazısıyla adlar | [Adlar](Adlar.md) |
| `basHarfler.ts` | Mühür harfleri | [basHarfler](basHarfler.md) |
| `hareket.ts` | Hareket dili | [hareket](hareket.md) |

## 3. Sınırlar

- Kit preset'e bağlanmadıkça `npm run build` onu ağaçtan atar. `verify:render`'ın kiti
  yükleyebilmesi için `scripts/run-check.mjs`'e `.webp` yükleyicisi eklendi (konsept §8).
- Kit değişikliği onay ister (Aşama 2 kuralı).
