/**
 * Havale/EFT yardımcıları.
 *
 * Faz 13 (backend K135): hesap bilgisi (banka, hesap sahibi, IBAN) artık
 * BURADA DEĞİL — backend `.env`'inde durur ve fiyat kataloğuyla gelir
 * (`PricingCatalog.bankTransfer`). Eskiden `VITE_BANK_TRANSFER_*` derlemeye
 * gömülüyordu; hesabı değiştirmek frontend'i yeniden derlemeyi gerektiriyordu
 * ve yöntemi kapatmanın tek yolu değişkeni silmekti. Artık tek anahtar
 * backend'deki `PAYMENT_METHODS`. IBAN sağlama toplamı da orada sınanır.
 * Ayrıntılı açıklama: docs/rehber/src/services/pricing.md §4
 */

/**
 * Havale açıklamasına yazılacak referans kodu: `DK-7XK2-M9QA`.
 *
 * Gelen havaleyi doğru davetiyeyle eşleştirmenin tek yolu budur — tutar
 * yalnızca paketi söyler, kimin ödediğini söylemez. Kod davetiyenin (yoksa
 * hesabın) kimliğinin son sekiz karakteridir; ULID'lerin bu kısmı rastgeledir.
 *
 * 🔴 Geçici: backend'de havale siparişi ucu yok. O uç açıldığında sipariş
 * kimliği (`orderId`) referansın yerini almalı; eşleştirme o zaman tahmin
 * değil birebir arama olur.
 */
export function bankTransferReference(sourceId: string): string {
  const tail = sourceId.replace(/[^0-9a-z]/gi, '').slice(-8).toUpperCase().padStart(8, '0');
  return `DK-${tail.slice(0, 4)}-${tail.slice(4)}`;
}
