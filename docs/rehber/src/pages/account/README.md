# Hesap ayarları — Faz 14 (frontend)

> **Backend:** `docs/rehber/fazlar/FAZ-14.md` (backend deposu) · **Kararlar:** K137–K145

## 1. Dosyalar

| Katman | Dosya | İş |
|---|---|---|
| Tip | `src/types.ts` (sonu) | `AccountEntitlements`, `EntitlementRight`, `EntitlementState`, `RefundBlocker`, `AccountSession`, … |
| Servis | `src/services/account.ts` | 10 uç, yanıt biçimi sınırda doğrulanır |
| Store | `src/stores/useAccountStore.ts` | Haklar + oturumlar; yazmadan sonra **yeniden okur** |
| Hook | `src/hooks/useAccountEntitlements.ts` | Bölüm açılınca tazele, hata toast |
| Etiket | `src/utils/accountLabels.ts` | Kod → Türkçe metin, rozet tonları, tarih |
| Bileşen | `src/components/account/*` | Kart, menü, formlar, hak satırı, oturum listesi, sipariş listesi, hesabı sil |
| Sayfa | `src/pages/account/*`, `src/pages/EmailChangeConfirmPage.tsx` | Bölümler, `/eposta-onay` |

## 2. 🔴 Frontend saymaz

"2 Gold aldı, 1'ini iptal etti → 1" sayısı **backend'in** (`SummarizeEntitlementsAction`).
Ekran yalnızca `tiers[].available`'ı gösterir. İptal ya da vazgeç sonrası store listeyi
**yeniden okur**; "bir kovadan düş, diğerine ekle" yerelde yapılsaydı kuralın (iade, yanma,
dondurma) ikinci bir kopyası olurdu ve bir gün ayrışırdı. K128'in (fiyatı frontend hesaplamaz)
haklar için hali.

"İptal Et" düğmesi `refund.eligible`'a göre görünür ama karar sunucunun: arada başka bir
sekmede yayın yapılmış olabilir. 409 `REFUND_NOT_ALLOWED` gelirse sebep (`params.reason`)
cümleye çevrilir (`toDisplayError` → `refundReasons.*`) ve liste tazelenir.

## 3. Güvenlik ekranının üç kuralı

1. **Parola:** tekrar alanı yalnızca formda; backend sözleşmesi kayıtla aynı. Başarıda bu
   cihaz kalır, diğerleri sunucuda kapanır (K142); oturum listesi tazelenir.
2. **E-posta:** başarı mesajı yalnızca "bağlantı gönderildi" der. Backend adres başka hesapta
   kayıtlı olsa da aynı 202'yi döner (K144); ekran daha fazlasını bilmez, bilmemeli.
3. **Oturumlar:** "bu cihaz" satırında "kapat" yerine **çıkış yap**. Kendi token'ını silen
   istemcinin bir sonraki isteği 401 alır ve kullanıcı sebebini anlamazdı. IP/konum yok (K143).

## 4. `/eposta-onay`

- Oturum **istemez**: bağlantı telefonda açılabilir.
- Sorgu backend'e **aynen** gider (`confirmEmailChange(search)`). `URLSearchParams` ile yeniden
  kurmak `%2B`'yi (`+`) bozabilir ve imza tutmaz. `verify-endpoints` bunu sınıyor.
- İstek **bir kez** gider (`useRef`): StrictMode effect'i iki kez çalıştırır ve bağlantı tek
  kullanımlık — ikinci istek "geçersiz" derdi.
- Başarıda backend bütün oturumları kapatmış olur; bu sekmede oturum açıksa
  `signOut({ revoke: false })`.

## 5. Panel rozeti

`DashboardPage` başlığında, kullanılabilir hak varsa **"N kullanılabilir hak"** →
`/hesap/planlarim`. Hata sessiz: rozet bir kısayol, panelin işi değil.

## 6. Çıkışta temizlik

