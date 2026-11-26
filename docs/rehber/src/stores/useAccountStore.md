# `src/stores/useAccountStore.ts`

> **Faz:** 14

Sunucu durumu: `entitlements` + `sessions`, her biri bir `idle | loading | ready | error` ile.

- **İlk yüklemede `loading`, yenilemede `ready` kalır:** eski veri ekranda durur, sayılar
  yanıp sönmez.
- **Yazma → yeniden oku:** `requestRefund`, `withdrawRefund`, `revokeSession`,
  `revokeOtherSessions` işlemden sonra listeyi sunucudan tekrar ister (bkz. `pages/account/README.md` §2).
- **`reset()`** çıkışta çağrılır (`signOut`).

Neden TanStack Query değil? Projenin bütün sunucu durumu Zustand'da (`useInvitationStore`,
`useRsvpStore`, `usePricingStore`); tek bir ekran için ikinci bir önbellek kütüphanesi
getirmek iki ayrı "veri nerede?" cevabı demekti.

## Faz 20 (`FE-57`): sahiplik bekçisi

401 ile düşen oturum `signOut` çağırmaz (aynı kişi dönüp kaldığı yerden devam edebilsin), yani `reset()` de çalışmaz.
Aynı sekmede **başka** bir hesap girerse önceki hesabın hakları ve oturum listesi, yenisi gelene kadar ekranda
kalıyordu (yükleme `entitlements` doluyken `ready` kalır). Dosyanın sonundaki abonelik son görülen kullanıcıyı tutar;
kullanıcı kimliği değişince `reset()` çağırır. Aynı kişi dönerse veri kalır. Editördeki karşılığı `useInvitationStore`
sonundaki bekçi.

`npm run verify:state` → *"401 sonrası başka hesap"* ve *"401 sonrası aynı hesap"*. Mutasyon: `reset()` kaldırılınca ilki kırılır.
