# `src/components/templates/kina/KinaAurora/index.tsx` — Kına Ateşi

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-aurora'`), `src/data.ts` (`kina-aurora` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Kına turuncusu, duvak alı ve sırma sarısından akışkan bir renk kütlesi; metin önünde buzlu cam kartta, adlar tek satırda.

Hero: KinaHero (kategori hero'su, `parts/KinaHero.tsx`) — `panel="cam"`, `names="line"`, `timer="satir"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (pembe-altın `#f0b775` / `#e0568c`) | `KINA_AURORA` (ateş turuncusu) |
| Hero | `Summary` | KinaHero, cam kart |
| Atmosfer | pembe mesh | `AuroraMesh` kına/al/sırma, opaklık 1 + `stardust` |

Vurgu rengi: `#f0b775` → `#ffc08a`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 4.07 | zarf mührü (ikon) |
| Hero | 8.07 | gövde / `#541a05` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| `AuroraMesh` | `[data-atmosphere]` |
| Parçacıklar + işaretçi | durağan kare, dinleyici yok |

## 5. Görsel öz-kontrol

Cam kart 360 px'te neredeyse tam genişlik; mesh kartın çevresinde ve 1280 px'te altta görünür. Saray'dan kart biçimi (kemer/dikdörtgen) ve tek satır adlarla ayrışıyor.
