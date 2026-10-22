# `konsept/harita/rotaPlani.ts` — rota nereden geçer?

> **Tarih:** 2026-10-17 · güncelleme 2026-10-22 (dar `ayna`, gizli başlangıç, `planGecerli`; nişan: `kenar`, `kavsak`, `kol`) · dal `design/harita`

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
| `kenar` | dar | harita üstte; kartuş + lejant altta üst üste | Kartuşun üst kenarından (%16) dik çıkar → solda yükselir → sağa döner → sağ üstteki iğneye (`w × 0.70`, ucu üst kenardan 80 px) alttan varır; etiket **solda**, iki satır ("BURADAYIZ" + mekân) |
| `kenar` | geniş | kartuş + lejant sağ sütunda | Kartuşun **sol** kenarından (%62) dik çıkar → aşağı kıvrılır, haritanın altında bir yay çizer → soldaki iğneye (`≈ w × 0.3`, `h × 0.44`) aşağıdan varır; etiket sağda |
| `kavsak` | dar | kartuş üst sol, lejant alt sol | **İki kol** kartuşun alt kenarının iki ucundan (%16, %84) dik çıkar, kartuşun ortasının biraz sağında (%55) bir kavşakta birleşir (bandın %26'sı, en çok 70 px aşağıda); ortak yol sağa kıvrılır, iğneye (`w × 0.8`) yukarıdan iner; etiket **solda** |
| `kavsak` | geniş | kartuş sol üst, lejant sağ üst (ikisi de üst satırda) | Ana kol kartuşun alt kenarından (%30) iner ve sağa kıvrılır; ikinci kol sağ kenarından (%56) çıkıp sağa, sonra aşağı kıvrılır; kavşak kartuşun sağ altında (`≥ w × 0.42`, kalan boyun %30'u); ortak yol aşağıda bir yay çizip iğneye (`≥ w × 0.64`, lejantın en az 110 px altı) aşağıdan varır |

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

`gizli: 20` plana yazılır; [Rota](Rota.md) durakları görünen kısma dağıtır. İkinci kol da kartuşun
altında başlar.

### 3.1 İkinci kol (`kavsak`)

`kol` ikinci yolun ara noktalarıdır (ilki kartuşun altında, sonuncusu kavşak); `kavsak` kavşağın ana
rotadaki sırasıdır. Kol yalnızca **iki ad** varsa kurulur (`ikiKol`): tek adda rota tek koldur ve
kavşaktan geçip yine iğneye varır — veride olmayan ikinci kişi çizilmez. Konsept rehberi §5 "ekranda
tek rota" der: kol ana rotaya katılan bir koldur, ayrı bir rota değildir (yorum; raporda açık soru).

## 4. Etiket genişliği

Kadraj kenarına ya da aynı yükseklikteki kutunun kenarına kadar (16 px pay), en çok 220 px.

## 5. `planGecerli(plan, ölçü)`

Kapak ilk planı sabitler; kutular değişince bunu sorar. Yanlış döner, eğer:

| Koşul | Ne olmuş |
|---|---|
| Rotanın ilk noktası kartuş kutusunun dışında | Kartuş 20 px'ten çok küçüldü; rota kenardan kopardı |
| Kolun ilk noktası kartuş kutusunun dışında | Aynısı, ikinci kol için |
| İğne kutusu (baş + iğne, 26 × 44) bir kutuyla kesişiyor | İğne lejantın/kartuşun altına girdi |
| Etiket kutusu (genişlik × 2·`etiketYari`) bir kutuyla kesişiyor | Etiket kutunun altında kaldı. `etiketYari`: dar 14, geniş 26; üst satırlı etikette (+"BURADAYIZ") +9 |

## 6. `durakOranlari(adet)`

`durakOranlari(adet, bas = 0.1, son = 0.66)`: `bas + ((i + 0.5) / adet) × (son − bas)` — duraklar
yayın %10–%66'sında eşit aralıklı (gizli başlangıç çıkarıldıktan sonra). Kavşaklı rotada pencere
kavşaktan +%7'de başlar, `min(0.86, 1 − 60 px / uzunluk)`'ta biter: duraklar ortak yoldadır ve son
durak iğnenin başının altında kalmaz (iğneye yukarıdan inen rotada baş, rotanın son ~45 px'inin
üstündedir).
