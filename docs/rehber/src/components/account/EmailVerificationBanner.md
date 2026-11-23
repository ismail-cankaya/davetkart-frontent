# `src/components/account/EmailVerificationBanner.tsx`

> **Faz 19 (19.14 · K191, SEC-09)** · Yer: `AppLayout` (Header'ın hemen altı) · Servis: `accountService.resendEmailVerification()`

## Ne yapar

Oturumdaki kullanıcı için sunucu `emailVerified: false` dediyse sayfanın üstünde bir bant gösterir:
"{{email}} adresine doğrulama bağlantısı gönderdik; ödeme ve yayın için doğrulayın" + **Bağlantıyı yeniden gönder**.
Düğme `POST /api/auth/email-verification` çağırır (saatte 3). Başarıda bilgi toast'u, hata (ör. 429) `toDisplayError` ile.

## Neden yalnızca açık `false`ta

`AuthUser.emailVerified` opsiyonel. Alan gelmeden önce localStorage'a yazılmış oturumlar onu taşımaz ve bant onlara
gösterilmez. `refreshSession()` ilk açılışta kullanıcıyı sunucudan tazeler; alan oradan gelir. `undefined`'ı
"doğrulanmamış" saymak, doğrulanmış kullanıcılara bir an yanlış bant gösterirdi.

## Bilerek yapılmayan

- Bant kapatılamaz: kullanıcı doğrulayana kadar ödeme ve yayın 403 alır, uyarının görünür kalması gerekir.
- Doğrulama durumu periyodik sorgulanmaz. Bağlantı aynı tarayıcıda açılırsa `EmailVerificationPage` oturumu tazeler;
  başka cihazda açılırsa bir sonraki sayfa yüklemesinde `refreshSession()` tazeler.
