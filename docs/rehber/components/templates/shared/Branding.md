# Fiyat kartı vaatleri — imza, premium tema, galeri (FE 10.20)

> **Faz:** 10 — Dilim F, adım FE 10.20 · **Karar:** **K102** (P-1, *karışık*)
> **Kod dosyaları:** `components/templates/shared/InvitationComposition.tsx` (imza) ·
> `components/create/ThemeStep.tsx` (rozet) · `data.ts` (`minimumTier`, fiyat kartı) ·
> `stores/useSubscriptionStore.ts` (`getRequiredTier`) · `types.ts`
> **Backend:** `ResolveBrandingAction` · `TierResolver` → `preset_tiers` (backend 10.66)

---

## 1. Sorun (P-1)

Fiyat kartı üç şey vaat ediyordu, kod üçünü de yapmıyordu:

| Kartta | Kodda (Faz 9) |
|---|---|
| Elit: *"Logosuz özel yayın"* | *"DavetKart ile hazırlandı"* her planda çiziliyordu |
| Gold/Elit: *"Premium tema koleksiyonu"* | Hiçbir tema plana bağlı değildi |
| Elit: *"Fotoğraf & Video galerisi"* | Galeri yalnızca fotoğraf kabul ediyor |

İsmail'in kararı (K102): logo ve tema vaadi **kodla** karşılansın, video **karttan** çıksın.
Premium tema = arka planı video olan 13 tema.

## 2. Ne değişti?

| Vaat | Frontend | Backend |
|---|---|---|
| Logosuz yayın | Alt bilgi `invitation.showBranding !== false` iken çiziliyor | Public yanıtta `showBranding` (Elit'te `false`) |
| Premium tema | 13 temada `minimumTier: 'gold'` · tema kartında *"Premium · Gold+"* rozeti · `getRequiredTier` | `TierResolver` en az Gold istiyor (yayın 402) |
| Video galeri | Kart: *"Fotoğraf & Video galerisi"* → *"Fotoğraf galerisi"* | — |

### 2.1 İmza neden `!== false`?

Alan yoksa (kaydedilmemiş yeni taslak, eski bir backend) imza çizilir. Vaat edilmeyen bir şeyi
yanlışlıkla vermek (imzasız) yerine, vaat edileni gecikmeli vermek (imza bir süre görünür) daha
güvenli taraf.

~~Alan yalnızca misafir yanıtında geliyor; Elit sahibi editör önizlemesinde imzayı görüyor.~~ →
FE 10.21'de kapandı (§4).

### 2.2 Rozet neden ekranda?

Fiyat kartı bir şey vaat ediyorsa kullanıcı onu tema seçerken görmeli. Rozet olmasaydı Standart alan
kullanıcı premium temayı seçer, davetiyesini hazırlar ve yayında 402 ile karşılaşırdı.

## 3. Doğrulama

`npm run verify:payment` → *"Fiyat kartı vaatleri"*:

| Kontrol | Mutasyon (FE 10.20) |
|---|---|
| Premium tema → Gold · + galeri → Elit · sıradan → Standart | `getRequiredTier` tema kuralını yanlış plana bağlasın → kırıldı |
| Premium liste = backend'in 13 kimliği | Bir temadan `minimumTier` silinsin → kırıldı |
| Kartta *"video"* geçmiyor | Eski metin geri gelsin → kırıldı |

~~**İmza** otomatik sınanmıyor: projede bileşen render eden bir doğrulama yok.~~ → FE 10.23:
`npm run verify:render` imzayı **251 şablonun hepsinde** ve editör önizlemesinde çizerek sınıyor
([`../../../scripts/verify-render.md`](../../../scripts/verify-render.md)). Backend tarafı
(`showBranding` plana göre) `PublicInvitationTest`'te 5, `InvitationTest`'te 3 vakayla sınanıyor.

**Tarayıcıda görüldü (2 Ekim 2026):** *"Premium · Gold+"* rozeti yalnızca videolu temalarda.

---

## 4. 🆕 FE 10.21 — editör önizlemesi de sunucunun kararını kullanıyor

Backend 10.66b'den beri sahibin kaydı da `invitation.showBranding` taşıyor (misafir yanıtıyla aynı
yer). Frontend'de:

| Yer | Ne yapıyor |
|---|---|
| `loadRecord` | Kaydın tamamını alıyor; karar da onunla geliyor (değişiklik yok) |
| Kaydetme yanıtı (`runSave`) | Kararı **tazeliyor**: ödeme sonrası ilk otomatik kayıtta imza kalkar |
| Yayın yanıtı | Kararı tazeliyor: yayın bağsız Elit paketini bağlayabilir (K99) |
| `toPayload` | Kararı gövdeye **koymuyor** (galeri gibi sunucunun alanı) |
| Yeni taslak | Karar yok → imza çizilir (henüz ödeme yok) |

`verify:state` → *"İmza"*: altı kontrol. Mutasyonlar (2 Ekim 2026): kayıt yanıtı kararı almasın ·
yayın yanıtı almasın · karar gövdeye girsin: üçü de kırıldı.

**Tarayıcıda görüldü (2 Ekim 2026, Vite 3017 + geliştirme backend'i):** Elit davetiye: misafir
sayfasında ve editör önizlemesinde alt bilgide yalnızca *"Deniz & Can"*. Gold davetiye: ikisinde de
*"DavetKart ile hazırlandı"*.
