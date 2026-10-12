# `src/components/templates/kina/KinaSade/KinaSade.tsx` — Avuç İçi

> **Kullananlar:** `TemplateRenderer.tsx` (`'sade'`), `src/data.ts` (`sade` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Şeftali kâğıt üstünde köşeden taşan iki soluk kına lekesi ve iki bindallı köşesi. Kategorinin en sakin, açık şablonu.

Hero: KinaHero (kategori hero'su, `parts/KinaHero.tsx`) — varsayılan: orta, adlar alt alta, mum sayacı.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | `shared/themeTokens` SADE + `red-800` vurgu | `KINA_SADE` (avuç `#f8ebdf`, kına kahvesi mürekkep) |
| Hero | `Summary` | KinaHero |
| Arka plan | `assets/bg-desktop.svg` | Kodla çizilmiş iki `KinaDamga` lekesi + iki `BindalliKose` |

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.85 | accent/zemin |
| Hero | 6.63 | gövde / `#f8ece0` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| KinaHero girişleri, alevler | bkz. [KinaHero](../parts/KinaHero.md) §4 |

## 5. Görsel öz-kontrol

Açık avuç zemini ve köşe lekeleriyle Manzara'dan (tepeler) ayrışıyor; boş senaryoda "Davetlisiniz" ortada.
