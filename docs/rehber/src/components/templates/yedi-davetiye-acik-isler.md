# Yedi Davetiye — açık kalan işler

> **İlk liste:** 4 Kasım 2026, dal `design/yedi-davetiye`
> **Faz 15 güncellemesi:** 4 Kasım 2026, frontend dalı `design/claude-davetiye`, backend dalı `faz15-desing/claude-davetiye`
> Ana rehber: [yedi-davetiye.md](yedi-davetiye.md) · Backend: `docs/rehber/fazlar/FAZ-15.md`

Her madde **ne**, **neden açık / nasıl kapandı** ve **nasıl kontrol edilir** diye yazıldı.
`[x]` = Faz 15'te kapandı (commit numarası parantez içinde). `[ ]` = hâlâ açık.

---

## 1. Doğrulanmamış olanlar

- [ ] **Gerçek cihazda kare hızı.** Kapsayıcıda gerçek GPU yok (SwiftShader); fps ölçülemedi.
  Hedef: masaüstü 60, orta seviye telefon ≥ 30 fps. *Kontrol:* orta seviye bir Android ve bir iPhone'da
  `dugun-gul-3d`, `dugun-fener`, `dugun-murekkep`, `dugun-altin-toz` ve `dugun-kitap-sayfa` (sayfa
  çevirirken) Chrome DevTools Performance / Safari Timeline ile.
- [x] **Editör önizlemesi (`/create`, `DeviceSimulator`).** Sihirbaz girişsiz açılıyor: Düğün → tema →
  "Davetiyeni Oluştur" → Tasarım Stüdyosu; zarf açılıp cihaz önizlemesi görüntülendi (Gül, Kitap
  Sayfaları, Mürekkep, Altın Toz, Pop-up, Kitap — İç Kapak). Konsol hatası yok. Bulunan kusur (tarih
  yokken boş geri sayım kutusu) düzeltildi (15.7). Görüntü: [`editor-onizleme.jpg`](yedi-davetiye/editor-onizleme.jpg).
- [ ] **Canlı davetiye sayfası (`/invite/:id`) ve yayın akışı.** Backend gerektiriyor; açılmadı.
  *Kontrol:* bir şablonla davetiye yayınlayıp misafir bağlantısı açılmalı (backend FAZ-15 testleri de
  misafir ucunun kimliği döndürdüğünü kilitliyor).
- [x] **A bölümü şablonlarının `TemplateRenderer` yolu.** `onizleme.html?…&yol=renderer` ve gerçek editör
  (`Kitap — İç Kapak`) üzerinden çizildi.
- [x] **Tema seçici ve galeri kapakları** (15.11): 25 şablonun kapağı `public/images/sablonlar/<id>.webp`
  (640 × 640 WebP, toplam 412 kB, ortalama 16 kB). Şablonun kendisinden üretildi: canlı mod, örnek adlar
  ("Elif & Can"; doğum gününde "Elif"), hareketi-azalt kipinde son kare, şablona göre ayarlanmış kare kırpım
  ("Bir Ömür" dikey olduğu için kare görünüm alanında). Sihirbazın tema ızgarasında görüldü.
  *Karar gerekli:* mevcut kapaklar yazısız dekoratif görseller; bunlar örnek adlı önizleme. Yazısız
  istenirse aynı betikle adlar gizlenerek yeniden üretilebilir.
- [ ] **LCV gönderimi uçtan uca.** Backend yok; form çiziliyor ama gönderilmedi.
- [x] **Arapça (RTL).** Yedi yeni şablon `dir="rtl"` ile tarandı. İki kusur bulunup düzeltildi:
  Türkçe tarih/ad satırları karışıyordu → hero metinleri `dir="auto"` (15.8); Kitap'ın sırtı solda
  kalıyordu → aynalanmış kitap (15.4). A bölümündeki 18 şablon RTL'de **taranmadı** (aşağıda).
- [ ] **A bölümündeki 18 konsept şablonu RTL'de.** Taranmadı. *Kontrol:* `shot.cjs` benzeri bir betikle
  `document.documentElement.dir = 'rtl'` iken açılmalı.

## 2. Bilinen sınırlar

- [x] **Kitap Sayfaları'nda RTL kitap yönü** (15.4): Arapçada sırt sağda, sayfalar diğer yöne çevrilir;
  sürükleme, dokunma şeritleri, ok tuşları ve düğmeler de ters döner.
- [ ] **Kitap Sayfaları zarf modülünü yok sayar.** `showEnvelope` açıkken de zarf çizilmez; kapak kapı yerine
  geçer. *Karar gerekli* (ürün).
- [x] **Kitap — köşe ipucu sürüklemeyi engelliyordu** (15.4): dokunuş ipucunu keser.
- [x] **Kitap — son durum "Son" yazıyordu** (15.4): artık "Arka kapak".
- [ ] **Kitap — uzun bölümler sayfa içinde kaydırılır** (LCV formu, uzun program). Küçük ekranda dar.
- [ ] **Gerçek bloom / alan derinliği yok** (Gül, Fener). *Karar gerekli:* `@react-three/postprocessing` eklensin mi?
- [x] **`@react-three/drei` kullanılmıyordu** (15.6): kaldırıldı.
- [x] **iOS'ta jiroskop izni** (15.2): Holografik, Gül ve Fener'de "Telefonu eğerek oynatın" düğmesi; yalnızca
  izin isteyen tarayıcıda ve dokunmatik cihazda (15.8) görünür. *Gerçek iPhone'da denenmedi.*
