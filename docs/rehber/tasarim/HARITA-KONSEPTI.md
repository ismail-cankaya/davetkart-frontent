# "Günün Haritası" konsepti

> **Kapsam:** 9 kategori × 2 preset. Mevcut preset'ler silinmez, değişmez.
> **Dal:** `design/harita` · **Kit:** `src/components/templates/konsept/harita/` · **Tarih:** 2026-10-16
> **Ortak kurallar:** [`KONSEPT-ORTAK.md`](./KONSEPT-ORTAK.md) · **Durum:** Aşama 5 kararları işlendi (2026-10-20, §11).

---

## 1. Fikir

Davet, **günün kendisini gösteren resimli bir haritadır**. Noktalı bir rota karşılamadan yemeğe,
oradan eğlenceye uzanır; mekân bir iğneyle işaretlidir. Adlar bir harita **kartuşunda** (başlık bloğu),
tarih ve saat **lejantta** durur.

Harita **temsilîdir**: gerçek bir yeri çizmez. Gerçek yönlendirmeyi her zaman `mapUrl` düğmesi yapar.
Konseptin işi "nereye, ne zaman, hangi sırayla" sorusunu tek bakışta okutmaktır.

| Mevcut dil | Ne yapıyor | Harita ondan nasıl ayrışıyor |
|---|---|---|
| Mezuniyet Pusula (tek preset) | Antika dünya haritası, altın pusula, ışık kapısı | Antika ve altın yok; günün yerel, düz renkli planı |
| Teknik Çizim | Ölçü çizgisi, kot, proje dili | Teknik değil resimli; ölçü yok, rota var |
| Posta Damgası | Yolculuğunu tamamlamış mektup | Gelecekteki yolculuk; mektup değil plan |
| Yıldız Haritası | Gökyüzü haritası, daire kadraj | Yeryüzü planı; serbest çerçeve |

| Kardeş konsept | Fark |
|---|---|
| Sergi Açılışı | Sergi beyaz ve boş; Harita renkli alanlarla dolu |
| Hikâye Kitabı | Kitap ortalı, serif, iki tonlu; Harita serbest, dar grotesk, çok renkli |

## 2. Palet

### 2.1 Arazi (temel)

| Ad | Hex | Rol | Kontrast (hesaplandı) |
|---|---|---|---|
| `arazi` | `#EEF0E6` | Sayfa zemini | — |
| `murekkep` | `#23303A` | Başlık, etiket, kontur | arazide 11.73 |
| `gri` | `#4E5B63` | Gövde, ikincil etiket | arazide 6.08 |
| `yol` | `#FFFFFF` | Yollar, kartuş zemini | üstünde mürekkep 13.50 |
| `blok` | `#DDD6C6` | Yapı blokları | üstünde mürekkep 9.33 |
| `park` | `#B7C9A2` | Yeşil alan | üstünde mürekkep 7.64 |
| `su` | `#9CC3D5` | Su | üstünde mürekkep 7.19 |
| `rota` | `#A8321F` | Rota, iğne, üst etiket | arazide 5.81; üstünde beyaz 6.69 |
| `rota-acik` | `#C8402F` | Yalnızca rota çizgisi ve iğne (yazı değil) | arazide 4.31 — yazı için yetmez |
| `rotaKoyu` | `#8F2A1A` | Yalnızca düğmenin üzerine gelme hâli | üstünde beyaz 8.35 |

### 2.2 Kategori ayarları

Bir preset arazi tonlarından en çok **dördünü** kullanır (ör. arazi + yol + su + rota). Gece haritası
yoktur (Teknik Çizim ve Yıldız Haritası koyu laciverttir). Çocuk ekseninde (`hazine`) arazi daha sıcak
olabilir: `#F1E6C8` — kullanılırsa mürekkep kontrastı ölçülür.

Kural:

1. Rota rengi her preset'te `rota` ailesidir; değişmez — konseptin imzasıdır.
2. Degrade yok; alanlar düz renk. Gölge yalnızca kartuşta (düz, kaymış: `4px 4px 0 murekkep`).
3. Altın, varak, eskitme (sepya, yanık kenar) yok.

## 3. Yazı

### 3.1 Font denetimi

Satır ve yöntem `SERGI-KONSEPTI.md §3.1` ile aynı. Ekran görüntüsü: `font-denetimi/harita.png`.

| Sonuç | Fontlar |
|---|---|
| **Elendi** | — glif açısından hepsi tam. Görsel olarak: Saira Condensed (`&` "Ɛ" gibi okunuyor) |
| Glif tam, seçilmedi | Oswald (çok yaygın, ağır); Archivo Narrow, Fira Sans Condensed (iyi — yedek); Source Serif 4, Literata (italik daha az kartografik) |

### 3.2 Seçilenler

