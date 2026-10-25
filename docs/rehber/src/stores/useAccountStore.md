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
