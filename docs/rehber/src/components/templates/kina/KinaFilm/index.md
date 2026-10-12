# `src/components/templates/kina/KinaFilm/index.tsx` — Film Şeridi

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-film'`), `src/data.ts` (`kina-film` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kına kahvesi şerit ve kare, tek mum ışığı halesi.

Hero: FilmHero (ortak) — `strip="#2a140c"`, `frame="#170b06"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (mercan `#e0785f`) | `KINA_FILM` (kına ışığı `#f2a066`) |
| Atmosfer | — | `Halo` 0.12 |

Vurgu rengi: `#e0785f` → `#f2a066`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.98 | input placeholder |
| Hero | 7.73 | gövde / `#170b06` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| `Halo` | `[data-atmosphere]` |
| Şerit süpürmesi | Ortak dosyada |

## 5. Görsel öz-kontrol

Koyu ve dar şerit kartıyla Pano/Plak'tan biçimce ayrı.
