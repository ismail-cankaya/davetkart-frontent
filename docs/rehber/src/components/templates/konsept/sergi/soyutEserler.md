# `konsept/sergi/soyutEserler.tsx` — özgün soyut eserler

> **Tarih:** 2026-10-17 (doğum günü: 2026-10-23) · dal `design/sergi` · Kaynak: SERGI-KONSEPTI §4.4, §9

---

## 1. Kural

Eser tek eser rengi (`--sg-eser`) + mürekkep + duvar beyazıyla kurulur; SVG, dokusuz, filtresiz.
400×500 tuvale (doğum günü eserleri çerçevelerinin oranındaki tuvale) çizilir ve çerçevesini `preserveAspectRatio="xMidYMid slice"` ile doldurur; önemli
biçimler kenarlardan en az %12 içeride durur. Eser rengi değişkenden geldiği için aynı eser her
kategoride kendi rengiyle asılabilir. Kapak eseri **fotoğrafa bağlı değildir**: galeri kapalıyken de tam.

## 2. Eserler

| Ad | Bileşen | Etiket | Fikir |
|---|---|---|---|
| `esik` | `EserEsik` | *Eşik* · Tuval üzerine akrilik | Dolu bir ışık kemeri ve onun üstünden geçen çizgi kemer, tek bir eşik çizgisinde buluşur. Gelinin eşikten geçişi; iki kişinin aynı kapıdan girişi. Düğün için |
| `ikiYarim` | `EserIkiYarim` | *İki Yarım* · Diptik, tuval üzerine akrilik | İki panoluk diptik (`pano="sol" \| "sag"`, her biri 300×450 = `2 / 3`). Bir daire panoların arasında bölünür; sol yarı fuşya zeminde duvar beyazı, sağ yarı duvar beyazı zeminde eser rengi. Alttaki mürekkep çizgi iki panodan geçer. "İki yarım bir bütün". Nişan Diptik için |
| `ilkIsler` | `EserIlkIsler` | *İlk işler* · Kâğıt üzerine guaj | 300×300 (`1 / 1`). Duvar zeminde tek dolu daire ve mürekkep yer çizgisi: ilk resim. Doğum günü Retrospektif, dönem I |
| `oyunDonemi` | `EserOyunDonemi` | *Oyun dönemi* · Ahşap üzerine boya | 300×400 (`3 / 4`). Üst üste üç blok, en üstteki 9° eğik. Dönem II |
| `kesifDonemi` | `EserKesifDonemi` | *Keşif dönemi* · Tuval üzerine akrilik | 400×300 (`4 / 3`). Eser renginde alan, köşeden köşeye mürekkep yörünge, ucunda duvar beyazı nokta. Dönem III |
| `bugun` | `EserBugun` | *Bugün* · Tuval üzerine akrilik | 200×300 (`2 / 3`). Tek mum: mürekkep gövde, eser renginde alev, yer çizgisi. Dönem IV |
| `yeniYas` | `EserYeniYas` | *Yeni Yaş* · Tuval üzerine akrilik ve kurşun kalem | 500×400 (`5 / 4`). Kalın eser renginde yay tuvalin ortasında kesilir; devamı ve bir daire %50 mürekkep kesik çizgiyle eskiz. Doğum günü Devam Eden |

`SOYUT_ESERLER` her eserin bileşenini, etiketteki adını ve teknik satırını birlikte tutar; preset ikisini
ayrı ayrı yazmaz.

### Diptik kenar kuralı

`İki Yarım`'da daire bilerek iç kenara yaslıdır (%12 kuralının istisnası): yarılar ancak kenarda buluşur.
Kırpılmasın diye sol pano `xMaxYMid slice`, sağ pano `xMinYMid slice` ile iç kenarına sabitlenir;
çerçeve oranı (`2 / 3`) tuvalinkiyle aynı tutulur.

## 3. Telif

- Biçimler bu iş için çizildi (Eşik: iki kemer, bir dikdörtgen, 4 SVG öğesi; İki Yarım: pano başına bir
  dikdörtgen, bir daire, bir çizgi; doğum günü eserleri 3–4 öğe: daire, blok, yay, mum). Bloklar sert kenarlı
  ve küçüktür; yumuşak kenarlı üst üste renk alanlarına gidilmedi. Bölünmüş daire ve tersine dönen renkler genel bir geometri; zemine ortalanmış
  kırmızı daire (bayrak) ya da yin-yang biçimine gidilmedi. Gerçek bir eser, tanınmış bir
  sanatçının imza dili taklit edilmedi: ızgaralı ana renk kompozisyonu, yumuşak kenarlı renk alanları,
  benek, figür çizgisi, tek renkli düz tuval yok. Kenarlar sert, renk düz.
- "Tuval üzerine akrilik" eserin kurgusal künyesidir; etkinlik verisi değildir.

## 4. Sınırlar

- Kaide ekseni (baby shower, sünnet) yeni eserler ekler. Salon asmasının dört eseri doğum gününde geldi;
  mezuniyet ve parti salonları kendi eserlerini ekleyebilir.
- `SoyutEserTanimi.Bilesen` yalnızca `className` ister; `EserIkiYarim`'ın `pano` prop'u isteğe bağlıdır,
  verilmezse sol pano çizilir.
