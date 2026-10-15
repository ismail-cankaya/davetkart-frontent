# `shared/paper/fontlar.ts` — el yazıları ve yükleme

> **Tarih:** 2026-10-15 · dal `design/kagit` · Denetim: [KAGIT-KONSEPTI §3](../../../../../tasarim/KAGIT-KONSEPTI.md)

---

## 1. Seçim

46 el yazısı adayından 13'ü Türkçe glif eksiği yüzünden elendi; geçenlerin arasından okunurluk
ve `I`/`İ` ayrımına göre üçü seçildi: **Pinyon Script** (resmî), **Alex Brush** (fırça), **Caveat**
(gündelik). Gövde **EB Garamond**, ara başlık **Cormorant Garamond** (zaten yüklü).

## 2. Yükleme

`useKagitFontlari(el)` şablon açıldığında `<link>` ekler; aynı aile ikinci kez eklenmez (`id`).
Genel `index.css`'e eklenmedi: oradaki her aile ana sayfa ve panel dahil her sayfaya iner.

- Etki içinde çalışır: sunucu çiziminde (`verify:render`) hiçbir şey yapmaz.
- `display=swap`: metin önce Cormorant'la görünür, font gelince değişir. İlk boyama beklemez.

## 3. `useElYazisiHazir(el, sinirMs = 700)`

Ad satırı yedekten el yazısına geçerken genişlik değişir. Hero, adın girişini bu kancaya bağlayabilir.
Sınır dolunca yine `true` döner: yavaş ağda ad gizli kalmaz.

## 4. Sınırlar

- Google Fonts'a bağlı (projenin mevcut yöntemi). Çevrimdışı önizlemede yedek font görünür.
- Font eklemek yeniden glif denetimi ister.
