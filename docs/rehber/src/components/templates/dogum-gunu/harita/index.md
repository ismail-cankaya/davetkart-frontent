# `dogum-gunu/harita/index.ts` — doğum gününün harita preset'leri

> **Tarih:** 2026-10-23 · dal `design/harita` · Konsept: [HARITA-KONSEPTI §7](../../../../../tasarim/HARITA-KONSEPTI.md) — *çocukta hazine haritası, yetişkinde şehir planı (akşam rotası)*

---

Doğum gününün "Günün Haritası" preset'lerinin barrel'ı. Birleştirmede kategori barrel'ına
(`dogum-gunu/index.ts`) tek satır eklenir: `export * from './harita';`. Önizleme düzeneği bu dosyayı kayıt
gerekmeden bulur.

| Preset | Eksen | Telefonda (360 px) | Kılavuz |
|---|---|---|---|
| `dogum-gunu-harita-hazine-avi` → `DogumGunuHaritaHazineAvi` | Hazine haritası | Kartuş üstte **ortalı**; lejant yok — duraklar sağlı sollu ipucu kutuları, kesik çizgi zikzakla X'e iner; X'in yanında varış kartı | [DogumGunuHaritaHazineAvi](DogumGunuHaritaHazineAvi/index.md) |
| `dogum-gunu-harita-kutlama-hatti` → `DogumGunuHaritaKutlamaHatti` | Şehir planı (çarşı) | Sol kenarda dikey **hat omurgası**; kartuş, istasyonlar ve son durak (iğne + varış kartı) omurgaya asılı tek sütun | [DogumGunuHaritaKutlamaHatti](DogumGunuHaritaKutlamaHatti/index.md) |

İki preset 360 px'te birbirinden ve önceki kategorilerin telefon iskeletlerinden (üst kartuş + alt lejant,
üst lejant + alt kartuş, üstte harita + altta tek blok; HARITA-KONSEPTI §11) ayrışır: ikisinde de **lejant
kutusu yoktur**, program haritanın üstünde tek tek kutulardır. Kapak: [`IzKapak`](../../konsept/harita/IzKapak.md).

Ortak parça: [`flavor.ts`](flavor.md). Kit: [`konsept/harita`](../../konsept/harita/index.md).
