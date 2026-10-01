# `src/pages/AccountPage.tsx` — Hesap ayarları ve hesabı silme (`/hesap`)

> **Kod dosyası:** `davetkart-frontent/src/pages/AccountPage.tsx`
> **Faz:** 10 — Dilim D, adım FE 10.17 (plandaki 10.46)
> **Birlikte gelenler:** `services/auth.ts` (`deleteAccount`) · `App.tsx` (korumalı rota) ·
> `DashboardPage.tsx` (*"Hesap Ayarları"* bağlantısı) · `scripts/verify-endpoints.ts` (*"Hesap silme ucu"*)
> **Backend:** `DELETE /api/auth/me` → 204 (backend 10.39–10.40 · `DeleteAccountAction`) · **K97** (H-1: anonimleştirme)
> **Önce oku:** [`ResetPasswordPage.md`](ResetPasswordPage.md) §3 (`signOut({ revoke: false })`)

---

## 1. Çözdüğü sorun

KVKK kişiye verisinin silinmesini isteme hakkı verir. Faz 9'a kadar bunun tek yolu
`kvkk@davetkart.com`'a mail yazmaktı; kod tarafında bir hesap silme yolu yoktu ve
backend `orders.user_id` üzerinden `cascade` ile ödeme kayıtlarını da silerdi (K82 ile
çelişki). Backend 10.38–10.41 bunu çözdü; bu sayfa ucun arayüzü.

## 2. Akış

```
/dashboard → "Hesap Ayarları" → /hesap
  → "Hesabımı Sil"                 (yalnızca formu açar)
  → şifre + "Hesabımı Kalıcı Olarak Sil"
      204 → ana sayfa → signOut({ revoke: false }) → toast
      422 password → alanın altında "Parola hatalı."
      429 / diğer → toast
```

### 2.1 Neden iki adım ve neden şifre?

| Koruma | Neye karşı |
|---|---|
| İlk düğme yalnızca formu açar | Yanlış tıklama |
| Şifre (backend `current_password:sanctum`) | Açık kalmış bir oturumu bulan başkası. Tarayıcının onay penceresi bunu vermez: *"Tamam"*a herkes basabilir |

Şifre kontrolü **backend'de**. Frontend'in yapabileceği bir doğrulama yok; yanlış şifre
`VALIDATION_FAILED` olarak `password` alanında döner ve `toFieldErrors` ile alanın altına
yazılır. Kuralın metni (`validation.rules.current_password`) FE 10.15'te eklendi; eklenmeseydi
kullanıcı *"Parola geçerli değil"* okurdu (`verify:errors` 5b).

### 2.2 Başarıdan sonra sıra: önce yönlendir, sonra oturumu kapat

```ts
navigate('/', { replace: true });
signOut({ revoke: false });
```

Ters sırada `ProtectedRoute` oturumun düştüğünü görüp sayfayı `/login`'e çevirebilir;
kullanıcı az önce sildiği hesap için *"Tekrar Hoş Geldiniz"* ekranı görürdü.
`replace`: geri tuşu silinmiş hesabın sayfasına dönmesin.

`revoke: false`: backend token'ı zaten sildi (`useAuthStore.md` §7). `signOut`
(sadece `logout` değil): silinmiş hesabın tasarımı ve LCV listesi sekmede kalmamalı.

## 3. Ekrandaki metin, backend'in yaptığıyla birebir

| Metin | Backend (`DeleteAccountAction`, K97) |
|---|---|
| Yayındakiler dahil bütün davetiyeler silinir | `Invitation::withTrashed()` → model üzerinden `forceDelete()` (cache de temizlenir) |
| Katılım yanıtları, misafir foto/videoları, galeri silinir | Davetiyeyle birlikte satırlar · dosyalar commit'ten sonra diskten |
| Bütün oturumlar kapanır | `tokens()->delete()` |
| Plan hakları sona erer, ödeme kayıtları bağı kaldırılarak saklanır | `orders.user_id` → `NULL` (`nullOnDelete`); hak `user_id` üzerinden hesaplandığı için sahipsiz sipariş kimseye hak vermez |

Bu tablo değişirse metin de değişmeli: kullanıcıya *"silinir"* deyip silmemek de,
*"saklanır"* deyip silmek de KVKK açısından sorun.

## 4. 🔴 Bulgu: gizlilik metni kodla uyuşmuyor (değiştirilmedi)

Plan (10.46) KVKK metninin **içeriğini** hukukçuya bırakıyor; bu adım metne dokunmadı.
Ama `pages/legal/PrivacyPage.tsx` → *"Saklama Süreleri"* bugünkü kodla iki yerde çelişiyor:

| Metin diyor | Kod yapıyor |
|---|---|
| Hesap verileri *"hesabın silinmesinden itibaren yasal zamanaşımı süresi boyunca"* saklanır | Kullanıcı satırı **hemen** silinir; yalnızca siparişler (anonim) kalır |
| Davetiye ve davetli verileri *"yayın bitiminden itibaren 6 ay içinde"* anonimleştirilir/silinir | `data:purge`: **etkinlik tarihinden** 6 ay sonra yalnızca **misafir** verisi (LCV, misafir medyası) silinir; davetiyenin kendisi ve galeri sahibi silene kadar kalır (K98) |
| — | Çöp kutusundaki davetiye 30 gün, iletişim mesajı 12 ay (K98): metinde yok |

Metnin hangi yöne düzeltileceği (kod mu metne, metin mi koda) hukuki bir karar.

## 5. Bilinen sınırlar

- **Şifre değiştirme ucu yok.** Sayfa *"Şifremi değiştirmek istiyorum"* bağlantısıyla
  sıfırlama akışına gönderiyor (adres taşınır). Ayrı bir `PUT /auth/password` Faz 10'un
  kapsamında değil.
- **Hız sınırı:** `DELETE /auth/me` `throttle:auth` altında. Gövdede `email` olmadığı için
  anahtar `anonim|IP`: aynı IP'den dakikada 5 yanlış şifre denemesi 429 alır.
- **Ad/e-posta düzenleme yok.** Sayfa yalnızca gösteriyor.

## 6. Doğrulama

`npm run verify:endpoints` → *"Hesap silme ucu (Faz 10)"*: `DELETE /auth/me`, gövdede `password`.

**Mutasyon kanıtı (FE 10.17'de denendi):** `api.delete('/auth/me', { password })` (parola
`data` yerine config'e) → *"gövdede 'password' yok"*. axios'ta `delete`in ikinci argümanı
config'tir; bu hata derlenir, istek gider ve backend her denemeye *"Parola zorunludur"* der.

**Tarayıcıda görüldü (FE 10.17):** sayfa, iki adımlı form, şifre alanına odak.

**Elle (backend açıkken):**

```
1. Test hesabıyla gir → /dashboard → "Hesap Ayarları"
2. "Hesabımı Sil" → yanlış şifre → alanın altında "Parola hatalı."
3. Doğru şifre → ana sayfa, toast, başlıkta "Giriş Yap"
4. Aynı bilgilerle giriş → "E-posta veya parola hatalı"
5. Backend: SELECT user_id FROM orders WHERE … → NULL (sipariş duruyor)
6. Davetiyenin public bağlantısı → 404
```
