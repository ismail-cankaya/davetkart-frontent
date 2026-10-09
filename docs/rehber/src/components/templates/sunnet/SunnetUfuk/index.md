# `src/components/templates/sunnet/SunnetUfuk/index.tsx` — Ufuk

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-ufuk`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `UfukHero + UfukScene` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_UFUK (koyu)` — `sunnet/themes.ts` |
| Arka plan | renderBackdrop: ortak `UFUK_PRESETS.sunnet` (saray, hilal) — değişmedi |
| Önceki görünüm | aynı sahne; vurgu `#f2cf7a`, kartlar `#08122a/75` |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `scrim` | `SCENE.scrim` | Değişmedi |
| `shutter` | `SCENE.sky.night[0][0]` | Değişmedi |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Yalnızca tema token'ları aileye geçti (vurgu fener pirinci, kartlar sax gecesi camı). Sahne paleti ortak preset'te — değişiklik önerisi raporda.
