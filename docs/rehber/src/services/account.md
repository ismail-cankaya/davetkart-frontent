# `src/services/account.ts` — hesap ayarlarının backend sınırı

> **Faz:** 14 · **Sınama:** `scripts/verify-endpoints.ts` → *"Hesap ayarları uçları (Faz 14)"*

| Metot | Uç | Not |
|---|---|---|
| `getEntitlements` | `GET /account/entitlements` | Biçim doğrulanır |
| `requestRefund(orderId, reason)` | `POST /orders/{id}/refund-request` | Boş açıklama gönderilmez |
| `withdrawRefund(orderId)` | `DELETE /orders/{id}/refund-request` | |
| `updateProfile` | `PATCH /auth/me` | `{data: user}` döner; store'a `setUser` |
| `changePassword` | `PUT /auth/password` | 204 |
| `requestEmailChange` | `POST /auth/email-change` | 202, adres kullanımda olsa da |
| `confirmEmailChange(rawQuery)` | `POST /public/email-change/confirm?…` | 🔴 Sorgu AYNEN |
| `listSessions` · `revokeSession` · `revokeOtherSessions` | `GET/DELETE /auth/sessions[/{id}]` | |

**Neden `authService`'e eklenmedi?** `authService` oturumun kendisiyle (giriş, çıkış, önbellek)
ilgileniyor; bu servis hesabın **ayarlarıyla**. Değişme sebepleri ayrı (SRP). `deleteAccount`
tarihsel olarak `authService`'te kaldı: hesap silmek bir oturum sonu da.

`useAuthStore`'a tek satırlık `setUser(user)` eklendi: profil güncellenince başlıktaki ad
hemen değişir ve önbelleğe yazılır; token dokunulmaz.


## 🆕 Faz 19 (19.14 · K191, SEC-09)

- `resendEmailVerification()` → `POST /auth/email-verification` (204; saatte 3, 429 `RATE_LIMITED`).
- `confirmEmailVerification(rawQuery)` → `POST /public/email-verification/confirm?<sorgu aynen>` (204 · 422 `EMAIL_VERIFICATION_INVALID`).
- Yeni hata kodları `EMAIL_NOT_VERIFIED` (403: ödeme/yayın) ve `EMAIL_VERIFICATION_INVALID` `src/contracts/error-codes.json` kopyasında ve tr/en `errors.json`'da.

## 🆕 Faz 22 (22.1 · K276)

`EMAIL_NOT_VERIFIED` silindi (backend artık fırlatmıyor; sözleşme kopyası ve tr/en `errors.json` aynı maddede).
`resendEmailVerification()` ve `confirmEmailVerification()` değişmedi.
