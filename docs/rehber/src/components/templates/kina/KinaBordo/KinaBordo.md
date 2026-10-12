# `src/components/templates/kina/KinaBordo/KinaBordo.tsx` — Al Duvak

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-bordo'`), `src/data.ts` (`kina-bordo` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Şarap ipeği videosunun tepesinden sarkan oyalı al duvak, dalgalanan tül ve sırma pullar. Metin okuma halesiyle videodan ayrılır.

Hero: KinaHero (kategori hero'su, `parts/KinaHero.tsx`) — `halo="24,5,12"`, `timer="satir"`, `pt-36` (duvak 112 px).

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (altın vurgu `#e8c07a`) | `KINA_BORDO` (kına ışığı `#f4a76c`) |
| Hero | `Summary` | KinaHero + okuma halesi, satır sayaç |
| Süs | — | `Duvak`: 120 px'te bir kavis, kıvrımlar ve iğne oyası pulları (SVG desen, yatay tekrar) |
| Atmosfer | — | `SilkVeil` al tül, `Halo` (tepe opaklığı 0.16), `fairyDust` sırma pulları |

Vurgu rengi: `#e8c07a` → `#f4a76c`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.07 | zarf mührü (ikon) |
| Hero | 8.39 | gövde / `#3c1219` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Video | `VideoBackdrop` reduce'da poster kalır |
| `SilkVeil`, `Halo` | `[data-atmosphere]` |
| Parçacıklar | `ParticleField` tek durağan kare |
| Okuma halesi girişi | Yalnız opaklık |

## 5. Görsel öz-kontrol

Duvak kavisleri 360 px'te en çok 108 px'e iner; süs ile tepsi ikonu arasında ~36 px boşluk. Boş senaryoda da duvak tepede, yedek metin ortada.
