# `src/components/studio/canvas/useFrameDocument.ts`

Faz 27.1 (K320). `DeviceCanvas`'ın iframe belgesini hazırlar.

| Ne | Nasıl |
|---|---|
| Stiller | Ana belgedeki `style`, `link[rel=stylesheet]`, yazı tipi `preload` bağlantıları kopyalanır. Sonradan eklenenler (tembel parça CSS'i, `useTemplateFont`'un eklediği yazı tipleri) ve `<style>` içerik değişiklikleri (Vite HMR) `MutationObserver` ile izlenir; kaldırılan kaldırılır |
| `<html>` öznitelikleri | `lang`, `dir`, `class`, `style`, `data-theme` aynalanır (tema ve yazı yönü) |
| Temel CSS | `html, body` tam yükseklik, kenar boşluğu yok, gövde kaydırmaz (şablon kendi kabında kaydırır) |
| Klavye | Odak iframe'deyken `keydown` ana pencereye ulaşmaz. Yazı alanı dışındaki tuşlar `document.body`'den yeniden gönderilir (pencereden değil: dinleyiciler hedefin `closest()`'ine bakar). Dinleyici `preventDefault` derse asıl olay da engellenir |
| Hazır olma | `srcdoc` belgesi `load` ile; etki geç kalırsa (`about:srcdoc` ve `complete`) hemen |
