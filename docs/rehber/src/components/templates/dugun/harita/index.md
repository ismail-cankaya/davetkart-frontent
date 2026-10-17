# `dugun/harita/index.ts` — düğünün harita preset'leri

> **Tarih:** 2026-10-17 · dal `design/harita` · Konsept: [HARITA-KONSEPTI](../../../../../tasarim/HARITA-KONSEPTI.md)

---

Düğünün "Günün Haritası" preset'lerinin barrel'ı. Birleştirmede kategori barrel'ına (`dugun/index.ts`)
tek satır eklenir: `export * from './harita';`. Önizleme düzeneği bu dosyayı kayıt gerekmeden bulur.

| Preset | Eksen | Kılavuz |
|---|---|---|
| `dugun-harita-kiyi-kenti` → `DugunHaritaKiyiKenti` | Şehir planı | [DugunHaritaKiyiKenti](DugunHaritaKiyiKenti/index.md) |
| `dugun-harita-kir-yolu` → `DugunHaritaKirYolu` | Arazi | [DugunHaritaKirYolu](DugunHaritaKirYolu/index.md) |

Ortak parça: [`flavor.ts`](flavor.md). Kit: [`konsept/harita`](../../konsept/harita/index.md).
