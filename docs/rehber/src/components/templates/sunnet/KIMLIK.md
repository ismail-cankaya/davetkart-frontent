# Sünnet kategorisi — "Şehzade Şenliği" kimliği

> **Kapsam:** `src/components/templates/sunnet/**` (28 şablon, `flavors.tsx`, `themes.ts`, `parts/`)
> **Denetim:** `npm run check`; sünnet duman testi (28 × 4 senaryo); kontrast betiği (346 bölüm + 36 hero çifti); statik önizleme (360 / 768 / 1280)

---

## 1. Kimlik özeti

Sünnet artık "koyu zemin + şampanya altın" varsayılanıyla değil, **sünnet
kıyafetinin kendisiyle** konuşur: saten mavi pelerin, kırmızı "Maşallah"
kuşağı, üstündeki sırma ve pullar, kalpaktaki tüylü sorguç, yakadaki nazar
boncuğu. Kategori iki saatte yaşar: **gündüz şenliği** (şeker beyazı otağ)
ve **gece şenliği** (kraliyet mavisi panayır).

| Kardeş | Onların dili | Sünnetin farkı |
|---|---|---|
| Düğün | fildişi + altın, alyans, dalga | soğuk şeker beyazı, sax + nar, sorguç |
| Kına | bordo, mandala, kına | kırmızı yalnızca **kuşak**ta; zemin mavi |
| Mezuniyet | lacivert + bronz, defne | doygun sax (lacivert değil), pirinç süs |
| Baby shower | pastel gök, bulut, ay | doygun, bayramlık renkler; nazar |
| Doğum günü / parti | balon, konfeti, neon | otağ saçağı, kandil, kuşak |

## 2. Palet

| Ad | Hex | Rol |
|---|---|---|
| Sax mavisi | `#2348c6` | Pelerin; ana mavi, açık zeminde metin olabilir |
| Nazar laciverti | `#101a4a` | Mürekkep, başlıklar |
| Nar kırmızısı | `#c3263c` | Kuşak dolgusu (açık zeminde metin: `#b8233a`) |
| Pirinç | `#e9b23a` | Sırma, pul, püskül — açık zeminde **asla metin** |
| Fener | `#f2c14e` | Koyu zeminde vurgu metni |
| Nazar turkuazı | `#2aa7b8` | Halka (açık zeminde metin: `#0d6f80`) |
| Şeker beyazı | `#f5f7fd` | Gündüz zemini |
| Gece | `#0e1650` | Gece zemini (şablonlarda `#070d33`–`#1b2f9e` aralığı) |

Ayrıntı ve 28 tema: [themes](themes.md).

## 3. Tipografi

| Rol | Yazı | Tavır |
|---|---|---|
| Şehzadenin adı | Playfair Display **italik** 600, 2.6rem → 7xl | Bayramlık, iri, hafif yaylı |
| Aile adı | Inter 600, büyük harf, `tracking-[0.3em]`, vurgu rengi | Adın altında ikinci rol |
| Kuşak etiketi | Inter 600, büyük harf, `tracking-[0.28em]`, kuşak üstünde | Kategorinin tipografik aygıtı |
| Sayaç | Playfair 600, `tabular-nums` | Kandil penceresinde |

Cormorant (düğünün ince zarafeti) kategoriden **çıkarıldı**: Yıldız,
Maşallah ve Deco'daki `theme-cormorant` kaldırıldı.

## 4. Motif ve hareket

| Motif | Nerede |
|---|---|
| **Sorguç** (tüy + nazar mücevheri) | Süs: zarf mührü, 21 ortak hero, 2 kategori hero'su |
| **Kuşak** (çentikli saten şerit, sırma dikiş) | Şehzade hero'sunda başlık; Maşallah'ta sahnenin omurgası |
| **Otağ saçağı + kandil feneri** | Klasik (gündüz), Lunapark (gece) |
| **Nazar boncuğu** | Bölüm deseni (her şablon), Modern'in grafik imzası |
| **Kemerli pencere** | Kandil sayaç |

Hareket karakteri **"şenlik sallantısı"**: girişler yukarıdan sarkar ya da
ortadan açılır, yaylı oturur (sorguç, saçak, kuşak, ad). Sürekli döngüler
az ve yavaş: tüy salınımı, fener ipi ve ışığı, kuşakta arada bir saten
parıltısı, nazar yörüngesi.

## 5. Hangi şablon kendi hero'sunu aldı, neden

