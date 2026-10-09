# `src/components/templates/sunnet/SunnetAurora/index.tsx` — Aurora Cam

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-aurora`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi, kontrast betiği, statik önizleme 360

---

## 1. Ne değişti

| | Önce | Şimdi |
|---|---|---|
| Hero | ortak `Summary` (9 kategoride aynı) | `SehzadeHero` + okuma halesi; kuşak buz camı (beyaz → `#d6f4f8`) |
| Mesh | şehzade mavisi + mor + buz | sax `35,72,198` / turkuaz `42,167,184` / nar `195,38,60` |
| Tema | `#070d1c` | `SUNNET_AURORA`: `#0a1242`, turkuaz vurgu, beyaz cam kartlar |

Aurora bir tasarım dilidir (dokuz kategoride var). Sahne (mesh + cam) korunur;
sünnet ayrışması ön planda: aynı aurora üstünde sünnetin düzeni.

## 2. Bakılacak risk

Nar mesh lekesi metnin arkasına gezebilir; okuma halesi bu yüzden açık.
Hale tahminiyle mesaj 6.91:1.
