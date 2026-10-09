# `src/components/templates/sunnet/SunnetYildizHaritasi/index.tsx` — Yıldız Haritası

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-yildiz-haritasi`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi ve kontrast betiği (bkz. [KIMLIK](../KIMLIK.md) §6–§7)

---

## 1. Ne değişti

Ortak `YildizHero` **değişmedi** (shared/ kapalı). Şablon yalnızca kendi
kaldıraçlarını kullanır: tema, hero parametreleri ve arka plan.

| Katman | Değer |
|---|---|
| Tema | `SUNNET_YILDIZ_HARITASI (koyu)` — `sunnet/themes.ts` |
| Arka plan | HeroStage: `#142070 → #04071f` radyal + turkuaz Halo (%12) |
| Önceki görünüm | derin mavi + yeşim |

## 2. Hero parametreleri

| Parametre | Değer | Neden |
|---|---|---|
| `star` | `#ffffff` | Değişmedi |
| `line` | `#6fd6e2` | Takımyıldız çizgisi nazar turkuazı |

## 3. Bakılacak risk (360 / 768 / 1280 px)

Çizgiler ince; 360 px'te takımyıldız ile ad çakışması bakılacak.
