# `nisan/harita/index.ts` — nişanın harita preset'leri

> **Tarih:** 2026-10-22 · dal `design/harita` · Konsept: [HARITA-KONSEPTI §7](../../../../../tasarim/HARITA-KONSEPTI.md) — *Rotamız belli*

---

Nişanın "Günün Haritası" preset'lerinin barrel'ı. Birleştirmede kategori barrel'ına (`nisan/index.ts`)
tek satır eklenir: `export * from './harita';`. Önizleme düzeneği bu dosyayı kayıt gerekmeden bulur.

| Preset | Eksen | Telefonda | Kılavuz |
|---|---|---|---|
| `nisan-harita-kroki` → `NisanHaritaKroki` | Mahalle krokisi | Harita üstte, kartuş + lejant altta tek blok | [NisanHaritaKroki](NisanHaritaKroki/index.md) |
| `nisan-harita-kavusak` → `NisanHaritaKavusak` | Arazi (kavuşak) | Kartuş üst sol, lejant alt sol, iki kollu rota | [NisanHaritaKavusak](NisanHaritaKavusak/index.md) |

İki preset 360 px'te de farklı yerleşimdedir (KONSEPT-ORTAK §7, K2): yan yana ilk ekran
`node_modules/.cache/harita-karsilastirma/nisan-360-yanyana.png`.

Ortak parça: [`flavor.ts`](flavor.md). Kit: [`konsept/harita`](../../konsept/harita/index.md).
