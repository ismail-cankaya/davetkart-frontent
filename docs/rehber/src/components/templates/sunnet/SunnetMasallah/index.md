# `src/components/templates/sunnet/SunnetMasallah/index.tsx` — Maşallah Kuşağı

> **Kullananlar:** `TemplateRenderer.tsx` (`sunnet-masallah`), `sunnet/index.ts`
> **Denetim:** `npm run check`, sünnet duman testi, kontrast betiği, statik önizleme 360/1280

---

## 1. Ne değişti

| | Önce | Şimdi |
|---|---|---|
| Hero | ortak `Summary` | `KusakHero`: kadrajı kesen sırmalı kuşak, "Maşallah" nakışı |
| Arka plan | kırmızı ipek, altın parlama, mavi balonlar | aynı dil; renkler aileye: sax/sedef balon, pirinç kıvılcım, nar tül |
| Tema | `theme-cormorant`, `#180a0d` | `SUNNET_MASALLAH`: `#1d0910`, Playfair, nar cam kartlar, pirinç hap düğme |

Konseptin adı kuşaktı ama kuşak yalnızca arka plandaki bir ipek dalgasıydı;
artık kompozisyonun kendisi.

## 2. Kuşak parametreleri

| Prop | Değer |
|---|---|
| `band` | `#8c1427 → #b51f35 → #c3263c → #8f1529` (saten degrade) |
| `thread` | `#f7d27a` (sırma; nakışta ≥ 3.95:1) |

## 3. Bakılacak risk

360 px'te kuşak 70 px, nakış 32 px; uzun ad (iki satır) kuşağı aşağı iter,
blok yine sığar. 1280 px'te kuşağın sağ ucu adın altından geçer, ada değmez
(önizlemede bakıldı).
