# `dugun/harita/DugunHaritaKirYolu` — "Kır Yolu"

> **ID:** `dugun-harita-kir-yolu` · **Konsept:** Günün Haritası ([HARITA-KONSEPTI](../../../../../../tasarim/HARITA-KONSEPTI.md)) · **Eksen:** arazi
> **Tarih:** 2026-10-17 · dal `design/harita`

---

## 1. Fikir

Kır düğününün arazi haritası: eş yükselti eğrileri, korular, bağ sıraları, bir dere ve gölet. Rota bir
patikadır (bant yok, her nokta arazi renginde halkalı). Geniş ekranda kartuş eski haritaların başlık
bloğu gibi **sol altta**, lejant sağ üstte; rota gölün kıyısından kıvrılıp tepeye çıkar ve iğne
doruğa saplanır. Köşede küçük, tek renk pusula gülü.

| | |
|---|---|
| Arazi | [`KirArazisi`](../../../konsept/harita/araziler/KirArazisi.md) — arazi + park + su + rota |
| Kapak | `duzen="ayna"`, `rota="patika"`, `sus="pusula"` (espri yok) |
| Zarf | [`HaritaZarf`](../../../konsept/harita/HaritaZarf.md), kapakta arazi penceresi |
| Tema | [`HARITA_TEMASI`](../../../konsept/harita/tema.md) |

## 2. Kıyı Kenti'nden farkı (yalnızca renk değil)

| | Kıyı Kenti | Kır Yolu |
|---|---|---|
| Eksen | Şehir planı (ızgara, bulvar, kordon) | Arazi (eş yükselti, koru, tarla) |
| Rota | Beyaz cadde üstünde | Patika, halkalı noktalar |
| Geniş yerleşim | Kartuş sol üst, lejant sağ alt | Kartuş sol alt, lejant sağ üst |
| Dar yerleşim | Lejant sağa yaslı, iğne solda | Lejant sola yaslı, iğne sağda |
| Köşe süsü | Kuzey oku + ölçek esprisi | Pusula gülü |

## 3. Doğrulama

Ekran görüntüleri: `node_modules/.cache/onizleme/dugun-harita-kir-yolu/`. Giriş 927–952 ms; zarf
(hareket azaltılmış) 68 ms.
