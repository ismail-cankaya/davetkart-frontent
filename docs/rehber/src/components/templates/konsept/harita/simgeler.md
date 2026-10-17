# `konsept/harita/simgeler.tsx` — piktogramlar

> **Tarih:** 2026-10-17 · dal `design/harita` · Kaynak: [HARITA-KONSEPTI §4.4](../../../../../tasarim/HARITA-KONSEPTI.md)

---

Hepsi bu dosyada sıfırdan çizildi: 24 px ızgara, tek renk (`currentColor`), 2 px kontur ya da düz
dolgu, yuvarlak uç. Harita üstünde (kapak, lejant, zarf) yalnızca bunlar kullanılır; Lucide
ikonları ortak bölümlerde kalır.

| Ad | Çizim | Nerede |
|---|---|---|
| `yuzuk` | Halka + üstünde baklava taş | Nikâh/tören durağı |
| `kadeh` | Kase, sap, taban | Karşılama/kokteyl |
| `yemek` | Üç dişli çatal + bıçak | Yemek |
| `muzik` | Tek sekizlik nota (dolu baş, bayrak) | Dans/kutlama |
| `pasta` | Tabak, katlı gövde, mum, alev | Pasta |
| `takvim` | Lejantın tarih satırı | |
| `ok` | Sağ üste ok | "Yol tarifi" düğmesi |
| `agac`, `fener` | Arazi süsleri (fener şehir planının iskelesinde, kendi `<g>`'siyle) | |
| `KuzeyOku` | Sol yarısı dolu ok; altına HTML "K" | Şehir planı köşesi |
| `PusulaGulu` | Dört kollu yıldız + ince halka, kuzey ucu dolu | Arazi köşesi, zarf kapağı |

Pusula gülü küçük ve tek renktir; altın, süs, gölge yok (Mezuniyet Pusula'dan ayrışma).

`x`, `y` prop'ları simgeyi iç içe SVG olarak (rota durakları) konumlar.
