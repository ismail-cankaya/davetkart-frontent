# `dugun/harita/DugunHaritaKirYolu` — "Kır Yolu"

> **ID:** `dugun-harita-kir-yolu` · **Konsept:** Günün Haritası ([HARITA-KONSEPTI](../../../../../../tasarim/HARITA-KONSEPTI.md)) · **Eksen:** arazi
> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (K2: telefonda da ayrışır) · dal `design/harita`

---

## 1. Fikir

Kır düğününün arazi haritası: eş yükselti eğrileri, korular, bağ sıraları, bir dere ve gölet. Rota bir
patikadır (bant yok, her nokta arazi renginde halkalı). Kartuş eski haritaların başlık bloğu gibi
**altta solda**, lejant **üstte sağda** — her genişlikte; patika kartuştan çıkıp tepeye tırmanır ve
iğne doruğa saplanır. Köşede küçük, tek renk pusula gülü.

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
| Dar yerleşim (360, 768) | Kartuş üstte, lejant altta; rota yukarıdan iner, iğne altta solda | **Lejant üstte, kartuş altta**; patika aşağıdan tırmanır, iğne üstte (tepede), etiketi sağında |
| İlk okunan | Adlar (kartuş) | Lejant: duraklar, mekân, yol tarifi — adlar ekranın altında başlık bloğunda |
| Köşe süsü | Kuzey oku (sağ üst) + ölçek esprisi | Pusula gülü (genişte sağ alt, darda lejantın altında solda) |

Pilotta iki preset 360 px'te aynı yerleşimdeydi (kartuş üstte, rota ortada, lejant altta); fark yalnızca
araziydi. K2 kararıyla Kır Yolu masaüstündeki yerleşimini telefona da taşıdı. 360 × 780 ölçümleri
(lejant, "Yol tarifi", temsilî harita notu ilk ekranda; uzun senaryoda kapak 936 px'e uzar):
[HaritaKapak §3](../../../konsept/harita/HaritaKapak.md).

## 3. Doğrulama

Ekran görüntüleri: `node_modules/.cache/onizleme/dugun-harita-kir-yolu/`; önce/sonra karşılaştırması
`node_modules/.cache/harita-karsilastirma/dugun-360-once-sonra.png`. Giriş 940–974 ms (sıcak, soğuk,
zarflı); zarf (hareket azaltılmış) 68 ms.
