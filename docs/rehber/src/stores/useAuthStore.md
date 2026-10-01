# `src/stores/useAuthStore.ts` — Oturum store'u ve açılış doğrulaması

> **Kod dosyası:** `davetkart-frontent/src/stores/useAuthStore.ts`
> **Bu kılavuz:** Faz 10, adım 10.29 — `refreshSession()`. Store'un kendisi Faz 2'den beri var;
> kılavuzu yoktu (K18 borcu), burada yalnızca oturum yaşam döngüsü anlatılıyor.
> **Birlikte değişenler:** `services/auth.ts` (`fetchCurrentUser`) · `services/api.ts` (bayat token'ın 401'i) ·
> `main.tsx` (açılış çağrısı) · `scripts/verify-editor-state.ts` (*"Oturum doğrulama (açılış)"*)
> **Backend:** `GET /api/auth/me` · token ömrü 30 gün, mutlak (K90, backend 10.10)

---

## 1. Oturum nereden geliyor?

| An | Kaynak | Sunucuya soruluyor mu? |
|---|---|---|
| Giriş / kayıt | `POST /auth/login` · `/auth/register` → `{ user, token }` | evet |
| **Sayfa yenileme** | `localStorage` (`davetkart_auth_session`), modül yüklenirken **eşzamanlı** | ❌ Faz 9: hayır · ✅ Faz 10: açılışta bir kez |
| Her kimlikli istek | `Authorization: Bearer <token>` (api.ts istek interceptor'ı) | evet, dolaylı |

Önbellekten eşzamanlı okuma bilinçli: korumalı rotalar ve başlık ilk çizimde doğru
oturumu göstermeli. Ama önbellek bir **iddia**dır, gerçek değil.

## 2. Sorun: önbellek yalan söyleyebilir

Faz 10'dan önce token'ların süresi dolmuyordu. Önbellekteki token ya geçerliydi ya da
kullanıcı çıkış yapmıştı. K90 ile token **30 gün** sonra geçersiz oluyor. Başka bir
cihazdan iptal edilmiş ya da veritabanından silinmiş (`sanctum:prune-expired`) bir
token da mümkün. Faz 9'daki davranış şuydu:

```
Uygulama açılır → "Hoş geldin Ayşe" (önbellek) → kullanıcı 10 dk editörde çalışır
→ ilk kaydetme 401 → oturum düşer → giriş ekranı
```

Kullanıcı *"giriş yapmıştım"* sanırken bir süre boyunca kaydedilemeyecek bir şey üzerinde
çalışmış olur.

## 3. Çözüm: `refreshSession()`

```ts
refreshSession: async () => {
  const { token } = get();
  if (!token) return;

  try {
    const user = await authService.fetchCurrentUser();   // GET /auth/me
    if (get().token !== token) return;                   // 🔴 bu arada oturum değişti
    authService.persistSession({ user, token });
    set({ user });
  } catch {
    // 401 → interceptor logout() yaptı · ağ hatası → oturum kalır
  }
}
```

| Cevap | Sonuç |
|---|---|
| 200 | Kullanıcı bilgisi **tazelenir** (ad başka cihazda değiştiyse görünür) ve önbelleğe yazılır |
| 401 `UNAUTHENTICATED` | `api.ts` interceptor'ı `logout()` çağırır: oturum **açılışta** düşer |
| Ağ hatası | 🔴 Oturum **kalır**. Metroda uygulamayı açan kullanıcı her seferinde çıkarılmamalı; bir sonraki kimlikli istek karar verir |

### Neden `main.tsx`'te?

```ts
// main.tsx
void useAuthStore.getState().refreshSession();
```

Bir bileşenin `useEffect`'i olsaydı, `StrictMode` geliştirmede efektleri iki kez
çalıştırır ve iki istek giderdi. Modül düzeyindeki çağrı uygulama başına **bir kez**
koşar. İlk çizimi bekletmez, çünkü store önbellekten zaten kurulu.

Neden store dosyasının kendisinde değil? `verify-editor-state.ts` store'u sahte bir
sunucuyla **import** ediyor. Import sırasında istek atan bir modül, betiğin sahte
adaptörü kurmasından önce gerçek ağa çıkmaya çalışırdı.

## 4. 🔴 İki yarış ve iki koruma

Açılış isteği yoldayken kullanıcı bir şey yapabilir: çıkış yapıp başka hesapla girmek,
ya da (başka sekmede) oturumu değiştirmek. Eski oturumun cevabı **geç** gelirse:

| Geç gelen | Korumasız | Koruma |
|---|---|---|
| Eski token'ın **401**'i | Interceptor `logout()` çağırır → **yeni** oturum düşer | `api.ts` → `isFromStaleSession()`: isteğin taşıdığı token güncel token değilse 401 yok sayılır |
| Eski token'ın **200**'ü | `set({ user })` → Mehmet'in oturumunda Ayşe'nin adı | `refreshSession()` → `if (get().token !== token) return` |

İkisi de bir **sıralama** hatası: tek bir istekte görünmez, derleme hatası vermez, elle
denemede ancak yavaş bir ağda ve doğru tıklama sırasıyla çıkar. `verify:state` ikisini
de ertelenmiş (deferred) sahte sunucu cevaplarıyla kuruyor.

### `isFromStaleSession` neyi bilerek bayat saymaz?

```ts
return typeof sentWith === 'string' && current !== null && sentWith !== `Bearer ${current}`;
```

- **Token'sız istek** (`sentWith` yok): public uçlar. 401 zaten beklenmez.
- **Oturum zaten kapalı** (`current === null`): `logout()` zararsız. Token `null` olduğu
  için sunucuya ikinci bir iptal isteği gitmez (Faz 2'deki döngü koruması).
- **Çıkış isteğinin kendisi** (`revokeSession`) eski token'ı açıkça taşır ve genellikle
  401 alır. O anda oturum zaten kapalı, yani yukarıdaki kol.

## 5. Doğrulama (`npm run verify:state` → *"Oturum doğrulama (açılış)"*)

| Senaryo | Beklenen |
|---|---|
| Geçerli token | `GET /auth/me` güncel token'la · kullanıcı tazelenir (zarf açılır) |
| 401 | Oturum düşer |
| Ağ hatası | Oturum kalır |
| Eski token'ın geç 401'i, girişten sonra | Yeni oturum **kalır** |
| Eski oturumun geç 200'ü, girişten sonra | Yeni kullanıcı **ezilmez** |

**Mutasyon kanıtı (10.29'da denendi):**

| Mutasyon | Kırılan senaryo |
|---|---|
| `isFromStaleSession` kontrolü kaldırıldı | geç 401 |
| `get().token !== token` koruması kaldırıldı | geç 200 |
| `catch` içinde her hatada `logout()` | ağ hatası · geç 401 |

Sahte adaptöre bu adımda bir ek yapıldı: hata nesnesi artık `config`'i de taşıyor
(gerçek axios hatası gibi). Interceptor, isteğin hangi token'la gönderildiğine oradan
bakıyor. Ek olmasaydı *"geç 401"* senaryosu gerçek tarayıcıda farklı davranırdı.

## 6. Elle doğrulama

```
1. Giriş yap → backend'de o token'ı sil (tinker: PersonalAccessToken::query()->delete())
2. Sayfayı yenile → giriş ekranına düşmeli (Faz 9'da: panel açılırdı, ilk kayıtta düşerdi)
3. Giriş yap → ağ sekmesinde "Offline" → sayfayı yenile → oturum KALMALI
```

## 7. 🆕 `logout({ revoke })` — sunucuda zaten silinmiş oturum (Faz 10, FE 10.16)

Faz 10'da token'ı **sunucu** silen iki olay geldi:

| Olay | Backend | Frontend'deki çağrı |
|---|---|---|
| Şifre sıfırlandı | `ResetPasswordAction` hesabın **bütün** token'larını siler | `ResetPasswordPage` (yalnızca aynı hesap açıksa) |
| Hesap silindi | `DeleteAccountAction` token'ları ve kullanıcıyı siler | Hesap sayfası (FE 10.17) |

İkisinde de `logout()`'un sonundaki `revokeSession(token)` anlamsız: `POST /auth/logout`
artık var olmayan bir token'la gider ve 401 döner. Zararsız (interceptor'ın ikinci
`logout()`'u token `null` olduğu için bir şey yapmaz) ama sonucu belli bir istek.

```ts
logout: ({ revoke = true } = {}) => {
  // …yerel durum önce temizlenir (değişmedi)…
  if (token && revoke) authService.revokeSession(token);
}
```

`sessionActions.signOut()` aynı seçeneği geçirir. İkisi de varsayılan olarak **iptal eder**:
mevcut çağrı yerleri (`Header` çıkışı, `api.ts` interceptor'ı) değişmedi.

**Neden `logout` değil `signOut({ revoke: false })` çağrılıyor?** Hesaba ait bellek
(editördeki tasarım, LCV listesi, ETag önbelleği) yalnızca `signOut` ile temizlenir
(`sessionActions.ts` yorumu). Silinmiş bir hesabın tasarımı bellekte kalmamalı.

**Doğrulama** (`npm run verify:state` → *"Oturum sınırları"*):

| Senaryo | Beklenen |
|---|---|
| `signOut()` | `POST /auth/logout`, eski token'la (önceden sınanmıyordu, eklendi) |
| `signOut({ revoke: false })` | Oturum ve editör temizlenir · `/auth/logout` **gitmez** |

Mutasyon: `if (token && revoke)` → `if (token)` iken *"iptal isteği gönderilmiyor"* kırılıyor.
