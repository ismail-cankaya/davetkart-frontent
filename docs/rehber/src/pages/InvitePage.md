# `src/pages/InvitePage.tsx`

> **Kod dosyası:** `src/pages/InvitePage.tsx`
> **Faz:** 4 — Public davetiye, dosya 4.8b
> **Önce oku:** [`../services/publicInvitation.md`](../services/publicInvitation.md)

---

## 1. Faz 4 öncesi ne yapıyordu?

```tsx
const { id } = useParams<{ id: string }>();
void id;                                        // ← kimlik KULLANILMIYORDU

const invitation = useInvitationStore(s => s.invitation);
```

Dosyanın başında bir `TODO(backend)` yorumu duruyordu: *"id'yi api üzerinden
çöz; servis yokken her id için yerel tasarım gösteriliyor."*

Yani `/invite/<herhangi bir şey>` adresine giden herkes **tarayıcıdaki
editörün** o anki içeriğini görüyordu. Kendi bilgisayarında düzgün çalışıyor
gibi görünen, ama başka bir cihazda tamamen boş bir sayfa. Faz 4 bu boşluğu
kapatıyor.

---

## 2. Üç yükleme durumu — ve neden ayrı ayrı

```ts
type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; invitation: Invitation }
  | { status: 'missing' }
  | { status: 'error' };
```

Buna **discriminated union** (ayırt edici birleşim) denir: `status` alanı
hangi varyantta olduğumuzu söyler ve TypeScript geri kalan alanları ona göre
daraltır. `state.status === 'ready'` kontrolünden sonra `state.invitation`
erişilebilir olur; diğer dallarda **derleme hatası** verir.

Alternatif olan üç ayrı `useState` (`loading`, `error`, `invitation`) imkânsız
durumları mümkün kılardı: `loading: true` iken `invitation` dolu olabilir,
`error` ve `invitation` aynı anda dolu olabilir. Birleşim tipi bu kombinasyonları
**dilde** yasaklıyor.

> **Kalıp:** Birbirini dışlayan durumları ayrı bayraklarla değil, tek bir
> ayırt edici alanla modelle. *İmkânsız durumu temsil edilemez yap.*

### `missing` ile `error` neden ayrı?

| Durum | Kullanıcıya ne demeli |
|---|---|
| `missing` (404) | "Bu davetiye bulunamadı" — bağlantı yanlış veya yayından kalkmış |
| `error` (ağ, 500, timeout) | "Şu an açılamıyor, yenileyin" — sorun geçici |

Aynı mesajı gösterseydik, geçici bir ağ kesintisinde misafire "davetiye yok"
derdik. Davetiye sahibi için bu kötü bir andır: linki attı, arayanlar "böyle
bir şey yok" görüyor.

Ayrımı **hata kodundan** yapıyoruz, metinden değil:

```ts
setState({ status: apiErrorCode(error) === 'RESOURCE_NOT_FOUND' ? 'missing' : 'error' });
```

Bu K20'nin frontend tarafı: backend **olayı** bildirir (`RESOURCE_NOT_FOUND`),
frontend **anlatır**. Kalıcı `toDisplayError()` çeviri katmanı geldiğinde
(`Notlar/03` §3.3) bu satır oraya taşınacak; şu an geçici `apiErrorCode()`
yardımcısı görevi görüyor.

### 🔴 Bilerek yapmadığımız ayrım

Yayınlanmamış, silinmiş ve hiç var olmayan davetiye **aynı** `missing`
durumuna düşüyor. Bu bir eksiklik değil, backend'in H7 kararının doğal sonucu:
üçü de aynı 404'ü döndürüyor ve **döndürmeli**. Frontend ayrım yapmaya
çalışsaydı, backend'in bilerek gizlediği bilgiyi tahmin etmeye kalkardı.

---

## 3. Yarış koruması

```ts
let cancelled = false;
...
return () => { cancelled = true; };
```

`useEffect`'in döndürdüğü fonksiyon **temizleme** (cleanup) işidir: bileşen
sökülürken veya bağımlılık (`id`) değişip effect yeniden çalışırken koşar.