| Şablon | Hero | Neden |
|---|---|---|
| Klasik | `SehzadeHero` + `OtagBackdrop` | Vitrin şablonu; kategorinin ilk izlenimi buradan kurulur |
| Modern | `SehzadeHero` + `NazarRings` | Summary'nin pembe ışıklı genel düzeni yerine kategori düzeni |
| Yıldız | `SehzadeHero` (hale) | Video korunur; ön plan kategoriye geçer |
| Lunapark | `SehzadeHero` (saçak, hale) | Gece panayırı = otağın gece karşılığı |
| Aurora, Krom | `SehzadeHero` (hale) | Tasarım dili şablonları; 9 kategoride aynı Summary'yi taşıyordu — ayrışma ön planda |
| Maşallah | `KusakHero` | Konseptin adı kuşak; kuşak sahnenin kendisi olmalı |
| Ortak hero'lu 21 şablon | ortak (değişmedi) | Kendi tasarım dilleri var; tema + parametre + arka planla aileye geçtiler |

Şehzade hero'su altı şablona hizmet eder; ayrışmayı sahne taşır (gündüz
otağı, nazar grafiği, şato videosu, panayır, aurora, krom).

## 6. Kontrast

Betik `node_modules/.cache/smoke-sunnet/contrast.ts` (git dışı) temaları
`themes.ts`'ten içe aktarır, yarı saydam katmanları zemine karıştırır.
Bölüm zemini en kötü hâliyle de hesaplanır (kategori deseni ~%4.5 vurgu).
**Sonuç: 346 bölüm + 36 hero çifti, eşik altı 0.**

### 6.1 Bölümler — tema başına en düşük çift

