# `konsept/sergi/SergiKok.tsx` — preset'in kökü

> **Tarih:** 2026-10-17 · dal `design/sergi`

---

`SergiKok` sergi preset'inin en dış bileşenidir: `sergiDegiskenleri(eser)`'i `style`'a yazar ve
`useSergiFontlari()`'nı çağırır. Tek prop'u eser rengidir (`kobalt | fusya | safran | gece`).

## Neden `display: contents`?

Kompozisyon kökü `h-full` ile önizleme çerçevesini doldurur; araya kutulu bir sarmalayıcı girseydi
yükseklik zinciri kopardı. `contents` kutusuzdur ama CSS değişkenleri miras kalır: kompozisyon, kapı
ve bütün bölümler aynı paleti görür. Kâğıt kitindeki `KagitKok` ile aynı desen.

## Sınırlar

- `useMemo` yalnızca eser adına bağlıdır; değişkenler çizimde bir kez kurulur.
