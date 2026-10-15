# "Kâğıt / el yapımı" konsepti — davetiye seti

> **Kapsam:** 9 kategoride, kategori başına 3 yeni preset (toplam 27). Mevcut preset'ler silinmez, değişmez.
> **Kit:** `src/components/templates/shared/paper/` · **Doku üretici:** `scripts/temalar/kagit-dokulari.ts`
> **Dal:** `design/kagit` · **Tarih:** 2026-10-15
> **Durum:** Aşama 2 — kit ve bu rehber onaydan sonra sabittir; değişiklik yeniden onay ister.

---

## 1. Fikir

Misafir telefonu açtığında **basılı, elle hazırlanmış bir davetiye seti** tutuyormuş gibi
hissetmeli: zarf, ana kart, ek kartlar ve cevap kartı.

Katalogda kâğıdın malzemeleri zaten var. Bu ailenin onlardan farkı **ölçek**: mevcut diller kâğıdı
yalnızca açılış ekranına (hero) koyar; altındaki program, mekân ve LCV sıradan dijital kartlardır.
Burada sayfanın **tamamı** kâğıttır.

| Mevcut dil | Ne yapıyor | Bu aile ondan nasıl ayrışıyor |
|---|---|---|
| Kağıt & Mühür (`*-kagit`, 8 kategori) | Hero'da tırtıklı kart + mum mühür | Ek kartlar, cevap kartı, zarf; doku çalışma anında üretilmiyor |
| Suluboya (`*-suluboya`) | Hero'nun kendisi suluboya, `feTurbulence` filtresiyle | Leke yalnızca süs; önceden üretilmiş maske |
| Herbaryum | Daveti bir arşiv kaydı yapar | Kayıt değil, gönderilmiş bir set |
| Posta Damgası | Yolculuğunu tamamlamış mektup, adres bloğu | Zarf açılır; damga bir baskı tekniği olarak kullanılır |
| Varak Monogram | Sıcak folyo, parlayan varak | Parlaklık yok; yaldız düz renktir |

### 1.1 Setin parçaları

| Parça | Davetiyede karşılığı | Kit |
|---|---|---|
| **Zarf** | `showEnvelope` açıkken giriş kapısı | `KagitZarf` |
| **Ana kart** | Hero | `KagitLevha` (tırtıklı kenar, isteğe bağlı kat izi) |
| **Ek kartlar** | Program, mekân, hediye | `KAGIT_TEMASI.surface` (düz kesim) |
| **Cevap kartı** | LCV formu | `KAGIT_TEMASI.input` (kesik çizgi), mürekkep dolgulu düğme |
| **Masa** | Sayfa zemini | `KAGIT_TEMASI.base` (o da dokulu kâğıt) |

Tırtıklı kenar yalnızca ana karttadır. Gerçek setlerde ek kartlar makinede kesilir; her kartı
tırtıklı yapmak hem "hazır şablon" görünür hem de mesajı sulandırır.

### 1.2 Zarf bir modüldür

`showEnvelope` kapalıysa (ör. Standart plan) zarf **hiç** görünmez; tasarım zarfı bayraktan bağımsız
göstermez. Zarfsız hâlde kâğıt hissini ana kartın **kayarak gelişi** ve mührün **basılışı** taşır.
Her preset önce zarfsız tasarlanır, zarf onun üstüne eklenir.

---

## 2. Palet

Tek kaynak: `shared/paper/palet.ts`. Renkler CSS değişkeni olarak dağıtılır (`KagitKok`); tema
dizgileri sabittir.

### 2.1 Kâğıtlar

| Ad | Hex | Ton | Not |
|---|---|---|---|
| `fildisi` | `#FAF6EE` | açık | En açık; düğme yazısı da budur |
| `pamuk` | `#F3ECDF` | açık | Sıcak krem; masa için ilk tercih |
| `gul` | `#F1E1DA` | açık | Gül kurusu |
| `adacayi` | `#E3E9DC` | açık | |
| `sis` | `#E5EAEF` | açık | Soğuk; baby shower, mezuniyet |
| `kraft` | `#D2B48E` | **orta** | Gövde metni de başlık mürekkebiyle yazılır (§2.6) |
| `lacivert` | `#1E2840` | koyu | Karton |
| `murdum` | `#2E1D27` | koyu | Karton |
| `komur` | `#26231F` | koyu | Karton |

### 2.2 Mürekkepler

