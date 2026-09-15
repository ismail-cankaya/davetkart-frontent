/**
 * Saat dilimi denetimi — `npm run verify:time`
 *
 * 🔴 Bu hata ekranda hata gibi görünmez: geri sayım çalışır, sadece yanlış
 * sayar. Berlin'deki bir misafir İstanbul'daki bir düğün için iki saat
 * kaymış bir sayaç görür ve kimse bunu fark etmez. Bu yüzden matematiğin
 * kendisi sınanır.
 */
import {
  instantToWallClock,
  isValidTimeZone,
  wallClockToInstant,
} from '../src/utils/eventTime';

let failures = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  if (actual === expected) {
    console.log(`  ✓ ${label}`);
    return;
  }
  failures += 1;
  console.error(`  ✗ ${label}\n      beklenen: ${String(expected)}\n      gelen:    ${String(actual)}`);
}

function main(): void {
  console.log('\nDuvar saati → an');

  // İstanbul yıl boyunca UTC+3 (2016'dan beri yaz saati uygulanmıyor).
  check(
    'İstanbul 19:00 → 16:00 UTC',
    wallClockToInstant('2026-11-14T19:00', 'Europe/Istanbul'),
    Date.UTC(2026, 10, 14, 16, 0),
  );

  // Berlin yaz saatinde UTC+2…
  check(
    'Berlin (yaz) 12:00 → 10:00 UTC',
    wallClockToInstant('2026-07-01T12:00', 'Europe/Berlin'),
    Date.UTC(2026, 6, 1, 10, 0),
  );

  // …kış saatinde UTC+1. Sabit offset varsayan bir uygulama burada düşer.
  check(
    'Berlin (kış) 12:00 → 11:00 UTC',
    wallClockToInstant('2026-01-01T12:00', 'Europe/Berlin'),
    Date.UTC(2026, 0, 1, 11, 0),
  );

  console.log('\n🔴 Asıl hata: aynı duvar saati, farklı dilim');

  const istanbul = wallClockToInstant('2026-11-14T19:00', 'Europe/Istanbul');
  const berlin = wallClockToInstant('2026-11-14T19:00', 'Europe/Berlin');

  // Kasım'da Berlin UTC+1, İstanbul UTC+3 → tam iki saat fark.
  check(
    'iki dilim arasında 2 saat fark var',
    berlin !== null && istanbul !== null ? berlin - istanbul : null,
    2 * 60 * 60 * 1000,
  );

  console.log('\nAn → duvar saati (gidiş-dönüş)');

  for (const [wall, zone] of [
    ['2026-11-14T19:00', 'Europe/Istanbul'],
    ['2026-07-01T12:00', 'Europe/Berlin'],
    ['2026-01-01T00:00', 'America/New_York'],
    ['2026-06-15T23:59', 'Asia/Tokyo'],
  ] as const) {
    const instant = wallClockToInstant(wall, zone);
    check(
      `${zone} ${wall} gidiş-dönüş`,
      instant === null ? null : instantToWallClock(instant, zone),
      wall,
    );
  }

  console.log('\nSınır durumlar');

  // Yaz saatine geçişte var OLMAYAN saat: Berlin'de 29 Mart 2026 02:00 →
  // 03:00'a atlar, yani 02:30 diye bir an yoktur. Çökmeden geçişin
  // sonrasına düşmeli.
  const gap = wallClockToInstant('2026-03-29T02:30', 'Europe/Berlin');
  check(
    'var olmayan saat bir ana çözülüyor',
    gap === null ? null : instantToWallClock(gap, 'Europe/Berlin'),
    '2026-03-29T03:30',
  );

  // Saat dilimi boşsa tarayıcının saati kullanılır — uydurma bir bölge
  // seçmek, olmayan bir bilgiyi varmış gibi göstermek olurdu.
  const local = new Date(2026, 10, 14, 19, 0).getTime();
  check('boş saat dilimi yerel saate düşüyor', wallClockToInstant('2026-11-14T19:00', ''), local);
  check(
    'geçersiz saat dilimi yerel saate düşüyor',
    wallClockToInstant('2026-11-14T19:00', 'TR+3'),
    local,
  );

  check('geçersiz IANA kimliği reddediliyor', isValidTimeZone('TR+3'), false);
  check('geçerli IANA kimliği kabul ediliyor', isValidTimeZone('Europe/Istanbul'), true);

  // Ayrıştırılamayan metin `null` döner; sayaç kendini gizler.
  check('boş tarih null', wallClockToInstant('', 'Europe/Istanbul'), null);
  check('bozuk tarih null', wallClockToInstant('yarın', 'Europe/Istanbul'), null);

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Duvar saati matematiği doğru: dilim farkı, yaz saati ve sınır durumlar.');
}

main();
