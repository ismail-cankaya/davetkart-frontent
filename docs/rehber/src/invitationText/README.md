# `src/invitationText/` — davetiye metinleri

Faz 24–25 (v2.0). Şablonların **sabit metinleri** (giriş sözü, bölüm başlıkları, LCV düğmesi…) koda gömülü değil;
anahtarla okunur, kullanıcı değiştirebilir (Elit, K305), ileride başka dillere çevrilir (v2.1).

## Dosyalar

| Dosya | Ne |
|---|---|
| `types.ts` | `InvitationLocale` (v2.0: yalnızca `tr`), `TextOverrides`, `InvitationTextBundle` |
| `locales/tr.json` | Varsayılan metinler: `shared`, `categories.<kategori>`, `scopes.<kapsam>`, `fixed` |
| `resolve.ts` | Paket yükleme (tembel, dil başına tek istek) ve çözüm: `resolveText`, `defaultText`, `fixedText` |
| `InvitationTextContext.tsx` | Sağlayıcılar, `useInvText`, `useFixedText`, `<InvText>`, `TextBundleGate`, editör köprüsü (`TextEditorBridge`) |
| `EditableTextMark.tsx` | Editörde tıklanabilir metin (ayrı parça: misafir indirmez) |
| `overrides.ts` | Saf işlemler: yazma/silme, doğrulama (`textProblem`), kategori anahtarları, geri al geçmişi |
| `hasCustomTexts.ts` | "Değiştirilmiş metin var mı" (paket sorusu, backend `has_custom_texts` ile aynı) |

## Çözüm sırası

`resolveText(key)`:

1. Kullanıcının metni: `invitation.textOverrides[locale][key]`.
2. Şablonun çalışma anı varsayılanı: `flavor.textDefaults[key]` (ör. kitapta "Bölüm II", sergide "Salon 1").
3. Şablon kapsamları, en özelden genele: `flavor.textScopes` → `scopes[kapsam][key]` (ör. `dugun-opera`, `kitap`).
4. Kategori: `categories[flavor.categoryId][key]`.
5. Ortak: `shared[key]`.
6. Hiçbiri yoksa anahtarın kendisi (görünür hata; `verify:text-slots` yakalar).

`fixed` metinler (erişilebilirlik etiketleri, isim yer tutucusu "Davetlisiniz", "bu davetiyeyi bildir" penceresi)
düzenlenemez; sözleşmede yoktur.

## Sağlayıcılar

- `TemplateRenderer` → `InvitationTextProvider`: dil (`invitation.locale`), kullanıcının metinleri, editör köprüsü.
- `InvitationComposition` → `InvitationTextScope`: flavor'ın kategorisi, kapsamları, çalışma anı varsayılanları.
  Kompozisyonsuz şablon (`DugunKitapSayfa`) bölümlerini kendisi sarar.
- Şablon bileşeni kompozisyonun **üstünde** metin hazırlıyorsa (kapı, `renderEnvelope` dışı) `useInvText(FLAVOR)` ile
  kapsamı açıkça verir (`DogumGunuMumlar`, `DogumGunuArcade`).

## Tembel paket (Faz 25)

`tr.json` (~25 kB) ana pakete ve misafir iskeletine girmez: `TemplateRenderer` paketi şablon parçasıyla paralel
başlatır, `TextBundleGate` şablonla aynı `Suspense` içinde bekler. `use(loadTextBundle(locale))` koşulsuz çağrılır
(aynı önbellekli söz; hook sırası sabit). Misafir bütçesi (K237) bu sayede tutar.

## `<InvText>`

Misafir sayfasında yalnızca metin çizer (sarmalayıcı yok; taşımadan önce/sonra 762 çizim birebir aynı,
`scripts/text-slots/snapshot.tsx`). Editörde `EditableTextMark` ile sarılır: kesikli çerçeve, tıkla/Enter ile
yerinde düzenleyici. Yer tutucular: `<InvText k="rsvp.deadline" slots={{ date: <span>…</span> }} />`.

🔴 Metin düz yazıdır: HTML yorumlanmaz, `dangerouslySetInnerHTML` şablonlarda yasak (`verify:text-slots`, K304).
