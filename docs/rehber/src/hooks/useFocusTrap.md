# `useFocusTrap` — Kılavuz

> **Kod dosyası:** `src/hooks/useFocusTrap.ts` · **Faz:** 19 ortak düzeltme (B-H3, 25 Kasım 2026)
> **Kullanan:** `src/components/payment/PaywallModal.tsx`

## Neden

`role="dialog"` + `aria-modal="true"` ekran okuyucuya "artık bir penceredesin" der, ama klavyeyi durdurmaz:
Tab arkadaki sayfaya kaçar, pencere kapanınca odak `body`'ye düşer. WAI-ARIA modal deseni üç şey ister:
açılınca odak içeri, açıkken Tab/Shift+Tab içeride döner, kapanınca odak açan öğeye geri döner.

## Desen

- `active` `true` olunca: o anki `document.activeElement` (açan öğe) saklanır, kaptaki ilk odaklanabilir öğeye odak verilir.
- `keydown` (Tab): son öğeden ileri → ilk öğe; ilk öğeden geri → son öğe. Odak bir şekilde dışarıdaysa da içeri çekilir.
- Temizlikte (kapanış ya da söküm) odak açan öğeye döner (`isConnected` ise).
- Görünmeyen öğeler (`getClientRects().length === 0`) sayılmaz; liste her Tab'da yeniden okunur (yükleniyor → planlar).
- Esc burada değil: kapatma kararı bileşenindir (`PaywallModal` kendi `keydown`'ında `closePaywall`).

## Sık hata

- `ref`'i `AnimatePresence` içindeki **kart**a ver, arka plan katmanına değil (arka plana tıklama kapatır).
- Effect, kap DOM'a girdikten sonra çalışır; `isOpen` ile aynı render'da çizilen kap için ek bekleme gerekmez.

## Nasıl denenir

`npm run e2e` → `e2e/paywall-after-publish.spec.ts`: pencere `dialog` rolüyle adlandırılmış, "Kapat" odakta,
12 Tab/Shift+Tab'da odak içeride, axe (WCAG A/AA) temiz, Esc kapatır ve odak galeri anahtarına döner.