| Ad | Başlık | Gövde | Kâğıt |
|---|---|---|---|
| `is` | `#2A211B` | `#4A3C31` | açık |
| `sepya` | `#45291A` | `#5A3E2C` | açık |
| `bordo` | `#5C1A26` | `#6C2733` | açık |
| `lacivert` | `#1C2A47` | `#33405A` | açık |
| `orman` | `#203629` | `#364C40` | açık |
| `gul` | `#6A2539` | `#7A3446` | açık |
| `beyaz` | `#F8F2E7` | `#DDD5C7` | koyu |
| `yaldiz` | `#E2C892` | `#D4B87E` | koyu — **düz renk**, parlamaz, degrade almaz |

### 2.3 Mum, pigment

| Mum | Hex | | Pigment (suluboya) | Hex |
|---|---|---|---|---|
| `bordo` | `#7B1E2C` | | `gul` | `#E8B0AA` |
| `lacivert` | `#263559` | | `seftali` | `#F2C4A0` |
| `adacayi` | `#5F7A5C` | | `adacayi` | `#AEC5A5` |
| `hardal` | `#B8892F` | | `lavanta` | `#BEB4D4` |
| `gul` | `#B0606F` | | `gok` | `#AAC6DA` |
| `komur` | `#2F2B29` | | `hardal` | `#E7C984` |
| `toprak` | `#8B5A3C` | | | |
| `yaldiz` | `#C29A4B` | | | |

### 2.4 Bir set nasıl kurulur

```ts
const SET: KagitSeti = {
  ton: 'acik', masa: 'pamuk', kart: 'fildisi',
  murekkep: 'is', vurgu: 'bordo', mum: 'bordo',
  doku: 'lif', el: 'pinyon'
};
```

- **Masa ve kart aynı tonda** (ikisi açık ya da ikisi koyu). Bölüm başlıkları masada, metinleri
  kartta durur ve aynı mürekkebi kullanır. Tip bunu zorlar.
- **Vurgu** küçük büyük harf etiketlerin, düğmenin ve ikonların rengidir; bir mürekkeptir, yeni renk değildir.
- **`ozel`**: kimlikli kategoriler (düğün, kına, sünnet, kurumsal) kendi KIMLIK paletindeki
  değeri buradan verir. Her `ozel` değeri o kategorinin raporunda ölçülür; ölçülmeden kullanılmaz.

### 2.5 Kontrast — ölçülen

Ölçüm: WCAG 2 bağıl parlaklık; kâğıt rengi dokunun **en koyu %1'i** ile koyultularak
(keten ×0.906, lif ×0.937). Tablodaki değerler en kötü doku (keten) içindir. Betik:
`node_modules/.cache/kagit/kontrast.ts` (repoya girmez; sonuçlar burada).

**Açık kâğıt × koyu mürekkep (başlık / gövde)**

| Kâğıt | is | sepya | bordo | lacivert | orman | gul |
|---|---|---|---|---|---|---|
| fildisi | 11.87 / 7.98 | 9.98 / 7.32 | 9.70 / 8.00 | 10.75 / 7.82 | 9.75 / 6.98 | 8.17 / 6.57 |
| pamuk | 10.90 / 7.32 | 9.16 / 6.72 | 8.90 / 7.35 | 9.86 / 7.18 | 8.95 / 6.41 | 7.50 / 6.03 |
| gul | 10.09 / 6.78 | 8.47 / 6.22 | 8.24 / 6.80 | 9.13 / 6.64 | 8.29 / 5.93 | 6.94 / 5.58 |
| adacayi | 10.34 / 6.95 | 8.68 / 6.37 | 8.44 / 6.97 | 9.36 / 6.81 | 8.49 / 6.08 | 7.11 / 5.72 |
| sis | 10.57 / 7.10 | 8.88 / 6.51 | 8.63 / 7.12 | 9.56 / 6.96 | 8.68 / 6.21 | 7.27 / 5.85 |
| kraft\* | 6.57 | 5.52 | 5.36 | 5.94 | 5.39 | **4.52** |

\* Kraft'ta gövde = başlık mürekkebi. En düşük çift: `gul` mürekkep / `kraft` = **4.52** (AA, sınırda).

**Koyu karton × açık mürekkep (başlık / gövde)**

| Karton | beyaz | yaldiz |
|---|---|---|
| lacivert | 13.86 / 10.60 | 9.49 / 8.06 |
| murdum | 14.83 / 11.35 | 10.16 / 8.62 |
| komur | 14.59 / 11.16 | 10.00 / 8.48 |

**Düğme (vurgu dolgusu üstünde yazı):** açık setlerde fildişi yazı 10.06 (gul) – 14.63 (is);
koyu setlerde karton rengi yazı 9.01 (yaldız/lacivert) – 14.26.

