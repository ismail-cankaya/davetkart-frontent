# `src/templatePresetColors.ts` — Kılavuz (ÜRETİLİR)

> **Faz:** 19 ortak düzeltme (B-E5, 25 Kasım 2026) · **Üreten:** `scripts/gen-preset-colors.ts` (`npm run gen:preset-colors`)

## Neden

Misafir sayfası (`InvitePage`) ve `TemplateRenderer` kataloğun yalnızca iki bilgisini kullanıyordu: şablon kimliği
var mı ve şablonun zemin rengi (tembel parça inerken yedek zemin). Bunun için `templateCatalog.ts`'in tamamını
(~105 kB: adlar, açıklamalar, kapaklar) misafire indiriyorlardı. Bu modül yalnızca `{ kimlik: renk }` (~12 kB).

Ölçüm (25 Kasım 2026): misafir sayfası (şablon hariç) **884,3 → 790,2 kB**.

## Kurallar

- Elle düzenlenmez. Katalogda şablon eklenir/çıkarılır ya da rengi değişirse: `npm run gen:preset-colors`.
- `verify-render` iki yönlü denetler: her şablonun rengi aynı, fazla kimlik yok, `DEFAULT_PRESET_ID` kataloğun ilki.
- `verify-bundle`: misafir sayfasının kapanışında `templateCatalog-*.js` parçası olmamalı.

## Yapılmayan (B-E5'in ikinci yarısı)

"İlk yüklemede `motion` yerine CSS" yapılmadı: `motion` misafir sayfasına özgü değil, ilk yüklemenin (uygulama kabuğu:
üst bilgi, sayfa geçişleri) ve 300'ü aşkın şablonun ortak bağımlılığı. Kabuktan çıkarmak ayrı bir tasarım işi; misafir
sayfası için kazanç da yok (şablon çizilince yine iner).
