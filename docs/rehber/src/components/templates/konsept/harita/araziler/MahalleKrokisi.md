# `konsept/harita/araziler/MahalleKrokisi.tsx` — mahalle krokisi ekseni

> **Tarih:** 2026-10-22 · dal `design/harita` · Eksen: [HARITA-KONSEPTI §4.3](../../../../../../tasarim/HARITA-KONSEPTI.md) · İlk kullanan: [Nişan Kroki](../../../nisan/harita/NisanHaritaKroki/index.md)

---

## 1. Fikir

Birinin peçeteye çizdiği adres tarifi: birkaç sokak, sıra sıra ev, bir meydan, küçük bir park. Şehir
planının ızgarası ve dolu blokları yok; çizgiler elle çizilmiş gibi titrer, evler simgedir.

## 2. Çizim

Kurgusal bir mahalle, 1200 × 1500 tuval, `xMidYMid slice`. Tonlar: **arazi**, **yol** (sokak içi ve ev
içi), **park**; rota kapakta ayrı katmandır.

| Öğe | Nasıl |
|---|---|
| Sekiz sokak | Kırık çizgi orta hat + genişlik (24–44). Önce iki kenar: [`titrek`](cizim.md) ile ±genişlik/2 kaydırılmış, ayrı tohumlarla titreyen iki çizgi (mürekkep %50, 1.6 px). Sonra içi: orta hattan `genişlik − 3` beyaz çizgi. Bu sıra kavşaklarda kenar çizgilerini beyazın altında bırakır: kroki temiz kesişir |
| Meydan ve çeşme | Ana cadde ile dik yolun kesişiminde hafif düzensiz beyaz daire (r 66, kenar %50) + iç içe iki halka (%45) |
| Çıkmaz sokak | Ucunda küçük beyaz daire |
| Evler | Her sokak boyunca 58 px'te bir, iki yana (kenardan 28–36 px) aday nokta. Sokağa, meydana, parka, çıkmaz ucuna ve başka eve (< 44 px) binen aday elenir; kalanların %16'sı ev yerine ağaç olur (sıra düz duvar gibi okunmasın). Ev: dik duran beşgen (gövde 28 × 17, çatı 11), beyaz içi, mürekkep %45 kontur, kapı çizgisi. Kroki geleneğinde evler döndürülmez |
| Park ve ağaçlar | [`lekeYolu`](cizim.md) ile park lekesi + içinde [`lekeIciNoktalar`](cizim.md) ağaçları; ağaç: daire + gövde, mürekkep %30 |

Bütün yollar (kenarlar, evler, kapılar, ağaçlar) modül yüklenirken **tek birer `<path>`** dizgisine
toplanır: DOM'da 20 öğe.

## 3. Ölçü

Kaynak 6.5 KB; DOM'daki SVG 25.7 KB, 20 öğe (ölçüldü, 360 px). Raster görsel, filtre, canlandırma yok.
Mürekkep çizgileri en çok %50: bölüm başlıkları perdenin altında AA'yı geçer (ölçüm: [NisanHaritaKroki](../../../nisan/harita/NisanHaritaKroki/index.md)).

## 4. Telif ve doğruluk

Hiçbir gerçek mahalleye dayanmaz; sokak adı, dükkân, cami, okul gibi yer imi çizilmez (veri uydurulmaz).
"Buradayız" yalnızca iğnenin yanında, mekân adının üstünde durur.