| Tema | Metin / bölüm zemini | Metin / kart | Düğme · seçim | Input |
|---|---|---|---|---|
| `SUNNET_AURORA` | 8.05 · body | 6.65 · body | 8.97 · buttonPrimary | 5.30 · input placeholder |
| `SUNNET_BENTO` | 6.30 · body | 7.18 · body | 7.15 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_BLUEPRINT` | 7.10 · accent | 6.01 · accent | 9.39 · buttonPrimary | 5.10 · input placeholder |
| `SUNNET_BRUTAL` | 5.45 · accent | 6.29 · accent | 5.73 · buttonPrimary | 5.43 · input placeholder |
| `SUNNET_CIZGI` | 5.45 · accent | 6.20 · accent | 6.02 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_DECO` | 7.98 · body | 7.01 · body | 9.27 · buttonPrimary | 5.38 · input placeholder |
| `SUNNET_DOKUMA` | 5.95 · body | 6.89 · body | 7.15 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_FILM` | 7.65 · accent | 6.68 · accent | 8.44 · buttonPrimary | 5.27 · input placeholder |
| `SUNNET_GAZETE` | 5.39 · accent | 6.14 · accent | 6.02 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_HERBARYUM` | 5.08 · accent | 5.72 · accent | 5.58 · accentBg üstü | 5.65 · input placeholder |
| `SUNNET_KAGIT` | 6.18 · body | 7.12 · body | 7.15 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_KINETIK` | 6.61 · accent | 7.91 · accent | 10.79 · buttonGhost | 6.27 · input placeholder |
| `SUNNET_KLASIK` | 5.45 · accent | 6.20 · accent | 6.02 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_KROM` | 7.89 · body | 6.58 · body | 11.44 · buttonPrimary | 4.60 · input placeholder |
| `SUNNET_LUNAPARK` | 8.73 · body | 7.92 · body | 11.03 · buttonPrimary | 4.90 · input placeholder |
| `SUNNET_MASALLAH` | 9.33 · body | 8.73 · body | 9.39 · buttonPrimary | 5.56 · input placeholder |
| `SUNNET_MERMER` | 5.99 · body | 6.83 · body | 7.15 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_MODERN` | 5.13 · accent | 5.72 · accent | 5.58 · accentBg üstü | 5.46 · input placeholder |
| `SUNNET_PANO` | 7.63 · body | 6.70 · body | 10.49 · buttonPrimary | 5.28 · input placeholder |
| `SUNNET_PLAK` | 7.73 · body | 6.55 · body | 10.02 · buttonPrimary | 4.99 · input placeholder |
| `SUNNET_POSTA` | 5.45 · accent | 6.14 · accent | 6.02 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_RISO` | 6.32 · accent | 7.27 · accent | 7.15 · accentBg üstü | 6.24 · input placeholder |
| `SUNNET_SULUBOYA` | 6.15 · body | 6.82 · body | 7.15 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_TERRAZZO` | 5.43 · accent | 6.14 · accent | 6.02 · accentBg üstü | 5.43 · input placeholder |
| `SUNNET_UFUK` | 10.63 · body | 9.77 · body | 10.40 · buttonPrimary | 4.94 · input placeholder |
| `SUNNET_VITRAY` | 7.86 · body | 6.70 · body | 9.11 · buttonPrimary | 5.06 · input placeholder |
| `SUNNET_YILDIZ` | 8.18 · body | 7.60 · body | 10.02 · buttonPrimary | 5.75 · input placeholder |
| `SUNNET_YILDIZ_HARITASI` | 8.01 · body | 7.06 · body | 10.49 · buttonPrimary | 5.56 · input placeholder |

Tüm satırlar eşiği geçer (normal metin 4.5, büyük başlık 3). "Düğme · seçim" sütunu birincil düğme, hayalet düğme ve `accentBg` üstündeki LCV/hediye seçim yazısının en düşüğüdür.

### 6.2 Hero çiftleri (kategori hero'ları)

| Şablon | Çift | Ön | Zemin (tahmini) | Oran | Eşik |
|---|---|---|---|---|---|
| Klasik | ad (lacivert) | `#101a4a` | `#edf0fb` | 14.55 | 3 |
| Klasik | aile (nar) | `#b8233a` | `#edf0fb` | 5.53 | 4.5 |
| Klasik | mesaj (body) | `#4b557a` | `#edf0fb` | 6.41 | 4.5 |
| Klasik | saat/mekân (body) | `#4b557a` | `#edf0fb` | 6.41 | 4.5 |
| Klasik | kuşak yazısı | `#ffffff` | `#c3263c` | 5.73 | 4.5 |
| Modern | ad | `#0c2340` | `#eaf4f8` | 14.13 | 3 |
| Modern | aile (turkuaz) | `#0d6f80` | `#eaf4f8` | 5.22 | 4.5 |
| Modern | mesaj (body) | `#4a5b70` | `#eaf4f8` | 6.22 | 4.5 |
| Modern | kuşak yazısı | `#ffffff` | `#0d6f80` | 5.83 | 4.5 |
| Yıldız | ad (beyaz) | `#ffffff` | `#343b5f` | 10.84 | 3 |
| Yıldız | aile (fener) | `#f2c14e` | `#343b5f` | 6.46 | 4.5 |
| Yıldız | mesaj (body) | `#aab4dc` | `#343b5f` | 5.30 | 4.5 |
| Yıldız | kuşak yazısı | `#fff4dc` | `#c3263c` | 5.25 | 4.5 |
| Maşallah | ad | `#fff3e2` | `#692d27` | 9.56 | 3 |
| Maşallah | başlık/aile (pirinç) | `#f2c45a` | `#692d27` | 6.39 | 4.5 |
| Maşallah | mesaj (body) | `#d6b4ab` | `#692d27` | 5.47 | 4.5 |
| Maşallah | kuşak nakışı (dekoratif, ≥32px) / #8c1427 | `#f7d27a` | `#8c1427` | 6.44 | 3 |
| Maşallah | kuşak nakışı (dekoratif, ≥32px) / #b51f35 | `#f7d27a` | `#b51f35` | 4.50 | 3 |
| Maşallah | kuşak nakışı (dekoratif, ≥32px) / #c3263c | `#f7d27a` | `#c3263c` | 3.95 | 3 |
| Maşallah | kuşak nakışı (dekoratif, ≥32px) / #8f1529 | `#f7d27a` | `#8f1529` | 6.26 | 3 |
| Lunapark | ad | `#ffffff` | `#271f3f` | 15.51 | 3 |
| Lunapark | aile (fener) | `#ffc456` | `#271f3f` | 9.81 | 4.5 |
| Lunapark | mesaj (body) | `#bcb5e4` | `#271f3f` | 8.03 | 4.5 |
| Lunapark | kuşak yazısı | `#fff4e6` | `#c3263c` | 5.28 | 4.5 |
| Aurora | ad | `#ffffff` | `#10285d` | 14.15 | 3 |
| Aurora | aile (turkuaz) | `#6fd6e2` | `#10285d` | 8.35 | 4.5 |
| Aurora | mesaj (body) | `#a9b4dc` | `#10285d` | 6.91 | 4.5 |
| Aurora | kuşak yazısı | `#0a1242` | `#d6f4f8` | 15.41 | 4.5 |
| Krom | ad degrade #f4f7ff | `#f4f7ff` | `#212744` | 13.62 | 3 |
| Krom | ad degrade #b7c8f4 | `#b7c8f4` | `#212744` | 8.75 | 3 |
| Krom | ad degrade #8fe3ec | `#8fe3ec` | `#212744` | 9.99 | 3 |
| Krom | aile (accent) | `#9fd8f0` | `#212744` | 9.42 | 4.5 |
| Krom | mesaj (body) | `#a3acc5` | `#212744` | 6.44 | 4.5 |
| Krom | kuşak yazısı / #e6eeff | `#0a1018` | `#e6eeff` | 16.40 | 4.5 |
| Krom | kuşak yazısı / #b7c8f4 | `#0a1018` | `#b7c8f4` | 11.44 | 4.5 |
| Krom | kuşak yazısı / #8fe3ec | `#0a1018` | `#8fe3ec` | 13.06 | 4.5 |

