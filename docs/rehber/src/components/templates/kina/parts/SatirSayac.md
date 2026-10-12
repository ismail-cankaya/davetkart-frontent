# `src/components/templates/kina/parts/SatirSayac.tsx` — Satır sayacı

> **Kullananlar:** `KinaHero` (`timer="satir"`) → `KinaManzara`, `KinaBordo`, `KinaAurora`, `KinaKrom`
> **Denetim:** duman testi (geçersiz/boş tarihte çizilmez), görsel öz-kontrol 360 / 768 / 1280

---

## 1. Neden ikinci bir sayaç

Dokuz şablon aynı `KinaHero`'yu kullanıyor. Hepsinde dört mumlu sayaç olunca 360 px
temas sayfasında koyu şablonlar (Bordo, Mum, Sekilli, Saray, Aurora) aynı alt
siluetle birbirine karıştı. Satır sayacı hero'nun alt kenarını değiştirir ve
~40 px kısaltır: Manzara'nın tepeleri bu sayede ilk ekrana girer.

```
──────────────────────────────
   120   ◆   06   ◆   13
   GÜN       SAAT     DAKİKA
──────────────────────────────
```

## 2. Sözleşme

| Prop | Ne |
|---|---|
| `date`, `timeZone` | `useCountdown`'a gider (duvar saati + saat dilimi) |
| `theme` | `border` (iki kıl çizgi), `accent` (sırma pulu), `heading` (sayı), `body` (etiket) |
| `delay`, `className` | Giriş gecikmesi, ek sınıflar |

- Tarih ayrıştırılamazsa (`valid: false`) bileşen `null` döner.
- Saniye bilinçli olarak yok: satır sakin kalsın, saniyede bir yeniden boyanan alan olmasın.
- Sayılar Playfair `tabular-nums`; rakam değişirken genişlik oynamaz.

## 3. Hareket

Tek giriş: `opacity` + 14 px `y` (`ease.out`). `MotionConfig reducedMotion="user"`
`y`'yi atlar; sürekli döngü yok.
