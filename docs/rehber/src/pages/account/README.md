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