`sessionActions.signOut()` artık `useAccountStore.reset()`'i de çağırıyor: paylaşılan bir
cihazda bir sonraki hesabın Planlarım'ı öncekinin haklarını bir an bile göstermesin.

## 7. 🆕 Faz 18.4 (`SEC-02` · K166): yayın yapmış hak iade edilmez

> **Backend:** `docs/rehber/fazlar/FAZ-18.md` §18.4 · `docs/rehber/app/Services/Refund/RefundEligibility.md` §6–§7 (backend deposu)

**Ne değişti (backend):** Yayınlanmış bir davetiye 3 gün içinde silinince hak serbest kalır
(K82) ve Planlarım'da **"Kullanılabilir"** görünür: yeni bir davetiyeyi yayınlayabilir. Ama artık
iade edilemez; backend hak listesinde `refund.eligible: false` ve `refund.blocker: 'used'` döner,
iade isteği 409 `REFUND_NOT_ALLOWED` + `reason: 'used'` alır. Önceden bu hak "İptal Et" düğmesini
gösteriyor ve iade ediliyordu (denetim bulgusu `SEC-02`).

| Dosya | Değişiklik |
|---|---|
| `src/types.ts` | `RefundBlocker` birliğine `'used'` |
| `src/locales/tr/errors.json` · `src/locales/en/errors.json` | `refundReasons.used`: 409 toast'ında "Bu hak iptal edilemiyor: …" cümlesinin devamı |
| `src/components/account/RightRow.tsx` | `available` + `blocker === 'used'` satırına tek cümlelik açıklama |
| `src/pages/PricingPage.tsx` | "İade alabilir miyim?" cevabı: yayın yapmış hak iade edilmez, 3 günde silinirse yeniden kullanılır |

**Neden `in_use` değil?** `in_use`'un cümlesi "hak bir davetiyede kullanılıyor". Bu hak hiçbir
davetiyede değil ve rozeti "Kullanılabilir". Aynı satırda iki çelişkili söz kullanıcıya yanlış
eylemi önerirdi ("davetiyeyi silersem iade alırım").

**Neden açıklama satırı?** Eskiden `available` + `eligible: false` yalnızca süresi geçmiş ya da
hediye koduyla alınmış haklarda olurdu ve kullanıcı nedenini tahmin edebiliyordu. `used` yeni
bir durum: aynı hakta dün "İptal Et" vardı. Düğmenin sessizce kaybolması "hata mı?" sorusunu
doğururdu. Açıklama yalnızca `used` için; diğer engellerin ekrandaki davranışı değişmedi.

**Sözleşme kopyası değişmedi:** `src/contracts/error-codes.json` parametrenin **adını**
(`reason`) taşır, değerlerini değil. Backend `contracts/error-codes.json` aynı kaldı;
`verify:errors` yeşil.

**Kural yine frontend'de değil:** düğmeyi `refund.eligible` gösterir, metni `refund.blocker`
seçer. Frontend "bu hak yayın yaptı mı?" diye kendisi sormaz (§2: K128'in haklar için hali).

**Elle dene** (backend `PAYMENT_DRIVER=fake`): Standart al → davetiyeyi yayınla → aynı gün sil →
Hesap Ayarları → Planlarım. Hak "Kullanılabilir"; "İptal Et" yok; altında "Bu hakla daha önce
bir davetiye yayınlandığı için iptal edilemez…" yazar. Yeni bir davetiye yayınla: hak ona bağlanır.

| Sık hata | Sonuç |
|---|---|
| `refundReasons.used` çevirisini eklememek | Toast'ta ham `used` kelimesi (`defaultValue`) |
| Açıklamayı `!right.refund.eligible`'a bağlamak | Süresi geçmiş ve hediye haklarına da "yayın yapıldı" yazar |
| Hakkı `in_use` kovasına taşımak ("iade edilemiyorsa kullanılıyordur") | Sayaç yanlış: hak yeni bir davetiyede kullanılabilir (K82) |
