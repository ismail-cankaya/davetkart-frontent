# `scripts/export-covers.mjs` — Kılavuz

> **Faz:** 19 ortak düzeltme (B-E4, 25 Kasım 2026) · **Karar:** K235 · **Komut:** `npm run build`'in son adımı

## Neden

Paylaşım önizlemesi (WhatsApp, Facebook) galerisi olmayan davetiyede genel posteri gösteriyordu: şablon kapakları
Vite derlemesinde hash'li adla çıkıyor, backend (`BuildSharePreviewAction`) adlarını bilemiyordu.

## Ne yapar

1. `src/templateCatalog.ts`'i esbuild ile Node'da yükler; içe aktarılan görseller `file` yükleyicisiyle bir önbellek
   klasörüne kopyalanır, `/images/...` yolları `public/`'ten okunur.
2. Her şablonun kapağını `dist/covers/<preset>.<uzantı>` adıyla kopyalar, `dist/covers/index.json`'a
   `{ "<preset>": "/covers/<preset>.<uzantı>" }` yazar. Backend bu dizini okur (`app/Support/TemplateCovers.php`).
3. Atlananlar: kapaksız şablon (`imageUrl: ''`), SVG (OG tarayıcıları göstermez), 600 kB'den büyük görsel
   (WhatsApp göstermiyor). Bunlarda önizleme genel postere düşer.
4. Dizin boş kalırsa ya da bir kapak dosyası bulunamazsa çıkış 1 (derleme kırmızı).

25 Kasım 2026 ölçümü: 65 kapak (2,7 MB), kapaksız 258, SVG 49, büyük 1.

## Sık hata

- Kapak yolu `import.meta.env.BASE_URL` ile kuruluyorsa betik onu `/` sayar (Vite'ın varsayılanı).
- Yeni şablonun kapağı SVG ise önizlemede görünmez; raster bir kapak (`.jpg`/`.webp`) ekle.

## Nasıl denenir

`npm run build` → çıktının sonunda `✓ export-covers: N kapak` · `dist/covers/index.json`.
