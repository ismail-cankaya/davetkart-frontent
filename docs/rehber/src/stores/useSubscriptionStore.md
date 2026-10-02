# `src/stores/useSubscriptionStore.ts` — Faz 10 değişikliği (10.8a)

> **Kod dosyası:** `davetkart-frontent/src/stores/useSubscriptionStore.ts`
> **Faz:** 10 — Sertleştirme, adım 10.8'in ilk parçası
> **İlgili karar:** **K88** (yayındaki davetiyede modül açma kayıt anında plan kontrolünden geçer)
> **Backend karşılığı:** `UpdateInvitationAction` (10.1) · `PaywallViolationException`
> **Kullananlar:** `EditorWorkspace.tsx` (yayınlama) · `useInvitationStore.ts` (otomatik kaydetme)

---

## 1. Ne değişti?

Tek bir fonksiyon eklendi ve bir tip dışa açıldı:

```ts
export interface OpenPaywallOptions { requiredTier; reason; invitationId }

export function paywallFromError(
  error: unknown,
  invitation: Invitation,
  invitationId: string | null
): OpenPaywallOptions | null
```

Görevi: bir API hatasına bakıp *"bu bir paywall 402'si mi, öyleyse duvar hangi
planla ve hangi sebeple açılmalı?"* sorusunu cevaplamak. 402 değilse `null`
döner ve çağıran kendi yoluna devam eder.

---

## 2. 🔴 Neden ayrı bir fonksiyon? — Aynı 402, iki kapı

Faz 10'a kadar 402'yi yalnızca **yayınlama** üretiyordu ve eşleme
`EditorWorkspace.attemptPublish()`'in içindeydi:

```ts
// Eski hali — EditorWorkspace.tsx içinde
if (code === 'PAYMENT_REQUIRED' || code === 'PAYWALL_TIER_INSUFFICIENT') {
  const serverTier = apiErrorParams(error).requiredTier;
  const requiredTier = isSubscriptionTier(serverTier) ? serverTier : getRequiredTier(invitation);
  useSubscriptionStore.getState().openPaywall({ requiredTier, reason: …, invitationId: recordId });
}
```

Backend 10.1'den sonra aynı 402 **ikinci bir kapıdan** gelir: yayındaki bir
davetiyede plan üstü bir modül açıldığında otomatik kaydetmenin `PUT`'u reddedilir.
O yolu `useInvitationStore` (10.8b) yakalıyor.

Eşleme iki yere kopyalansaydı:

| Kopya | Olası ayrışma | Kullanıcının gördüğü |
|---|---|---|
| Yayınlama | `requiredTier`'ı sunucudan okur | *"Elit gerekiyor"* |
| Otomatik kaydetme | Aceleyle yazılmış, yerel `getRequiredTier()`'dan okur | *"Gold gerekiyor"* |

Aynı davetiye için iki ekran iki farklı plan önerirdi. **C3**: aynı kuralı üreten
iki yol zamanla ayrışır. Kural tek yere, paywall'ın kendi store'una taşındı.

---

## 3. Üç karar, tek yerde

```ts
const code = apiErrorCode(error);
if (code !== 'PAYMENT_REQUIRED' && code !== 'PAYWALL_TIER_INSUFFICIENT') return null;

const serverTier = apiErrorParams(error).requiredTier;

return {
  requiredTier: isSubscriptionTier(serverTier) ? serverTier : getRequiredTier(invitation),
  reason: code === 'PAYMENT_REQUIRED' ? 'purchase' : 'upgrade',
  invitationId
};
```

| Karar | Neden |
|---|---|
| Ayrım `code`'da, durum kodunda değil | İki 402 iki ayrı ekran ister: *"önce bir plan al"* / *"planını yükselt"* (backend `docs/08` §4) |
| Plan **sunucudan** | `TierResolver` asıl otoritedir. Yerel `getRequiredTier()` yalnızca yanıt planı taşımıyorsa (beklenmeyen) yedektir |
| `isSubscriptionTier()` ile daraltma | `params` bir `Record<string, unknown>`; sunucudan geleni **doğrulamadan** tipe sokmak, bozuk bir değerle plan kartlarını boş çizerdi |

