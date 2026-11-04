# Yedi Davetiye — açık kalan işler

> **Dal:** `design/yedi-davetiye` · **Tarih:** 2026-11-04 · Ana rehber: [yedi-davetiye.md](yedi-davetiye.md)

Bu oturumda kapanmayan, doğrulanmamış ya da senin onayını bekleyen her şey burada. Her madde
**ne**, **neden açık** ve **nasıl kontrol edilir** diye yazıldı. Kapattıkça işaretle.

---

## 1. Doğrulanmamış olanlar (test edilmedi ya da edilemedi)

- [ ] **Gerçek cihazda kare hızı.** Bu kapsayıcıda gerçek GPU yok; ekran görüntüleri yazılımsal
  GPU (SwiftShader) ile alındı, fps ölçülmedi. Hedef: masaüstünde 60, orta seviye telefonda en az 30 fps.
  *Kontrol:* orta seviye bir Android ve bir iPhone'da `dugun-gul-3d`, `dugun-fener`, `dugun-murekkep`,
  `dugun-altin-toz` ve `dugun-kitap-sayfa` (sayfa çevirirken) açılıp Chrome DevTools Performance /
  Safari Timeline ile ölçülmeli.
- [ ] **Editör önizlemesi (`/create`, `DeviceSimulator`) ve canlı davetiye sayfası (`/invite/:id`)
  tarayıcıda açılmadı.** Canlı sayfa backend ister. Görsel kontroller `onizleme.html?…&yol=renderer`
  ile yapıldı; bu yol da `TemplateRenderer` → tembel kayıt → `Suspense` zincirinden geçer, ama gerçek
  sayfaların kapsayıcı yüksekliği, Lenis ve modal etkileşimleri denenmedi.
  *Kontrol:* 25 şablonun her biri editörde seçilip önizlemede ve yayınlanmış bir davetiyede açılmalı.
- [ ] **A bölümündeki 18 şablon görsel olarak konsept barrel'ı üzerinden denendi**, `TemplateRenderer`
  yolu yalnızca sunucu çizimiyle (`verify:render`) denendi. *Kontrol:* `onizleme.html?preset=<id>&yol=renderer`
  ile birkaçı açılmalı.
- [ ] **Tema seçici ve şablon galerisi kapakları.** 25 yeni girdinin `imageUrl`'i boş; kapak yalnızca
  `backgroundStyle` degradesi. Galeride göründükleri doğrulanmadı (yalnızca katalogda oldukları denetlendi).
  *Karar gerekli:* gerçek kapak görselleri istenecek mi?
- [ ] **LCV gönderimi uçtan uca denenmedi** (backend yok). Form çiziliyor; gönderip yanıtı güncelleme
  akışı gerçek bir davetiyede denenmeli — özellikle `dugun-kitap-sayfa`'da form sayfa içinde kaydırılarak
  dolduruluyor.
- [ ] **Arapça (RTL) dilde hiçbir şablon açılıp bakılmadı.** Metinler ortalı/mantıksal hizalı yazıldı ama
  denetlenmedi.

## 2. Bilinen sınırlar (bilerek yapılmayan ya da eksik kalan)

- [ ] **Kitap Sayfaları'nda RTL kitap yönü yok.** Mekanik `dir="ltr"`; Arapça kitapta sırt sağda olmalı.
- [ ] **Kitap Sayfaları zarf modülünü yok sayar.** `showEnvelope` açık olsa da zarf çizilmez; kapak kapı
  yerine geçer. Ürün kararı olarak onaylanmalı.
- [ ] **Kitap Sayfaları — küçük kusurlar:**
  - Sayfa göstergesi kapağı saymaz ("1 / 7"), son sayfa da "7 / 7" sonra "Son" görünür; dil gözden geçirilmeli.
  - Boşta köşe kaldırma ipucu (~1 s) sırasında sürükleme başlatılamaz.
  - Uzun bölümler (LCV formu, uzun program) sayfanın içinde kaydırılır; küçük ekranda sayfa dar kalabilir.
- [ ] **Gerçek bloom / alan derinliği yok** (Gül, Fener). `@react-three/postprocessing` eklemek
  istemedim; sis ve ışıkla yaklaşıldı. *Karar gerekli:* paket eklensin mi?
- [ ] **`@react-three/drei` kurulu ama kullanılmıyor.** Ağaçtan atıldığı için pakete girmiyor, ama gereksiz
  bağımlılık. *Karar gerekli:* kaldırılsın mı, yoksa ileride kullanılacak mı?
- [ ] **iOS'ta jiroskop izni istenmiyor.** `DeviceOrientationEvent.requestPermission` bir kullanıcı
  hareketi ister; izin olmadan iOS'ta eğim yalnızca işaretçi/boşta salınımla çalışır (Holografik, Gül, Fener).
