# `src/pages/CreatePage.tsx` — Faz 10 değişikliği (10.8d)

> **Kod dosyası:** `davetkart-frontent/src/pages/CreatePage.tsx`
> **Faz:** 10 — Sertleştirme, adım 10.8'in dördüncü parçası
> **Birlikte değişenler:** `components/create/EditorWorkspace.tsx` (duvar oradan çıktı) ·
> `components/payment/PaywallModal.tsx` (yalnızca açıklama)
> **İlgili:** [`../stores/useInvitationStore.md`](../stores/useInvitationStore.md) Faz 10 eki ·
> [`../components/create/EditorWorkspace.md`](../components/create/EditorWorkspace.md)

---

## 1. Ne değişti?

İki şey:

```tsx
// 1) Plan duvarı sayfa seviyesinde, tek kopya
return (
  <>
    <AnimatePresence mode="wait">{/* build | generating | editor */}</AnimatePresence>
    <PaywallModal />
  </>
);

// 2) Sayfaya girerken ve çıkarken açık kalmış duvar kapatılır
useEffect(() => {
  useSubscriptionStore.getState().closePaywall();
  return () => useSubscriptionStore.getState().closePaywall();
}, []);
```

---

## 2. 🔴 Duvar neden stüdyodan sayfaya taşındı?

Faz 10'a kadar `<PaywallModal />` yalnızca `EditorWorkspace`'in içindeydi, çünkü
402'yi yalnızca stüdyodaki **Yayınla** düğmesi üretiyordu.

Backend 10.1'den sonra 402'nin ikinci bir kaynağı var: yayındaki davetiyede plan
üstü bir modülün otomatik kaydı. Modül anahtarları ise **stüdyoda değil**:

| Sihirbaz aşaması | Bileşen | Modül anahtarları | Duvar (eski) |
|---|---|---|---|
| `build` | `DetailsFormStep` (Grup C) | ✅ **Burada** | ❌ Yok |
| `editor` | `EditorWorkspace` | ❌ | ✅ |

Kullanıcının yolu: Panel → **Düzenle** (stüdyo açılır) → *Tasarımını Düzenle*
(`build` aşamasına döner) → anahtarı açar. Duvar yalnızca stüdyoda yaşasaydı,
`useInvitationStore` onu açardı (`isPaywallOpen = true`) ama ekranda **hiçbir şey**
görünmezdi — yalnızca kendiliğinden kapanan bir anahtar.

Otomatik kaydetme hook'u (`useInvitationAutoSave`) zaten sayfa seviyesindeydi,
çünkü her aşamayı kapsıyor. 402 de her aşamadan gelebildiğine göre, onu gösteren
duvar da aynı seviyede durmalı: **üreten ile gösteren aynı kapsamda.**

> Portal (`createPortal(…, document.body)`) sayesinde duvarın **nerede
> çizildiği** değişmedi; değişen yalnızca **ne zaman var olduğu**.

---

## 3. Neden girişte ve çıkışta kapatılıyor?

Sayfadan ayrılırken otomatik kaydetme bekleyen yazımı **boşaltır** (`flush`). Bu
bir ağ isteğidir ve cevabı sayfa kapandıktan **sonra** gelebilir:

```
t=0.0  kullanıcı galeriyi açar
t=0.5  "Panelim"e tıklar → CreatePage kapanır → flush → PUT
t=0.8  402 gelir → store duvarı "açar"   (ama çizecek bileşen yok)
…      kullanıcı panelden BAŞKA bir davetiyeyi açar
       → CreatePage yeniden açılır → duvar ESKİ davetiyenin planıyla belirir  🔴
```

Duvarın `invitationId`'si eski davetiyeyi gösterdiği için bu yalnızca şaşırtıcı
değil, **yanlış hedefe** checkout başlatabilecek bir durum. Girişteki
`closePaywall()` bu kalıntıyı temizler; çıkıştaki, sayfa açıkken açılmış bir
duvarın sayfa dışına taşınmamasını sağlar.

`closePaywall()` bir checkout sürerken (`isProcessing`) hiçbir şey yapmaz — ödeme
sayfasına yönlendirme ortasında duvar kaybolmaz.

> ⚠️ Bu davranış bir React efektine bağlı olduğu için `verify:state` onu
> sınayamaz (betik React çizmez). Elle doğrulama: aşağıdaki §5.

---

## 4. `PaywallModal.tsx`'te ne değişti?

Yalnızca açıklama. İlk cümle *"Yayınlama 402 ile reddedildiğinde açılan plan
duvarı"* diyordu; artık iki kaynağı da sayıyor ve duvarın CreatePage'de tek kopya
olduğunu söylüyor. Portal paragrafı da güncellendi: sebep (Motion'ın `transform`'u
`fixed` konumu hapseder) hâlâ geçerli, ama artık *"EditorWorkspace'in sarmalayıcısı"*
değil *"sihirbaz aşamalarının sarmalayıcıları"*. **B4**: yorum koddan farklı bir şey
söylememeli.

---

## 5. Kendin dene (elle)

1. Standart plan ile bir davetiye yayınla.
2. Panel → **Düzenle** → *Tasarımını Düzenle*.
3. **Fotoğraf Galerisi** anahtarını aç.
   Beklenen: ~1,5 sn sonra duvar *"Planınızı Yükseltin"* ile açılır, **Elit**
   vurgulu; anahtar kapanır.
4. Duvarı kapat, anahtarı yeniden aç ve **hemen** "Panelim"e git (1,5 sn dolmadan).
5. Panelden **başka** bir davetiyeyi düzenlemeye aç.
   Beklenen: duvar **açılmaz**.

```powershell
npm run lint
npm run build
```
