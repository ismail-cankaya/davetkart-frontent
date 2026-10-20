# "Sergi Açılışı" konsepti

> **Kapsam:** 9 kategori × 2 preset. Mevcut preset'ler silinmez, değişmez.
> **Dal:** `design/sergi` · **Kit:** `src/components/templates/konsept/sergi/` · **Tarih:** 2026-10-16
> **Ortak kurallar:** [`KONSEPT-ORTAK.md`](./KONSEPT-ORTAK.md) · **Durum:** Aşama 5 kararları işlendi (2026-10-20, §11).

---

## 1. Fikir

Davet bir **sergi açılışıdır**. Misafir bir mekânın içinde durur: beyaz duvar, tek spot ışığı,
duvara asılmış bir eser ve eserin yanında müze etiketi. Bilgi bir duyuru gibi değil, **etiket dilinde**
verilir: kim, ne, ne zaman, nerede.

Konseptin iki aracı var: **boşluk** (duvarın çoğu boştur) ve **etiket** (küçük, kesin, hizalı yazı).
Süs yoktur; eser süsün yerini tutar.

| Mevcut dil | Ne yapıyor | Sergi ondan nasıl ayrışıyor |
|---|---|---|
| Noir Minimal | Koyu zeminde tek dev serif isim | Açık zemin; isim değil eser + etiket ilişkisi |
| Bento Editorial | Bilgiyi hücre ızgarasına böler | Izgara yok; duvar ve asma hattı var |
| Brutal | Süssüz kutular, kalın çizgi | Kutu ve kontur yok; derinliği ışık ve çerçeve gölgesi verir |
| Mermer, Kâğıt, Monogram | Yüzey malzemesi (taş, kâğıt, varak) | Malzeme yok; yüzey düz beyaz duvardır |

| Kardeş konsept | Fark |
|---|---|
| Hikâye Kitabı | Kitap simetrik, serif, sıcak ve koyu kapaklı; Sergi asimetrik, grotesk, serin ve beyaz |
| Günün Haritası | Harita çok renkli ve kalabalık; Sergi tek renkli eser ve boşluk |

## 2. Palet

### 2.1 Duvar ve yazı (her preset'te aynı)

| Ad | Hex | Rol | Kontrast (hesaplandı) |
|---|---|---|---|
| `duvar` | `#F7F7F5` | Sayfa zemini — serin, kremsiz beyaz | — |
| `murekkep` | `#1C1C1C` | Başlık, etiket başlığı | duvarda 15.89 |
| `etiket` | `#5E5E5E` | Gövde, etiket satırları | duvarda 6.05 |
| `cerceve` | `#FFFFFF` | Paspartu | — |
| `golge` | `rgba(0,0,0,.35)` | Çerçeve gölgesi (hazır, canlandırılmaz) | — |

### 2.2 Eser renkleri (preset başına **bir** tane)

| Ad | Hex | Duvarda yazı | Üstünde beyaz | Not |
|---|---|---|---|---|
| `kobalt` | `#2A4BA0` | 7.49 | 8.04 | |
| `fusya` | `#A72D63` | 6.12 | 6.57 | Kına, nişan |
| `safran` | `#E0A526` | **2.04 — yazı olamaz** | — | Yalnızca eser yüzeyi; üstüne `murekkep` 7.77 |
| `gece` | `#1C1C1C` | 15.89 | 17.04 | Kurumsal, mezuniyet |

Kural:

1. Bir preset **tek** eser rengi seçer. İkinci renk yoktur; düğme ve vurgu da bu renktir.
2. Duvar her zaman `duvar`dır. Krem, fildişi, kâğıt tonu kullanılmaz (Kâğıt ve Kitap ile karışır).
   Tek istisna zarf kapısıdır: "Işığı yakın" kapısı ışık yanana kadar `karanlik` duvarı gösterir (§11).
3. Degrade yalnızca spot ışığındadır (beyazdan çok hafif sıcak beyaza, radyal). Başka degrade yok.
4. Kırmızı-turuncu (vermilion) kullanılmaz: Günün Haritası'nın rota rengidir.

## 3. Yazı

### 3.1 Font denetimi

Satır: `Gülşen İrem & Çağrı Öztürk — Işıl, Ağustos, Şubat` ve büyük harf karşılığı. Her aday
`"Font", monospace` yığınıyla çizildi; ayrıca `ğ Ğ ş Ş ı İ ç Ç ö Ö ü Ü & —` karakterlerinin her biri
`"Font", monospace` ve `"Font", serif` yığınlarıyla ölçüldü — genişlik farkı = yedeğe düşmüş.
Ekran görüntüsü: `font-denetimi/sergi.png`; seçilenlerin rol örneği: `font-denetimi/secilenler.png`.

| Sonuç | Fontlar |
|---|---|
| **Elendi** | — (9 adayın hepsi tam) |
| Glif tam, seçilmedi | Hanken Grotesk, Schibsted Grotesk (Inter'e çok yakın); Familjen Grotesk (tek katlı `ɑ` başlıkta oyunbaz okunuyor); Bricolage Grotesque (karakterli ama etiket için gürültülü); Young Serif, DM Serif Display, Gloock (ağır; Playfair'in yüksek kontrastına yaklaşıyor) |