- [ ] **Altın Toz:** yazı oturmadan çok hızlı kaydırılırsa bir an iki aşamanın yazısı üst üste görünebilir.
  Boş veride ("Davetlisiniz") zerreler ile HTML yazının hizası açılışın ilk saniyelerinde kayık görünebiliyor.
- [ ] **Holografik:** eğim döngüsü (`requestAnimationFrame`) kart ekran dışındayken de çalışıyor; görünürlükle
  (`useStageActive`) durdurulmalı.
- [ ] **Mürekkep:** sayfanın herhangi bir yerine (düğmeler dahil) dokunmak damla ekler; WebGL bağlamı
  unmount'ta açıkça bırakılmaz (StrictMode yüzünden `loseContext` kaldırıldı, tarayıcının toplamasına kalır).
- [ ] **three.js chunk'ı (887 kB, gzip 239 kB)** orta seviye telefonda da iner; yalnızca çok zayıf cihazlar
  (`saveData`, ≤1 GB bellek, ≤2 çekirdek) statik görünüme düşer. Mobil veri için eşik gözden geçirilebilir.

## 3. Senin onayını bekleyen kararlar

- [ ] **Kategori `index.ts` barrel'larına konsept şablonları eklenmedi.** İş tanımı istiyordu; eklenseler
  `React.lazy` ayrı chunk üretemez, şablonlar ana pakete girerdi. Yerine `templates/lazyPresets.ts` kullanıldı.
- [ ] **`onRsvpClick` hiçbir şablonda çağrılmıyor** (depodaki eski şablonlarda da). LCV satır içi `RSVPForm`
  ile alınıyor. `onRsvpClick` modalı da kullanılsın mı?
- [ ] **A bölümündeki 18 şablonun katalog adları ve renkleri** (`src/data.ts`) benim seçimim; konseptlerin
  paletlerinden alındı. Adlar ("Kitap — Kesik Kurdele", "Harita — Mahalle Krokisi" …) onaylanmalı.
- [ ] **`verify:render` artık misafir sayfasını `prerenderToNodeStream` ile çiziyor** (tembel şablonları
  bekleyebilmek için). Süre ~4 s; daha önceki eşzamanlı çizimden farklı bir davranış.

## 4. Backend ve dış bağımlılıklar

- [ ] **Şablon id izin listesi / seeder.** Backend şablon id'lerini bir listede tutuyorsa şu 25 id eklenmeli
  (frontend'de başka kayıt yok):
  - `dugun-kitap-birinci-bolum`, `dugun-kitap-ic-kapak`, `dugun-harita-kir-yolu`, `dugun-harita-kiyi-kenti`,
    `dugun-sergi-beyaz-kup`, `dugun-sergi-duvar-yazisi`
  - `nisan-kitap-kurdele`, `nisan-kitap-onsoz`, `nisan-harita-kavusak`, `nisan-harita-kroki`,
    `nisan-sergi-bir-omur`, `nisan-sergi-diptik`
  - `dogum-gunu-kitap-masal`, `dogum-gunu-kitap-yeni-bolum`, `dogum-gunu-harita-hazine-avi`,
    `dogum-gunu-harita-kutlama-hatti`, `dogum-gunu-sergi-devam-eden`, `dogum-gunu-sergi-retrospektif`
  - `dugun-kitap-sayfa`, `dugun-gul-3d`, `dugun-popup`, `dugun-murekkep`, `dugun-fener`,
    `dugun-holografik`, `dugun-altin-toz`
- [ ] **Plan/fiyat eşlemesi.** Yeni şablonların hangi planda sunulacağı backend'de belirlenmeli (frontend'e
  fiyat yazılmadı).
- [ ] **`npm audit`: 13 bildirim** (2 orta, 10 yüksek, 1 kritik). Çoğunun önceden var olan bağımlılıklardan
  geldiği tahmin ediliyor; ayrıntılı bakılmadı. *Kontrol:* `npm audit`.

## 5. Dokümantasyon borcu

- [ ] **Depo düzeni bileşen başına rehber dosyası ister** (`docs/rehber/<aynı yol>.md`). Yedi yeni şablon,
  `shared/three/` ve `shared/yedi/` için tek bir toplu rehber yazıldı ([yedi-davetiye.md](yedi-davetiye.md));
  dosya başına rehberler yok.
- [ ] **`docs/rehber/scripts/verify-render.md` güncellenmedi**: yeni "Tembel şablonlar: kayıt ve veri"
  bölümü ve `prerender`'a geçiş orada anlatılmıyor.
- [ ] **`docs/rehber/scripts/onizleme.md`**: yeni `yol=renderer` parametresi yazılmadı.
- [ ] **Konsept rehberlerindeki "kayıt satırları commit'lenmez" notları** (`KONSEPT-ORTAK.md §2`) artık
  güncel değil; şablonlar kaydedildi.
