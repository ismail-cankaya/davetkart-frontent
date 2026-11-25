/**
 * K262 (A-E5): TR cep telefonu, backend `StoreCheckoutRequest` ile aynı kural.
 * Boşluk, tire, parantez ve nokta atılır; `+90`/`90` öneki `0` olur; sonuç `05XXXXXXXXX` değilse `null`.
 * Ayrıntılı açıklama: docs/rehber/src/utils/trMobile.md
 */
export function normalizeTrMobile(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, '').replace(/^\+?90(?=5\d{9}$)/, '0');
  return /^05\d{9}$/.test(digits) ? digits : null;
}