### 3.2 Seçilenler

| Rol | Font | Kural |
|---|---|---|
| Duvar yazısı (sergi adı), adlar | **Instrument Serif** 400, italik | ≥ 28 px. Adlar italik. Dar ve uzun: büyük boyda sakin durur |
| Etiket, gövde, düğme, form | **Instrument Sans** 400 / 600 | Etiket 12–13 px, gövde 15–16 px. Rakamlar `tabular-nums` |
| Küçük üst etiket (`AÇILIŞ · 14 KASIM`) | Instrument Sans 600 | 11 px, `tracking-[0.22em]`, büyük harf CSS ile (`lang="tr"`) |

Kurallar:

1. Başka font yok. Playfair, Cormorant, Inter bu konseptte görünmez — bölüm başlıkları da
   `[&_.font-serif]` ile Instrument Serif'e çevrilir.
2. Büyük harf CSS ile yapılır (`uppercase`, `lang="tr"`): `İ` doğru çıkar. JS'te `toLocaleUpperCase('tr-TR')`.
3. Uzun ad kesilmez, küçülür; satır `text-wrap: balance`.

### 3.3 Yükleme

Kitte `konsept/sergi/fontlar.ts`: şablon açılınca tek `<link>` (iki aile, `display=swap`).
Örnek: `shared/paper/fontlar.ts`.

## 4. Düzen kuralları

### 4.1 Kapak (hero)

- **Asimetrik.** Duvar yazısı ve eser aynı eksende değildir: mobilde yazı üstte sola yaslı, eser
  altında sağa kaymış; masaüstünde yazı solda, eser sağda.
- **Etiket eserin yanındadır**, altında ya da üstünde değil (müze kuralı). Mobilde dar kalırsa
  eserin sağ alt köşesine yaslanır, eserle üst üste binmez.
- **Etiket sırası:** sanatçı (adlar) → eser adı + yıl → teknik/alt satır → (isteğe bağlı) tarih, saat, mekân.
- Tarih ve mekân etiket dilindedir: `14 Kasım 2026, 19.00 · Çırağan Sarayı`.
- Kenar boşluğu geniştir: mobilde en az 24 px, duvarın en az %40'ı boş kalır.

### 4.2 Kapağın ötesi

- `renderBackdrop` ile duvar **sabit** kalır; bölümler aynı duvarda asılı gibi akar. Zemin desenli olmaz.
- Bölüm başlıkları (flavor kopyası): Program → *Açılış akışı*, Detay → *Ziyaret bilgileri*,
  Galeri → *Eserler*, LCV → *Açılış listesi*. Hediye kategoriye göre (ör. *Katkı*); bağış kutusu metaforu kullanılmaz.
- Kartlar (`surface`) paspartu gibi: beyaz, ince gölge, köşe yuvarlaması **yok**.
- Galeri modülü kapalı olabilir (ve çoğu planda kapalıdır): **kapak eseri asla fotoğrafa bağlı değildir.**
  Fotoğraf varsa ilk fotoğraf kapak eseri olabilir; yoksa özgün soyut eser çizilir.

### 4.3 Preset eksenleri (iki preset farklı eksenlerden seçilir)

| Eksen | Kapak | Uygun |
|---|---|---|
| **Tek eser** | Büyük tek çerçeve + etiket | Düğün, nişan, kurumsal |
| **Salon asması** | 3–5 küçük çerçeve, farklı boyutlar, tek asma hattı | Doğum günü, mezuniyet, parti |
| **Duvar yazısı** | Çerçevesiz; vinil harf gibi büyük duvar metni + tek satır etiket | Kurumsal, düğün |
| **Kaide** | Beyaz kaide üstünde tek nesne, cam fanus | Baby shower, sünnet |

### 4.4 Soyut eser

Eser özgün ve basittir: tek renk alanı, iki üst üste dikdörtgen, bir yay, bir çizgi. Konseptin **tek**
eser rengiyle ve `murekkep` ile kurulur. Tanınan bir sanatçının dili taklit edilmez (§9). Eser
SVG'dir; dokusu yoktur.

## 5. Süsleme dili

| Öğe | Kural |
|---|---|
| Çerçeve | Beyaz paspartu + ince kenar (`#D6D6D2`) + tek yumuşak gölge. Altın çerçeve, oyma çerçeve yok |
| Spot ışığı | Radyal, çok hafif sıcak beyaz; eserin üst kenarına düşer. Ekranda tek spot |
| Asma hattı | İsteğe bağlı ince yatay çizgi (duvar rayı) |
| Etiket | Küçük beyaz plaka ya da doğrudan duvarda; çerçevesiz |
| Yasak | Konfeti, yaprak, kurdele, mühür, doku, ikon kalabalığı |

## 6. Hareket dili

Karakter: **ışık yanar, eser asılır**. Sessiz, kısa, tek sefer.

