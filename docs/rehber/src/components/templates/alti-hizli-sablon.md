# Altı hızlı şablon — videosuz animasyonlu davetiyeler

> **Tarih:** 5 Kasım 2026 · **Frontend dalı:** `design/claude-davetiye`
> Kayıt: `src/components/templates/lazyPresets.ts` → `LAZY_ALTI_PRESETS` · Katalog: `src/data.ts` (`TEMPLATE_PRESETS` sonu)

Oturum ~50 dakikalık bir süre sınırıyla, soru sorulmadan yürütüldü. Altı şablon paralel yazıldı; hiçbiri video
render etmez, hiçbiri `minimumTier` almaz (her planda yayınlanır). Animasyonlar yalnızca CSS 3B, SVG çizgi
(`pathLength`), canvas 2B ve `motion` ile yapılır — three.js / WebGL kullanılmaz.

---

## 1. Şablonlar

| Id | Klasör | Fikir | Teknik |
|---|---|---|---|
| `dugun-kum-saati` | `dugun/DugunKumSaati/` | Gece-espresso zeminde altın kum taneleri; kum saati akar, kaydırdıkça kum dökülerek adları ve tarihi yazar. | Canvas 2B: arka planda düşen taneler (`kumMotoru.ts` → `useCanvasLoop`), hero'da cam silueti, cama kırpılmış kum, çukurlaşan üst yüzey, koni yığın ve akan tane dizisi. Tek bir "kum" değeri (açılışta 0 → 0,3 + kaydırma) her şeyi sürer. |
| `dugun-origami-turna` | `dugun/DugunOrigamiTurna/` | Washi kâğıt üzerinde bir kare katlanarak turnaya dönüşür; kaydırınca bir turna sürüsü bölümlerin üzerinden uçar. Sumi mürekkep + tek vermilyon hanko mührü. | CSS 3B: `preserve-3d` kutuda 8 üçgen panel, 5,2 sn'lik tek zaman çizelgesinde `clip-path` + `rotateX/Y` ile kat izlenimi. Sürü: `heroExit`/`progress`'e bağlı 6 SVG turna. Washi: SVG gürültü filtresi + lif gradyanları. |
| `kina-mehndi` | `kina/KinaMehndi/` | Bir avuç içinde ince kına desenleri (mandala, çiçek, sarmaşık, parmak bantları, bilezik) kendiliğinden çizilir. Koyu kına kahvesi + altın. | SVG çizgi animasyonu: `motion` `pathLength` 0 → 1, kademeli. Nokta halkaları sonradan belirir; yanlardaki altın sarmaşıklar kaydırma `progress`'iyle büyür. |
| `dogum-gunu-mumlar` | `dogum-gunu/DogumGunuMumlar/` | Pasta ve titreyen 5 mum; misafir dokunarak tek tek söndürür, hepsi sönünce konfeti patlar ve davetiye açılır. "Atla" butonu var. | CSS/SVG pasta, CSS keyframe alevler, `motion` duman; canvas 2B konfeti (140 parça, ~1,9 sn). Kapı `role="dialog"`, arkadaki davetiye `inert`. Mumlar `aria-label="Mumu söndür"` taşıyan butonlardır. |
| `sunnet-atli-karinca` | `sunnet/SunnetAtliKarinca/` | Gece lunaparkı: ışıklı, dönen, atları inip çıkan bir atlı karınca; her at bir bilgi kartı (tarih, saat, mekân, program) taşır. | Saf CSS 3B halka: 12 dilimli tente, ampuller, direk, platform, 6 SVG at. Kartlar halkaya ters dönerek hep izleyiciye bakar, arkadakiler derinliğe göre solar. Yarıçap `clamp(104px, 33cqw, 168px)`. |
| `kurumsal-terminal` | `kurumsal/KurumsalTerminal/` | Koyu terminal penceresi; `$ event --date`, `$ venue --map`, `$ agenda --list` komutları harf harf yazılır, çıktılar satır satır akar, imleç yanıp söner. LCV formu bir komut istemi gibi görünür. | Tek sayaç + adım başına bir `setTimeout`. Mürekkep laciverdi zemin, fildişi metin, çelik mavisi komut, kehribar `$` ve imleç (yeşil değil). Tam metin `sr-only` blokta; görsel pencere `aria-hidden`. |

## 2. Ortak kurallar (altısında da)