**LCV alanının alt çizgisi** (WCAG 1.4.11, ≥ 3:1): yarı saydam mürekkep tutmadı (alfa 0.55'te bile
kraft/gul 2.00). Çizgi bu yüzden **tam gövde mürekkebidir** (≥ 4.52).

**Suluboya lekesi üstünde başlık mürekkebi** (leke %85, fildişi üstünde multiply): en kötü
4.75 (`lavanta` lekesi / `gul` mürekkep). Gövde metni lekenin üstüne konmaz.

### 2.6 Renk kuralları

1. Kraft orta tondur: üstündeki her metin başlık mürekkebiyle (kit bunu kendisi yapar).
2. Koyu kartonda yalnızca `beyaz` ve `yaldiz` mürekkep.
3. Yaldız düz renktir; degrade, parıltı, `background-clip: text` yok.
4. Leke, kabartma ve damga **bilgi taşımaz** — taşıdıkları ad/tarih sayfada gerçek metin olarak da var.
5. Kabartmanın kontrastı bilerek düşüktür; yazı olarak kullanılmaz.

### 2.7 Kategori şeritleri

Kategoriler arası ayrışma KIMLIK belgelerindeki notlara dayanır (düğün §10, kına §10, sünnet §1).

| Kategori | Kâğıt | Mürekkep / vurgu | Mum | Pigment | Baş harf |
|---|---|---|---|---|---|
| Nişan | fildisi, gul, pamuk | gul, is, lacivert | gul, yaldiz (alyans metali) | gul, seftali, lavanta | çift |
| Baby shower | sis, adacayi, fildisi | lacivert, orman | adacayi, lacivert | gok, lavanta, adacayi | `ilk` (bebek adı boş olabilir) |
| Doğum günü | kraft, pamuk | is, orman, lacivert | hardal, toprak | hardal, gok | çift ya da `ilk` |
| Mezuniyet | sis, lacivert karton | lacivert, beyaz, yaldiz | lacivert, yaldiz | — | **`ilk`** (ikinci alan okul) |
| Parti | kraft, komur karton | is, beyaz | komur, hardal | hardal | çift ya da `ilk` |
| Düğün | KIMLIK `ozel` (inci, tül) | menekşe mürekkep `#211b2d` | şakayık `#9b3a63` | — | çift |
| Kına | KIMLIK `ozel` (avuç `#f8ebdf`) | kına kahvesi | al `#b0241c` | — | çift |
| Sünnet | KIMLIK `ozel` (şeker beyazı) | nazar laciverti | nar | — | **`ilk`** (çocuk adı) |
| Kurumsal | KIMLIK `ozel` | KIMLIK | — | — | **`ilk`** (kurum); el yazısı yok |

Kaçınılacaklar: doygun turuncu-kırmızı (kına), şakayık/inci/mersin (düğün), sax/nar (sünnet)
kendi kategorileri dışında.

---

## 3. Yazı

### 3.1 Font denetimi

Satır: `Gülşen İrem & Çağrı Öztürk — Işıl, Ağustos, Şubat`. Her aday `"Font", monospace` yığınıyla
çizildi; eksik karakter monospace'e düşüp göze batar. Otomatik kontrol: her karakter iki farklı
yedek yığınla ölçüldü, genişlik farkı = yedeğe düşmüş. Denetlenen karakterler:
`ğ Ğ ş Ş ı İ ç Ç ö Ö ü Ü & —`.

46 el yazısı / kaligrafi adayı, 12 serif:

| Sonuç | Fontlar |
|---|---|
| **Elendi** (13) | Mrs Saint Delafield, Monsieur La Doulaise, Tangerine, Herr Von Muellerhoff, Satisfy, Cookie, Homemade Apple, Kristi (`ğ Ğ ş Ş İ`); Rouge Script, Nothing You Could Do (`+ ı`); Lovers Quarrel, Qwigley (`ğ Ğ İ`); La Belle Aurore (`ı`) |
| Glif tam ama seçilmedi | Great Vibes, Petit Formal Script, Italianno, Arizonia (büyük `I` "J" gibi okunuyor: *Işıl*); Corinthia, Sacramento (ince gövde, küçükte kontrast); Birthstone (küçük boyda `İ` noktası kayboluyor); WindSong, Ballet, MonteCarlo, Luxurious Script, Mea Culpa, Imperial Script, Ephesis (süs okunurluğu aşıyor); Parisienne, Allura, Dancing Script, Style Script, Kalam ve diğerleri (yedek) |
| Serif | 12'si de geçti |

### 3.2 Seçilenler

