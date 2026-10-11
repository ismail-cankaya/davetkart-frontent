# `src/components/templates/dugun/parts/TulVeil.tsx` — Puantiyeli tül dokusu

> **Kullananlar:** `DugunSade` (açık), `DugunModern` (koyu, HeroStage `overlay`)
> **Denetim:** duman testi

---

## 1. Ne çizer

Gelin duvağının puantiyeli tülü (point d'esprit): 0.5 px'lik baklava ağ ve ağın
gözlerine serpilmiş inci noktalar. Desen SVG `pattern`'dir; her çözünürlükte keskin.

## 2. Ayarlar

| Prop | Varsayılan | Anlamı |
|---|---|---|
| `tone` | — | `light`: mürekkep ipliği, `dark`: inci ipliği |
| `strength` | 1 | Ağ ve nokta opaklığının çarpanı |
| `clear` | 34 | Radyal maskenin temiz kalan merkezi (%) — tül kadrajı kenarlardan sarar, metnin arkası temiz kalır |

## 3. Notlar

- Desen kimliği `React.useId()`'den türetilir; aynı sayfada birden çok önizleme
  çizildiğinde (galeri) `id` çakışmaz.
- Tamamen durağandır: animasyon, canvas ya da kaydırma yok — "hareketi azalt" için
  ayrıca bir şey gerekmez.
