# `src/components/templates/kina/KinaModern/KinaModern.tsx` — Kına Turuncusu

> **Kullananlar:** `TemplateRenderer.tsx` (`'modern'`), `src/data.ts` (`modern` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Zemin kınanın kendisi: köşeden taşan dev krem leke, kahve mürekkep halkası ve sola yaslı iri adlarla afiş düzeni.

Hero: KinaHero (kategori hero'su, `parts/KinaHero.tsx`) — `align="start"`, `damga={DAMGA_AL}`, alev `#fff1d6`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | `shared/themeTokens` MODERN (gece, indigo) | `KINA_MODERN` (kına turuncusu `#ec8f57`, kahve mürekkep) |
| Hero | `Summary` | KinaHero, afiş düzeni |
| Arka plan | `assets/bg-desktop.svg` | Dev `KinaDamga` (krem) + mürekkep halkası + `Grain` |

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.67 | accent/zemin |
| Hero | 5.34 | gövde / `#e78952` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| KinaHero girişleri | bkz. KinaHero §4 |
| `Grain` | Durağan |

## 5. Görsel öz-kontrol

Kategorinin tek doygun turuncu zemini; sola yaslı düzen Krom'la paylaşılıyor ama zemin açık/koyu zıt.
