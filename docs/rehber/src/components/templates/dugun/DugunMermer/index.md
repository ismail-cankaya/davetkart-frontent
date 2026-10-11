# `src/components/templates/dugun/DugunMermer/index.tsx` — Mermer & Rölyef

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-mermer'`), `src/data.ts` (`dugun-mermer` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Mermer & Rölyef — inci-lila damarlı beyaz taş.

Hero: MermerHero (ortak, `shared/heroes`).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel `SectionTheme` (altın/bronz/bordo ağırlıklı) | `DUGUN_THEMES.DugunMermer` |
| Hero parametreleri | kategori dışı renkler | `slab`, `vein` |
| Bölüm biçimi | kutu alan, köşeli/yuvarlak buton | Hap buton + LCV kartı alanı (`kurdele()`) |
| Süs | iç içe halkalar (flavor) | kurdele düğümü (flavor) |

Ortak hero'nun kodu değişmedi; yalnızca tema ve parametreler.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.95 | placeholder / alan |
| Hero | 5.24 | body (mesaj/mekân) / zemin #efecf2 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| HeroStage atmosferi (`data-atmosphere`) | `index.css` reduce kuralı → durur, ışık yerinde kalır |
| İşaretçi parallax'ı | `usePointerParallax` dinleyici kurmaz |
| Ortak hero'nun kendi girişleri/döngüleri | Ortak dosyada; değişmedi (bkz. KIMLIK.md hareket tablosu) |

## 5. Duman testi

`a:ok(25KB) b:ok(6KB) c:ok(23KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ortak hero'nun kendi dar ekran davranışı; renk değişikliği yerleşimi etkilemez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
