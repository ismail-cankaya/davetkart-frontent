# `shared/Envelope.tsx` — renkler temadan

> **Kullananlar:** `InvitationComposition` (`showEnvelope` açıkken)
> **Tarih:** 2026-10-11 · dal `design/ortak`

---

Beş renk artık `theme.envelope`'tan okunur, yoksa eski varsayılana düşer:

```ts
const custom = theme.envelope ?? {};
const seal = custom.seal ?? (isDark ? 'bg-amber-300 text-slate-950' : 'bg-stone-800 text-stone-50');
```

Alanların listesi ve gerekçesi: `palette.md`. Animasyon, metin ve akış değişmedi.

## B-D14 (26 Kasım 2026): ipucu nabzı artık metni soldurmuyor

373 şablonluk axe taraması (390 px, `onizleme.html?zarf=1`, giriş animasyonu bittikten sonra): ipucu metni nabzın
0,75 tabanında 16 şablonda 4,5:1'in altındaydı (çoğu pastel Baby Shower; en kötüsü `baby-shower-pastel` 2,95).
Tam opaklıkta 16'sı da geçiyor; 0,9 ve 0,95 tabanında bile ikisi kalıyordu. Bu yüzden nabız opaklıktan
ölçeğe taşındı: `hint-fade` (opaklık 0,75 → 1) yerine `hint-pulse` (`scale(1)` → `scale(1.04)`), sınıf
`animate-hint-pulse`. Dikkat çekme işi sürer, kontrast hiç düşmez; azaltılmış harekette animasyon kapalı.
Sonuç (yeniden tarama): 342 şablon ≥ 4,5, ihlal 0. 11'inde axe "belirsiz" (krom degrade ve kâğıt dokusu zemin: `*-krom`, `nisan-soz-mektubu`, `nisan-gul-kurusu`, `nisan-soz-senedi`, `dogum-gunu-mumlar`) — gözle bakılmalı; 20 şablon kendi kapısını kullanıyor (bu ipucu yok).
