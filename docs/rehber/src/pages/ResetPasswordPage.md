# `src/pages/ResetPasswordPage.tsx` — Yeni şifre belirleme (`/sifre-sifirla`)

> **Kod dosyası:** `davetkart-frontent/src/pages/ResetPasswordPage.tsx`
> **Faz:** 10 — Dilim D, adım FE 10.16 (plandaki 10.37)
> **Birlikte gelenler:** [`ForgotPasswordPage.md`](ForgotPasswordPage.md) · `services/auth.ts` (`resetPassword`) ·
> `stores/sessionActions.ts` (`signOut({ revoke: false })`) · `App.tsx` (rota)
> **Backend:** `POST /api/auth/reset-password` → 204 (backend 10.33 · `ResetPasswordAction`) ·
> bağlantıyı kuran `ResetPasswordNotification::resetUrl()` (backend 10.34)

---

## 1. Bağlantı nereden geliyor?

Maildeki *"Parolamı Sıfırla"* düğmesi şu adrese gider:

```
{FRONTEND_URL}{password_reset_path}?token=…&email=…
 └ backend .env  └ config/davetkart.php → '/sifre-sifirla'
```

🔴 **Bu rotanın yolu backend'deki değerle aynı olmalı.** Biri değişip öteki değişmezse
maildeki bağlantı `*` rotasına düşer ve kullanıcı hiçbir hata görmeden ana sayfaya atılır.
İki tarafta da yorum var (`App.tsx` · `config/davetkart.php`); otomatik bir denetim yok,
çünkü backend config'i frontend'in derlemesine girmiyor.

Bağlantı neden Host başlığından değil de config'ten kuruluyor: backend
`ResetPasswordNotification.md` (*password reset poisoning*).

## 2. Akış

| Durum | Ekran |
|---|---|
| `token` ya da `email` yok | *"Bağlantı Geçersiz"* + *"Yeni Bağlantı İsteyin"* |
| Form gönderildi, 204 | Oturum (aynı hesapsa) kapanır → toast → `/login` |
| 422 `PASSWORD_RESET_INVALID` | *"Bağlantı Geçersiz"* görünümüne geçer |
| 422 `VALIDATION_FAILED` / 429 | Toast, form kalır |

### 2.1 Neden tek bir "geçersiz" ekranı?

Backend token yanlış mı, süresi mi dolmuş, adres mi tutmuyor, **ayırmaz**: tek kod,
alan yok (backend H6). Ayırsaydı *"bu adres kayıtlı ama token yanlış"* bilgisini verirdi.
Kullanıcı açısından üçünün çaresi de aynı: yeni bağlantı. Görünümdeki düğme adresi
`/sifremi-unuttum`'a taşır.

Form o noktada bir daha işe yaramadığı için hata toast değil, sayfanın kendisi oluyor.

## 3. 🔴 Başarıdan sonra oturum

Backend şifreyi yazarken o hesabın **bütün** token'larını siler. Kullanıcı bu cihazda aynı
hesapla açıksa, store'daki token artık sunucuda yok.

```ts
if (useAuthStore.getState().user?.email === email) {
  signOut({ revoke: false });
}
```

| Seçim | Neden |
|---|---|
| `signOut`, `logout` değil | Hesaba ait bellek (editör, LCV listesi, ETag önbelleği) de temizlenmeli |
| `revoke: false` | Token sunucuda zaten silindi; iptal isteği yalnızca bir 401 dönerdi |
| Yalnızca **aynı** adres | Bu cihazda başka bir hesap açıksa onun token'ı geçerli; ona dokunmak gereksiz bir çıkış olurdu |

Adres karşılaştırması düz eşitlik: ikisi de backend'in normalize ettiği hâliyle geliyor
(store'daki kullanıcı ve maildeki `email` parametresi).

Başarıda **giriş yapılmaz**. Backend token vermiyor; kullanıcı yeni şifresiyle girer.
Bu bilinçli: şifre sıfırlama bağlantısını ele geçiren biri en azından yeni şifreyi
bilmeden oturum açamaz.

## 4. Form ayrıntıları

- **Adres salt okunur.** Token o adresle eşleşmeli; değiştirmenin tek sonucu 422 olurdu.
  `autoComplete="username"`: şifre yöneticisi yeni şifreyi doğru hesaba kaydetsin.
- **`minLength={8}`**: backend kuralı (`min:8`, kayıtla aynı). Giriş formunda bilerek
  yok (`LoginPage` yorumu); burada şifre **üretiliyor**.
- **Tekrar alanı yok**: kayıt formuyla aynı. Backend `confirmed` istemiyor.

## 5. Bilinen sınırlar

- **Token tarayıcı geçmişinde kalır.** Adres çubuğundan silinmiyor; silinseydi sayfa
  yenilendiğinde form kaybolurdu. Token tek kullanımlık (başarıda silinir) ve süreli
  (`auth.passwords.users.expire`, 60 dk).
- **Referer:** sayfa dış kaynağa bağlantı vermiyor. Tarayıcıların varsayılanı
  (`strict-origin-when-cross-origin`) dışarıya zaten yalnızca kökeni gönderir.
- **Terim:** arayüz *"şifre"* diyor (giriş/kayıt formları böyleydi), backend maili ve
  hata metinleri *"parola"*. Kullanıcı mailde *"Parolamı Sıfırla"*ya basıp *"Yeni
  Şifrenizi Belirleyin"* sayfasına geliyor. Faz 10'da düzeltilmedi; tek terime inmek
  ayrı bir metin geçişi.

## 6. Doğrulama

| Komut | Bölüm | Ne sınanıyor |
|---|---|---|
| `npm run verify:endpoints` | *"Şifre sıfırlama uçları (Faz 10)"* | Yol, yöntem, gövdede `token` · `email` · `password` |
| `npm run verify:state` | *"Oturum sınırları"* | `signOut({ revoke: false })` belleği temizler, `/auth/logout` göndermez |
| `npm run verify:errors` | | `PASSWORD_RESET_INVALID`'in iki dilde metni var, `VALIDATION_FAILED`'den farklı |

**Mutasyon kanıtı (FE 10.16'da denendi):**

| Mutasyon | Kırılan |
|---|---|
| `logout` `revoke`'u yok saysın | *"iptal isteği gönderilmiyor"* |
| `resetPassword` gövdesinden `token` düşsün | *"gövdede 'token' yok"* |

**Elle** (`ForgotPasswordPage.md` §5'in devamı):

```
1. Logdaki bağlantıyı aç → adres salt okunur alanda
2. 8 karakterden kısa şifre → tarayıcı göndermez
3. Geçerli şifre → "Şifreniz yenilendi" → /login → yeni şifreyle giriş
4. Aynı bağlantıyı yeniden aç ve gönder → "Bağlantı Geçersiz"
5. Bağlantıdan token'ı sil → doğrudan "Bağlantı Geçersiz"
```
