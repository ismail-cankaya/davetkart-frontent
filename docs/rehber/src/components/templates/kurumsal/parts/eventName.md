# `kurumsal/parts/eventName.ts` — Kurum ve etkinlik adı

> **Kullananlar:** `KurumsalHero` (üst ray + başlık), `KurumsalPano` (pano ad satırı)
> **Denetim:** duman testi yoklaması: Künye başlığı ve kurum rayı, Pano kanat sayısı

---

## 1. Neden?

Kurumsal kategoride sihirbaz ad alanını iki parça toplar: **"Kurum / Marka"**
ve **"Etkinlik Adı"** (`data.ts` → `nameLabels`). İkisi tek metinde saklanır:
`"Nova Teknoloji & Gelecek Zirvesi 2026"` (bkz. `utils/names`).

Ortak hero'lar bu metni bir çiftin adı gibi tek parça basar. Kurumsal düzen ise
kurumu ve etkinliği ayrı yerlere koyar.

## 2. Sözleşme

`splitHostAndEvent(names)` → `{ host, event }`

| `names` | `host` | `event` |
|---|---|---|
| `Nova Teknoloji & Gelecek Zirvesi 2026` | `Nova Teknoloji` | `Gelecek Zirvesi 2026` |
| `Yıllık Gala` | `''` | `Yıllık Gala` |
| `''` | `''` | `''` (çağıran yedek metni seçer) |

`TemplateRenderer` adı önceden `displayNames` ile temizler; baştaki ya da
sondaki ayraç (`& Gala`) buraya ulaşmaz.

Kurum adı `&` içeriyorsa ilk ayraçtan bölünür. Bu, saklama biçiminin sınırıdır;
sihirbaz (`splitNames`) da aynı yerden böler.
