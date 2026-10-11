# `src/components/templates/dugun/DugunNoir/index.tsx` — Noir Minimal

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-noir'`), `src/data.ts` (`dugun-noir` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Noir Minimal — şampanya altını yerine inci kıl çizgiler, inci toz, köşesiz butonlar.

Hero: NoirHero (ortak, `shared/heroes`).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel `SectionTheme` (altın/bronz/bordo ağırlıklı) | `DUGUN_THEMES.DugunNoir` |
| Hero parametreleri | kategori dışı renkler | hale `Hale` (tepe .12), toz inci |
| Bölüm biçimi | kutu alan, köşeli/yuvarlak buton | Kendi köşesiz biçimi (kurdele karakteri uygulanmadı) |
| Süs | iç içe halkalar (flavor) | kurdele düğümü (flavor) |

Ortak hero'nun kodu değişmedi; yalnızca tema ve parametreler.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.73 | placeholder / alan |
| Hero | 6.86 | body (mesaj/mekân) / zemin #0b0a0e |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| HeroStage atmosferi (`data-atmosphere`) | `index.css` reduce kuralı → durur, ışık yerinde kalır |
| HeroStage parçacıkları (canvas) | `ParticleField` tek durağan kare çizer, döngü başlamaz |
| İşaretçi parallax'ı | `usePointerParallax` dinleyici kurmaz |
| Ortak hero'nun kendi girişleri/döngüleri | Ortak dosyada; değişmedi (bkz. KIMLIK.md hareket tablosu) |

## 5. Duman testi

`a:ok(24KB) b:ok(5KB) c:ok(24KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ortak hero'nun kendi dar ekran davranışı; renk değişikliği yerleşimi etkilemez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |
