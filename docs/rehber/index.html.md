# `index.html` — paylaşım etiketleri

> **Faz:** 19.23 — `FE-04` · **Karar:** K230

Site geneli `description`, `og:*`, `twitter:card`. Adresler mutlak ve sabit (`https://davetkart.com`): önizleme botları
göreli `og:image`'ı çözmez. Görsel `public/videos/hero-bg-poster.jpg` (ana sayfa posteri; backend genel önizlemesi de
bunu kullanır: `config/davetkart.php` → `share_preview.image_path`). Davetiyeye özel önizleme bu dosyada değil:
`/invite/{id}` botları Nginx'te Laravel'e gider (backend `docs/rehber/deploy/nginx/davetkart.md`).
