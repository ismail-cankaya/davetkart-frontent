# `src/components/templates/sunnet/SunnetYildiz/SunnetYildiz.tsx` — Yıldız Tozu (videolu)

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-yildiz`), `SunnetYildiz/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi (SSR'da `window` taklidiyle — aşağıda)

---

## 1. Ne değişti

| | Önce | Şimdi |
|---|---|---|
| Hero | ortak `Summary` | `SehzadeHero` + okuma halesi (`6,10,42`), nar kuşak |
| Video | `sunnet-yildiz` (public, kapalı) | aynı, dokunulmadı |
| Fişekler | şampanya altın + pembe + buz mavisi | fener pirinci `#f2c14e`, nar `#ff8a96`, sax ışığı `#9db0ff`, krem |
| Tema | `theme-cormorant`, `#060f26` + `#f2d79b` | `SUNNET_YILDIZ`: `#0b1240`, Playfair, sax cam kartlar |

Video hareketli ve karesi önceden bilinmediği için hero halesiyle gelir;
kontrast, en parlak orta ton (`#8a96c8`) varsayımıyla hesaplandı (mesaj 5.30:1).

## 2. 🔴 SSR notu (ortak dosya)

`shared/VideoBackdrop` `useState` başlatıcısında `window.matchMedia` okur;
Node'da `renderToString` bu şablonda `window is not defined` fırlatır.
Uygulama yalnızca istemcide çizdiği için üretimde sorun yok; duman testi
en küçük bir `window` taklidiyle koşar. Değişiklik önerisi raporda.
