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
