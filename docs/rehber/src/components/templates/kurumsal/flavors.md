# `kurumsal/flavors.tsx` — Kurumsal flavor

> **Kullananlar:** 26 kurumsal şablon → `InvitationComposition`, `Envelope`,
> ortak bölümler ve hero'lar
> **Denetim:** duman testi (başlıklar prerender çıktısında aranır)

---

## 1. Süs: odak işareti

Dört köşe kesim işaretinin arasında, artıyla ortalanmış bir daire ve merkezde
dolu bir nokta. Eski süs (düğümlü altıgen) jenerik bir "teknoloji ağı"
simgesiydi. Yenisi baskı provasının kayıt işaretinden türetildi: ölçü,
hassasiyet, odak.

Zarf mührü (30 px), ortak hero süsleri (18–44 px) ve Künye rayı (18 px) aynı
çizimi kullanır. Çizgi kalınlığı 1.1 / 0.7. Küçük boyda da seçilir.

## 2. Arka plan deseni: kayıt artıları

88 px hücrede merkezde bir artı (%20), köşede bir nokta (%14). Kompozisyon
deseni ayrıca %40 opaklıkla ve `theme.accent` rengiyle basar.

🔴 Desen kimliği `useId()` ile örneğe özgüdür. Eskiden sabit
`id="kurumsalPattern"` vardı. Galeri birden çok kurumsal önizlemeyi aynı
sayfaya çizdiğinde hepsi ilk desenin `currentColor`'ını kullanıyordu; ayrıntı
için bkz. [RegistrationGrid](parts/RegistrationGrid.md#2--neden-svg-pattern-değil).

## 3. Metinler

| Alan | Değer | Not |
|---|---|---|
| `envelopeLabel` | Etkinlik Daveti | Değişmedi |
| `tagline` | Birlikte Daha İleriye | Değişmedi; Künye hero'da başlık boşken göz başlığı |
| `headings.timeline` | **Gündem** | Eskiden "Program Akışı". Ortak bölüm zaten "PROGRAM AKIŞI" üst etiketini basıyordu; başlık onu tekrarlıyordu |
| `headings.details` | Konum ve Ulaşım | Değişmedi |
| `headings.gallery` | **Görsel Arşiv** | Eskiden "Galeri" |
| `headings.gift` | **Bağış ve Katkı** | Eskiden "Sponsorluk". Bölüm IBAN ve tutar gösterir; bu bir sponsorluk değil, bağış/katkı akışıdır |
| `headings.rsvp` | Kayıt Formu | Değişmedi |

Ortak bölümlerin üst etiketleri ("Özel Anlarımız", "Hediye Takdiri") ve hediye
açıklaması koda gömülüdür ve kurumsal bağlamda romantik okunur. Bunlar bu
klasörden değiştirilemez; raporda ortak değişiklik önerisi olarak yer alır.
