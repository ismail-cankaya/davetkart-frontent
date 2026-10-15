# `shared/paper/KagitLevha.tsx` — tırtıklı ana kart

> **Tarih:** 2026-10-15 · dal `design/kagit`

---

## 1. Fikir

Ana kart ekranda duran bir nesnedir: kenarı el yapımı kâğıt gibi tırtıklı, yüzeyi dokulu, altında
gölge, isteğe bağlı bir kat izi.

## 2. Kenar

`tirtikliKenar(tohum)` iki `clip-path` çokgeni üretir (kenar başına 64 nokta, içe 0–3 px girinti):

- **Saçak** (dış, %50 opak): lifin incelerek bittiği bölge.
- **Gövde** (iç, tam opak): saçaktan 0.9–2.2 px içeride.

Tohumdan deterministiktir ve modül ömründe bir kez hesaplanıp önbelleğe alınır; her çizimde aynı
dizge kullanılır. Mevcut `DeckleEdge` (26 nokta, tek katman) değiştirilmedi.

Neden `clip-path`, maske değil? Köşeler: dört kenar şeridini maske katmanlarıyla birleştirmek
köşede düz bir çıkıntı bırakıyordu; çokgen köşeyi doğal kapatır, görsel dosya gerektirmez.

## 3. Gölge

`drop-shadow` yalnızca kâğıdı taşıyan katmanda (`--kg-levha-golge`): gölge tırtıklı kenarı izler,
metin filtreye girmez. Statik; canlandırılmaz.

## 4. Kat izi

`kat="yatay" | "dikey"`: ortada ince bir gölge + hemen altında bir ışık çizgisi, alt yarıda hafif
bir gölgelenme. Koyu kartonda gölge %22 (ilk deneme %35 ağır bir şerit gibi duruyordu).

## 5. Hareket

`giris` verilirse `kaymaGirisi` (0.6 s, y 22 → 0, −1.2° → 0). Hareketi azaltta yalnızca opaklık.

## 6. Sınırlar

- Girinti kartın içine doğrudur: içerik dolgusu (`icerikClassName`) en az 24 px olmalı.
- Aynı ekranda iki tırtıklı kart farklı `tohum` almalı; aynı yırtık iki kez görünmesin.