K88'in normal akışında gelen hep `PAYWALL_TIER_INSUFFICIENT`'tır (yayındaki
davetiyenin bir hakkı vardır) → `reason: 'upgrade'`. Plan metni de tam olarak bunu
istiyordu: *"paywall'ı `reason: 'upgrade'` + sunucunun `requiredTier`'ıyla aç"*.
`PAYMENT_REQUIRED` yalnızca iadeden sonra görülür ve o zaman `'purchase'` doğrudur.

---

## 4. Neden `useSubscriptionStore.ts` içinde?

Seçenekler: `services/api.ts`, `utils/`, ya da buradan.

- `services/api.ts` HTTP'yi bilir, **paywall'ı bilmemeli** — `OpenPaywallOptions`
  bir arayüz kavramıdır.
- Buradaysa fonksiyon, doldurduğu yapıyla (`OpenPaywallOptions`) ve onu tüketen
  eylemle (`openPaywall`) yan yana durur. Birini değiştiren, öbürünü görür.

Bağımlılık yönü tek taraflı kalıyor: `useInvitationStore` → `useSubscriptionStore`
→ `services/api`. `useSubscriptionStore` editör store'unu **içeri almıyor**;
döngüsel import yok.

---

## 5. Sık yapılan hatalar

| # | Hata | Ne olur |
|---|---|---|
| 1 | Eşlemeyi her çağırana kopyalamak | İki ekran iki farklı plan önerir (§2) |
| 2 | 402'yi yalnızca durum koduyla tanımak | *"Plan al"* ile *"yükselt"* ekranları karışır |
| 3 | `requiredTier`'ı yerel kopyadan okumak | Sunucu kuralı değişince (ör. fiyat haritası) duvar yanlış planı önerir |
| 4 | `params.requiredTier`'ı `as SubscriptionTier` ile zorlamak | Bozuk değer derleyiciyi susturur, ekranı bozar |

---

## 6. Kendin dene

```powershell
npm run lint           # tsc: iki çağıran da yeni imzayla derleniyor
npm run verify:state   # "Yayındaki davetiyede plan üstü modül" bölümü bu fonksiyondan geçiyor
```

Tarayıcı konsolunda:

```js
const { paywallFromError } = await import('/src/stores/useSubscriptionStore.ts');
const e = { isAxiosError: true, response: { data: { error: { code: 'PAYWALL_TIER_INSUFFICIENT', params: { requiredTier: 'elit' } } } } };
paywallFromError(e, {}, 'INV-1');   // { requiredTier: 'elit', reason: 'upgrade', invitationId: 'INV-1' }
paywallFromError(new Error('x'), {}, null);   // null
```

> Konsol denemesi `apiErrorCode()`'un hata zarfını nasıl okuduğuna bağlıdır
> (`services/api.ts`); axios hatası taklidinde `response.data.error` yeterli.

---

## 7. 🆕 Faz 10 (FE 10.20 · K102): premium tema

`getRequiredTier()` artık temayı da soruyor: `TEMPLATE_PRESETS[].minimumTier === 'gold'` ise en az
Gold. Modül kuralı daha yüksekse o kazanır (galeri açık premium tema yine Elit).

Bu hâlâ bir **sunum** kopyası (§1): sunucu `requiredTier`'ı 402'de söylüyor ve yedek yalnızca söylemediğinde
kullanılıyor. Backend ikizi `TierResolver` → `preset_tiers`. Premium liste iki tarafta da sabit:
backend `PaywallTest::the_premium_themes_are_the_thirteen_video_themes`, frontend `verify:payment` →
*"Fiyat kartı vaatleri"*. Biri değişir de öbürü değişmezse bu iki testten biri kırılır.
