# `src/pages/ForgotPasswordPage.tsx` — Şifre sıfırlama bağlantısı isteme (`/sifremi-unuttum`)

> **Kod dosyası:** `davetkart-frontent/src/pages/ForgotPasswordPage.tsx`
> **Faz:** 10 — Dilim D, adım FE 10.16 (plandaki 10.37)
> **Birlikte gelenler:** [`ResetPasswordPage.md`](ResetPasswordPage.md) (bağlantının açtığı sayfa) ·
> `services/auth.ts` (`requestPasswordReset`) · `LoginPage.tsx` (*"Şifremi unuttum"*) · `App.tsx` (rota)
> **Backend:** `POST /api/auth/forgot-password` → 202 (backend 10.32 · `SendPasswordResetLinkAction`)

---

## 1. Çözdüğü sorun

Faz 9'a kadar şifresini unutan kullanıcının yapabileceği bir şey yoktu: ne bir bağlantı
ne bir uç vardı. Hesap (ve içindeki ödenmiş davetiyeler) kalıcı olarak kilitli kalıyordu.

## 2. 🔴 "Gönderildi" ekranı hesabın varlığını söylemez

Backend her adrese **aynı 202**'yi döner. Kayıtlı adrese mail gider, kayıtsız adrese
gitmez, ama cevap aynıdır. Amaç: formu kullanarak *"bu kişi DavetKart üyesi mi?"*
sorusunu cevaplatamamak (enumeration).

Arayüz bu sırrı geri açmamalı. Bu yüzden metin **koşullu**:

> *"ayse@ornek.com bir hesaba kayıtlıysa şifre sıfırlama bağlantısını gönderdik."*

| Yazılabilecek ama yazılmayan | Neden |
|---|---|
| *"Bağlantı gönderildi"* | Kayıtsız adres için yalan |
| *"Bu adrese ait hesap bulunamadı"* | Backend'in sakladığını söyler |

`services/auth.ts` → `requestPasswordReset` bu yüzden `Promise<void>` döner: istemcinin
okuyabileceği bir *"gönderildi mi?"* bilgisi yok.

## 3. Hatalar

| Durum | Cevap | Ekran |
|---|---|---|
| Kayıtlı ya da kayıtsız adres | 202 | *"Gönderildi"* görünümü |
| Biçimsiz adres | 422 `VALIDATION_FAILED` | Toast (tarayıcının `type="email"` denetimi çoğunu önden yakalar) |
| Aynı adresle dakikada 5'ten, aynı IP'den 20'den fazla deneme (`throttle:auth`) | 429 `RATE_LIMITED` | Toast: *"… sonra tekrar deneyin"* |

## 4. Giriş formundan adres taşıma

`LoginPage`'deki *"Şifremi unuttum"* bağlantısı yazılmış adresi router state'iyle taşır
(`ForgotPasswordState`). Kullanıcı giriş denemesinde yazdığı adresi yeniden yazmaz.
State URL'ye yazılmaz; sayfa yenilenirse alan boş gelir, sorun değil.

Bağlantı şifre alanının **altında**. Üstünde dursaydı klavyeyle e-postadan şifreye
geçerken (Tab) araya girerdi.

## 5. Doğrulama

`npm run verify:endpoints` → *"Şifre sıfırlama uçları (Faz 10)"*: yol, yöntem ve
gövdedeki `email`.

**Elle:**

```
1. Backend: MAIL_MAILER=log ve kuyruk işçisi açık (php artisan queue:work)
   (bildirim kuyruğa gider; işçi yoksa mail hiç yazılmaz)
2. /login → adresi yaz → "Şifremi unuttum" → adres alanda dolu gelmeli
3. Gönder → "kayıtlıysa … gönderdik" görünümü
4. storage/logs/laravel.log → Türkçe mail ve /sifre-sifirla?token=…&email=… bağlantısı
5. Kayıtsız bir adresle 2–3'ü tekrarla → ekran AYNI, logda mail YOK
```
