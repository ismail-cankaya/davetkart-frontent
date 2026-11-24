# `scripts/verify-render.tsx` · `scripts/render-env.ts`

> **Faz:** 10 — FE 10.23 · **Komut:** `npm run verify:render` (`npm run verify` ve `check` içinde)
> **Sınadığı sözler:** K102 (Elit imzasız) · K101 (misafir yanıtını günceller) · K97/K98 (gizlilik metni) · K220 (dil kapsamı) · K222/K223 (hata sınırı)

---

## 1. Neden var?

Öbür doğrulama betikleri store'ları, servisleri ve saf fonksiyonları sınıyor. Ekrana **ne çizildiğini**
sınayan bir şey yoktu: imzanın Elit'te kalkması tek bir JSX koşuluna bağlıydı ve yalnızca elle
doğrulanabiliyordu.

## 2. Nasıl çalışıyor?

Gerçek bileşenler `react-dom/server` ile HTML'e çiziliyor. Tarayıcı yok, efektler koşmuyor: ilk
çizimde görünen metin denetleniyor. Yeni bağımlılık yok (React'in kendi sunucu çizicisi).

| Bölüm | Ne çiziliyor | Kontrol |
|---|---|---|
| İmza: misafir sayfası | `TemplateRenderer`, **bütün** şablonlar × (`true`, `false`, karar yok) | `false`'ta hiçbirinde imza yok; öbür ikisinde hepsinde var |
| İmza: editör önizlemesi | `DeviceSimulator` (editörün kendisi), store'a Elit/Gold kaydı yüklenmiş | Elit'te imza yok, alt bilgide adlar var; Gold ve yeni taslakta imza var |
| LCV | `RSVPForm`, `RsvpModal`, misafir sayfasının tamamı | Kod yokken *"Katılımımı Bildir"*; kod varken *"Yanıtımı Güncelle"* + açıklama; başka davetiyede yeni yanıt |
| Gizlilik metni | `PrivacyPage` → *Saklama Süreleri* bölümü | *"derhal silinir"*, *"30 gün"*, *"etkinlik tarihinden 6 ay"*, *"12 ay"* var; *"zamanaşımı"*, *"yayın bitiminden"* yok |

### 2.1 🔴 Sunucu çiziminde zustand başlangıç durumunu okur

`useSyncExternalStore` sunucuda üçüncü argümanı (sunucu anlık görüntüsü) çağırıyor; zustand oraya
`getInitialState()` veriyor. İlk denemede editör önizlemesi Elit kaydı yüklendiği hâlde imzayı çizdi.
`syncServerSnapshot()` çizimden önce güncel durumu başlangıç nesnesine kopyalıyor; bileşen aynı
seçicilerle okuyor, değişen yalnızca okunan nesne.

### 2.2 `render-env.ts`

`useUIStore` `window.matchMedia`'yı modül yüklenirken, `VideoBackdrop` ilk çizimde okuyor. Node'da
`window` yok. Bu dosya betiğin **ilk** import'u: sahte bir `window` (boş dinleyicilerle) ve bellekte bir
`localStorage` kuruyor. Videolu 13 tema onsuz çizilemiyordu.

### 2.3 Tembel bölümler

`InvitationComposition` bölümleri `React.lazy` ile yüklüyor. `renderToStaticMarkup` onların yerine
yükleniyor göstergesini çiziyor; alt bilgi Suspense'in dışında olduğu için imza kontrolüne yetiyor.
LCV formunu sayfanın tamamında görmek için `prerenderToNodeStream` kullanılıyor: Suspense çözülene
kadar bekliyor.

### 2.4 Tembel şablonlar (Faz 15, `design/yedi-davetiye`)

Konsept şablonları ve "Yedi Davetiye" şablonları `templates/lazyPresets.ts` ile **şablonun kendisi**
tembel yüklenir; `renderToStaticMarkup` onlarda yalnızca `TemplateFallback`'i çizer, imza hiç çıkmaz.
Bu yüzden misafir sayfası denetimi (`guestPage`) artık her şablonda `prerenderToNodeStream` kullanır
ve `async`'tir. Süre ~4 s.

Ayrı bölüm **"Tembel şablonlar: kayıt ve veri"** (`lazyPresetsRender`), `LAZY_PRESETS`'teki her kimlik için:

| Kontrol | Neden |
|---|---|
| `data.ts` kataloğunda var | Kayıtlı ama seçilemeyen şablon (A bölümünün başlangıç hatası) tekrar olmasın |
| Dolu veride adlar ve mekân çiziliyor | Şablon gerçekten çizildi (yedek zemin değil) |
| Boş veride (ad, tarih, mekân, program, fotoğraf yok) istisna yok | Boş taslak editörde açılır |

## 3. Mutasyon kanıtı (2 Ekim 2026)

| Mutasyon | Kırılan kontrol |
|---|---|
| İmza her zaman çizilsin | *"Elit kararı (false) 251 şablonun hepsinde imzayı kaldırıyor"* |
| İmza yalnızca `=== true`'da çizilsin | *"karar yoksa … hepsinde imza var"* |
| Form hep *"Katılımımı Bildir"* | *"aynı cihazdan dönen misafir …"* |
| Formdaki açıklama kalksın | aynı |
| Pencere hep *"YANITI GÖNDER"* | *"önizleme penceresi de güncelle diyor"* |
| `loadRecord` kararı düşürsün | *"Elit kaydı yüklenince önizlemede imza yok"* |
| Eski hesap maddesi geri gelsin | *"hesap silinince veriler hemen silinir"* |
| Misafir süresi *"yayın bitiminden"* | *"misafir verisi etkinlikten 6 ay"* |
| Çöp kutusu maddesi silinsin | *"silinen davetiye 30 gün"* |

## 4. Bilinen sınırlar (B6)

- **Etkileşim yok:** tıklama, yazma ve gönderim sonrası ekranlar (*"Yanıtınız güncellendi"*) çizilmiyor.
  Gönderim mantığı `verify:state`'te, ekran tarayıcıda.
- **Efekt yok:** `useEffect` ile kurulan durum (ör. `DeviceSimulator`'ın LCV kapsamını sıfırlaması)
  çizime yansımıyor.
- **Metin kontrolü:** gizlilik bölümü belirli ifadeleri arıyor. Hukukçu metni yeniden yazarsa kontrol
  kırılabilir; o zaman yeni metnin aynı sayıları söylediği kontrol edilip ifadeler güncellenir.

---

## 🆕 Faz 19.20 (`FE-01`) — dil kapsamı (K220)

Beşinci bölüm `languageScope`: `SUPPORTED_LANGUAGES` tam olarak `tr,en`; `LanguageSwitcher`
(`inline`) iki düğme çiziyor, gizli dil kodları yok; `localStorage`'a `de` yazılıp
`i18n.changeLanguage()` (argümansız = algılamayı yeniden koştur) çağrılınca dil `tr` ve kayıt `tr`;
`en` kaydı korunuyor; `ar` artık RTL değil.

`render-env.ts` `window.localStorage`'ı global depoya bağlar: dil algılayıcı globali değil
`window`'u okur. Mutant: `storedPreference` desteklenmeyen kodu süzmeden döndürünce kırmızı.
Ayrıntı: `docs/rehber/src/i18n.md`.

---

## 🆕 Faz 19.21 (`FE-02`) — hata sınırı (K222 · K223)

`routeErrors`: **gerçek** rota tablosu (`src/routes.tsx`) `createMemoryRouter`'a verilir, hedef rotaya
hata fırlatan bir `loader` takılır. Neden `loader`: sunucu çiziminde React hata sınırları çalışmaz;
yükleyici hatası ise yönlendiricinin **durumuna** yazılır ve `errorElement` sunucuda da çizilir. Aynı
`errorElement` çizim hatasında da kullanılır.

| Rota | Kontrol |
|---|---|
| `/pricing` | `data-route-error="app"`, ham ekran yok, `<footer` duruyor, Türkçe metin + `href="/"`, ayrıntı sızmıyor |
| `/create` | `data-route-error="editor"` + `data-save-note="local"` |
| `/invite/abc` | `data-route-error="guest"`, site bağlantısı yok |
| `/pricing` (chunk mesajı) | *"Sayfa yüklenemedi"* |

`preloadRecovery`: `recoverFromPreloadError` sahte saat ve bellek depoyla: ilk hata yeniler, 5 s sonra
ikincisi yenilemez, pencere geçince yine yeniler, depolama yoksa yenilemez.

Mutantlar: `/create`'in `errorElement` satırı silinince *editör kendi sınırında* kırmızı; bayrak kontrolü
silinince *ikinci kez yenilenmiyor* kırmızı.

## 🆕 Faz 19 (19.12 · K189, FE-51) — misafir yüklemesi kapalı

`guestUploadsAreOff()`: satır içi LCV formu (`RSVPForm`) ve misafir sayfasının tamamı `type="file"` çizmiyor;
`src/` altında `RsvpModal`, `uploadAsGuest`, `onRsvpClick` geçen modül yok (statik içe aktarma grafiğinin
yaklaşığı: metin taraması, Vite'ın gerçek grafiği değil) ve `RsvpModal.tsx` silinmiş. Mutant: forma
`<input type="file" />` eklendi → iki kontrol kırmızı. Yukarıdaki tablodaki `RsvpModal` satırı artık
geçersiz: önizleme penceresi kaldırıldı, "Yanıtımı Güncelle" kontrolleri yalnızca `RSVPForm` ve sayfanın tamamında.
Bayrak açılırsa (D2) bu vaka "açıkken satır içi form dosya alanı çiziyor, kapalıyken çizmiyor" olur.

## SEC-11 (Faz 19.18, K231): yedek süresi ve veri işleyenler

§3 (gizlilik metni) iki kilit daha taşır:

- **Yedek süresi:** metin "yedeklerden de en geç {`BACKUP_PURGE_DAYS`} gün içinde" demeli. Sayı `src/legal/retention.ts`'ten
  okunur; biri metne sayıyı elle yazarsa sabitle ayrışır ve kırmızı (mutant 1).
- **Veri işleyenler:** `DATA_PROCESSORS` listesi testte **ayrı** yazılı (sayfadan türetilmez); sayfadan bir ad
  silinirse `eksik: <ad>` ile kırmızı (mutant 2: Shopier). Ayrıca K257 (tarihsiz davetiye 12 ay) cümlesi aranır.
