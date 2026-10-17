# `konsept/harita/rotaPlani.ts` — rota nereden geçer?

> **Tarih:** 2026-10-17 · dal `design/harita`

---

## 1. Neden ölçüden?

Kartuşun ve lejantın boyu veriye göre değişir (uzun ad, kapalı program, boş lejant). Sabit bir rota
çizimi bir kadrajda kutuların altına girer. Rota bu yüzden ölçülen kutulardan, aralarındaki boş alanda
kurulur; iğne her zaman boş alanda, etiketi kutulara binmez.

## 2. Tarifler

`genisMi(w, h)`: w ≥ 880 ve w ≥ 1.05 h.

| Düzen | Kadraj | Rota |
|---|---|---|
| `capraz` | dar | Kartuşun altından çıkar → sağa kıvrılır → iki noktada U dönüşü → sola iner → iğneye **yukarıdan** iner; etiket sağda |
| `ayna` | dar | Aynası: kartuşun sağ altından çıkar, sola kıvrılır, sağa iner; etiket solda |
| `capraz` | geniş | Kartuşun sağ kenarından çıkar, üstten sağa gider, kıvrılıp ortaya, iğneye yukarıdan iner |
| `ayna` | geniş | Kartuş sol altta: rota sağa gider, yukarı kıvrılır, iğneye **aşağıdan** çıkar (iğne üst orta) |

Son parçanın iğneye dikey yaklaşması, etiketin (iğne başı hizasında, yanında) rotanın üstüne
binmemesi içindir.

## 3. Etiket genişliği

Kadraj kenarına ya da aynı yükseklikteki kutunun kenarına kadar (16 px pay), en çok 220 px.

## 4. `durakOranlari(adet)`

`0.1 + ((i + 0.5) / adet) × 0.56` — duraklar yayın %10–%66'sında eşit aralıklı.
