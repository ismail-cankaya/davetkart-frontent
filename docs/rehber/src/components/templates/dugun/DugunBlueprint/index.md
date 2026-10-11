# `src/components/templates/dugun/DugunBlueprint/index.tsx` — Teknik Çizim

> **Kullananlar:** `TemplateRenderer.tsx` (`'dugun-blueprint'`), `src/data.ts` (`dugun-blueprint` kartı)
> **Denetim:** `npm run lint`; duman testi ve kontrast betiği (bkz. [KIMLIK.md](../KIMLIK.md) §7)

---

## 1. Fikir

Teknik Çizim — lacivert değil mürekkep moru ozalit; revizyon şakayık. Kendi köşesiz geometrisini korur.

Hero: BlueprintHero (ortak, `shared/heroes`).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel `SectionTheme` (altın/bronz/bordo ağırlıklı) | `DUGUN_THEMES.DugunBlueprint` |
| Hero parametreleri | kategori dışı renkler | `paper`, `line`, `accent` |
| Bölüm biçimi | kutu alan, köşeli/yuvarlak buton | Kendi köşesiz biçimi (kurdele karakteri uygulanmadı) |
| Süs | iç içe halkalar (flavor) | kurdele düğümü (flavor) |

Ortak hero'nun kodu değişmedi; yalnızca tema ve parametreler.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.20 | placeholder / alan |
| Hero | 6.76 | body (mesaj/mekân) / zemin #1e1832 |

Eşik: normal metin 4.5, büyük başlık 3. Yöntem ve varsayımlar KIMLIK.md §6'da.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero'nun kendi girişleri/döngüleri | Ortak dosyada; değişmedi (bkz. KIMLIK.md hareket tablosu) |

## 5. Duman testi

`a:ok(27KB) b:ok(7KB) c:ok(22KB)` — a: dolu örnek, b: boş alanlar, c: zarflı.

## 6. Bakılacak riskler

| Genişlik | Risk |
|---|---|
| 360 px | Ortak hero'nun kendi dar ekran davranışı; renk değişikliği yerleşimi etkilemez. |
| 768 px | Sorun beklenmez. |
| 1280 px | Sorun beklenmez. |

## 7. Görsel öz-kontrol

Bu turda ekran görüntüsüyle bakılmadı.
