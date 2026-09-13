/**
 * Backend hata kodu kataloğunun tipli yüzü.
 *
 * `error-codes.json` backend deposundan **tek yönlü kopyalanır** (K31): iki
 * depo derleme zamanında birbirine bağlanmaz. Backend katalogu büyüttüğünde
 * dosya elle yenilenir ve buradaki türetilmiş tipler otomatik genişler.
 *
 * Kaynak: `davetkart-backend-php-laravel/contracts/error-codes.json`
 */
import catalogue from './error-codes.json';

/** Bir kodun sözleşmedeki üstverisi. */
export interface ErrorCodeMeta {
  /** Bu kodun taşındığı HTTP durumu. Ayrım koddadır, statüde değil. */
  readonly status: number;
  /** `params` içinde gelebilecek beyaz listelenmiş anahtarlar. */
  readonly params: readonly string[];
  /** Aynı isteğin tekrarlanmasının anlamlı olup olmadığı. */
  readonly retryable: boolean;
}

const CODES = catalogue.codes as Record<string, ErrorCodeMeta>;

/**
 * Katalogdaki 21 kodun birleşimi. `error-codes.json` yenilendiğinde bu tip de
 * kendiliğinden yenilenir — elle güncellenecek ikinci bir liste yoktur.
 */
export type ErrorCode = keyof typeof catalogue.codes;

/** Sözleşmedeki tüm kodlar — çeviri bütünlüğü testleri bunu tüketir. */
export const ERROR_CODES = Object.keys(CODES) as ErrorCode[];

/** Gelen serbest metnin katalogda karşılığı var mı. */
export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === 'string' && value in CODES;
}

/** Bilinen bir kodun üstverisi; katalog dışı değerde `null`. */
export function errorCodeMeta(code: string | null): ErrorCodeMeta | null {
  return isErrorCode(code) ? CODES[code] : null;
}