| Rol | Font | Kural |
|---|---|---|
| Harita etiketleri (yer, durak), üst etiket, lejant başlığı | **Barlow Condensed** 400 / 600 | Üretilen etiketler büyük harf, `tracking-[0.18em]`, ≥ 11 px. Kullanıcı metni (mekân, durak adı) yazıldığı gibi kalır (K9) |
| Gövde, lejant satırları, form, düğme | **Barlow Semi Condensed** 400 / 500 | 14–16 px; rakamlar `tabular-nums` |
| Kartuştaki adlar, su adları, bölüm başlıkları | **Newsreader** italik (opsz) | Adlar ≥ 26 px; su adları italik ve geniş aralıklı (kartografik gelenek) |

Kurallar:

1. Başka font yok; bölüm başlıkları `[&_.font-serif]` ile Newsreader italiğe çevrilir.
2. Etiketler hiçbir zaman yazıyı çizgiyle kesmez: etiketin altında yol/sınır varsa `yol` renginde
   yumuşak bir zemin (halo değil, düz dikdörtgen) bırakılır.
3. Döndürülmüş etiket (su, yol boyunca) yalnızca süs metninde; **bilgi** (tarih, saat, mekân) hiçbir
   zaman döndürülmez.

### 3.3 Yükleme

`konsept/harita/fontlar.ts`: üç aile tek `<link>`, `display=swap`.

## 4. Düzen kuralları

### 4.1 Kapak (hero)

- **Serbest yerleşim**: harita tam ekrandır; kartuş bir köşeye (mobilde üst-sol), lejant karşı köşeye
  (mobilde alt) yaslanır. Rota ikisinin arasında akar. Ortalı simetri yok.
- **Kartuş:** üst etiket (`ROTAMIZ BELLİ`), adlar (italik), tarih. Beyaz zemin, ince mürekkep kontur,
  kaymış düz gölge.
- **Lejant:** açık olan program adımlarından (`timelineEvents`, en çok 3 satır) + mekân. Program
  modülü kapalıysa lejant yalnızca tarih ve mekânı gösterir; o da boşsa lejant çizilmez.
- **İğne** mekânı işaretler; mekân adı iğnenin yanındaki etikettir. `venue` boşsa iğne kalır, etiket olmaz.
- Harita üstünde küçük not: *temsilî harita*. `mapUrl` varsa "Yol tarifi" düğmesi kapakta da bulunur
  (≥ 44 px dokunma hedefi).

### 4.2 Kapağın ötesi

- `renderBackdrop` ile harita **sabit** kalır ve kaydırdıkça yavaşça kayar (yalnızca `transform`);
  bölümler haritanın üstünde, `yol` renginde kartlarda (`surface`) okunur. Kart altında harita %100
  opak değildir; kontrast kartın kendisiyle ölçülür.
- Kapağın altında haritayı **%80 perde** örter; perde kapağın alt kenarından başlar ve onunla kayar.
  Perdenin altındaki süs çizgileri en çok %50 mürekkeptir (pilotta ölçülen en kötü zemin 4.62).
- Bölüm başlıkları (flavor kopyası): Program → *Duraklar*, Detay → *Varış*, Galeri → *Yol üstünden*,
  Hediye → kategoriye göre, LCV → *Rotaya katılın*.

### 4.3 Preset eksenleri (iki preset farklı eksenlerden)

| Eksen | Harita | Uygun |
|---|---|---|
| **Şehir planı** | Yol ızgarası, bloklar, su kıyısı | Düğün, kurumsal, parti |
| **Arazi** | Eş yükselti eğrileri (statik SVG), patika, orman lekeleri | Düğün (kır), nişan, mezuniyet |
| **Mahalle krokisi** | Elle çizilmiş görünen birkaç sokak, ev simgeleri, "buradayız" | Kına, nişan, baby shower |
| **Hazine haritası** | Sıcak arazi, X işareti = mekân, kesik çizgili rota, basit simgeler | Doğum günü (çocuk), sünnet |
| **Alan planı** | Kuşbakışı tesis: sahne, kayıt masası, salonlar (piktogram) | Kurumsal, mezuniyet, sünnet (şenlik alanı) |

### 4.4 Simgeler

Piktogramlar özgün, tek renkli, 2 px konturlu ya da düz dolgu; tek bir ızgaraya (24 px) çizilir. Yemek,
müzik, kadeh, yüzük, kep, çadır gibi **genel** simgeler. Lucide ikonları bölümlerde kullanılabilir;
harita üstünde yalnızca kitin özgün simgeleri.

Durak simgesi, kullanıcının yazdığı adım başlığından sözlükle seçilir; eşleşmezse sıra numarası çizilir
(K9). Sözlük kategoriye göre genişler; ör. kınada "Kına töreni" yüzük değil kına simgesi alır.

## 5. Süsleme dili

