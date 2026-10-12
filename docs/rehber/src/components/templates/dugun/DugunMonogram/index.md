# `src/components/templates/dugun/DugunMonogram/index.tsx` — İnci Varak

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-monogram'`), `src/data.ts` (`dugun-monogram` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

İnci Varak — altın varak yerine inci-gümüş varak arma, şakayık boyalı kenar.

Hero: MonogramHero (ortak, `shared/heroes`).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel `SectionTheme` (Altın varak, altın boyalı kenar, fildişi kart) | `DUGUN_THEMES.DugunMonogram` |
| Hero parametreleri | Altın varak, altın boyalı kenar, fildişi kart | inci-gümüş varak [#7d7489, #d6cde0, #fbf8fd], şakayık kenar #9b3a63, kart #fdfcfe |
| Bölüm biçimi | kutu alan, köşeli buton | Hap buton + LCV kartı alanı (`kurdele()`), şakayık mühürlü tül zarf |
| Süs | kurdele düğümü (flavor) | değişmedi |

Şablon `origin/main` birleştirmesiyle geldi (d8ab8b7); ortak hero kodu değişmedi.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.30 | placeholder / alan |
| Hero | 6.72 | body (mesaj/mekân) / zemin #fdfcfe |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| HeroStage atmosferi (`data-atmosphere`) | `index.css` reduce kuralı → durur, ışık yerinde kalır |
| İşaretçi parallax'ı | `usePointerParallax` dinleyici kurmaz |
| Ortak hero'nun kendi girişleri/döngüleri | Ortak dosyada; değişmedi (bkz. KIMLIK.md hareket tablosu) |

## 5. Duman testi

`a:ok(38KB) b:ok(20KB) c:ok(23KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ortak hero'nun kendi dar ekran davranışı; renk değişikliği yerleşimi etkilemez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
