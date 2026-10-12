# `src/components/templates/kina/KinaGazete/index.tsx` — Gazete Manşeti

> **Kullananlar:** `TemplateRenderer.tsx` (`'kina-gazete'`), `src/data.ts` (`kina-gazete` kartı)
> **Denetim:** kına duman testi, kontrast betiği, görsel öz-kontrol (bkz. [KIMLIK.md](../KIMLIK.md))

---

## 1. Fikir

Avuç kâğıdı, kahve mürekkep, al manşet; künye "KINA GAZETESİ".

Hero: GazeteHero (ortak) — `masthead="KINA GAZETESİ"`.

## 2. Ne değişti

| Alan | Önce | Sonra |
|---|---|---|
| Tema | Yerel tema (`#b8323f`) | `KINA_GAZETE` |
| Künye | "KINA POSTASI" | "KINA GAZETESİ" (Posta şablonuyla karışmasın) |

Vurgu rengi: `#b8323f` → `#a31f18`.

## 3. Kontrast

| Alan | En düşük oran | Çift |
|---|---|---|
| Bölümler | 5.97 | accent/zemin |
| Hero | 7.43 | gövde / `#fbf4ec` (gerçek zemin, 360 px) |

Eşik: normal metin 4.5, büyük başlık 3, ikon 3. Yöntem: KIMLIK.md §6.

## 4. Hareket ve "hareketi azalt"

| Kaynak | Nasıl susturulur |
|---|---|
| Ortak hero girişleri | Ortak dosyada |

## 5. Görsel öz-kontrol

Boş senaryoda ortak hero tek bir "D" baş harfi bırakıyor (ortak davranış, raporda).
