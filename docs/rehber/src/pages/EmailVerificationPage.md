# `src/pages/EmailVerificationPage.tsx`

> **Faz 19 (19.14 · K191, SEC-09)** · Rota: `/eposta-dogrula` (backend `davetkart.frontend.email_verification_path`) · Kardeş: `EmailChangeConfirmPage`

Postadaki bağlantının hedefi. Oturum istemez (bağlantı başka cihazda açılabilir); yetkinin kanıtı sorgudaki imza.
Sorgu `accountService.confirmEmailVerification(search)` ile backend'e **aynen** gider; yeniden kurulmaz, çünkü imza
kodlamayı kapsar (`EmailChangeConfirmPage` ile aynı gerekçe).

| Aşama | Gösterilen |
|---|---|
| `confirming` | dönen simge |
| `done` | "adresiniz doğrulandı" + oturum açıksa **Panelim**, değilse **Giriş Yap**; oturum açıksa `refreshSession()` ile bant kalkar |
| `failed` | `EMAIL_VERIFICATION_INVALID` çevirisi (geçersiz, süresi dolmuş ya da kullanılmış) |

İstek yalnızca bir kez gider (`useRef`): StrictMode effect'i iki kez çalıştırır ve bağlantı tek kullanımlık; ikinci
istek "kullanılmış" derdi. Metinler `auth.verification.*` çevirilerinde (`verify:i18n` gömülü Türkçe saymaz).
