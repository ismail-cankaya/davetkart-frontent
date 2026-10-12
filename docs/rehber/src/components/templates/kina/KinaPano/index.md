# `src/components/templates/kina/KinaPano/index.tsx` — Mekanik Pano

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-pano'`), `src/data.ts` (`kina-pano` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kına kahvesi kanatlar, krem harf.

Hero: PanoHero (ortak) — `flap="#2e140c"`, `ink="#fbe6d2"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#e0785f`) | `KINA_PANO` |
| Atmosfer | — | `Halo` 0.14 |

Vurgu rengi: `#e0785f` → `#f2a066`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.82 | input placeholder |
| Hero | 6.88 | gövde / `#2e140c` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Kanat dönüşleri | Ortak dosyada |
| `Halo` | `[data-atmosphere]` |

## 5. Görsel öz-kontrol

Boş isim yedeği istemcide yerleşir (duman testi bunu sunucuda aramaz).
