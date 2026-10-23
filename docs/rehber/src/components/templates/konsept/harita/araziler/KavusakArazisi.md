# `konsept/harita/araziler/KavusakArazisi.tsx` — arazi ekseni, kavuşak

> **Tarih:** 2026-10-22 · dal `design/harita` · Eksen: [HARITA-KONSEPTI §4.3](../../../../../../tasarim/HARITA-KONSEPTI.md) · İlk kullanan: [Nişan Kavuşak](../../../nisan/harita/NisanHaritaKavusak/index.md)

---

## 1. Fikir

Coğrafyada iki akarsuyun birleştiği yere **kavuşak** denir. Nişanın arazisi bu: iki vadi ortadaki
sırtın iki yanından iner, dereleri kavuşakta tek ırmak olur. Kapaktaki iki kollu rota
([`kavsak` düzeni](../rotaPlani.md)) aynı fikri insanlar için söyler.

## 2. Çizim

1200 × 1500 tuval, `xMidYMid slice`. Tonlar: **arazi**, **park** (korular), **su**. Çizim dili
[Kır Arazisi](KirArazisi.md)'yle aynıdır (eş yükselti, koru, tarla), yer başkadır.

| Öğe | Nasıl |
|---|---|
| Dört tepe | Biri iki derenin **arasındaki sırt** (690, 420); diğerleri güneybatı, güneydoğu, kuzeybatı. [`lekeYolu`](cizim.md) ile 4–7 iç içe halka, her üçüncüsü ana eğri |
| İki kol + ırmak | Sol kol kuzeybatıdan, sağ kol kuzeydoğudan iner (15 px su); kavuşakta (740, 820) birleşir, ırmak güneye akar (26 px: su çoğalır); kavuşakta 17 px'lik su dairesi birleşmeyi yumuşatır |
| Dört koru, üç tarla, bir toprak yol | Kır Arazisi'nin desenleriyle (kesikli sınır, döndürülmüş sıra) |
| Su adı | *Kavuşak* — Newsreader italik, ırmak boyunca −64° (süs metni, bilgi değil; mürekkep %50) |

Gölet yok; Kır Arazisi'nin tepe + dere + gölet çekirdeğinden ayrışır. 1280 px'te kapağın iğnesi
kavuşağın hemen yanına düşer (ölçü: iğne 803, 442 · kavuşak ekranda ≈ 790, 545).

## 3. Ölçü

Kaynak 5.3 KB; DOM'daki SVG 30.8 KB, 167 öğe (ölçüldü, 360 px). Raster görsel, filtre, canlandırma yok.

## 4. Telif ve doğruluk

Kurgusal; gerçek bir akarsu kavşağına dayanmaz. "Kavuşak" coğrafi bir terimdir, yer adı olarak
kullanılmadı.