- **Desen:** `InvitationComposition` + kendi `SectionTheme`'i (`themeOverride`) + kategori flavor'ından türetilmiş
  flavor + `renderBackdrop` / `renderHero` (örnek: `dugun/DugunFener`). Timeline, Details, Gallery, RSVPForm
  bölümlerini kompozisyon çizer; boş veri olan bölüm orada gizlenir.
- **`mode === 'preview'`:** döngü yok — son kare statik çizilir (kum saati tek kare, turna katlanmış, desen tam
  çizili, mum kapısı hiç gösterilmez, karınca −18°'de durur, terminal satırları anında görünür).
- **`prefers-reduced-motion`:** `useReducedMotion` ile önizlemeyle aynı statik hâle düşer; doğum gününde konfeti
  ve duman atlanır, son mum sönünce davetiye hemen açılır.
- **Mobil:** 390 px genişlik öncelikli; canvas'larda `devicePixelRatio` en fazla 2.
- **Temizlik:** rAF, zamanlayıcı ve dinleyiciler unmount'ta kaldırılır.
- **Kapak görselleri:** `public/images/sablonlar/<id>.svg` — **geçici** düz SVG yer tutucular (ad + renk).
  Gerçek ekran görüntüsü kapakları üretilmedi.

## 3. Bilinen sınırlar

- **Hiçbiri tarayıcıda gözle denenmedi.** `npm run lint`, `npm run build` ve `npm run verify:render` geçti;
  ama 390 px yerleşim, animasyon zamanlaması ve 3B görünüm görsel olarak kontrol edilmedi. İlk iş bu olmalı.
- **Kum Saati:** dökülen kum miktarı kalan süreden değil açılış animasyonu + kaydırmadan gelir (geri sayım
  metin olarak `HeroCountdown`'dadır). Arka plan döngüsü davetiye açık kaldıkça sürer; taneler `Math.random`
  kullandığı için her yüklemede birebir aynı görünmez.
- **Origami Turna:** kat, gerçek kâğıt katlama değil stilize bir biçim dönüşümüdür. Hero'ya `revealed` bilgisi
  gelmediği için zarf açıkken katlanma zarfın arkasında oynayabilir. Canlı modda turnanın salınımı ve sürünün
  kanat çırpışı durmadan döner.
- **Kına Deseni:** el silueti elle çizilmiş yaklaşık bir şekildir (anatomik değil). Yan sarmaşıklar
  `preserveAspectRatio="none"` kullandığından çok uzun/kısa ekranlarda yapraklar hafif bozulur. Çizim ~5–6 sn sürer.
- **Mumları Üfle:** mum kapısı ortak zarfın yerini alır; şablon davetiyeyi `showEnvelope: false` ile çizer
  (iki kapı art arda gelmesin diye). Kapı her açılışta yeniden gösterilir (hatırlanmaz). Konfeti boyutu
  patlama başında bir kez okunur.
- **Atlı Karınca:** halka, kart ve solma üç ayrı CSS animasyonudur; aynı anda başladıkları için hizalıdırlar,
  arka planda kalan sekmede çok az kayabilir. Arkadaki atlar ters yöne gidiyormuş gibi görünür. Uzun mekân adı
  kartta 2 satırda kesilir. Keyframe içinde `var()` kullanıldığından modern tarayıcı gerekir.
- **Terminal:** en fazla 2 kişi adı (`useHeroData`), en fazla 4 program satırı (+ "… +N oturum daha").
  `> ` öneki ve sol imleç tüm girdilere (tarih seçici, açılır listeler dahil) uygulanır. Pencerenin
  `min-h-[300px]`'ı kısa içerikte altta boşluk bırakır. Yazma animasyonu zarf açıldıktan sonra başlar
  (`renderBackdrop` içindeki küçük bir geri çağrıyla öğrenilir, çünkü `HeroRenderProps`'ta `revealed` yok).

## 4. Yeni bir şablon ekleme (bu turda izlenen yol)

1. Bileşeni kendi klasöründe yaz (`src/components/templates/<kategori>/<SablonAdi>/index.tsx`), adlandırılmış dışa aktar.
2. `lazyPresets.ts` → `LAZY_ALTI_PRESETS`'e `fromBarrel(() => import('./<yol>'), '<Ad>')` satırı ekle.
   `TemplateRenderer.tsx` `LAZY_PRESETS`'i yaydığı için orada değişiklik gerekmez.
3. `src/data.ts` → `TEMPLATE_PRESETS`'e id, ad, renkler, `imageUrl`, `categories` ekle.
4. `npm run lint && npm run build` → şablon başına tek commit.
