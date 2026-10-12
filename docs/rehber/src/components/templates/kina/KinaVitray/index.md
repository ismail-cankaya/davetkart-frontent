# `src/components/templates/kina/KinaVitray/index.tsx` — Vitray Işık

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-vitray'`), `src/data.ts` (`kina-vitray` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Al, kına ve sırma camlar; ışık gün değil, akşam mumunun sıcaklığında.

Hero: VitrayHero (ortak) — `glass={[al, kına, sırma]}`, `lead="#140906"`, `glow="#f2a066"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (pembe `#d1587f`) | `KINA_VITRAY` |
| Hero parametreleri | gül/altın/mürdüm cam | al/kına/sırma cam, kahve kurşun |
| Atmosfer | — | `GodRays` + `Halo` |

Vurgu rengi: `#d1587f` → `#f2a066`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.56 | input placeholder |
| Hero | 7.38 | gövde / `#22120d` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| `GodRays`, `Halo` | `[data-atmosphere]` |
| Cam süpürmesi | Ortak dosyada |

## 5. Görsel öz-kontrol

Metin kemerin karanlık alt yarısında (7.38).
