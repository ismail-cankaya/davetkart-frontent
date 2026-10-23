# `konsept/harita/araziler/HazineAdasi.tsx` — hazine haritası ekseni

> **Tarih:** 2026-10-23 · dal `design/harita` · Eksen: [HARITA-KONSEPTI §4.3](../../../../../../tasarim/HARITA-KONSEPTI.md) · İlk kullanan: [Hazine Avı](../../../dogum-gunu/harita/DogumGunuHaritaHazineAvi/index.md)

---

## 1. Fikir

Kurgusal bir ada: kum, koru, iki tepe, küçük bir göl, kıyıda palmiyeler, denizde dalga ve kaya. Antika
değildir (§2.2): eskitme, sepya, yanık kenar yok; düz renk ve ince çizgi.

## 2. Çizim

1200 × 1500 tuval, `xMidYMid slice`. Tonlar: **sıcak arazi** `#F1E6C8`, **su**, **park**; rota ve X kapakta.

| Öğe | Nasıl |
|---|---|
| Kara | İki [`lekeYolu`](cizim.md): ana ada (x 270–930, y 150–1370) + batı yarımadası (x 40–620). Önce ikisinin 3.6 px kenarı, üstüne dolguları: içteki kesişme örtülür, dışta 1.8 px (mürekkep %45) kalır |
| Yarımadanın nedeni | Dikey telefonda kadraj dışında (x < 307); yatay ekranda sol yarıyı karaya çevirir — ipuçları ve X orada durur |
| Sığlık | Lekelerin %107–108 büyütülmüş izi, kesik beyaz çizgi (%85); içte kalan kısmı kara örter |
| Adacıklar | Üç küçük leke |
| Tepeler | İki grup eş yükselti halkası (4–5 halka, %28) |
| Korular | Dört park lekesi + içinde yuvarlak ağaçlar (%30) |
| Palmiyeler | 11 yer; gövde + dört yaprak, mürekkep %45 |
| Deniz | Tohumlu dalga (beyaz %75) ve kaya (%35), karaya binmeyen noktalar |
| Su adı | *Mavi Koy* — süs metni, yatay italik, %50 |

Bütün yollar modül yüklenirken hesaplanır; DOM'da 20 öğe.

## 3. Ölçü

Kaynak 6.2 KB; DOM'daki SVG 22.8 KB (360 px). Raster, filtre, canlandırma yok. Kıyı ve palmiye çizgileri sıcak
zeminde koyu kaldığı için preset perdeyi %86 kullanır (ölçüm preset kılavuzunda).

## 4. Telif ve doğruluk

Hiçbir gerçek adaya dayanmaz. X kapakta durur ve temsilîdir; yönlendirme `mapUrl` ile.
