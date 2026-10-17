# `konsept/sergi/Spot.tsx` — tek spot ışığı

> **Tarih:** 2026-10-17 · dal `design/sergi` · Kaynak: SERGI-KONSEPTI §5, §6

---

## 1. Ne yapar

Çok hafif sıcak beyaz, radyal bir ışık: konseptteki **tek** degrade. Varsayılan konumu eserin üst
kenarıdır (kabın %190'ı genişlikte, merkez üst kenarın biraz üstünde). Girişte 0.5 s'de yanar (yalnızca
opaklık).

## 2. Nereye konur

Aydınlattığı öğenin `relative` kabına. Spot `-z-10` ile kapak katmanının bütün yazılarının arkasına,
duvarın önüne iner. Bu yüzden kap **yığın bağlamı kurmamalıdır** (`isolate`, `z-*`, `transform` yok):
pilotta kap `isolate` iken spot, DOM'da kendinden önce gelen adların üstüne binip onları soldurdu.

Başka hedefte (duvar yazısı) `className` ile konum ve boy ezilir; `cn` aynı gruptaki sınıfı değiştirir.

## 3. Erişilebilirlik

`aria-hidden`. Işık zemini yalnızca açar, karartmaz: kontrastın en kötü noktası düz duvardır. Çizilmiş
ekranda ölçülen en düşük metin oranı 5.99 (etiket rengi, spot kenarındaki `#F6F6F4` pikselinde).

## 4. Sınırlar

- Degrade tarayıcıda titreme (dither) ile çizilir: kenarda duvardan 1 birim koyu pikseller oluşabilir
  (ölçüme dahil).