| Hareket | Süre | Nasıl |
|---|---|---|
| Spot yanar | 0.5 s | opaklık 0 → 1 |
| Eser asılır | 0.6 s, `ease.out` | y −10 → 0, döndürme −0.6° → 0 |
| Etiket belirir | 0.3 s, 0.5 s gecikme | opaklık |
| Bölüm girişleri | 0.4 s | opaklık + y 12 → 0, bir kez |

Hero'da son öğe ≤ 1.0 s'de biter. Sonsuz döngü yok. Hareket azaltıldığında her şey yerinde görünür.

## 7. Kategori yorumları

| Kategori | Uyum | Yorum |
|---|---|---|
| Düğün | ● | Müzede düğün: *tek eser*, sade etiket. Şaka yok. Pilot: Beyaz Küp (kobalt), Duvar Yazısı (gece) |
| Nişan | ● | *Önizleme* — "Yakında: Bir Ömür". Fuşya |
| Doğum günü | ● | *Retrospektif*: salon asması, her çerçeve bir dönem (yıl yazılmaz; veride yok) |
| Mezuniyet | ● | *Bitirme sergisi*; `gece` rengi, duvar yazısı |
| Baby shower | ● | *Yeni eser · Yakında*: kaide üstünde fanus |
| Kurumsal | ● | Lansman = açılış. `names` = Kurum & Etkinlik; etiket kurum künyesi |
| Parti | ◐ | Açılış kokteyli (vernisaj); salon asması |
| Sünnet | ◐ | *Küçük ressamın ilk sergisi*: kaide ya da salon asması, çocuk ölçeğinde |
| Kına | ◐ | **Çeyiz sergisi** (çeyiz serme geleneği): çerçevelerde özgün oya / işleme motifi, etiket "El işi". Zorlanırsa ajan söyler |

Şaka ölçüsü: bir preset en çok **bir** espri satırı taşır (ör. *Karışık teknik: sabır, kahkaha, çay*),
yalnızca etiketin alt satırında. Düğün ve kurumsal preset'lerin ilki şakasızdır. Sabit metinler
flavor/preset içinde Türkçe yazılır; raporda i18n anahtarı önerilir.

## 8. Yapılacaklar / yapılmayacaklar

| Yap | Yapma |
|---|---|
| Boşluk bırak; duvarın %40'ı boş | Duvarı desenle, dokuyla, krem tonla doldurma |
| Bilgiyi etiket diliyle ver | Bilgiyi kartlara, rozetlere, ikon yığınlarına bölme |
| Tek eser rengi | İki vurgu rengi, degrade düğme |
| Fotoğrafsız da tam çalış | Kapak eserini galeriye bağlama |
| Asimetrik denge | Her şeyi ortala |

## 9. Telif

- Eserler özgün SVG'dir. Gerçek bir sanat eseri, tanınmış bir sanatçının imza dili (ızgaralı ana renk
  kompozisyonu, yumuşak kenarlı renk dikdörtgenleri, benekler, figür çizgisi vb.) taklit edilmez.
- Müze, galeri, fuar adı ve logosu yok (yerli ya da yabancı). "Müze" sözcüğü genel anlamda serbest.
- Kına'daki oya ve işleme motifleri özgün çizimdir; belgelenmiş bir desenin kopyası değildir.

## 10. Kit (`konsept/sergi/`)

Önerilen içerik (ajan ilk kategoride kurar, sonrakilerde kullanır): `palet.ts` (§2), `fontlar.ts` (§3.3),
`tema.ts` (ortak `SectionTheme` üreticisi; eser rengi parametre), `Cerceve.tsx`, `Etiket.tsx`,
`Spot.tsx`, `soyutEserler.tsx`. Her dosyanın kılavuzu `docs/rehber/src/components/templates/konsept/sergi/`.

## 11. Pilot kararları (Aşama 5, 2026-10-20)

Kullanıcı düğün pilotundaki bütün önerileri onayladı.

| # | Karar |
|---|---|
| K4 | Düğünde **kobalt** kalır. Düğün kimliği kobaltı kurumsala ayırıyor, ama Sergi'nin kurumsalı `gece` kullandığı için konsept içinde çakışma yok |
| K5 | **"Işığı yakın" zarf kapısı** kalır: ışık yanana kadar `karanlik` duvar (`#222221`, yazı `#A8A8A3`), dokununca karanlık çekilir, spot yanar, eser asılır. §2 kural 2'nin tek istisnası |
| K6 | **Kurgusal eser künyesi** serbesttir: eser adı (ör. *Eşik*) ve teknik satırı (ör. *Tuval üzerine akrilik*) süs esere aittir, etkinlik verisi değildir. Yaş, sıra no gibi etkinlik bilgisi yine uydurulmaz |
| — | Bölüm üst etiketleri **"Salon 1…n"**: yalnızca görünen bölümler sayılır |

Pilotta eklenen renkler (kit `palet.ts`): `duvarKoyu #EDEDEA` (ikincil yüzey), `kenarGuclu #8A8A86` (form sınırı,
3:1), `karanlik #222221` / `#A8A8A3` (kapı), hover tonları (kobalt `#223E83`, gece `#373737`).

Spot kuralı: spotun kabı yığın bağlamı kurmaz (`isolate` yok); kurarsa spot önündeki yazıyı soldurur.
