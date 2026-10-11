# `src/components/templates/dugun/DugunCini/index.tsx` — Gül Çini

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-cini'`), `src/data.ts` (`dugun-cini` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Gül Çini — İznik üçlüsü kategori paletine çevrildi: inci sır, mürekkep moru hat, mersin ikinci sır, şakayık çiçek.

Hero: CiniHero (ortak, `shared/heroes`).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel `SectionTheme` (İznik kobalt, firuze ve mercan (sıcak beyaz sır)) | `DUGUN_THEMES.DugunCini` |
| Hero parametreleri | İznik kobalt, firuze ve mercan (sıcak beyaz sır) | `glaze` #fdfcfe, `cobalt` #2c2340, `turquoise` #6f9c86, `coral` #a3365f, `leaf` #41604f, `grout` #e4dee9 |
| Bölüm biçimi | kutu alan, köşeli buton | Hap buton + LCV kartı alanı (`kurdele()`), şakayık mühürlü tül zarf |
| Süs | kurdele düğümü (flavor) | değişmedi |

Şablon `origin/main` birleştirmesiyle geldi (d8ab8b7); ortak hero kodu değişmedi.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.31 | placeholder / alan |
| Hero | 6.92 | body (mesaj/mekân) / zemin #fdfcfe |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| HeroStage atmosferi (`data-atmosphere`) | `index.css` reduce kuralı → durur, ışık yerinde kalır |
| İşaretçi parallax'ı | `usePointerParallax` dinleyici kurmaz |
| Ortak hero'nun kendi girişleri/döngüleri | Ortak dosyada; değişmedi (bkz. KIMLIK.md hareket tablosu) |

## 5. Duman testi

`a:ok(40KB) b:ok(18KB) c:ok(23KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ortak hero'nun kendi dar ekran davranışı; renk değişikliği yerleşimi etkilemez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
