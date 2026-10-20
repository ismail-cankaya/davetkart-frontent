# "Hikâye Kitabı" konsepti

> **Kapsam:** 9 kategori × 2 preset. Mevcut preset'ler silinmez, değişmez.
> **Dal:** `design/kitap` · **Kit:** `src/components/templates/konsept/kitap/` · **Tarih:** 2026-10-16
> **Ortak kurallar:** [`KONSEPT-ORTAK.md`](./KONSEPT-ORTAK.md) · **Durum:** Aşama 5 kararları işlendi (2026-10-20, §11).

---

## 1. Fikir

Davet, hikâyeyi anlatan **ciltli bir kitaptır**: bez kapak, iç kapak, bölümler, künye. Kutlanan olay
hikâyenin **yeni bölümüdür** — nişan bir önsöz, düğün birinci bölüm, mezuniyet bir cildin sonu.

Konseptin taşıyıcısı malzeme değil **kitap tipografisidir**: başharf, sayfa başı, sayfa numarası,
aralıklı büyük harf, bölüm numarası, ortalı başlık. İlk ekran koyu bez kapaktır; içerisi şamua kâğıttır.

| Mevcut dil | Ne yapıyor | Kitap ondan nasıl ayrışıyor |
|---|---|---|
| Kâğıt & Mühür / Kâğıt seti | Davetiye kartı, mum mühür, tırtıklı kenar, zarf | Kart değil kitap; mühür, tırtık, suluboya **yok**; bez cilt ve bölüm kurgusu |
| Gazete Manşeti | Haber dili, sütun, manşet | Haber değil anlatı; tek sütun, kitap sayfası |
| Varak Monogram | Sıcak folyo arma, parlayan varak | Yaldız yalnızca kapak başlığında ve **düz renk**; arma yok, parlama yok |
| Herbaryum | Arşiv föyü, etiket | Föy değil cilt; bitki yok |

| Kardeş konsept | Fark |
|---|---|
| Sergi Açılışı | Sergi asimetrik, beyaz, grotesk; Kitap simetrik, koyu kapak + şamua, serif |
| Günün Haritası | Harita serbest yerleşimli ve çok renkli; Kitap ortalı, iki tonlu |

## 2. Palet

### 2.1 Bez cilt (preset başına bir tane — ilk ekran)

| Ad | Hex | Üstünde yaldız | Üstünde şamua |
|---|---|---|---|
| `sise` (şişe yeşili) | `#1F3A2E` | 5.21 | 10.27 |
| `sarap` | `#5B1E24` | 5.36 | 10.56 |
| `lacivert` | `#1C2541` | 6.38 | 12.58 |

### 2.2 Sayfa

| Ad | Hex | Rol | Kontrast (şamua üstünde, hesaplandı) |
|---|---|---|---|
| `samua` | `#F2EAD3` | İç sayfa zemini (sarımsı kitap kâğıdı) | — |
| `murekkep` | `#231F1A` | Başlık, gövde | 13.64 |
| `soluk` | `#5E5446` | Sayfa başı, sayfa no, ikincil metin | 6.17 |
| `kurdele` | `#8C2F2F` | Başharf, ayraç kurdelesi, düğme | 6.82 (üstünde şamua 6.82) |
| `yaldiz` | `#C9A35C` | **Yalnızca** kapakta, koyu bez üstünde | — |

Kural:

