# `src/components/templates/kina/flavors.tsx` — Kına çeşnisi

> **Kullananlar:** 35 kına şablonu (`KINA_FLAVOR` → `InvitationComposition flavor`)
> **Denetim:** kına duman testi (dolu senaryoda "Kına Gecesi Programı" etiketi aranır)

---

## 1. Ne taşır

| Alan | Değer | Nerede görünür |
|---|---|---|
| `Ornament` | `TepsiIcon` — kına tepsisi (eskiden mehendi'yi andıran mandala yıldızı) | Zarf mührü, KinaHero tepesi, ortak hero'ların süs yuvası |
| `BackgroundPattern` | `KinaPattern` — seyrek bindallı dalları (lale filizi + sırma pul), 140 px yarım kaydırmalı | Bölüm arkası desen |
| `envelopeLabel` | `Kına Davetiyesi` | Zarf |
| `tagline` | `Kınamıza Bekliyoruz` | `UfukHero` başlık yedeği (başlık boşken) |
| `headings` | Gecenin Akışı · Adres & Ulaşım · Anılarımız · Takı & Armağan · Katılım Durumu | Bölüm başlıkları |
| `eyebrows` | Kına Gecesi Programı · Kınanın Yakılacağı Yer · Kınadan Önce · Takı Merasimi · Kına Davetine Yanıt | Bölüm başlığının üstündeki küçük etiket |
| `giftNote` | Takı ya da hediye notu (aşağıda) | Hediye bölümü açıklaması |

## 2. Neden bu metinler

- "Akış" → **"Gecenin Akışı"**: kına bir gece töreni; program saatlerle değil sırayla
  (kına yakılması, türküler, takı) okunur.
- Etiketler törenin dilinden: kına "yakılır", takı "merasim"dir.
- `giftNote` takıyı anar: kına gecesinde armağan çoğunlukla takıdır; varsayılan metin
  (`shared/flavor.ts`) kategori dışı genel bir ifadeydi.

## 3. Desen notu

Desen kimliği `useId` ile üretilir: aynı belgede birden çok davetiye (vitrin, düzenleyici
önizlemesi) çizildiğinde `<pattern id>` çakışmaz. Opaklıklar %7–13: bölüm metninin
arkasında kontrastı bozmaz (kontrast betiği vurguyu %40 × %13 karıştırarak "en kötü zemin" alır).
