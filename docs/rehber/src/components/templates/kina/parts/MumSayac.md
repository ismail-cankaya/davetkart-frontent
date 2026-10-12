# `src/components/templates/kina/parts/MumSayac.tsx` — Mum sayacı

> **Kullananlar:** `KinaHero`
> **Denetim:** duman testi (geçersiz/boş tarihte çizilmez), kontrast betiği (sayı/etiket kart üstünde)

---

Geri sayımın dört birimi tepside yanan dört mumdur: üstü yuvarlak bir gövde (tema
`surface` + `border`), gövdenin tepesinde fitil, fitilin üstünde titreyen alev ve
arkasında nefes alan ışık.

| Dışa açılan | Ne |
|---|---|
| `MumSayac` | `date`, `timeZone` (zorunlu; `useCountdown`), `theme`, `flame` (hex), `delay`, `className` |
| `Alev` | Tek alev: dış alev + açık çekirdek + bulanık ışık; `delay` her mumu farklı fazda titretir |

Tarih ayrıştırılamazsa (`valid: false`) bileşen `null` döner. Sayılar Playfair
`tabular-nums`; saniye değişirken genişlik oynamaz.
