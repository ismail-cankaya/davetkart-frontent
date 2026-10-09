# `kurumsal/parts/RegistrationGrid.tsx` — Kayıt artısı ızgarası

> **Kullananlar:** `KurumsalNetwork`, `KurumsalBento`, `KurumsalBrutal`,
> `KurumsalYildizHaritasi` (`HeroStage.atmosphere`)
> **Denetim:** duman testi

---

## 1. Ne yapar?

Hero sahnesine kesim matı gibi seyrek bir artı ızgarası çizer: her hücrenin
merkezinde 10 px'lik bir artı, köşesinde bir nokta. Varsayılan maske ızgarayı
merkezde yoğunlaştırır, kenarlarda eritir. Brutal'da `mask="none"` ile tam
yüzeydir.

## 2. 🔴 Neden SVG `<pattern>` değil?

Kategori deseni (`flavors.tsx` → `BackgroundPattern`) bir SVG `<pattern>`'dir.
Bir `<pattern>` iki sorun taşır:

1. **`id` çakışması.** Şablon galerisi birden çok kurumsal önizlemeyi aynı
   sayfaya çizer. `url(#id)` belgedeki ilk eşleşmeye gider.
2. **`currentColor`.** Desen içindeki `currentColor`, deseni **kullanan**
   öğeden değil, `<pattern>`'in kendi bağlamından çözülür. Yani ikinci
   önizleme ilkinin rengini ödünç alır.

Burada desen bir veri URI'sidir (`background-image: url("data:image/svg+xml,…")`).
Renk SVG metnine gömülür ve her şablon kendi değeriyle basılır. Aynı sorun için
flavor deseni de `useId()` ile örneğe özgü kimlik alır.

## 3. Parametreler

| Prop | Varsayılan | Anlam |
|---|---|---|
| `color` | — | Artı ve nokta rengi (alfa dahil) |
| `mask` | merkezde elips | Izgaranın eridiği maske; `none` tam yüzey |
| `size` | 88 | Hücre (px) |
