# `scripts/run-check.mjs` — doğrulama betiklerini Node'da çalıştırır

> **Tarih:** 2026-10-15 · dal `design/kagit` (yalnızca §2 değişti)

---

## 1. Ne yapar

`verify:*` betiklerini esbuild ile tek bir CJS dosyasına paketleyip Node'da çalıştırır. Gerçek
uygulama modülleri içeri alınır; `import.meta.env` derleme anında yerine konur.

## 2. Görsel yükleyicileri

Şablonlar görsel içe aktarır (kapaklar `data.ts`'te, dokular kâğıt kitinde). Node'da görselin
içeriğine gerek yok, yalnızca modülün yüklenebilmesine: `.png`, `.jpg`, `.svg` ve **`.webp`**
`empty` yükleyicisiyle boş modül olur.

`.webp` 2026-10-15'te eklendi: kâğıt kiti (`shared/paper/doku.ts`) WebP dokuları içe aktarıyor;
kiti kullanan preset'ler `TemplateRenderer` üzerinden `verify:render`'a girdiğinde yükleyici
olmadan paketleme "No loader is configured for .webp" hatasıyla dururdu.