| Öğe | Kural |
|---|---|
| Rota | Noktalı/kesik çizgi, `rota` rengi, yuvarlak uç. Ekranda tek rota |
| Pusula gülü | Küçük, tek renk, köşede; altın ve süslü değil |
| Ölçek çubuğu | İsteğe bağlı, süs; espri olabilir (*1 cm = bir ömür*) — en çok bir espri |
| Kartuş | Beyaz dikdörtgen, ince kontur, kaymış düz gölge |
| Yasak | Eskitme, yırtık kenar, kahve lekesi, altın pusula (Pusula); ölçü kotası (Teknik Çizim); posta damgası (Posta) |

## 6. Hareket dili

Karakter: **iğne düşer, rota ilerler**.

| Hareket | Süre | Nasıl |
|---|---|---|
| İğne düşer | 0.35 s | y −16 → 0, ölçek 1.2 → 1 |
| Rota belirir | ≤ 0.9 s toplam | rota parçaları (noktalar/segmentler) sırayla **opaklıkla**; `pathLength`, `stroke-dashoffset` **yok** |
| Kartuş, lejant | 0.4 s | opaklık + y 8 → 0 |
| Kaydırma | sürekli | `renderBackdrop` haritası `translateY` ile yavaş kayar (paralaks), hareket azaltıldığında sabit |

Hero'da son öğe ≤ 1.0 s'de biter. Sonsuz döngü yok. Font geç gelince yeniden ölçülen öğe (rota, iğne)
yerinden oynamaz; konum ilk ölçümde sabitlenir ya da değişim animasyonsuz ve görünmeden yapılır.

## 7. Kategori yorumları

| Kategori | Uyum | Yorum |
|---|---|---|
| Düğün | ● | Şehir planı ya da kır arazisi; karşılama → nikâh → yemek durakları |
| Nişan | ● | *Rotamız belli* — arazi ya da mahalle krokisi |
| Doğum günü | ● | Çocukta hazine haritası, yetişkinde şehir planı (gece rotası) |
| Mezuniyet | ● | Kampüs alan planı; `names` = Mezun & Okul — okul kartuşta |
| Kurumsal | ● | Etkinlik alan planı; kayıt → oturum → kokteyl |
| Parti | ● | Şehir planı, gece değil — sıcak arazi tonu serbest |
| Baby shower | ◐ | Yumuşak mahalle krokisi, "yolculuk başlıyor" |
| Sünnet | ◐ | Şenlik alanı planı ya da hazine haritası |
| Kına | ◐ | **Mahalle krokisi — gelinin evi**: birkaç sokak, ev simgesi, iğne; zorlanırsa ajan söyler |

## 8. Yapılacaklar / yapılmayacaklar

| Yap | Yapma |
|---|---|
| Haritayı temsilî tut, "temsilî harita" notunu yaz | Gerçek sokak adı, gerçek kıyı çizgisi, gerçek şehir planı çiz |
| Lejantı veriden kur, boşsa çizme | Veride olmayan durak uydur |
| Bilgiyi yatay yaz | Tarihi, saati, mekânı döndür |
| Dört renkle yetin | Her alan için ayrı renk |

## 9. Telif ve doğruluk

- Harita verisi kullanılmaz (ticari harita karoları, ekran görüntüsü, açık veri dahil). Bütün çizim
  özgün ve kurgusaldır; lisans ve atıf gerekmez.
- Gerçek bir harita sağlayıcısının görsel dili (renk şeması, iğne biçimi, arayüz) taklit edilmez.
- Misafir yanlış yönlendirilmez: harita temsilîdir, yönlendirme `mapUrl` ile yapılır.

## 10. Kit (`konsept/harita/`)

Önerilen: `palet.ts`, `fontlar.ts`, `tema.ts`, `Kartus.tsx`, `Lejant.tsx` (veriden), `Igne.tsx`,
`Rota.tsx` (opaklıkla açılan segmentler), `simgeler.tsx` (24 px ızgara), `araziler/` (eksen başına statik SVG).

## 11. Pilot kararları (Aşama 5, 2026-10-20)

Kullanıcı düğün pilotundaki bütün önerileri onayladı.

| # | Karar |
|---|---|
| K2 | **İki preset telefonda da ayrışır.** Pilotta Kıyı Kenti ile Kır Yolu 360 px'te aynı yerleşimdeydi (kartuş üstte, rota ortada, lejant altta); fark yalnızca araziydi. Her eksen telefonda kendi yerleşimini kurar (ör. Kır Yolu'nda kartuş altta, iğne üstte, patika dikey) |
| K3 | **Zarf kapısı masaüstünde büyür:** katlanmış harita kartı ekran yüksekliğinin yaklaşık %70'i kadardır; boş zeminin ortasında küçük kart kalmaz |
| K9 | Kullanıcı metni (mekân, durak) yazıldığı gibi; durak simgesi sözlükle (§3.2, §4.4) |
| — | Kartuşta tarih durur; program yokken lejant tarihi tekrar gösterir (§1 ve §4.1 birlikte geçerli) |
| — | `imageUrl` kart görseli boş kalır; kart degradeyle çizilir |