- [x] **Altın Toz — hızlı kaydırmada üst üste yazı / boş veride hizasızlık** (15.5): yeni aşama yalnızca kendi
  ölçülmüş düzeniyle çizilir; giden yazı daha hızlı söner.
- [x] **Holografik — döngü ekran dışında çalışıyordu** (15.1): görünürlükle durur.
- [x] **Mürekkep — düğmelere dokunmak damla düşürüyordu** (15.3): etkileşimli öğeler hariç.
- [ ] **Mürekkep — WebGL bağlamı unmount'ta açıkça bırakılmıyor** (StrictMode yüzünden; tarayıcı toplar).
- [ ] **three.js chunk'ı (887 kB, gzip 240 kB)** orta seviye telefonda da iner; yalnızca çok zayıf cihazlar
  statik yedeğe düşer. *Karar gerekli:* mobil veri için eşik.
- [ ] **Ana paket 1 597 → 1 612 kB** (Faz 15.6). Neden ölçüldü: `react-router` 7.18.5 ve `axios` 1.21.0
  güvenlik güncellemeleri (eski sürümlerle geçici build = 1 597 kB). Şablon kodu ana pakette değil.

## 3. Onayını bekleyen kararlar

- [ ] **Kategori `index.ts` barrel'larına konsept şablonları eklenmedi** (tembel yükleme için;
  gerekçe: `lazyPresets.md`, `KONSEPT-ORTAK.md` §2 notu).
- [ ] **`onRsvpClick` hiçbir şablonda çağrılmıyor** (eski şablonlarda da); LCV satır içi form.
- [ ] **A bölümündeki 18 şablonun katalog adları ve renkleri** (`src/data.ts`).
- [ ] **`verify:render` misafir sayfasını `prerenderToNodeStream` ile çiziyor** (~4 s; belge:
  `docs/rehber/scripts/verify-render.md` §2.4).
- [ ] **Yeni şablonlar premium mu?** Mevcut kural (K102) yalnızca video temaları Gold yapar; 25 yeni şablon
  Standart'ta yayınlanır. Değişecekse: backend `config/davetkart.php` → `preset_tiers`, iki backend testi
  (`PaywallTest`, `TemplateCatalogueTest`) ve frontend `minimumTier` birlikte.

## 4. Backend ve dış bağımlılıklar

- [x] **Şablon id izin listesi / seeder** — backend'de **yok**; kimlik yalnızca `string|max:48`
  (en uzunu 31 karakter). Kod değişikliği gerekmedi. Sözleşme testi eklendi:
  `tests/Feature/TemplateCatalogueTest.php` (backend 15.1).
- [ ] **Backend testi koşturulmadı.** Bulut alanında PHP 8.3 var, proje ^8.5 istiyor; Laravel 13 / Symfony 8
  8.3'te açılmıyor, `phpstan` zip'i de indirilemedi. *Kontrol:* PHP 8.5 makinede
  `php artisan test --filter=TemplateCatalogueTest` ve `composer check`.
- [ ] **Plan/fiyat eşlemesi** — §3'teki "premium mu?" kararına bağlı.
- [x] **`npm audit`** (15.6): 13 bildirim → **0** (`npm audit fix`, yalnızca mevcut aralıklar içinde).
  `lint`, `build`, `verify` yeşil.

## 5. Dokümantasyon

- [x] **Bileşen başına rehberler** (15.9): `lazyPresets.md`, `shared/three/index.md`, `shared/yedi/index.md`,
  `dugun/<Bileşen>/index.md` × 7.
- [x] **`docs/rehber/scripts/verify-render.md`** §2.4 (15.9).
- [x] **`docs/rehber/scripts/onizleme.md`** — `yol=renderer` (15.9).
- [x] **`KONSEPT-ORTAK.md` §2** — kaydın güncel durumu notu (15.9).

## 6. Faz 15 commit'leri

**Frontend** (`design/claude-davetiye`, `design/yedi-davetiye` üzerinden):
15.1 Holografik döngüsü ekran dışında durur · 15.2 iOS jiroskop izni · 15.3 Mürekkep dokunma ·
15.4 Kitap RTL + ipucu + gösterge · 15.5 Altın Toz aşama düzeni · 15.6 drei kaldırıldı + `npm audit` ·
15.7 boş geri sayım kutusu · 15.8 RTL metin yönü + jiroskop düğmesi yalnızca dokunmatikte ·
15.9 rehberler · 15.10 bu liste · 15.11 kapak görselleri.

Not: 15.1 commit'i `GyroButton` kullanımını da içeriyor, bileşenin kendisi 15.2'de geldi; 15.1 tek başına
derlenmez (dalın ucu derlenir).

**Backend** (`faz15-desing/claude-davetiye`): 15.1 `TemplateCatalogueTest` · 15.2 `FAZ-15.md`.

Hiçbir depoda `main`'e dokunulmadı; PR açılmadı.
