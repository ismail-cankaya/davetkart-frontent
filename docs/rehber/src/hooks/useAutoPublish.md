# `src/hooks/useAutoPublish.ts` — Ödeme dönüşünde yayın kancası

> **Faz:** 11.6 (ilk yazım) · 21.3 `FE-58` (karar saf fonksiyona taşındı, K267) · **Karar:** [`../utils/autoPublish.md`](../utils/autoPublish.md)

Ödeme onaylandığında siparişin bağlı olduğu davetiyeyi yayına alır. Kart, Shopier ve hediye kodu (toplam 0) aynı dönüş
sayfasına düşer; sipariş `paid` olunca kullanıcıdan ikinci bir "Yayınla" tıklaması beklenmez. Yayının kendisi yine
`POST /invitations/{id}/publish`: plan kontrolünü (402) sunucu yapar, frontend yetki kararı vermez.

| Durum | Karşılığı |
|---|---|
| Paket siparişi (`invitationId: null`) | yayınlanacak davetiye yok, `idle` |
| 409 `INVITATION_ALREADY_PUBLISHED` | kullanıcı hedefine ulaşmış, `published` |
| Diğer hatalar | ödeme geçerli kalır; `error`, ekran sebebi ve "Tekrar Dene"yi gösterir |
| Aynı sipariş bu sekmede daha önce denendi | `skipped`: istek yok, kart "Ödemeniz onaylandı" (21.3) |

## İki bekçi

1. **`attemptedOrderId` (ref):** bu çizimde karar bir kez verilir. StrictMode geliştirmede efekti iki kez çalıştırır;
   ikinci çalışma `claimAutoPublish`'i yeniden çağırsaydı `already` döner ve ilk isteğin `publishing` durumunu `skipped`
   ile ezerdi. Sonuç iptal edilmez: ilk isteğin sonucu düşseydi ekran "yayınlanıyor"da kalırdı (11.6 notu).
2. **`memory` (sekme belleği):** sayfa yenilense ya da geri gelinse de aynı sipariş için ikinci istek gitmez
   (`sessionStorage`). Bellek ilk efekt çalışmasında kurulur (`??=`); sunucu tarafı çizimde `window` yok.

"Tekrar Dene" (`retry`) belleğe bakmaz: kullanıcının kendi tıklamasıdır.
