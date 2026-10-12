# `src/components/templates/kina/KinaBrutal/index.tsx` — Brutal

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-brutal'`), `src/data.ts` (`kina-brutal` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Avuç zemin, kahve mürekkep, al ve kına turuncusu bloklar; köşesiz sert geometri.

Hero: BrutalHero (ortak) — `ink="#2a0f08"`, `accent="#b0241c"`, `accent2="#e8894a"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (pembe-kırmızı `#c81e4a`) | `KINA_BRUTAL` |
| Hero parametreleri | pembe-kırmızı `#c81e4a` + turuncu | al `#b0241c` + kına turuncusu `#e8894a`, kahve mürekkep |

Vurgu rengi: `#c81e4a` → `#b0241c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.31 | accent/zemin |
| Hero | 9.00 | gövde / `#fffaf4` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Sünnet nar kırmızısından (`#c3263c`) daha sıcak ve koyu al `#b0241c`.
