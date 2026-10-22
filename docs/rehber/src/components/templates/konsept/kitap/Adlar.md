# `konsept/kitap/Adlar.tsx` — `KitapAdlar`

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (`adlarBoyu`) · dal `design/kitap`

---

## 1. Dizgi

Adlar Caslon Display ile alt alta; `&` kendi satırında **Caslon Text italik**, 0.7 em — Caslon'un
italik `&`'ı klasik kitap dizgisinin süsüdür. Satırlar arasında boşluk karakteri var: ekran okuyucu
"Gülşen İrem & Mehmet Çağrı" okur.

## 2. Boy

`font-size: max(32px, min(akis·o cqi, enCok·o px))`

- `cqi`: kompozisyon kökü `@container`'dır; boy telefon çerçevesinde de doğru akar.
- `o`: en uzun adın uzunluğuna göre çarpan (≤ 12 → 1, ≤ 18 → 0.86, ≤ 26 → 0.74, üstü 0.64).
- **32 px tabanı:** Display'in kıl çizgileri bunun altında kopar (KITAP-KONSEPTI §3.2).
- Varsayılan `enCok` 64 px, `akis` 12.5 cqi (360 px'te 45 px).
- `adlarBoyu(adlar, enCok, akis)` aynı değeri CSS dizgisi olarak verir: adlarla aynı ölçüde çizilmesi
  gereken bir süs `em`'ini buna bağlar (nişanın kesik kurdelesi, `NisanKitapKurdele`).

## 3. Kurallar

- Harf büyüklüğüne dokunulmaz; ad kesilmez, kısaltılmaz (`text-wrap: balance`, `overflow-wrap: break-word`).
- Ad yoksa `bos` ("Davetlisiniz") yazılır.
- `as`: hero'da `h1`, kapak kapısında `p`.

Denendi: `Gülşen İrem Karaağaçlı & Mehmet Çağrı Yıldırımoğlu` 360 / 768 / 1280 px, kapakta ve iç kapakta.
