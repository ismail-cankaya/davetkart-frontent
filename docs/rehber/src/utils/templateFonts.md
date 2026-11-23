# `src/utils/templateFonts.ts`

> **Faz:** 19.17 — `SEC-12` · **Karar:** K226

`loadTemplateFonts()`: `/fonts/templates.css`'i belgeye **bir kez** ekler, `load`/`error`'da çözülür
(hata da çözülür: yedek font çizilir). Sunucu çiziminde (`document` yok) hemen çözülür.

Çağıranlar: `harita`/`kitap`/`sergi`/`paper` `fontlar.ts` ve `sinema/useTemplateFont`. Eskiden her biri
Google'a kendi `<link>`'ini ekliyordu. Stil dosyası 36 KB, ama font dosyaları yalnızca o aile
kullanılınca iner; bu yüzden şablonlar tek dosyayı paylaşır.

`useTemplateFont(family)`'deki css2 sorgusu artık yükleme için değil, belge: `verify:fonts` oradaki
her ailenin yerel tanımı olduğunu denetler.
