# `src/pages/PricingPage.tsx` — fiyatlandırma sayfası

> **Faz:** 13 (frontend 13.11)

## Ne değişti?

| Önce | Sonra |
|---|---|
| Yalnızca bu sayfada yaşayan üç uydurma paket: Zarif / Prestij / İhtişam (349 / 549 / 949 ₺) | `data.ts` → `SUBSCRIPTION_PLANS`: paywall ve ödeme sayfasıyla **aynı** üç paket |
| "İlk davetiyenizde ₺139" gibi sabit sayılar | Backend kataloğu: misafire liste + kampanya, giriş yapmış yeni üyeye %60'lı fiyat |
| Sabit "%60" bandı ve SSS cevabı | `firstPublishPercent`'ten; indirim kapalıysa band ve soru görünmez |
| "Kredi kartı, banka kartı ve havale ile ödeme" | Açık yöntemlere göre (`pricing.methods.*`) |

Özellik listesinde dahil olmayanlar (paywall'daki gibi) üstü çizili görünür. Öne çıkan
paket Gold.

⚠️ SSS'deki diğer cevaplar ("yayın süresi", "iade") eski sayfadan aynen kaldı. Ticari
gerçekliğe uygun olup olmadıklarını kontrol etmen gerekiyor.

## 🆕 Faz 18.4 (`SEC-02` · K166): "İade alabilir miyim?"

Eski cevap 3 günlük serbest bırakmayı iade cümlesinin hemen arkasına koyuyordu: "yayındaysa,
3 gün içinde silerek hakkı serbest bırakabilirsiniz". Okuyan, "silersem iade alırım" anlıyordu
ve backend de tam olarak buna izin veriyordu (denetim bulgusu `SEC-02`). Backend artık yayın
yapmış hakkı iade etmiyor; cevap buna ve Kullanım Şartları'ndaki "yayınlandığı anda hizmet ifa
edilmiş sayılır" maddesine uyduruldu:

> … Bir davetiye yayınlanan hak kullanılmış sayılır ve iade edilmez; ancak yayından sonraki
> 3 gün içinde davetiyeyi silerseniz hakkı yeni bir davetiyede kullanabilirsiniz. …

Yukarıdaki ⚠️ notun "iade" kısmı bu cevap için kapandı; "yayın süresi" cevabı hâlâ kontrol bekliyor.

## 🆕 Faz 19.19 (`FE-52` · K232): SSS yayın süresi vaat etmiyor

**Sorun.** İki SSS cevabı "paketinizin yayın süresi", "süre sonunda erişime kapanır" ve "küçük bir ücretle uzatabilirsiniz"
diyordu. Backend'de yayın süresi, kapanma tarihi ya da uzatma siparişi yok: davetiye siz silene kadar yayında kalır
(tek istisna: iade sonrası yayından kaldırma, "İade alabilir miyim?" cevabında).

**Şimdi.** İlk cevap "siz silene kadar yayında kalır"; üçüncü soru "Davetiyem ne kadar süre yayında kalır?" ve cevabı
gerçek kuralı söyler: süre sınırı ve ek ücret yok; misafir verisi etkinlikten
`GUEST_DATA_MONTHS_AFTER_EVENT` (6) ay sonra silinir (K98). Sayı `src/legal/retention.ts`'ten okunur; gizlilik
metni de aynı sabiti kullanır (iki yerde sayı yazılmaz).

**Kilit.** `STATIC_FAQS` dışa aktarılır; `verify-render` hiçbir SSS'de "yayın süre…" ya da "uzat…" geçmediğini ve
6 ay cümlesinin sabitle aynı olduğunu denetler. Yayın süresi bir gün ürüne girerse önce backend kuralı, sonra bu
denetim, en son metin değişir.
