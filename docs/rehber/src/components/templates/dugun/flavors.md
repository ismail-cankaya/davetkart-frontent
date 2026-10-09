# `src/components/templates/dugun/flavors.tsx` — Düğün flavor'ı

> **Kullananlar:** 40 düğün şablonunun tamamı (`DUGUN_FLAVOR`); üzerinden zarf,
> ortak bölümler (Program, Detaylar, Galeri, Hediye, LCV) ve ortak hero'lar
> **Denetim:** duman testi (c senaryosunda zarf etiketi aranır)

---

## 1. Ne taşır

| Alan | Önce | Sonra |
|---|---|---|
| `Ornament` | İç içe iki halka (nişanın alyans diliyle karışıyordu) | `KurdeleMark` — kurdele düğümü |
| `BackgroundPattern` | Dalga + nokta | Puantiyeli tül: baklava ağ + seyrek inci nokta, `useId` ile tekil desen kimliği |
| `envelopeLabel` | Düğün Davetiyesi | Düğün Davetiyesi |
| `tagline` | Evleniyoruz | Evleniyoruz (artık KurdeleHero'da isimlerin altında görünür) |
| `headings.timeline` | Program | Nikâhtan Düğüne |
| `headings.details` | Detaylar | Düğün Adresi |
| `headings.gallery` | Galeri | Hikâyemizden Kareler |
| `headings.gift` | Hediye & Takı | Takı & Hediye |
| `headings.rsvp` | LCV (Lütfen Cevap Veriniz) | Lütfen Cevap Veriniz |

LCV bölümünün üst satırı (ortak dosyada) zaten "LCV — Katılım Bildirimi" yazdığı için
başlıkta kısaltma tekrarlanmaz.

## 2. Nerede görünür

- **Süs:** zarf mührü, 22 ortak hero'nun süs yeri (Bento, Deco, Kağıt, Bilet…).
- **Desen:** `renderBackdrop` vermeyen her şablonda bölümlerin arkasında, `opacity-40`
  ve `theme.accent` renginde (Ufuk kendi sahnesini çizdiği için orada görünmez).
