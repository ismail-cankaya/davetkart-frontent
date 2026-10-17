# `konsept/kitap/BezKapak.tsx` — `BezYuzey` · `BezKapak`

> **Tarih:** 2026-10-17 · dal `design/kitap` · Kaynak: [KITAP-KONSEPTI §4.1](../../../../../tasarim/KITAP-KONSEPTI.md)

---

## 1. `BezYuzey`

Mutlak konumlu, `aria-hidden` katman:

| Katman | Nasıl |
|---|---|
| Bez | `background-color` = bez + `bez.webp` (`multiply`) |
| Menteşe oluğu | Sırt tarafında 8 px dikey degrade (sol 14 px; kap ≥ 48 rem'de 26 px) — kapağın içe basılı oluğu |
| Kenar koyulaşması | Radyal degrade, kenarda siyah %30 |

Hepsi CSS; filtre yok. Katmanların hepsi yalnızca koyulaştırır.

## 2. `BezKapak`

Simetrik, dikey eksende, iki ton (bez + yaldız):

```
ETİKET (11 px, aralıklı)       ← "Birinci Bölüm" / "Düğün Davetiyesi"
Adlar (Caslon Display, KitapAdlar)
—— (48 px yaldız çizgi)
İtalik satır (18 px)            ← flavor.tagline "Evleniyoruz"
TARİH (13 px, aralıklı)         ← "13 ŞUBAT 2027"
alt yuvası                       ← "Sayfayı çevirin" ya da "Kapağı açın" düğmesi
```

- Yaldız düz renk; üstte 1 px koyu gölge baskının bezde çukur durduğunu söyler (parlama yok).
- İçerik `useBaslikFontuHazir`'ı bekler (≤ 400 ms) ve `kapakBelirir` ile 0.5 s'de belirir.
- Tarih yalnızca gün (hafta günü ve saat iç sayfada). Tarih yoksa satır çizilmez.

## 3. Ölçüm (çizilmiş ekran, en kötü piksel)

| Metin | En düşük |
|---|---|
| Yaldız / şişe (etiket, italik, tarih, ipucu) | 5.35 |
| Yaldız / şarap (kapak kapısı) | 5.50 |

Eşik 4.5 (en küçük metin 11 px). Adlar ≥ 32 px, eşik 3.
