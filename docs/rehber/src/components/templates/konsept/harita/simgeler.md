# `konsept/harita/simgeler.tsx` — piktogramlar

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (nişan sözlüğü) · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §4.4](../../../../../tasarim/HARITA-KONSEPTI.md)

---

Hepsi bu dosyada sıfırdan çizildi: 24 px ızgara, tek renk (`currentColor`), 2 px kontur ya da düz
dolgu, yuvarlak uç. Harita üstünde (kapak, lejant, zarf) yalnızca bunlar kullanılır; Lucide
ikonları ortak bölümlerde kalır.

| Ad | Çizim | Nerede |
|---|---|---|
| `yuzuk` | Halka + üstünde baklava taş | Nikâh/tören, yüzük takma durağı |
| `kadeh` | Kase, sap, taban | Karşılama/kokteyl |
| `yemek` | Üç dişli çatal + bıçak | Yemek |
| `muzik` | Tek sekizlik nota (dolu baş, bayrak) | Dans/kutlama |
| `pasta` | Tabak, katlı gövde, mum, alev | Pasta |
| `halka` | Çapraz duran, iç içe geçmiş iki halka | Nişan, söz (2026-10-22) |
| `kahve` | Türk kahvesi fincanı: daralan gövde, kulp, tabak, iki buhar kıvrımı | Kahve ikramı (2026-10-22) |
| `cay` | İnce belli bardak + tabak | Çay ikramı (2026-10-22) |
| `tatli` | Tabakta iki baklava dilimi (eşkenar dörtgen) | Tatlı, baklava, lokum, çikolata ikramı (2026-10-22) |
| `kurdele` | Fiyonk: iki yuvarlak kanat, iki uç | Kurdele kesme (2026-10-22) |
| `kamera` | Gövde, üst çıkıntı, objektif | Fotoğraf çekimi (2026-10-22) |
| `takvim` | Lejantın tarih satırı | |
| `ok` | Sağ üste ok | "Yol tarifi" düğmesi |
| `agac`, `fener` | Arazi süsleri (fener şehir planının iskelesinde, kendi `<g>`'siyle) | |
| `KuzeyOku` | Sol yarısı dolu ok; altına HTML "K" | Şehir planı, mahalle krokisi köşesi |
| `PusulaGulu` | Dört kollu yıldız + ince halka, kuzey ucu dolu | Arazi köşesi, zarf kapağı |

Pusula gülü küçük ve tek renktir; altın, süs, gölge yok (Mezuniyet Pusula'dan ayrışma). `halka`
Kâğıt'ın Söz Senedi'ndeki kabartma halkalardan ayrıdır: düz 2 px kontur, 24 px rozette, ışık/gölge yok.

`x`, `y` prop'ları simgeyi iç içe SVG olarak (rota durakları) konumlar. Hangi başlığın hangi simgeyi
aldığı [`veri.ts` → `durakSimgesi`](veri.md)'dedir.