| Rol | Font | Kural |
|---|---|---|
| Adlar — resmî kaligrafi | **Pinyon Script** | Yalnızca adlar, ≥ 28 px |
| Adlar — fırça kaligrafi | **Alex Brush** | Yalnızca adlar, ≥ 26 px |
| Adlar — gündelik el yazısı | **Caveat** | Adlar ve kısa notlar, ≥ 20 px |
| Ara başlık | **Cormorant Garamond** 500–600 | Zaten genel olarak yüklü; ≥ 18 px |
| Gövde | **EB Garamond** 400–500 | 15–16 px; küçük büyük harf etiketleri de bu |

Kurallar:

1. El yazısı **yalnızca adlarda**. Başlık, tarih, mekân, düğme, form el yazısıyla yazılmaz.
2. `&` el yazısıyla değil, serif italikle dizilir (`Adlar` bileşeni). Pinyon'un `&`'ı "ɤ" gibi okunur.
3. El yazısına harf aralığı (`tracking`) verilmez; harfler birbirine bağlanır.
4. Büyük harf CSS ile yapılır, `lang="tr"` altında: *İ* doğru çıkar. JS'te `toLocaleUpperCase('tr-TR')`.
5. Uzun adlar küçülür, kesilmez: `Adlar` boyu ad uzunluğuna göre ×1 / ×0.86 / ×0.74 / ×0.62
   ölçekler; satır `text-wrap: balance` ile dengelenir.

### 3.3 Yükleme

Fontlar `index.css`'teki genel `@import`'a **eklenmez** (her sayfaya inerdi). `KagitKok` şablon
açıldığında yalnızca o setin el yazısını ve EB Garamond'u ekler (`display=swap`). Yedek Cormorant
Garamond'dur; satır uzunluğu değişebileceği için hero adları `useElYazisiHazir()` ile en çok 700 ms bekleyebilir.

---

## 4. Malzeme

