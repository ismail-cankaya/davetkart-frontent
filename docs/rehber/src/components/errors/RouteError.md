# `src/components/errors/RouteError.tsx`

> **Faz:** 19.21 — `FE-02` · **Karar:** K222 · **Test:** `npm run verify:render` → *Hata sınırı*

## Neden

Hiçbir rotada `errorElement` yoktu: bir sayfa düşünce React Router'ın İngilizce, markasız
"Unexpected Application Error!" ekranı çıkıyor, editördeki kaydedilmemiş değişiklik kayboluyordu.
`Suspense` yüklemenin **beklemesini** yönetir, **başarısızlığını** değil.

## Ne çizer

- Başlık + açıklama `t('routeError.*')` ile (tr/en). Chunk hatası (`Failed to fetch dynamically
  imported module` vb.) ayrı metin alır ve "Tekrar dene" göstermez (aynı dosya yine gelmez).
- **Tekrar dene:** aynı adrese `navigate(..., { replace: true })`. Yeni konum sınırı sıfırlar, sayfa
  yenilenmez: bellekteki taslak kalır.
- **Sayfayı yenile:** `location.reload()`. **Ana sayfa:** düz `<a href="/">` (bozuk yönlendirici
  durumunu da temizler). Misafir (`scope="guest"`) site bağlantısı görmez.
- `scope="editor"`: `EditorSaveNote` canlı `saveState`'i okur. Editör düşünce `CreatePage` söküler,
  `useInvitationAutoSave` temizliği bekleyen kaydı `flush` eder; not `saving` → `saved`/`failed`
  olarak güncellenir. Oturumsuz kullanıcıda `local`: "yenilerseniz kaybolur". `rejected` (taslak tavanı,
  A-H2) da `failed` sayılır: içerik sunucuda değil.
- Hata ayrıntısı yalnızca `import.meta.env.DEV`'de.

## Sık hata

- `Link` ile ana sayfaya dönmek: yönlendirici hatalı durumdaysa aynı ekran kalabilir.
- Hata raporlama: frontend'de araç yok (Sentry yok); yeni bağımlılık eklenmedi (D4).

## Nasıl denenir

Geliştirmede bir sayfanın gövdesine `throw new Error('x')` → başlık ve alt bilgi yerinde, ortada
RouteError ve ayrıntı. `/create`'te aynısı → kaydetme notu.
