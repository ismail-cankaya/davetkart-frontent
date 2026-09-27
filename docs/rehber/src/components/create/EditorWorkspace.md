# `src/components/create/EditorWorkspace.tsx` — Faz 10 değişikliği (10.8d)

> **Kod dosyası:** `davetkart-frontent/src/components/create/EditorWorkspace.tsx`
> **Faz:** 10 — Sertleştirme, adım 10.8'in dördüncü parçası
> **İlgili:** [`../../stores/useSubscriptionStore.md`](../../stores/useSubscriptionStore.md) ·
> [`../../pages/CreatePage.md`](../../pages/CreatePage.md)

---

## 1. Ne değişti?

Bileşenin davranışı **değişmedi**; iki sorumluluk başka yere taşındı.

| Önce | Sonra | Neden |
|---|---|---|
| `attemptPublish()` 402'yi kendisi çözüyordu (kod → neden, `params` → plan, yedek `getRequiredTier()`) | `paywallFromError(error, invitation, recordId)` çağırıyor | Aynı 402 artık otomatik kaydetmeden de geliyor; eşleme tek yerde (**C3**) |
| `<PaywallModal />` bileşenin sonundaydı | `CreatePage`'de | 402 artık stüdyo dışındaki bir aşamadan (`build`) da geliyor |

```tsx
} catch (error) {
  const { invitation, recordId } = useInvitationStore.getState();
  const paywall = paywallFromError(error, invitation, recordId);
  if (paywall) {
    useSubscriptionStore.getState().openPaywall(paywall);
    return;
  }

  if (apiErrorCode(error) === 'INVITATION_ALREADY_PUBLISHED') { … }   // 409 — değişmedi
  toast(toDisplayError(error), 'error');
}
```

Kaldırılan importlar: `PaywallModal`, `getRequiredTier`, `isSubscriptionTier`,
`apiErrorParams`. Hepsi artık `paywallFromError`'ın içinde.

---

## 2. Neden davranış aynı kalmalıydı?

Bu bir **taşıma** (refactor): yayınlama akışının kullanıcıya görünen hiçbir şeyi
değişmedi — aynı iki 402 aynı iki ekranı, 409 aynı bilgi mesajını açıyor. Taşıma
ile davranış değişikliğini aynı adımda yapmak, bir şey bozulduğunda hangisinin
bozduğunu ayırt etmeyi imkânsızlaştırır. Davranış değişikliği ayrı adımda,
store'da (10.8b).

`verify:state` → **"Yayınlama"** bölümü değişmeden yeşil: kaydetme başarısızken
yayınlanmıyor, başarılıysa önce kaydedip sonra yayınlıyor.

---

## 3. Kendin dene

```powershell
npm run lint
npm run verify:state
```

Elle: hiç planı olmayan bir hesapla galerili bir davetiyeyi **Yayınla** → duvar
*"Yayınlamaya Bir Adım Kaldı"* (`purchase`); Gold alınmış bir davetiyede galeriyi
açıp **Yayınla** → *"Planınızı Yükseltin"* (`upgrade`), Elit vurgulu. İkisi de Faz
10'dan önce de böyleydi; değişmemiş olmaları bu adımın kanıtı.
