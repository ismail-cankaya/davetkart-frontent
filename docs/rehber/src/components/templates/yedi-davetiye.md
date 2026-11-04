# Yedi Davetiye — konsept şablonlarının kaydı ve yedi yeni düğün şablonu

> **Dal:** `design/yedi-davetiye` (`faz-14-account-settings` üzerinden) · **Tarih:** 2026-11-04

Bu rehber iki işi anlatır:

- **A.** Diskte yazılı olup hiçbir yere kaydedilmemiş 18 konsept şablonunun (Kitap · Harita · Sergi)
  canlıya alınması.
- **B.** Yedi yeni, animasyonlu düğün şablonu ve onların ortak 3D altyapısı.

Oturum boyunca soru sorulamadığı için verilen kararlar ilgili bölümün **Karar** satırlarında yazılıdır.

---

## A. Konsept şablonlarının kaydı

### A.1 Kaydedilen şablonlar

Id'ler uydurulmadı: hepsi bileşenlerin kendi rehberlerinde (`docs/rehber/src/components/templates/<kategori>/<konsept>/…`)
ve `KONSEPT-ORTAK.md §3` kimlik kuralında (`<önek>-<slug>-<ad>`) önceden belirlenmişti.

| Id | Bileşen | Katalog adı |
|---|---|---|
| `dugun-kitap-birinci-bolum` | `DugunKitapBirinciBolum` | Kitap — Birinci Bölüm |
| `dugun-kitap-ic-kapak` | `DugunKitapIcKapak` | Kitap — İç Kapak |
| `dugun-harita-kir-yolu` | `DugunHaritaKirYolu` | Harita — Kır Yolu |
| `dugun-harita-kiyi-kenti` | `DugunHaritaKiyiKenti` | Harita — Kıyı Kenti |
| `dugun-sergi-beyaz-kup` | `DugunSergiBeyazKup` | Sergi — Beyaz Küp |
| `dugun-sergi-duvar-yazisi` | `DugunSergiDuvarYazisi` | Sergi — Duvar Yazısı |
| `nisan-kitap-kurdele` | `NisanKitapKurdele` | Kitap — Kesik Kurdele |
| `nisan-kitap-onsoz` | `NisanKitapOnsoz` | Kitap — Önsöz |
| `nisan-harita-kavusak` | `NisanHaritaKavusak` | Harita — Kavuşak |
| `nisan-harita-kroki` | `NisanHaritaKroki` | Harita — Mahalle Krokisi |
| `nisan-sergi-bir-omur` | `NisanSergiBirOmur` | Sergi — Bir Ömür |
| `nisan-sergi-diptik` | `NisanSergiDiptik` | Sergi — Diptik |
| `dogum-gunu-kitap-masal` | `DogumGunuKitapMasal` | Kitap — Masal |
| `dogum-gunu-kitap-yeni-bolum` | `DogumGunuKitapYeniBolum` | Kitap — Yeni Bölüm |
| `dogum-gunu-harita-hazine-avi` | `DogumGunuHaritaHazineAvi` | Harita — Hazine Avı |
| `dogum-gunu-harita-kutlama-hatti` | `DogumGunuHaritaKutlamaHatti` | Harita — Kutlama Hattı |
| `dogum-gunu-sergi-devam-eden` | `DogumGunuSergiDevamEden` | Sergi — Devam Eden |
| `dogum-gunu-sergi-retrospektif` | `DogumGunuSergiRetrospektif` | Sergi — Retrospektif |

Kaydedilmeyen şablon yok: 18'inin hepsi çalışır durumdaydı.

### A.2 Nasıl kaydedildi

- **`src/components/templates/lazyPresets.ts`** — yeni dosya. Her konsept barrel'ı
  (`dugun/kitap`, `nisan/harita`, …) `React.lazy` ile ayrı chunk olarak yüklenir. `fromBarrel(load, ad)`
  adlandırılmış dışa aktarımı `default`'a çevirir; tip `Record<K, ComponentType<TemplateProps>>` olduğu
  için yanlış bileşen adı derleme hatası verir.
- **`TemplateRenderer.tsx`** — `THEME_PRESETS` sonuna `...LAZY_KONSEPT_PRESETS`; şablon `Suspense`
  içinde çizilir (yedek: tam ekran, sessiz şamua zemin `TemplateFallback`). Eski, eager şablonlar için
  Suspense etkisizdir.
- **`src/data.ts`** — 18 katalog girdisi (kategori başına `categories: ['dugun' | 'nisan' | 'dogum-gunu']`).
  Renkler konseptlerin kendi paletlerinden alındı (`konsept/kitap/palet.ts` bezleri, `konsept/harita/palet.ts`,
  `konsept/sergi/palet.ts` eser renkleri). `imageUrl: ''` — kod tabanlı şablon; `TemplateCover` kapağı
  kartın degradesiyle çizer (bkz. `TemplateCover` durum 3). Tailwind sınıfları literal yazıldı.

**Karar — kategori barrel'ları (`dugun/index.ts`) değiştirilmedi.** İş tanımı "kategori `index.ts`
dışa aktarımlarına ekle" diyordu; ancak `TemplateRenderer` kategori barrel'ını statik içe aktarır.
Konsept barrel'ı oraya `export *` ile bağlansaydı Rollup modülü ana pakete koyar, `React.lazy` ayrı
chunk üretemezdi (aynı modül hem statik hem dinamik içe aktarılmış olur). Konsept barrel'ları zaten
vardı (`<kategori>/<konsept>/index.ts`); tembel kayıt onları doğrudan hedefler. `scripts/onizleme`
de aynı barrel'ları kullanır.

**LCV:** Bu şablonlar (ve depodaki bütün şablonlar) LCV'yi `InvitationComposition` içindeki satır içi
`RSVPForm` ile alır; `onRsvpClick` hiçbir mevcut şablonda kullanılmıyor. Davranış korunmuştur.

### A.3 Doğrulama

- `scripts/verify-render.tsx` — misafir sayfası artık `prerenderToNodeStream` ile çizilir (Suspense
  çözülür, tembel şablonlar da tam HTML'e döner). Yeni bölüm **"Tembel şablonlar: kayıt ve veri"**:
  her tembel şablon katalogda mı; dolu veride adlar ve mekân çiziliyor mu; boş veride (ad, tarih,
  mekân, program, fotoğraf yok) çizim kırılıyor mu. Toplam süre ~4 s.
- Playwright (dev sunucusu, `onizleme.html?preset=…&mod=live`), 390 × 844 ve 1440 × 900, `dolu` ve
  `bos` senaryoları: konsol hatası yok, yatay taşma yok. Boş senaryoda adların yerine "Davetlisiniz",
  program ve galeri bölümleri gizli.
- Ana paket: 1 586 kB → 1 594 kB (katalog girdileri + kayıt). Konsept kodu ayrı chunk'larda
  (en büyüğü ~10 kB, ortak kit chunk'ları ayrı).

Eksik/yarım parça bulunmadı: TODO yok, sabit örnek metin yok, mobilde taşma yok.
