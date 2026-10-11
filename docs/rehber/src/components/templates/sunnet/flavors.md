# `src/components/templates/sunnet/flavors.tsx` — Sorguç, nazar deseni, başlıklar

> **Kullananlar:** 28 sünnet şablonu (`SUNNET_FLAVOR`); ortak `Envelope`, sünnetin kullandığı 21 ortak hero, 5 bölüm ve iki kategori hero'su
> **Denetim:** sünnet duman testi (zarflı/zarfsız, dolu/boş)

---

## 1. Süs: Sorguç (`Ornament`)

Şehzade kalpağının tüylü mücevheri: **nazar boncuğundan yükselen tüy**.
Eski süs (taç) her "prens" temasına uyardı; sorguç yalnızca sünnet
kıyafetinde var.

| Parça | Çizim |
|---|---|
| Tüy | Sağa hafif yatık yaprak biçimi, orta damar, dört kılçık |
| Mücevher | Üç halka: dış kasnak, iç halka, göz bebeği |
| İnci | Mücevherin iki yanında iki nokta |

18 px'te (Blueprint, Plak) de okunur: çizgiler 24'lük kutuda 0.8–1.2.
Tüy kökünden ±4° salınır (`sunnet-sway`, 6 s); bkz. [parts/motion](parts/motion.md).
Süs zarf mühründe, 21 ortak hero'lu şablonda ve kategori hero'larında aynı süstür.

## 2. Desen: nazar ve pul (`BackgroundPattern`)

104 px'lik yarım kaydırmalı döşeme: iki nazar boncuğu (8 ve 6 px yarıçap),
iki dört köşeli pul, bir inci. Kapsayıcı `%40`, desen `%8–11` → zemine
etkisi ~%4.5; kontrast betiği bölüm zeminini bu en kötü hâliyle de hesaplar.

Desen kimliği `useId` ile üretilir. Sabit kimlikle iki davetiye aynı belgede
çizilirse (şablon ızgarası) ikincisi birincinin rengini alırdı.

## 3. Metinler

| Alan | Değer | Not |
|---|---|---|
| `envelopeLabel` | Sünnet Davetiyesi | Değişmedi |
| `tagline` | Şehzademizin Büyük Gününe Bekliyoruz | Değişmedi |
| `headings.timeline` | **Şenlik Programı** | Eskisi "Program Akışı" — bölümün sabit üst etiketiyle aynıydı, iki kez yazılıyordu |
| `headings.details` | Adres & Ulaşım | — |
| `headings.gallery` | **Şehzademizden Kareler** | Eskisi "Anılarımız" (doğum günüyle aynı) |
| `headings.gift` | Takı & Armağan | — |
| `headings.rsvp` | Katılım Durumu | — |
