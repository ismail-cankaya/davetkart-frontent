# `src/components/templates/dugun/DugunVitray/index.tsx` — Vitray

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-vitray'`), `src/data.ts` (`dugun-vitray` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Vitray — şakayık, lila ve mersin camlar; arkadan inci-pembe ışık.

Hero: VitrayHero (ortak, `shared/heroes`).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel `SectionTheme` (altın/bronz/bordo ağırlıklı) | `DUGUN_THEMES.DugunVitray` |
| Hero parametreleri | kategori dışı renkler | `glass`, `glow`, huzme ve hale rengi |
| Bölüm biçimi | kutu alan, köşeli/yuvarlak buton | Hap buton + LCV kartı alanı (`kurdele()`) |
| Süs | iç içe halkalar (flavor) | kurdele düğümü (flavor) |

Ortak hero'nun kodu değişmedi; yalnızca tema ve parametreler.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.41 | placeholder / alan |
| Hero | 6.91 | body (mesaj/mekân) / zemin #140f1a |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| HeroStage atmosferi (`data-atmosphere`) | `index.css` reduce kuralı → durur, ışık yerinde kalır |
| HeroStage parçacıkları (canvas) | `ParticleField` tek durağan kare çizer, döngü başlamaz |
| İşaretçi parallax'ı | `usePointerParallax` dinleyici kurmaz |
| Ortak hero'nun kendi girişleri/döngüleri | Ortak dosyada; değişmedi (bkz. KIMLIK.md hareket tablosu) |

## 5. Duman testi

`a:ok(43KB) b:ok(24KB) c:ok(26KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ortak hero'nun kendi dar ekran davranışı; renk değişikliği yerleşimi etkilemez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |
