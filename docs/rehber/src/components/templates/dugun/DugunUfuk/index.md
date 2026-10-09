# `src/components/templates/dugun/DugunUfuk/index.tsx` — Ufuk

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-ufuk'`), `src/data.ts` (`dugun-ufuk` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Ufuk — sahne ön ayarı (`UFUK_PRESETS.dugun`) ortak ve kart kapağı ondan üretildiği için gökyüzü aynı; kimlik önündeki katmanda.

Hero: UfukHero + UfukScene (ortak, `shared/heroes`).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel `SectionTheme` (altın/bronz/bordo ağırlıklı) | `DUGUN_THEMES.DugunUfuk` |
| Hero parametreleri | kategori dışı renkler | tema vurgusu inci pembesi, inci buton |
| Bölüm biçimi | kutu alan, köşeli/yuvarlak buton | Hap buton + LCV kartı alanı (`kurdele()`) |
| Süs | iç içe halkalar (flavor) | kurdele düğümü (flavor) |

Ortak hero'nun kodu değişmedi; yalnızca tema ve parametreler.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.32 | placeholder / alan |
| Hero | 9.87 | body (mesaj/mekân) / zemin #0a0f24 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kaydırmaya bağlı sahne (UfukScene) | Ortak sahne kendi reduce yolunu taşır; değişmedi |
| Ortak hero'nun kendi girişleri/döngüleri | Ortak dosyada; değişmedi (bkz. KIMLIK.md hareket tablosu) |

## 5. Duman testi

`a:ok(76KB) b:ok(54KB) c:ok(71KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ortak hero'nun kendi dar ekran davranışı; renk değişikliği yerleşimi etkilemez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |
