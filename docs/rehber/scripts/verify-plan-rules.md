# `scripts/verify-plan-rules.ts` — `npm run verify:plans`

> **Faz:** 18, adım 18.1.5 (`OPS-01`, `FE-05` · K146–K147)
> **Kapsanan dosyalar:** `scripts/verify-plan-rules.ts` · `src/contracts/plan-rules.json` (kopya) ·
> `src/contracts/planRules.ts` (okuyucu) · `package.json` (`verify:plans`, `verify` zinciri)
> **Backend tarafı:** `davetkart-backend-php-laravel/docs/rehber/app/Console/Commands/ExportPlanRules.md`

## 1. Hangi problemi çözüyor?

"Hangi planda ne var" kuralını **sunucu uygular**, arayüz yalnızca **gösterir**. Arayüzde bu
kuralın üç elle yazılmış kopyası var:

| Kopya | Yer | Ne işe yarar |
|---|---|---|
| Premium şablon listesi | `src/data.ts` → `minimumTier` (32 şablon) | "Gold+" rozeti |
| Özellik matrisi | `src/data.ts` → `SUBSCRIPTION_PLANS` | Fiyat kartındaki ✓ / üstü çizili satırlar, "LCV — maksimum 100 kişi" |
| Gereken plan hesabı | `useSubscriptionStore.ts` → `getRequiredTier`, `TIER_RANK` | Plan duvarında "Tavsiye Edilen" |

Kopyalar sunucudaki kuraldan ayrışırsa iki şey olur:

- **Arayüz fazlasını söyler** (şablon "Gold+", sunucu tanımıyor): kullanıcı Standart'la premium
  şablon yayınlar. Para kaybı; denetimdeki `OPS-01` senaryosu.
- **Arayüz eksiğini söyler** (sunucu Gold istiyor, rozet yok): kullanıcı uyarısız 402 alır.

Ayrışmayı bugüne kadar haber veren bir şey yoktu; denetim iki tarafı elle karşılaştırdı.

## 2. Desen: sözleşme kopyası + denetim betiği

```
backend: config/davetkart.php ─[php artisan plans:export]→ contracts/plan-rules.json
                                                                   │ (elle kopyala)
frontend: src/contracts/plan-rules.json ─[npm run verify:plans]→ data.ts · useSubscriptionStore.ts
```

Hata kodlarıyla **aynı desen** (`src/contracts/error-codes.json` + `verify:errors`): iki depo
derleme zamanında birbirine bağlanmaz, dosya tek yönlü kopyalanır. Betik başka depoya bakmaz;
bu yüzden CI'da ve backend deposu yanında olmayan bir makinede de aynı sonucu verir.

🔴 **Uygulama sözleşmeyi içeri almaz.** `planRules.ts`'in tek tüketicisi bu betiktir. Arayüzün
kuralları sözleşmeden *türetmesi* (ya da API'den okuması) daha güçlü bir çözümdür ve `FE-05`'in
kalan işidir; bu adım kopyaları kaldırmıyor, **ayrıştıkları anda kırmızı yakıyor.**

## 3. Ne denetleniyor?

| Bölüm | Arayüz | Sözleşme | Yakaladığı hata |
|---|---|---|---|
| Plan sırası | `TIER_RANK`, `isSubscriptionTier`, kart kimlikleri | `tierOrder` | Yeni plan, sırası değişen plan |
| (a) Premium şablonlar | `minimumTier` | `presetTiers` | İki yönde: rozet var kural yok · kural var rozet yok |
| (b) Fiyat kartı | `SUBSCRIPTION_PLANS[].features` | `moduleTiers`, `rsvpLimits`, `whiteLabelTier` | Yanlış ✓, yanlış LCV sayısı, eşlenmemiş satır |
| (c) Hesap | `getRequiredTier()` | Sözleşmeden hesaplanan beklenen plan | Koda gömülü kuralın eskimesi |

### (b) Satırlar nasıl eşleniyor?

Kart satırları düz metin (`label`). Betik her satırı bir kurala bağlayan küçük bir tablo tutar:

| Satır | Kural |
|---|---|
| Geri sayım sayacı · Zarf açılış animasyonu · Hikaye / Zaman çizelgesi · Fotoğraf galerisi · Hediye & IBAN modülü | `moduleTiers.show_*` |
| Logosuz özel yayın | `whiteLabelTier` |
| LCV satırı | `moduleTiers.show_rsvp` + `rsvpLimits`: satırdaki **sayı** sınırla aynı; sınırsız planda sayı yok |
| Temel / Premium koleksiyon | Plan premium şablonların hepsini açıyorsa "Premium", hiçbirini açmıyorsa "Temel" |
| Harita & Konum yönlendirmesi | Backend'de kuralı yok (`UNGATED_ROWS`): her planda açık olmalı |

Denetim **kapalı dünya** varsayar: tabloda olmayan bir satır ya da sözleşmede olup kartta satırı
olmayan bir modül hata sayılır. Aksi hâlde yeni bir satır hiçbir kurala bağlanmadan eklenebilir
ve betik onu hiç görmezdi. Etiket değişirse betik "satır yok" der; tabloyu güncellemek bilinçli
bir adımdır.

### (c) 501 durum nereden geliyor?

- 373 şablonun her biri, modülsüz (rozetle hesabın aynı listeden çıktığını sınar).
- 6 modülün bütün birleşimleri (2⁶ = 64) × iki şablon (biri düz, biri premium) = 128.

Beklenen plan betikte sözleşmeden hesaplanır: açık modüllerin ve şablonun gerektirdiği planların
en yükseği. Bu, backend `TierResolver::requiredFor()`'un kuralıdır.

### Modül adları: `MODULE_FIELDS`

Sözleşme modülleri backend'in kolon adıyla taşır (`show_rsvp`); davetiyedeki alan `showRSVP`.
Eşleme `planRules.ts`'te elle yazılıdır ve değerleri `Invitation`'ın boolean alanlarına tiplidir:
alan yeniden adlandırılırsa `tsc` kırılır, sözleşmeye yeni modül gelirse betik durur.

## 4. Kırmızıysa ne yapılır?

🔴 **Farkı bir tarafa uydurma.** Hangi şablonun hangi planda olduğu bir **fiyat kararıdır**.

1. Hangi taraf doğru? Karar İsmail'in.
2. Kural değişecekse **backend'de** değişir: `config/davetkart.php` → `php artisan plans:export`.
3. Kopya yenilenir:
   ```powershell
   Copy-Item ..\davetkart-backend-php-laravel\contracts\plan-rules.json src\contracts\plan-rules.json
   ```
4. Arayüz kopyası (`data.ts`, `getRequiredTier`) yeni sözleşmeye göre düzeltilir; `npm run verify:plans`.
5. Yayın sırası: **önce backend, sonra frontend** (K148; docs deposu
   `operations/deployment/YAYIN-SIRASI.md`).

## 5. Sık yapılan hatalar

| Hata | Sonuç |
|---|---|
| `plan-rules.json` kopyasını elle düzenleyip betiği susturmak | Arayüz "Gold+" der, sunucu uygulamaz: `OPS-01`'in ta kendisi. Kopya yalnızca backend'den gelir |
| Yeni premium şablonda `minimumTier` yazıp backend'i unutmak | (a) kırmızı: "sözleşmede YOK" |
| Backend'de kuralı değiştirip kopyayı yenilememek | Betik eski kopyayla yeşil kalır. Yayın öncesi kontrol listesi iki dosyayı karşılaştırır (`YAYIN-SIRASI.md`) |
| Fiyat kartına yeni satır ekleyip betiğe eşlemesini yazmamak | (b) kırmızı: "tanınmayan satır" |
| Sözleşmeye fiyat eklemek | Fiyat API'den gelir (K128); `verify:pricing` `src/` altında fiyat arar |

## 6. Kendin dene

```powershell
npm run verify:plans
```

**Mutant 1 — premium kimliği sil:** `src/contracts/plan-rules.json`'dan `"dugun-gokyuzu": "gold",`
satırını sil.

```
✗ dugun-gokyuzu: arayüzde gold+, sözleşmede YOK → sunucu her planda yayınlatır
✗ modüller [yok] + şablon dugun-gokyuzu: arayüz gold, sözleşme standart
```

**Mutant 2 — Gold'a galeri ver:** `src/data.ts`'te Gold kartının `Fotoğraf galerisi` satırını
`included: true` yap.

```
✗ Gold: "Fotoğraf galerisi" included=true; sözleşme (moduleTiers.show_gallery = elit) false diyor
```

İkisi de 18.1'de elle denendi (çıkış kodu 1) ve geri alındı. Denemeden sonra `git diff --stat`
boş olmalı.
