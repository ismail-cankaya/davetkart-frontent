# `src/components/templates/kina/KinaKinetik/index.tsx` — Kinetik Tipografi

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-kinetik'`), `src/data.ts` (`kina-kinetik` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Zemin duvağın alı, üstünden krem harflerle "KINA GECESİ" akar. Kategorinin tek doygun kırmızı zemini.

Hero: KinetikHero (ortak) — `topWord="KINA GECESİ"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (koyu, pembe `#dd6b7a`) | `KINA_KINETIK` (al `#8c1a14` zemin) |
| Atmosfer | — | `Halo` 0.14 |

Vurgu rengi: `#dd6b7a` → `#ffc58f`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.51 | accent/zemin |
| Hero | 5.58 | gövde / `#942019` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kayan şerit | Ortak dosyada |
| `Halo` | `[data-atmosphere]` |

## 5. Görsel öz-kontrol

Şerit harfleri metin sütununun üstünde ve altında; adlara değmiyor.