| Malzeme | Kit | Kural |
|---|---|---|
| Doku | `doku: 'lif' \| 'keten' \| 'yok'` | Önceden üretilmiş gri WebP, `multiply`. **Çalışma anında `feTurbulence` yok.** |
| Tırtıklı kenar | `KagitLevha kenar="tirtikli"` | Yalnızca ana kart. Aynı ekranda iki kart → farklı `tohum`. |
| Kat izi | `KagitLevha kat="yatay"` | Ana kartta en çok bir kat. |
| Mum mühür | `MumMuhur` | Ekranda en çok bir (zarftaki ile hero'daki aynı anda görünmez). Baş harf `basHarfler()`. |
| Kabartma | `Kabartma` | Süs; bilgi taşımaz. |
| Mürekkep damgası | `MurekkepDamga` | En çok bir; hafif eğik (−12°…+8°). |
| Suluboya | `SuluboyaLeke` | En çok üç leke; kâğıdın kenarından taşar, ortaya gelmez. Kalıp çiçek kümesi yok. |
| Kurutulmuş çiçek / mürekkep çizimi | Preset'te, özgün SVG | Tek dal ya da tek çizgi; telifli çizim taklidi yok. |

Bütçe: kit dokuları **22.3 KB** (lif 1.1 · keten 2.8 · mürekkep 9.6 · leke 8.7); sınır 40 KB.
Preset başına ek görsel ≤ 60 KB.

---

## 5. Hareket

| Hareket | Süre | Nerede |
|---|---|---|
| Kâğıt kayar (`kaymaGirisi`) | 0.6 s, `ease.out`, y 22 → 0, −1.2° → 0 | Ana kart, zarf |
| Mürekkep belirir (`belirmeGirisi`) | 0.45 s, opaklık | Metin |
| Damga basılır (`basmaGirisi`) | 0.24 s, ölçek 1.16 → 1 | Damga, mühür |
| Mühür kırılır | 0.3 s, iki parça ayrılıp söner | Zarf |
| Zarf açılır | dokunuştan kapının kalkmasına **≤ 1 s** (ölçülen 956–969 ms) | Zarf |

Kurallar:

1. Her hareket **bir kez** oynar. Sonsuz döngü, nabız, parıltı yok (zarfın ipucu metni de durağan).
2. Yalnızca `transform` ve `opacity`. `pathLength`, `clip-path`, renk, filtre canlandırılmaz.
3. Hero'da son öğenin `gecikme + süre` toplamı ≤ 1.0 s.
4. **Hareketi azalt:** App'teki `MotionConfig reducedMotion="user"` transform'ları atlar, öğeler
   yerinde belirir. Zarf dokunuşta anında kalkar (ölçülen 4–6 ms), hiçbir şey dönmez ya da kaymaz.

---

## 6. Bir preset nasıl kurulur

```tsx
const SET: KagitSeti = { ton: 'acik', masa: 'pamuk', kart: 'fildisi', murekkep: 'is', vurgu: 'bordo', mum: 'bordo', doku: 'lif', el: 'pinyon' };
const FLAVOR = { ...NISAN_FLAVOR, BackgroundPattern: undefined }; // masa zaten kâğıt

export function NisanOrnek({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <KagitKok set={SET}>
      <InvitationComposition
        invitation={invitation}
        flavor={FLAVOR}
        mode={mode}
        themeOverride={KAGIT_TEMASI}
        renderHero={(props) => <OrnekHero {...props} />}
        renderEnvelope={(props) => <KagitZarf {...props} />}   // önerilen kanca, §8
      />
    </KagitKok>
  );
}
```

- Kategori deseni (`BackgroundPattern`) kapatılır: masa dokulu kâğıttır, üstüne desen binmez.
- Preset kendi dokusunu, kenarını, mührünü yazmaz; kitten alır.
- Metinler flavor'dan (Türkçe) gelir; yeni metin önerisi raporda i18n anahtarı olarak listelenir.

---

## 7. Yapılacaklar / yapılmayacaklar

| Yap | Yapma |
|---|---|
| Kâğıdın kenarında boşluk bırak: kart bir nesnedir | Kartı ekranın tamamına yayma |
| Adları el yazısıyla, geri kalanı serifle | El yazısıyla paragraf, tarih, düğme |
| Tek mühür, tek damga, en çok üç leke | Her köşeye süs; kalıp çiçek kümesi |
| Yaldızı düz renk kullan | Parıltı, degrade, cam (`backdrop-blur`), neon, gölgeli parlama |
| Hareketi bir kez oynat | Sürekli yüzen, nabız atan, dönen öğe |
| Kontrastı ölç, rapora yaz | "Krem üstünde açık kahve okunur" diye tahmin et |

---

## 8. Ortak dosyalara önerilen değişiklikler (uygulanmadı)

| Dosya | Ne | Neden |
|---|---|---|
| `shared/InvitationComposition.tsx` | Opsiyonel `renderEnvelope?: (props) => ReactNode`; verilmezse bugünkü `Envelope` | Kâğıt zarfı (`KagitZarf`) kompozisyona takılabilsin. Bugün yalnızca `theme.envelope` renkleri değiştirilebiliyor. |
| `shared/InvitationComposition.tsx` + `shared/palette.ts` | Opsiyonel `SectionTheme.footer` sınıfı; verilmezse bugünkü `opacity-60` / `opacity-40` | Alt bilgi kâğıt setinde ölçüldü: ad 3.01, imza 1.98 (pamuk, `is`) — AA altı. Yalnızca seçen preset etkilenir. |
| `scripts/run-check.mjs` | `loader`'a `'.webp': 'empty'` | Kit WebP içe aktarıyor; preset'ler kiti kullandığında `verify:render` yükleyemez. |
| `src/types.ts`, `index.css` | — | Değişiklik gerekmiyor. |
| `data.ts`, `TemplateRenderer.tsx`, kategori `index.ts` | Her kategori aşamasında 3 kayıt | Mevcut kayıt deseni; yapı değişmiyor. |

---

## 9. Bilinen sınırlar

- Ortak bölümlerin bazı iç öğeleri yuvarlak köşeli kalır (hediye tutarı hapları, LCV durum
  seçicisi, kişi sayacı): yarıçapları bileşenin içinde sabit. Kâğıt kartın keskin köşesiyle
  küçük bir üslup farkı yaratır.
- `surface` program akışının nokta işaretine de uygulanır; yuvarlak nokta 3 px köşeli küçük bir
  kâğıt sekmesine dönüşür. Bilinçli kabul edildi.
- Ortak alt bilgi soluktur (§8 önerisi kabul edilene kadar AA altı).
- Zarf kanca kabul edilene kadar preset'lerde ortak `Envelope` kâğıt renkleriyle çizilir.

---

## 10. Doğrulama

| Ne | Nasıl | Sonuç |
|---|---|---|
| Font denetimi | Headless Chrome, 58 font, çift yedek ölçümü | 13 eleme (§3.1) |
| Kontrast | `kontrast.ts`, doku koyulaşması dahil | En düşük metin çifti 4.52 (§2.5) |
| Zarf süresi | Gerçek zamanlı ölçüm, 360 × 780 | 956–969 ms; hareketi azalt 4–6 ms |
| Görsel | 360 px ekran görüntüleri: kit, üç set (krem, gece, kraft + uzun ad), zarf kareleri | Aşama 2 raporu |