Hero tahmini: metnin oturduğu bölgenin rengi = degrade durağı + atmosfer
katmanlarının tepe opaklığı + okuma halesi. Videolu Yıldız'da kare
bilinmez; en parlak orta ton `#8a96c8` varsayıldı.

### 6.3 Ortak hero parametreleri (hero'nun kendi dolgusu)

| Şablon | Çift | Oran |
|---|---|---|
| Brutal | `#ffffff` / nar `#c3263c` · lacivert / pirinç `#e9b23a` | 5.73 · 8.59 |
| Plak | etiket `#fff4dc` / `#c3263c` | 5.25 |
| Pano | kanat yazısı `#f5f7fd` / `#141c52` | 14.88 |
| Blueprint | çizgi `#e6ecff` · pirinç `#f2c14e` / `#132a7a` | 10.86 · 7.63 |
| Kinetik | beyaz · `#ffc94a` · `#d3dbff` / `#1b2f9e` | 10.79 · 7.04 · 7.88 |

### 6.4 Dekoratif, eşik dışı bırakılanlar

Hiçbir **metin** eşik altında değil. Yalnız süs: pirinç iplik/pul/püskül
açık zeminde (Dokuma, Posta, Terrazzo, saçak) ve kuşak sırma dikişi —
bilgi taşımaz.

## 7. Hareketi azalt

| Kaynak | Nerede | Nasıl susar |
|---|---|---|
| Tüy salınımı `sunnet-sway` | Sorguç (her yerde) | `@media (prefers-reduced-motion)` + `data-atmosphere` |
| Fener ipi `sunnet-sway-hang`, ışığı `sunnet-glow` | Klasik | aynı |
| Saten parıltı `sunnet-sheen` | Kuşak, Maşallah bandı | aynı; dinlenme konumu şerit dışı |
| Nazar yörüngesi `sunnet-spin` | Modern | aynı |
| Saçak inişi, sorguç girişi, kuşak açılışı, ad yükselişi (Motion `y`/`rotate`/`scaleX`) | Kategori hero'ları | `MotionConfig reducedMotion="user"` transform'u atlar |
| Opaklık girişleri | Kategori hero'ları | Kalır (hareket değil) |
| Kaydırma ipucu `animate-bob-down-6` | Kategori hero'ları | index.css listesinde |
| Parçacıklar (havai fişek, balon, konfeti, kabarcık, toz, çizgi) | Yıldız, Maşallah, Lunapark, Aurora, Krom, Vitray | Ortak `ParticleField`: tek durağan kare |
| İşaretçi parallax'ı | HeroStage'li şablonlar | Ortak `usePointerParallax`: dinleyici kurulmaz |
| Atmosfer (Halo, AuroraMesh, SilkVeil, GoldSheen, GodRays, LightLeak, Iridescent) | HeroStage'li şablonlar | `data-atmosphere` → index.css |
| Video | Yıldız | Ortak `VideoBackdrop`: poster |
| Ortak hero döngüleri (marquee, plak, film/mermer/vitray parıltısı, terrazzo, Ufuk) | 21 şablon | Kendi `useReducedMotion` / index.css kuralları (değişmedi) |
| Sayaç saniyesi | Tümü | Metin değişimi — hareket değil |

## 8. Görseller ve telif

Yeni görsel varlıkların tamamı **kodla çizilmiş özgün SVG**:
`SunnetKlasik/assets/sunnet-klasik-kapak.svg`,
`SunnetModern/assets/sunnet-modern-kapak.svg` ve `parts/` altındaki çizimler
(sorguç, nazar, saçak, fener, kuşak). İnternetten görsel/font indirilmedi;
marka, karakter ya da tanınmış bir eser kopyası yok. Mevcut `SunnetYildiz`
ve `SunnetUfuk` kapakları olduğu gibi kaldı.
