import { BankTransferAccount } from '../types';
import { isValidTrIban, normalizeIban } from '../utils/iban';

/**
 * Havale/EFT hesap bilgisi — ortam değişkenlerinden okunur.
 *
 * 🔴 **Depodan uzak, tarayıcıdan değil.** IBAN ve hesap sahibi `.env`'de
 * durur (`.env*` gitignore'da), yani kaynak koduna ve git geçmişine girmez.
 * Ama Vite `VITE_` önekli her değeri derlenen JS'e **gömer**: `/odeme`
 * chunk'ını indiren herkes bu değerleri okuyabilir. Bu kabul edilebilir,
 * çünkü aynı bilgi ödeme yapan her müşteriye zaten ekranda gösterilir.
 * Gizli anahtar (sağlayıcı API sırrı vb.) bu yola asla konmaz — bkz.
 * `.env.example`.
 *
 * Bilgi bir gün backend'den gelecekse (`GET /payments/bank-account` gibi,
 * yeniden derlemeden hesap değiştirebilmek için) değişecek tek yer burası.
 */

let warned = false;

function warnOnce(message: string): void {
  if (!import.meta.env.DEV || warned) return;
  warned = true;
  console.warn(`[bankTransfer] ${message}`);
}

/**
 * Yapılandırılmış hesap; eksik ya da hatalıysa `null` (Havale/EFT kapalı).
 *
 * 🔴 Sağlama toplamından geçmeyen IBAN **gösterilmez**. `.env`'e yazarken
 * düşen tek bir hane, müşterinin parasını başka bir hesaba gönderir; seçeneği
 * kapatmak, yanlış hesabı göstermekten her zaman iyidir.
 */
export function getBankTransferAccount(): BankTransferAccount | null {
  const bankName = import.meta.env.VITE_BANK_TRANSFER_BANK_NAME?.trim() ?? '';
  const accountHolder = import.meta.env.VITE_BANK_TRANSFER_ACCOUNT_HOLDER?.trim() ?? '';
  const iban = normalizeIban(import.meta.env.VITE_BANK_TRANSFER_IBAN ?? '');

  if (!bankName || !accountHolder || !iban) {
    warnOnce(
      'Havale/EFT kapalı: VITE_BANK_TRANSFER_BANK_NAME, VITE_BANK_TRANSFER_ACCOUNT_HOLDER ' +
        've VITE_BANK_TRANSFER_IBAN .env dosyasında tanımlı olmalı (bkz. .env.example).'
    );
    return null;
  }

  if (!isValidTrIban(iban)) {
    warnOnce('Havale/EFT kapalı: VITE_BANK_TRANSFER_IBAN geçerli bir TR IBAN değil (mod-97 tutmadı).');
    return null;
  }

  return { bankName, accountHolder, iban };
}

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
