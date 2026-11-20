# `scripts/verify-i18n.ts` · `scripts/i18n-baseline.json`

> **Faz:** 19.20 — `FE-01` · **Karar:** K221 · **Komut:** `npm run verify:i18n` (`verify` ve `check` içinde)

## Neden

Çekirdek arayüzün çoğu Türkçe metni koda gömülü (~800 parça). Hepsini bu bulguda çevirmek ayrı bir
faz; ama her yeni ekran gömülü metin ekleyip borcu sessizce büyütmemeli. Bu bir **mandal** (ratchet):
sayı bugünkü ölçümden yukarı çıkamaz, aşağı inince taban da iner.

## Ne sayılır

`src/**/*.tsx`, **`src/components/templates/` hariç** (şablon metni misafir içeriği, kapsam dışı).
Yorumlar ayıklanır; Türkçe harf (`şğıİçöü`, büyük/küçük) içeren:

- JSX metni: `>…<` arasında, süslü parantezsiz (`{t('…')}` sayılmaz),
- dizgi sabiti: `'…'`, `"…"`, `\`…\`` (ör. `placeholder="Adınız"`).

Sayım denetimdeki `fe-d1-metrics.mjs` §2b ile aynı düzenli ifadedir; kabadır ama belirlenimcidir.

## Kural

Dosya dosya **tam eşitlik**: artarsa kırmızı (`t()` kullan), azalırsa da kırmızı (tabanı düşür).
Böylece bir dosyada açılan boşluk sonra başka metinle doldurulamaz.

## Tabanı güncellemek

```
npm run verify:i18n -- --update
```

Değişen `scripts/i18n-baseline.json` kodla **aynı commit'e** girer. İnceleme sırasında tabandaki
artış göze batmalı: gerekçesiz artış = `t()`'ye taşınmamış metin.

## Sık hata

- Türkçe harfsiz metin (`Ana Sayfa`) sayılmaz; bu ölçü oranı izler, kesin envanter değildir.
- Dosya taşınınca eski yol "azaldı", yeni yol "yeni" görünür: `--update` yeter.

## Mutant (20 Kasım 2026)

`src/pages/PricingPage.tsx`'te bir `{t('…')}` → düz Türkçe metin: kırmızı. Geri alınınca yeşil.
