# `konsept/harita/rotaPlani.ts` — rota nereden geçer?

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (dar `ayna`, gizli başlangıç, `planGecerli`) · dal `design/harita`

---

## 1. Neden ölçüden?

Kartuşun ve lejantın boyu veriye göre değişir (uzun ad, kapalı program, boş lejant). Sabit bir rota
çizimi bir kadrajda kutuların altına girer. Rota bu yüzden ölçülen kutulardan, aralarındaki boş alanda
kurulur; iğne her zaman boş alanda, etiketi kutulara binmez.

## 2. Tarifler

`genisMi(w, h)`: w ≥ 880 ve w ≥ 1.05 h.

| Düzen | Kadraj | Kutular | Rota |
|---|---|---|---|
| `capraz` | dar | kartuş üst, lejant alt | Kartuşun alt kenarından **dik** çıkar → sağa kıvrılır → iki noktada U dönüşü → sola iner → iğneye **yukarıdan** iner; etiket sağda |
| `ayna` | dar | lejant üst, kartuş alt | Kartuşun üst kenarından (kartuşun %20'sinde) dik çıkar → sağa tırmanır (%72) → sağda kıvrılır (%82) → sola döner (%60) → iğneye sağ-alttan varır. İğne `w × 0.38`'de, ucu lejant grubunun 12 + 52 px altında; etiket sağda |
| `capraz` | geniş | kartuş sol üst, lejant sağ alt | Kartuşun sağ kenarından dik çıkar, üstten sağa gider, kıvrılıp ortaya, iğneye yukarıdan iner |
| `ayna` | geniş | kartuş sol alt, lejant sağ üst | Kartuşun sağ kenarından dik çıkar, sağa gider, yukarı kıvrılır, iğneye **aşağıdan** çıkar (iğne üst orta) |

Son parçanın iğneye dikey ya da alttan yaklaşması, etiketin (iğne başı hizasında, yanında) rotanın
üstüne binmemesi içindir. Dar `ayna`da ara noktaların yüksekliği "kartuş kenarı → iğne ucu" aralığının
oranıdır: kısa aralıkta (dolu senaryo, ~100 px) yatay bir kıvrım, uzun aralıkta (boş senaryo, ~450 px)
dikey bir tırmanış olur. 360 px'te iğne Kır Arazisi'nin ana tepesinin üstüne düşer (doruk x ≈ 0.36 w).

## 3. Gizli başlangıç

Rota kutunun kenarından değil, **20 px içeriden** başlar ve kenara dik çıkar (`cikis()`: içeride bir,
kenarın 6 px dışında bir nokta). Kartuş opaktır ve katmanın üstündedir (z-10); başlangıç görünmez,
rota "kartuşun altından" çıkar. İki yararı var:

- Kartuş fontla birkaç piksel küçülse de rota kenardan kopmaz (sabit plan, bkz. [HaritaKapak §4.1](HaritaKapak.md)).
- Çıkış her zaman kenara diktir; Kıyı Kenti'nde cadde kartuşun altından aşağı iner, sonra sağa kıvrılır.

`gizli: 20` plana yazılır; [Rota](Rota.md) durakları görünen kısma dağıtır.

## 4. Etiket genişliği

Kadraj kenarına ya da aynı yükseklikteki kutunun kenarına kadar (16 px pay), en çok 220 px.

## 5. `planGecerli(plan, ölçü)`

Kapak ilk planı sabitler; kutular değişince bunu sorar. Yanlış döner, eğer:

| Koşul | Ne olmuş |
|---|---|
| Rotanın ilk noktası kartuş kutusunun dışında | Kartuş 20 px'ten çok küçüldü; rota kenardan kopardı |
| İğne kutusu (baş + iğne, 26 × 44) bir kutuyla kesişiyor | İğne lejantın/kartuşun altına girdi |
| Etiket kutusu (genişlik × 28, genişte × 52) bir kutuyla kesişiyor | Etiket kutunun altında kaldı |

## 6. `durakOranlari(adet)`

`0.1 + ((i + 0.5) / adet) × 0.56` — duraklar yayın %10–%66'sında eşit aralıklı (gizli başlangıç
çıkarıldıktan sonra).
