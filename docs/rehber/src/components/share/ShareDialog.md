# `src/components/share/ShareDialog.tsx`

Faz 29.3 (K327). `useShare()` → `share(url, title)` ve sayfanın çizeceği `dialog`.

- Dokunmatik cihazda ve Web Share varsa cihazın paylaşım menüsü (`navigator.share`), pencere açılmaz.
- Aksi halde pencere: QR kod (`QrCode`, tembel parça), bağlantı, "Bağlantıyı kopyala", WhatsApp (`wa.me`), Web Share
  varsa "Diğer uygulamalar".
- `QrCode`: `qrcode-generator` (bağımlılıksız, UTF-8 bayt kipi) yalnızca modül matrisini hesaplar; SVG React ile
  çizilir, `dangerouslySetInnerHTML` yok.