1. Sayfa `samua`dır. Kâğıt kitinin `pamuk #F3ECDF` / `fildisi #FAF6EE` tonları kullanılmaz.
2. Yaldız **düz renk**tir: degrade, parlama, ışık süpürmesi yok (Monogram'ın imzası).
3. Kapak koyu, içerisi açık: tema iki ayrı yüzey taşımaz — bölümler şamua üstündedir; koyu bez
   yalnızca hero'dadır (bkz. §4.2).

## 3. Yazı

### 3.1 Font denetimi

Satır ve yöntem `SERGI-KONSEPTI.md §3.1` ile aynı. Ekran görüntüsü: `font-denetimi/kitap.png`.

| Sonuç | Fontlar |
|---|---|
| **Elendi** | IM Fell English ve IM Fell English SC (`ğ Ğ ş Ş İ` yok — ölçümle bulundu) |
| Glif tam, seçilmedi | Libre Baskerville (geniş, ekranda ağır); Crimson Pro (EB Garamond'a yakın — Kâğıt'ın gövdesi); Sorts Mill Goudy, Cardo (küçük boyda ince); Alegreya / Alegreya SC (italikte `&` sonrası boşluk dar okunuyor — yedek seçenek); Spectral / Spectral SC (iyi, ama Caslon kitap kimliğini daha açık taşıyor — yedek) |

### 3.2 Seçilenler

| Rol | Font | Kural |
|---|---|---|
| Kapak başlığı, bölüm başlığı, başharf | **Libre Caslon Display** 400 | **≥ 32 px** (kıl çizgileri ince; küçükte kontrast düşer) |
| Gövde, adlar (iç sayfa), italik | **Libre Caslon Text** 400 / 700 / italik | Gövde 16 px, satır 1.6; sola yaslı + `text-wrap: pretty` (iki yana yaslama kelime aralarını açtı, §11) |
| Sayfa başı, bölüm no, etiketler | Libre Caslon Text 400, büyük harf | 10–12 px, `tracking-[0.2em]` (gerçek küçük büyük harf yok; aralıklı büyük harf kullanılır) |

Kurallar:

1. Başka font yok; bölüm başlıkları `[&_.font-serif]` ile Caslon Display'e çevrilir.
2. Başharf (`::first-letter`) yalnızca **bir** paragrafta, kurdele renginde. `I`/`İ` ayrımı veride
   nasılsa öyle kalır (Işıl → `I`).
3. Büyük harf CSS ile (`lang="tr"`).

### 3.3 Yükleme

`konsept/kitap/fontlar.ts`: iki aile tek `<link>`, `display=swap`.

## 4. Düzen kuralları

### 4.1 Kapak (hero)

- **Simetrik**, dikey eksende. Üstte aralıklı büyük harf etiket (`BÖLÜM I`), ortada başlık (adlar),
  altında ince yaldız çizgi ve italik alt satır, en altta tarih.
- Bez dokusu tek WebP (kit görseli, ≤ 40 KB toplam), `multiply` — çalışma anında filtre yok.
- Kitap sırtı ve ayraç kurdelesi isteğe bağlı süstür; bilgi taşımaz.
- **Zarf modülü açıksa** giriş kapısı kapağın kendisidir (`renderEnvelope`): kapak sol menteşeden açılır.
  Zarf kapalıysa kapak doğrudan hero'dur; kapı hiç görünmez.

### 4.2 İç sayfalar

- Bölümler şamua üstünde, ortalı tek sütun (en çok 34 em). Masaüstünde sütunun iki yanında boşluk —
  sayfa kenarı hissi; ikinci sütun yok.
- Bölüm başlıkları (flavor kopyası) kitap dilindedir ve **açık modüllerden numaralanır**:
  `I · Davet`, `II · Akış`, `III · Mekân`… Kapalı modül numara atlatmaz (`useMemo` ile hesap).
- Sayfa başı (`BÖLÜM II · Gülşen & Çağrı`; adlar kullanıcının yazdığı gibi, büyük harfe çevrilmez) ve sayfa numarası süs olarak yalnızca preset'in kendi
  çizdiği alanlarda (hero, backdrop) bulunur; ortak bölümlerin içine girmez.
- **İçindekiler:** programı noktalı satırlarla "içindekiler" gibi dizmek **onaylandı** (K8). Ortak
  `Timeline`'a tema üzerinden bir görünüm seçeneği eklenir (`design/konsept-ortak`); gelene kadar başlık
  *İçindekiler* olur, düzen ortak kalır. Seçenek gelince düğün dahil bütün Kitap preset'leri kullanır.

### 4.3 Preset eksenleri (iki preset farklı eksenlerden)

| Eksen | Kapak | Uygun |
|---|---|---|
| **Bez cilt** | Tam ekran koyu bez kapak, yaldız başlık | Düğün, nişan, mezuniyet |
| **İç kapak** | Kapak yok; şamua iç kapak sayfası (künye düzeni: başlık, çizgi, yayın yeri ve yılı = mekân ve tarih) | Düğün, kurumsal, kına |
| **Masal kitabı** | Süslü çerçeveli kapak, basit özgün figür (taç, yıldız, ay) | Sünnet, baby shower, doğum günü |
| **Anı defteri** | Lastikli/kurdeleli defter kapağı, el yazısı yok — etiket kâğıdı üstünde serif | Kına, parti, doğum günü |

## 5. Süsleme dili

| Öğe | Kural |
|---|---|
| Fleuron (❦, ⁂) | Bölüm sonunda en çok bir; SVG ya da fontun kendi glifi (glif denetlenir) |
| İnce çizgi | Başlık altında 40–60 px, ortalı |
| Başharf | Tek; kurdele renginde |
| Çerçeve | Yalnızca *masal kitabı* ekseninde, ince çift çizgi; köşe süsü özgün |
| Yasak | Mum mühür, tırtıklı kenar, suluboya, kurutulmuş çiçek (Kâğıt); varak parlaması (Monogram); harita, çerçeveli tablo (kardeşler) |

## 6. Hareket dili

Karakter: **kapak açılır, sayfa çevrilir**. Ağır, kâğıt gibi.

| Hareket | Süre | Nasıl |
|---|---|---|
| Kapak açılır (zarf modülü) | 0.8 s, `ease.inOut` (`ease.out` kapağı ilk 150 ms'de ekrandan çıkarıyordu) | `rotateY` 0 → −160°, `perspective`, sol menteşe; dokunuştan kapının kalkmasına ≤ 1 s |
| Kapak belirir (zarfsız) | 0.5 s | opaklık + ölçek 0.98 → 1 |
| Ayraç sarkar | 0.4 s, 0.3 s gecikme | y −100% → 0 |
| Bölüm girişi | 0.4 s | opaklık + y 10 → 0, bir kez |

Yalnızca `transform`/`opacity`. Hareket azaltıldığında kapak anında kalkar, hiçbir şey dönmez.

## 7. Kategori yorumları

| Kategori | Uyum | Yorum |
|---|---|---|
| Düğün | ● | *Birinci Bölüm* — bez cilt; *iç kapak* sade alternatif |
| Nişan | ● | *Önsöz* — hikâyenin başı |
| Doğum günü | ● | *Yeni Bölüm* (yaş veride yok, sayı yazılmaz); çocukta masal kitabı |
| Mezuniyet | ● | *Bir cildin sonu*; `names` = Mezun & Okul — okul kapakta yayınevi yerine |
| Baby shower | ● | *İlk Sayfa* — masal kitabı, açık bez renkleri yerine `lacivert` |
| Sünnet | ● | *Şehzade'nin Masalı* — masal kitabı, taç figürü |
| Kına | ◐ | *Gelinin Defteri* — anı defteri ekseni, `sarap` |
| Kurumsal | ◐ | *İç kapak*: kurum = yayınevi, etkinlik = eser adı; yıldönümü sayısı veride yoksa yazılmaz |
| Parti | ◐ | *Bu Gecenin Hikâyesi* — anı defteri |

## 8. Yapılacaklar / yapılmayacaklar

| Yap | Yapma |
|---|---|
| Kitap tipografisi: başharf, aralıklı büyük harf, ortalı başlık | Kâğıt kitinin parçalarını (`KagitLevha`, `MumMuhur`, dokular) kullanma |
| Numaraları açık modüllerden hesapla | Veride olmayan sayı (yaş, cilt no, sayfa sayısı) yaz |
| Koyu kapak → şamua iç | İç sayfaları koyu yap, kapağı açık yap |
| Düz yaldız | Parlayan, degrade yaldız |

## 9. Telif

- Tanınmış yayınevi ve dizilerin kapak düzenleri taklit edilmez (üç bantlı cep kitabı, klasikler
  dizisi kapakları vb.); yayınevi adı ve logosu yok.
- Gerçek kitap adı, telifli metinden alıntı yok. Sabit metinler özgündür.
- Masal figürleri özgün ve basittir (taç, yıldız, ay); tanınmış bir çizerin ya da karakterin taklidi değildir.

## 10. Kit (`konsept/kitap/`)

Önerilen: `palet.ts`, `fontlar.ts`, `tema.ts`, `BezKapak.tsx` (doku + başlık), `KapakKapisi.tsx`
(zarf modülü), `bolumBasliklari.ts` (açık modüllerden numaralı başlıklar), `Fleuron.tsx`, `doku/bez.webp`.

## 11. Pilot kararları (Aşama 5, 2026-10-20)

Kullanıcı düğün pilotundaki bütün önerileri onayladı.

| # | Karar |
|---|---|
| K7 | **İç Kapak'ın zarf kapağı `lacivert`.** `sarap` kınanın kapağıdır; aynı konseptte iki kategori aynı kapağı taşımaz. Düğün kimliğinin laciverti sünnete bırakması eski düğün ailesi içindir |
| K8 | **İçindekiler** görünümü onaylandı (§4.2) |
| — | Kapak açılış eğrisi `ease.inOut`, süre 0.8 s (§6) |
| — | Alt metin sola yaslı + `text-wrap: pretty` (§3.2) |
| — | Olduğu gibi kalır: kapakta "Birinci Bölüm", ilk sayfada "Bölüm I", süs sayfa numarası "1", bölüm adları *İçindekiler · Yer ve Zaman · Resimli Sayfalar · Armağan · Cevabınız*; zarf açıkken Birinci Bölüm'ün hero'su yalnızca ilk sayfadır (kapak zaten kapıdır) |
