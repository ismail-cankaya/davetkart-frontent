# `src/components/templates/sunnet/parts/OtagBackdrop.tsx` — Otağ içi sahnesi

> **Kullananlar:** `SunnetKlasik` (`renderHeroBackground`)
> **Denetim:** kontrast betiği (Klasik hero çiftleri, en düşük 5.53:1), statik önizleme

---

## 1. Ne

Klasik'in (anasayfa vitrini) sahnesi: **gündüz şenliğinde otağın içi**.

| Katman | Değer |
|---|---|
| Zemin | Radyal `#ffffff → #f5f7fd → #e4e9f8`; metnin arkası en açık |
| Tavan | Kadrajın üstündeki tepeden açılan 8 sax dilim (%7), maskeyle %78'de söner |
| Saçak | sax / beyaz dilim, nar sırma, pirinç püskül |
| Fenerler | Nar ve sax camlı iki fener, farklı ip boyu |
| Alt geçiş | `#f5f7fd`'ye 112 px solma |

Tavan SVG'si `preserveAspectRatio="none"`: dilimler kadrajla gerilir, bu
bir desen değil perspektif olduğu için sorun değil.

## 2. Neden açık

Kategorinin vitrin şablonu eskiden lacivert + altın taçtı: kardeş
kategorilerin "koyu zemin + şampanya altın" varsayılanıyla aynı. Gündüz
şenliği hem kategoriyi ayırır hem de sünnetin bir **gündüz** töreni
olduğunu (alay, at, çadır) söyler.

Kontrast için hesaplanan zemin, tavan diliminin maskeli tepe değeriyle
karışmış `#edf0fb`'dir (en kötü hâl).
