# `src/services/rsvpReceipts.ts` — Misafirin kendi yanıtını güncellemesi

> **Kod dosyası:** `davetkart-frontent/src/services/rsvpReceipts.ts`
> **Faz:** 10 — Dilim F, adım FE 10.18 · **Karar:** **K101** (misafire düzenleme kodu)
> **Birlikte değişenler:** `services/rsvps.ts` (`update`) · `services/persistence.ts` (`updateRsvp`) ·
> `stores/useRsvpStore.ts` (`ownReply`, `submitDraft`) · `templates/shared/RSVPForm.tsx` ·
> `preview/RsvpModal.tsx` · `types.ts` (`editCode`, `RsvpReceipt`)
> **Backend:** `PUT /api/public/invitations/{id}/rsvps/{rsvpId}` (backend 10.59 · `UpdateRsvpAction`)

---

## 1. Çözdüğü sorun

Misafir formu iki kez gönderirse iki satır oluşuyordu: davetiye sahibi aynı adı iki kez
görüyor, kişi sayısı kotadan iki kez düşüyordu. Backend artık ilk gönderimin yanıtında bir
**düzenleme kodu** veriyor (`editCode`). Frontend bu kodu davetiye başına saklıyor ve ikinci
gönderimi **güncelleme** olarak yapıyor.

## 2. Akış

```
ilk gönderim     POST /public/invitations/{id}/rsvps        → { id, …, editCode }
                 rsvpReceipts.remember(id, { rsvpId, editCode })
ikinci gönderim  PUT  /public/invitations/{id}/rsvps/{rsvpId}  gövde: form + editCode
sayfa yenilendi  setInvitationScope(id) → rsvpReceipts.recall(id) → ownReply
```

| PUT'un cevabı | Ne olur |
|---|---|
| 200 | Aynı yanıt güncellendi; listede bir kez görünür |
| 404 `RESOURCE_NOT_FOUND` | Sahip yanıtı silmiş ya da kod geçersiz: kod **unutulur**, yeni yanıt gönderilir, yeni kod saklanır |
| Diğer (son tarih, kota, ağ) | Hata misafire gösterilir; **yeni yanıta düşülmez**, kod korunur |

### 2.1 Neden yalnızca 404'te yeni yanıta düşülüyor?

404 *"bu yanıt artık yok"* demek: misafir için doğru davranış, yanıtını yeniden kaydetmek.
Son tarih geçmişse ya da kota doluysa yeni bir POST da aynı nedenle reddedilir. Daha kötüsü:
kota dolu değilken bir ağ hatasında POST'a düşmek, ikinci satırı (çözmek istediğimiz hatayı)
geri getirirdi.

## 3. Saklama

| | |
|---|---|
| Anahtar | `davetkart_rsvp_receipt:<davetiye kimliği>` |
| Değer | `{ rsvpId, editCode }` (şekli okunurken denetlenir) |
| Depo yok/kapalı | Her erişim try/catch içinde: misafir her seferinde yeni yanıt gönderir, form bozulmaz |

Kod **tarayıcıya** bağlı. Misafir başka bir cihazdan gönderirse kod yoktur ve yeni satır açılır;
bu, kararın bilinen bedeli (backend `UpdateRsvpAction.md` §6).

## 4. Arayüz

- Bu cihazdan daha önce yanıt verildiyse form düğmesinin üstünde şu not çıkıyor: *"Bu cihazdan
  daha önce yanıt verdiniz. Yeniden gönderirseniz yanıtınız güncellenir."*
- Düğme *"Yanıtımı Güncelle"* oluyor.
- Başarı başlığı *"Yanıtınız güncellendi"* oluyor.
- Başlık **gönderim anındaki** duruma göre seçiliyor. Gönderimden sonra `ownReply` her zaman
  dolu; ona bakılsaydı ilk gönderim de *"güncellendi"* derdi.
- Önizleme yüzeyleri (`invitationId = null`) etkilenmiyor: `ownReply` orada hep `null`.

## 5. Tuzak alanı güncellemede yok

`website` (honeypot) ilk gönderimde gövdede **olmak zorunda** (B9). Güncelleme ucunda ise bu
alanın karşılığı yok: kodu bilmeyen o uca gelemez. Servis alanı gövdeden çıkarıyor.

## 6. Doğrulama

| Komut | Bölüm | Kontrol |
|---|---|---|
| `npm run verify:endpoints` | *"LCV uçları"* | PUT yolu, gövdede `editCode`, `website` yok |
| `npm run verify:state` | *"LCV: kendi yanıtını güncelleme"* | 7 kontrol (bkz. §2 tablosu + sayfa yenileme + liste tekilliği) |

**Mutasyon (FE 10.18):**

| Mutasyon | Kırılan |
|---|---|
| Kod yok sayılsın (hep POST) | ikinci gönderim · tuzak · yenileme |
| 404'te yeni yanıta düşülmesin | 404 kontrolü (ilk sürümde betik çöküyordu; istisna yakalanıp kontrole çevrildi) |
| Her hatada yeni yanıta düşülsün | son tarih kontrolü |
| Kod hatırlanmasın | yenileme · son tarih |
| Liste eski kaydı çıkarmasın | liste tekilliği |
| Güncellemede tuzak alanı gitsin | iki betikte de |

**Elle:** yayındaki bir davetiyede formu gönder → sayfayı yenile → not ve *"Yanıtımı Güncelle"*
görünmeli → kişi sayısını değiştirip gönder → panelde tek satır, yeni sayı.

## 7. 🆕 FE 10.23 — çizim ve tarayıcı doğrulaması (2 Ekim 2026)

**Çizim:** `npm run verify:render` → *"LCV: kendi yanıtını güncelleme"*: kod yokken form *"Katılımımı
Bildir"*, kod tarayıcıda varken *"Yanıtımı Güncelle"* ve açıklama; önizleme penceresi (`RsvpModal`) ve
misafir sayfasının tamamı (tembel bölümler dahil) aynı. Kod davetiyeye özgü. Ayrıntı:
[`../../scripts/verify-render.md`](../../scripts/verify-render.md).

**Tarayıcıda (Vite 3017 + geliştirme backend'i):** Elit davetiyede form gönderildi → kod tarayıcıya
yazıldı → sayfa yenilendi → *"Yanıtımı Güncelle"* ve açıklama göründü → kişi sayısı 4 yapılıp
gönderildi → sahibin listesinde **tek** satır, 4 kişi.

> Sekme arka planda kaldığı için (`visibilityState: hidden`) tarayıcı animasyonları durdurdu ve
> gönderim sonrası *"Yanıtınız güncellendi"* başlığı ekrana gelmedi (form çıkış animasyonu bitmedi).
> Sunucu tarafı ve formun iki hâli doğrulandı; başlığın kendisi ön plandaki bir sekmede elle bakılacak.
