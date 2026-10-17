# `konsept/kitap/KitapKok.tsx` — şablonun kökü

> **Tarih:** 2026-10-17 · dal `design/kitap`

---

`display: contents` bir sarmalayıcı; kendi kutusu yok, düzene karışmaz. Üç iş yapar:

1. `--kt-baslik-font` ve `--kt-metin-font` değişkenlerini yazar (tema ve bileşenler bunları okur).
2. `useKitapFontlari()` ile iki Caslon ailesini yükler.
3. `lang="tr"` koyar: CSS büyük harfi `i`'yi `İ` yapar (`Birinci` → `BİRİNCİ`), heceleme Türkçe olur.
   Dil DOM'dan miras kalır; `display: contents` bunu etkilemez.

Kompozisyon, kapak kapısı ve bölümler bu kökün içindedir.
