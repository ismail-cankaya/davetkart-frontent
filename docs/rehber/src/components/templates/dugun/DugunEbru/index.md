# `src/components/templates/dugun/DugunEbru/index.tsx` — Ebru

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-ebru'`), `src/data.ts` (`dugun-ebru` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Ebru — inci su üstünde pudra şakayık, lila ve mersin battal; mürekkep moru ve şakayık taşlar; inci cetvel.

Hero: EbruHero + EbruSheet (ortak, `shared/heroes`).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel `SectionTheme` (Fildişi su, tozlu mavi taşlar, altın cetvel) | `DUGUN_THEMES.DugunEbru` |
| Hero parametreleri | Fildişi su, tozlu mavi taşlar, altın cetvel | inci su #f1edf3, pudra şakayık/lila/mersin battal, mürekkep moru + şakayık taş, inci cetvel #b4a9c0 |
| Bölüm biçimi | kutu alan, köşeli buton | Hap buton + LCV kartı alanı (`kurdele()`), şakayık mühürlü tül zarf |
| Süs | kurdele düğümü (flavor) | değişmedi |

Şablon `origin/main` birleştirmesiyle geldi (d8ab8b7); ortak hero kodu değişmedi.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.18 | placeholder / alan |
| Hero | 6.56 | body (mesaj/mekân) / zemin #fbf9fb |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| HeroStage atmosferi (`data-atmosphere`) | `index.css` reduce kuralı → durur, ışık yerinde kalır |
| İşaretçi parallax'ı | `usePointerParallax` dinleyici kurmaz |
| Ortak hero'nun kendi girişleri/döngüleri | Ortak dosyada; değişmedi (bkz. KIMLIK.md hareket tablosu) |

## 5. Duman testi

`a:ok(92KB) b:ok(73KB) c:ok(88KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ortak hero'nun kendi dar ekran davranışı; renk değişikliği yerleşimi etkilemez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
