# `src/components/templates/kina/KinaMum/index.tsx` — Kına Tepsisi

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-mum'`), `src/data.ts` (`kina-mum` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Karanlık odada bakır tepsi, ortasında kına, çevresinde dokuz mum. Tepsi ilk ekranın tepesinde, adlar tek satırda altında; tek yükselen efekt alevden kopan kor.

Hero: KinaHero (kategori hero'su, `parts/KinaHero.tsx`) — `names="line"`, `ornament={false}` (sahne zaten tepsi), alev `#ffc35f`, `pt-[210px] @md:pt-[280px]`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#e09a5e`) | `KINA_MUM` (ıs `#170a05`, mum sarısı vurgu) |
| Hero | `Summary` | KinaHero, tek satır adlar, süs kapalı |
| Arka plan | HeroStage | [TepsiSahnesi](TepsiSahnesi.md) (tepede) + `embers` |

Vurgu rengi: `#e09a5e` → `#ffc777`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.44 | input placeholder |
| Hero | 7.17 | gövde / `#3e1a0c` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Tepsinin girişi | MotionConfig `y`'yi atlar |
| Alev `kina-flicker`, ışık `kina-glow` | `parts/motion` reduce kuralı |
| Korlar | `ParticleField` durağan kare |

## 5. Görsel öz-kontrol

İlk sürümde tepsi altta, 780 px'lik ilk ekranın dışındaydı ve şablon Bordo'nun kopyası gibi duruyordu. Tepsi tepeye alındı; 360/768/1280'de tepsi ile başlık arasında boşluk var.
