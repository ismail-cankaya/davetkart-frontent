# `src/components/templates/dugun/themes.ts` — Düğün bölüm temaları

> **Kullananlar:** 40 düğün şablonu (`DUGUN_THEMES.<Şablon>` → `themeOverride`)
> **Denetim:** kontrast betiği bu dosyanın dökümünü okur (bkz. [KIMLIK.md](KIMLIK.md) §6–7)

---

## 1. Neden tek dosya

Eskiden her şablon kendi `SectionTheme`'ini taşıyordu; dört şablon (`Sade`, `Manzara`,
`Sekilli`, `Modern`) ise kına ve nişanla ortak `shared/themeTokens.ts`'i kullanıyordu.
Renk ailesini tek yerde görmek ve kontrastı tek betikle denetlemek için 40 tema burada.
Kına ve nişan sonraki turda bu dosyayı okuyup bilerek ayrışabilir.

## 2. Bölüm karakteri — `kurdele()`

| Alan | Karakter | Neden |
|---|---|---|
| `base` | `theme-cormorant` | Bölüm başlıkları (`font-serif`) Cormorant Garamond olur |
| `input` | Kutu değil alt çizgi (`border-0 border-b rounded-none bg-transparent`) | Basılı LCV kartındaki "yazılacak satır" |
| `buttonPrimary` | `rounded-full tracking-[0.12em]` | Hap buton, kartın geniş aralıklı küçük başlıklarıyla aynı dil |
| `buttonGhost` | `rounded-full border` | Kişi sayısı +/− düğmeleri de daire olur |
| `surface` | Açıkta uzun yumuşak gölge, koyuda üst kenarda tek inci ışığı | Tül kart |

`uppercase` bilinçli olarak yok: ortak bölümler `lang` taşımaz, arayüz dili
İngilizceyken "Katılımımı Bildir" CSS ile "KATILIMIMI BILDIR" olurdu.

Kendi sert geometrisi olan diller (`DugunBrutal`, `DugunBlueprint`, `DugunNoir`)
`kurdele()` kullanmaz; yalnızca renk ailesini alır.

## 3. Çekirdekler

| Çekirdek | Zemin | Mürekkep | Gövde | Vurgu | Buton |
|---|---|---|---|---|---|
| `TUL` (açık) | `#f8f6f9` | `#211b2d` | `#655d74` | `#9b3a63` | mürekkep dolgu |
| `GECE` (koyu) | `#16121d` | `#f6f1f8` | `#b1a8bd` | `#eba9c6` | inci dolgu `#efe8f3` |

Şablon temaları bu iki çekirdekten türer; yalnızca zemin ve vurgu tonu şablonun
görseline göre kayar (ör. Dugun2 mersin `#4f6b55`, Gökyüzü gök mavisi zemin).

**1. tur düzeltmesi — koyuların ayrışması.** Koyu şablonların hepsi `GECE`'nin menekşe-siyahını
taşıyordu ve temas sayfasında birbirine karışıyordu. Şimdi her birinin zemin tonu farklı:

| Şablon | Ton | Zemin |
|---|---|---|
| DugunManzara | **açık** (İnci Gravür) | `#f6f3f7`, vurgu mor mürekkep `#5e3f6e` |
| DugunAurora | **açık** (Sedef) | `#f6f3f8`, vurgu orkide-şakayık `#87306a` |
| DugunKrom | **açık** (Saten Gümüş) | `#eceff3`, koyu metal degrade başlık, vurgu `#4b3f6b` |
| DugunSekilli | mersin gecesi | `#0f1714` |
| DugunModern | nötr kömür | `#0c0b0e` |
| DugunMumIsigi | sıcak toprak | `#120d0b`, vurgu şeftali-inci `#f2c6b6` |
| DugunOnyx | saf siyah | `#070708` |
| DugunSahil | gün batımı mor laciverti (video) | `#171526` |

## 4. Zarf ve harita başlığı

`kurdele()` her temaya, kendisi vermiyorsa, şunları ekler:

| Alan | Açık (`ZARF_TUL`) | Koyu (`ZARF_GECE`) |
|---|---|---|
| `envelope.paper` | tül degrade `#fbfafc → #ece7f0` | gece degrade `#241d2e → #16121d` |
| `envelope.flap` | `#e1dae7` | `#2c2438` |
| `envelope.seal` | **şakayık mum mührü** `#9b3a63`, inci kurdele | **inci mühür** `#efe8f3`, gece kurdele |
| `envelope.glow` | pudra şakayık `#f3dde7`/70 | şakayık ışığı `#eba9c6`/10 |
| `envelope.card` | beyaz, inci kenar | gece, beyaz/10 kenar |
| `mapHeader` | `#efebf2` | `#1f1a28` |

Ortak varsayılan koyu temada altın mühür ve altın ışıma basardı; kimlikte altın yok.
Zemini çekirdekten ayrılan koyular (Şekilli, Modern, Mum Işığı, Onyx, Krom) zarf kağıdını ve
harita başlığını kendi tonlarıyla verir. Kendi geometrisi olan Noir, Brutal ve Teknik Çizim
zarfı ayrıca tanımlar.

## 5. 2. turda eklenen dört dil

`DugunCini`, `DugunEbru`, `DugunMonogram`, `DugunTakvim` (`origin/main`'den geldi) artık
yerel tema taşımıyor; hepsi `kurdele()` ile tül zemin, mürekkep, şakayık vurgu alır.
Monogram'ın altın varağı inci-gümüşe döndü.

## 6. Tailwind notu

- Sınıflar literal yazılır; hex'i şablon dizgisiyle üretmek derlenmeyen sınıf demektir.
- `DecoHero` sayaç ayırıcısını `theme.divider.replace('bg-', 'divide-')` ile üretir.
  `divide-[#d9d0e2]/22` sınıfı Deco temasının JSDoc'unda literal geçer ki derlensin.
