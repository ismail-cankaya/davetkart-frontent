# `shared/palette.ts` — `SectionTheme.envelope` ve `mapHeader`

> **Kullananlar:** `Envelope.tsx`, `Details.tsx`; değerleri şablonların tema nesneleri verir
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

## 1. Neden tema, neden flavor değil?

Zarf ve harita başlığı renkleri `theme.id`'ye (koyu/açık) göre sabitti. Koyu temada zarf
mührü ve ışıması **altın**dı: "altın yok" diyen bir kategori kimliği (düğün, kurumsal)
zarfta bozuluyordu.

Üç ajan üç yol önerdi. `TemplateFlavor` **kategori başına tektir**; oysa aynı kategoride
hem açık hem koyu şablon vardır. Bu yüzden alanlar şablon başına olan `SectionTheme`'e
eklendi.

## 2. Yeni alanlar (hepsi isteğe bağlı)

| Alan | Ne boyar | Verilmezse |
|---|---|---|
| `envelope.paper` | Zarf gövdesi | slate / stone degrade |
| `envelope.flap` | Kapak ve yan katlar | `slate-700` / `stone-300` |
| `envelope.seal` | Mühür zemini + yazısı | **`amber-300`** / `stone-800` |
| `envelope.glow` | Zarfın arkasındaki ışıma | **`amber-300/10`** / `rose-200/40` |
| `envelope.card` | Açılırken görünen iç kart | `slate-950` / beyaz |
| `mapHeader` | Detaylar kartının harita başlığı | `slate-900` / `stone-100` |

Değerler Tailwind sınıf dizgesidir (tema nesnesinin geri kalanı gibi). Varsayılanlar
bugünkü görünümün aynısıdır: hiçbir şablon kendiliğinden değişmez.
