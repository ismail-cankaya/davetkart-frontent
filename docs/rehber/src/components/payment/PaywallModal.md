# `PaywallModal` — Kılavuz

> **Kod dosyası:** `src/components/payment/PaywallModal.tsx`
> Sunucu 402 ile bir plan istediğinde açılan plan duvarı (yayın reddi ya da yayındaki davetiyede plan üstü modül, K88).

## Erişilebilirlik (B-H3, Faz 19 ortak düzeltme, 25 Kasım 2026)

- Kart `role="dialog"`, `aria-modal="true"`, `aria-labelledby="paywall-title"` (başlık `h2`).
- Odak tuzağı: [`useFocusTrap`](../../hooks/useFocusTrap.md) — açılınca "Kapat" düğmesi, Tab içeride döner, kapanınca açan öğeye döner.
- Esc ve arka plana tıklama `closePaywall`; arkadaki sayfa açıkken kaymaz (`body` `overflow: hidden`).
- Sınama: `e2e/paywall-after-publish.spec.ts` (rol, odak, axe, Esc).
- Kontrast: kilitli (yetersiz) plan kartı artık `opacity-55` ile soluklaştırılmıyor (axe `color-contrast` kırmızıydı);
  `bg-stone-50` zemin + kilit düğmesi yeter. Dahil olmayan özellik `text-stone-500` üstü çizili (`PricingPage` ile aynı).
