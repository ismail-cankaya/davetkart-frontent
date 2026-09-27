/**
 * Ödeme sayfası denetimi — `npm run verify:payment`
 *
 * 🔴 Buradaki hataların hiçbiri ekranda hata gibi görünmez. Yanlış bir IBAN
 * kusursuz biçimli görünür ve para başka hesaba gider; `12/`'de kilitlenen
 * bir tarih alanı yalnızca "form bozuk" hissi verir; URL'den okunamayan bir
 * paket fiyatsız bir ödeme düğmesi çizer. Bu yüzden saf fonksiyonların
 * kendisi sınanır.
 */
import { formatIban, isValidTrIban, normalizeIban } from '../src/utils/iban';
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  isCardNumberComplete,
  passesLuhn,
  previewCardNumber,
  validateCard,
} from '../src/utils/paymentCard';
import { checkoutHref, parseCheckoutSearch } from '../src/utils/checkoutRoute';
import { bankTransferReference, getBankTransferAccount } from '../src/services/bankTransfer';

let failures = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`  ✓ ${label}`);
    return;
  }
  failures += 1;
  console.error(`  ✗ ${label}\n      beklenen: ${e}\n      gelen:    ${a}`);
}

const CARD = { holderName: 'Ayşe Yılmaz', number: '4242424242424242', expiry: '1228', cvc: '123' };
// Sabit saat: 27 Eylül 2026.
const NOW = new Date(2026, 8, 27);

function main(): void {
  console.log('\nIBAN');
  const iban = 'TR330006100519786457841326';
  check('geçerli TR IBAN kabul ediliyor', isValidTrIban(iban), true);
  check('boşluklu ve küçük harfli yazım da kabul ediliyor', isValidTrIban('tr33 0006 1005 1978 6457 8413 26'), true);
  check('tek hane hatası reddediliyor (mod-97)', isValidTrIban('TR330006100519786457841327'), false);
  check('yan yana iki hanenin yer değiştirmesi reddediliyor', isValidTrIban('TR330006100519786457841362'), false);
  check('eksik hane reddediliyor', isValidTrIban('TR33000610051978645784132'), false);
  check('başka ülke IBAN’ı reddediliyor', isValidTrIban('DE89370400440532013000'), false);
  check('normalize boşluk atar, büyütür', normalizeIban(' tr33 0006 '), 'TR330006');
  check('dörtlü gruplama', formatIban(iban), 'TR33 0006 1005 1978 6457 8413 26');

  console.log('\nKart markası ve biçim');
  check('4 → Visa', detectCardBrand('4242'), 'visa');
  check('51–55 → Mastercard', detectCardBrand('5555'), 'mastercard');
  check('2221–2720 → Mastercard (2-serisi)', detectCardBrand('2223003122003222'), 'mastercard');
  check('2220 Mastercard değil', detectCardBrand('2220'), 'unknown');
  check('34/37 → Amex', detectCardBrand('3782'), 'amex');
  check('9792 → Troy', detectCardBrand('9792'), 'troy');
  check('Visa dörtlü gruplanır', formatCardNumber('4242424242424242'), '4242 4242 4242 4242');
  check('Amex 4-6-5 gruplanır', formatCardNumber('378282246310005'), '3782 822463 10005');
  check('harf ve fazla hane atılır', formatCardNumber('4242-4242 4242x4242 999999'), '4242 4242 4242 4242 999');
  check('önizleme boş yerleri noktayla doldurur', previewCardNumber('4242'), '4242 •••• •••• ••••');
  check('Amex önizlemesi 15 hanedir', previewCardNumber('37'), '37•• •••••• •••••');

  console.log('\nLuhn ve otomatik ilerleme');
  check('Visa test numarası Luhn’dan geçer', passesLuhn('4242424242424242'), true);
  check('Amex test numarası Luhn’dan geçer', passesLuhn('378282246310005'), true);
  check('tek hane hatası Luhn’dan geçmez', passesLuhn('4242424242424241'), false);
  check('tamamlanan numara ilerletir', isCardNumberComplete('4242424242424242'), true);
  check('yarım numara ilerletmez', isCardNumberComplete('424242424242'), false);
  check('Luhn’suz tam numara ilerletmez', isCardNumberComplete('4242424242424241'), false);

  console.log('\nSon kullanma alanı');
  check('iki hanede eğik çizgi eklenmez (geri silme kilitlenmez)', formatExpiry('12'), '12');
  check('üçüncü hanede eğik çizgi gelir', formatExpiry('123'), '12/3');
  check('tam tarih', formatExpiry('1228'), '12/28');

  console.log('\nDoğrulama');
  check('geçerli kart hatasız', validateCard(CARD, NOW), {});
  check('içinde bulunulan ay hâlâ geçerli (09/26)', validateCard({ ...CARD, expiry: '0926' }, NOW).expiry, undefined);
  check('geçen ay süresi dolmuş (08/26)', validateCard({ ...CARD, expiry: '0826' }, NOW).expiry, 'Kartın süresi dolmuş.');
  check('13. ay reddedilir', validateCard({ ...CARD, expiry: '1328' }, NOW).expiry, 'Ay 01 ile 12 arasında olmalı.');
  check('yarım tarih reddedilir', validateCard({ ...CARD, expiry: '12' }, NOW).expiry, 'AA/YY biçiminde yazın.');
  check(
    'Amex dört haneli güvenlik kodu ister',
    validateCard({ ...CARD, number: '378282246310005', cvc: '123' }, NOW).cvc,
    '4 haneli olmalı.'
  );
  check('rakamlı isim reddedilir', validateCard({ ...CARD, holderName: 'Ayşe 123' }, NOW).holderName, 'İsim yalnızca harf içermeli.');
  check('Türkçe karakterli isim kabul edilir', validateCard({ ...CARD, holderName: 'Çağrı Öztürk-Şahin' }, NOW).holderName, undefined);

  console.log('\nÖdeme adresi');
  const withInvitation = { tier: 'gold' as const, invitationId: '01J9ZK3F9QK2MZ7XK2M9QA0000' };
  check('adres gidip geliyor (davetiyeli)', parseCheckoutSearch(new URLSearchParams(checkoutHref(withInvitation).split('?')[1])), withInvitation);
  check('hesap paketi: davetiye parametresi yok', checkoutHref({ tier: 'elit', invitationId: null }), '/odeme?tier=elit');
  check('davetiyesiz adres null kimlik verir', parseCheckoutSearch(new URLSearchParams('tier=elit')), { tier: 'elit', invitationId: null });
  check('tanınmayan paket reddedilir', parseCheckoutSearch(new URLSearchParams('tier=platin')), null);
  check('paketsiz adres reddedilir', parseCheckoutSearch(new URLSearchParams('invitation=abc')), null);

  console.log('\nHavale');
  check('referans kodu biçimi', bankTransferReference('01J9ZK3F9QK2MZ7XK2M9QA'), 'DK-7XK2-M9QA');
  check('kısa kimlik sıfırla doldurulur', bankTransferReference('ab'), 'DK-0000-00AB');
  check('yapılandırılmamış hesap Havale/EFT’yi kapatır', getBankTransferAccount(), null);

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Ödeme yardımcıları doğru: IBAN sağlama toplamı, kart biçimi, son kullanma ve ödeme adresi.');
}

main();
