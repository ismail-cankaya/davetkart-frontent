# `scripts/verify-render.tsx` · `scripts/render-env.ts`

> **Faz:** 10 — FE 10.23 · **Komut:** `npm run verify:render` (`npm run verify` ve `check` içinde)
> **Sınadığı sözler:** K102 (Elit imzasız) · K101 (misafir yanıtını günceller) · K97/K98 (gizlilik metni)

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
