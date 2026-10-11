/**
 * Kart formu yardımcıları — biçimlendirme, marka tespiti ve doğrulama.
 *
 * Saf fonksiyonlardır: kart bilgisini hiçbir yere göndermez, saklamaz. Formun
 * ekranda doğru görünmesi ve bariz yazım hatalarının sağlayıcıya gitmeden
 * yakalanması içindir.
 *
 * 🔴 Buradaki doğrulama bir **kolaylıktır, güvenlik değildir.** Kartın gerçek
 * olup olmadığına, limitine ya da 3D Secure onayına yalnızca banka karar verir.
 * Luhn'dan geçen bir numara yalnızca "yazım hatası yok" demektir.
 */

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'troy' | 'unknown';

/** Kart formunun alanları. Bu nesne bileşen dışına çıkmaz (bkz. CardPaymentForm). */
export interface CardDetails {
  holderName: string;
  /** Yalnızca rakamlar; boşluklar `digitsOnly` ile atılmış olarak tutulur. */
  number: string;
  /** Yalnızca rakamlar: `MMYY`. Ekranda `formatExpiry` ile `AA/YY` olur. */
  expiry: string;
  cvc: string;
}

export type CardField = keyof CardDetails;
export type CardErrors = Partial<Record<CardField, string>>;

interface BrandSpec {
  label: string;
  /** Geçerli numara uzunlukları. */
  lengths: number[];
  cvcLength: number;
  /** Numaranın ekranda bölüneceği grup boyları. */
  groups: number[];
}

const BRAND_SPECS: Record<CardBrand, BrandSpec> = {
  visa: { label: 'Visa', lengths: [13, 16, 19], cvcLength: 3, groups: [4, 4, 4, 4, 3] },
  mastercard: { label: 'Mastercard', lengths: [16], cvcLength: 3, groups: [4, 4, 4, 4] },
  amex: { label: 'American Express', lengths: [15], cvcLength: 4, groups: [4, 6, 5] },
  troy: { label: 'Troy', lengths: [16], cvcLength: 3, groups: [4, 4, 4, 4] },
  unknown: { label: 'Kart', lengths: [16], cvcLength: 3, groups: [4, 4, 4, 4, 3] }
};

/** Sağlayıcılardan bağımsız üst sınır (ISO/IEC 7812). */
export const MAX_CARD_DIGITS = 19;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * İlk hanelere (BIN) göre kart markası. Yazarken tahmin edilir; eksik numara
 * da bir marka döndürebilir, doğruluğu `validateCard` belirler.
 *
 * Mastercard'ın 2-serisi (2221–2720) 2017'den beri dağıtılıyor; yalnızca
 * 51–55'e bakmak bu kartları "tanınmayan" gösterirdi.
 */
export function detectCardBrand(number: string): CardBrand {
  const digits = digitsOnly(number);
  if (/^4/.test(digits)) return 'visa';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^9792/.test(digits)) return 'troy';
  if (/^5[1-5]/.test(digits)) return 'mastercard';

  const firstFour = Number(digits.slice(0, 4));
  if (digits.length >= 4 && firstFour >= 2221 && firstFour <= 2720) return 'mastercard';

  return 'unknown';
}

export function cardBrandLabel(brand: CardBrand): string {
  return BRAND_SPECS[brand].label;
}

export function cvcLengthFor(brand: CardBrand): number {
  return BRAND_SPECS[brand].cvcLength;
}

/** Numarayı markanın grup düzeniyle böler: `4242 4242 4242 4242`, Amex `3782 822463 10005`. */
export function formatCardNumber(number: string): string {
  const digits = digitsOnly(number).slice(0, MAX_CARD_DIGITS);
  const groups = BRAND_SPECS[detectCardBrand(digits)].groups;

  const parts: string[] = [];
  let cursor = 0;
  for (const size of groups) {
    if (cursor >= digits.length) break;
    parts.push(digits.slice(cursor, cursor + size));
    cursor += size;
  }
  return parts.join(' ');
}

/**
 * Kart önizlemesi için numara: yazılan haneler + kalan yerlerde `•`,
 * markanın grup düzeniyle. `4242 42` → `4242 42•• •••• ••••`.
 */
