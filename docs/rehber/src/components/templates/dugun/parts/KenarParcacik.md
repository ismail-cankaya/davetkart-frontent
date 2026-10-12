# `src/components/templates/dugun/parts/KenarParcacik.tsx` — Kenarda kalan parçacıklar

> **Kullananlar:** DugunOnyx, DugunGulYapraklari, DugunSahil, DugunNoir, DugunVitray (HeroStage `overlay`)
> **Denetim:** görsel öz-kontrol (360/768/1280 px), duman testi

---

## 1. Sorun

HeroStage'e `particles` olarak verilen alanlar bütün kadrajda dolaşır. 1. tur görsel
denetiminde yıldız tozu ve yapraklar isimlerin, tarihin ve geri sayımın üstünden geçiyordu.
Kabul ölçütü: süs görselleri ve parçacıklar bu üçüne hiçbir genişlikte değmemeli.

## 2. Çözüm

| Kural | Değer |
|---|---|
| Yatay maske | `#000` 0–10%, saydam 20–80%, `#000` 90–100% — metin kolonu temiz |
| Dar kap | `hidden @md:block`: 448 px altında hiç çizilmez (orada metin kolonu tam genişlik) |
| Parallax | Yok (HeroStage'in parçacık katmanı dışında); kenar tozunda fark edilmiyor |
| Hareketi azalt | `ParticleField` kendi davranışı: tek durağan kare |

768 px'te KurdeleHero'nun en geniş satırı (~320 px, 224–544) maskenin saydam bölgesinde
(154–614) kalır. Noir'ın dev isimleri (~500 px) için de saydam bölge yeter.

## 3. Bedeli

Telefonda (360 px) bu beş şablonda canvas parçacığı görünmez; videonun kendi yaprakları,
bokeh'i ve ışıkları yerinde kalır.