Korumasız iki senaryo bozulurdu:

1. **Sökülme:** Kullanıcı yanıt gelmeden sayfadan çıkar → `setState` sökülmüş
   bir bileşende çağrılır (React uyarısı, bellek sızıntısı riski)
2. **Kimlik değişimi:** `/invite/A` → `/invite/B` geçişinde A'nın yanıtı geç
   gelirse **B sayfasında A'nın davetiyesi** çizilir

İkincisi sinsi olanı ve tam da bir yarış koşulu: hangi yanıtın önce döneceğini
ağ belirler, kod değil. Faz 3'te aynı sınıftan bir sorunu store'un kaydetme
kuyruğunda çözmüştük (F4); burada bayrak yeterli çünkü tek bir okuma var.

---

## 4. Şablon nereden geliyor?

```tsx
templateId={resolvePresetId(state.invitation.imageTheme)}
```

Eskiden `useActivePreset()` kullanılıyordu — yani **editörün** store'undaki
aktif şablon. Misafirde öyle bir şey yok: şablon, sunucudan gelen davetiyenin
kendi alanıdır (`imageTheme`, backend'de `preset_id`'den türetiliyor — K41).

`resolvePresetId` katalogda olmayan bir anahtar gelirse ilk şablona düşüyor.
Neden gerekli? Çünkü **E6**: backend `preset_id` üzerine kısıt koymadı, o
alan frontend kataloğunun anahtarı. Katalogdan bir şablon kaldırılırsa eski
davetiyeler boş ekran yerine geçerli bir tasarımla açılmaya devam eder.

---

## 5. Kalan işler

| Konu | Ne zaman |
|---|---|
| LCV formu gerçekten gönderilmiyor (`RsvpModal` yerel) | **Faz 5** |
| Galeri boş (`galleryImages: []`) | **Faz 6** |
| Geri sayım sayacı saat dilimi | **Faz 4 açık sorusu** — `invitations.timezone` kararı |
| Metinler koda gömülü (i18next dışında) | `Notlar/03` — projedeki mevcut duruma uygun |

---

## 6. Sık yapılan hatalar

| # | Hata | Ne olur | Doğrusu |
|---|---|---|---|
| 1 | Üç ayrı `useState` bayrağı | İmkânsız durumlar temsil edilebilir hâle gelir | Discriminated union (§2) |
| 2 | 404 ile ağ hatasını birleştirmek | Geçici kesintide "davetiye yok" denir | Kodla ayır (§2) |
| 3 | Yayınlanmamış/silinmiş ayrımı yapmaya çalışmak | Backend'in gizlediğini tahmin etmek | Hepsi `missing` |
| 4 | `cancelled` bayrağını atlamak | Kimlik değişiminde yanlış davetiye çizilir | Cleanup (§3) |
| 5 | Şablonu store'dan almak | Misafirde store boş; herkes aynı tasarımı görür | `invitation.imageTheme` (§4) |
| 6 | Hata metnini backend'den beklemek | K20 ihlali | Kod gelir, metni frontend yazar |

---

## 7. Kendin dene

```powershell
php artisan serve      # 1. terminal
npm run dev            # 2. terminal
```

| Deneme | Beklenen |
|---|---|
| Yayınlanmış bir id ile `/invite/<id>` | Davetiye çizilir |
| Aynı id, gizli pencerede (oturum yok) | **Aynı** sonuç — auth gerekmiyor |
| `status` = `saved` yapıp yenile | "Bu davetiye bulunamadı" |
| `/invite/gecersiz` | "Bu davetiye bulunamadı" (rota kısıtı 404) |
| Backend'i durdur, yenile | "Davetiye şu an açılamıyor" — **farklı** mesaj |
| DevTools → Network → 2. yükleme | `304 Not Modified` (tarayıcı XHR'de 200 gösterebilir; curl ile bak) |

Beşinci satır §2'nin kanıtı: iki farklı sorun, iki farklı mesaj.