export function previewCardNumber(number: string): string {
  const digits = digitsOnly(number).slice(0, MAX_CARD_DIGITS);
  const spec = BRAND_SPECS[detectCardBrand(digits)];
  const total = Math.max(Math.min(...spec.lengths.filter((l) => l >= 15)), digits.length);
  const filled = digits.padEnd(total, '•');

  const parts: string[] = [];
  let cursor = 0;
  for (const size of spec.groups) {
    if (cursor >= filled.length) break;
    parts.push(filled.slice(cursor, cursor + size));
    cursor += size;
  }
  return parts.join(' ');
}

/**
 * `1228` → `12/28`; yazarken `12` → `12`, `123` → `12/3`.
 *
 * Eğik çizgi ancak üçüncü hane gelince eklenir. İki hanede eklenseydi,
 * `12/`'de geri silmeye basan kullanıcı yine `12/` görürdü: silinen çizgi
 * biçimlendirmeyle hemen geri gelir ve alan kilitlenir.
 */
export function formatExpiry(expiry: string): string {
  const digits = digitsOnly(expiry).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Luhn (mod-10) sağlama toplamı — tek hane hatalarını ve çoğu yer değiştirmeyi yakalar. */
export function passesLuhn(number: string): boolean {
  const digits = digitsOnly(number);
  if (digits.length === 0) return false;

  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

/**
 * Numara yazılıp bitti mi? Formun bir sonraki alana kendiliğinden geçmesi
 * için. 13 haneli eski Visa'lar bilerek dışarıda: 13. hanede atlamak,
 * 16 haneli bir kartı yazan kullanıcıyı yarıda keserdi.
 */
export function isCardNumberComplete(number: string): boolean {
  const digits = digitsOnly(number);
  const spec = BRAND_SPECS[detectCardBrand(digits)];
  return digits.length >= 15 && spec.lengths.includes(digits.length) && passesLuhn(digits);
}

/** Kart üzerindeki isim: harfler, boşluk, nokta, kesme ve tire (Türkçe karakterler dahil). */
const HOLDER_NAME_PATTERN = /^[\p{L}][\p{L} .'-]*$/u;

/** Son kullanma tarihi bu kadar yıldan uzaksa büyük olasılıkla yazım hatasıdır. */
const MAX_EXPIRY_YEARS_AHEAD = 20;

/**
 * Tüm alanları doğrular; hatasız alan sonuçta **yer almaz**. Boş nesne =
 * form gönderilebilir.
 *
 * `now` parametresi testte saati sabitlemek içindir.
 */
export function validateCard(card: CardDetails, now: Date = new Date()): CardErrors {
  const errors: CardErrors = {};
  const brand = detectCardBrand(card.number);
  const spec = BRAND_SPECS[brand];

  const name = card.holderName.trim();
  if (name.length === 0) errors.holderName = 'Kart üzerindeki ismi yazın.';
  else if (name.length < 3 || !HOLDER_NAME_PATTERN.test(name)) {
    errors.holderName = 'İsim yalnızca harf içermeli.';
  }

  const number = digitsOnly(card.number);
  if (number.length === 0) errors.number = 'Kart numarasını yazın.';
  else if (!spec.lengths.includes(number.length) || !passesLuhn(number)) {
    errors.number = 'Kart numarası geçersiz görünüyor.';
  }

  const expiry = digitsOnly(card.expiry);
  if (expiry.length === 0) errors.expiry = 'Son kullanma tarihini yazın.';
  else if (expiry.length !== 4) errors.expiry = 'AA/YY biçiminde yazın.';
  else {
    const month = Number(expiry.slice(0, 2));
    const year = 2000 + Number(expiry.slice(2));
    if (month < 1 || month > 12) errors.expiry = 'Ay 01 ile 12 arasında olmalı.';
    else {
      // Kart, yazan ayın SON gününe kadar geçerlidir: 12/28 → 31 Aralık 2028.
      const endOfValidity = new Date(year, month, 1);
      if (endOfValidity <= now) errors.expiry = 'Kartın süresi dolmuş.';
      else if (year > now.getFullYear() + MAX_EXPIRY_YEARS_AHEAD) errors.expiry = 'Yılı kontrol edin.';
    }
  }

  const cvc = digitsOnly(card.cvc);
  if (cvc.length === 0) errors.cvc = 'Güvenlik kodunu yazın.';
  else if (cvc.length !== spec.cvcLength) errors.cvc = `${spec.cvcLength} haneli olmalı.`;

  return errors;
}
