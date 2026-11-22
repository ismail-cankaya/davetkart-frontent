# `src/utils/preloadRecovery.ts`

> **Faz:** 19.21 — `FE-02` · **Karar:** K223 · **Test:** `npm run verify:render` → *Chunk yenilemesi*

## Neden

Tembel yüklenen her sayfa bir ağ isteğidir. Zayıf mobil bağlantı ya da çok eski bir sekme
(dağıtım eski `assets/`'i 14 gün tutar, `KEEP_OLD_ASSETS_DAYS`) chunk'ı alamazsa `import()` reddedilir.
Çoğu zaman tek bir yenileme yeter: yeni `index.html` güncel chunk adlarını getirir.

## Desen

- Vite, yüklenemeyen dinamik içe aktarmada `window`'a `vite:preloadError` gönderir;
  `event.preventDefault()` hatayı yutar. `installPreloadRecovery()` `main.tsx`'te bir kez çağrılır.
- `recoverFromPreloadError`: `sessionStorage['davetkart-preload-reload']`'da son yenilemenin zamanı.
  60 s (`PRELOAD_RELOAD_WINDOW_MS`) içinde ikinci hata **yenilemez**: hata yayılır, `RouteError`
  "Sayfa yüklenemedi" der. Pencere geçince yeni bir hata yine bir kez yeniler.
- Depolama yoksa ya da istisna atarsa yenileme yok: döngü korumasız kör yenileme yapılmaz.

## Sık hata

- Bayrağı zamansız (`'1'`) yazmak: sekme açık kaldıkça bir daha hiç yenilenmez.
- `localStorage` kullanmak: bayrak sekmeler arasında paylaşılır, başka sekmenin kurtarmasını engeller.

## Nasıl denenir

`npm run build && npx vite preview` → `dist/assets/PricingPage-*.js`'i geçici olarak yeniden adlandır
→ `/pricing`'i aç: bir yenileme, sonra *"Sayfa yüklenemedi"*.
