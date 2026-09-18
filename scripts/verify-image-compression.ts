/**
 * Tarayıcıda ön küçültme denetimi — `npm run verify:image`
 *
 * 🔴 Bu modülün asıl işi (`compressImageForUpload`) canvas, `createImageBitmap`
 * ve `toBlob` ister; Node'da yok. Ama hatanın **yaşadığı yer** o değil: yanlış
 * hesaplanan bir hedef ölçü ya da yanlış seçilen bir çıktı biçimi sessizce
 * çalışır, kimse hata görmez ve fotoğraflar ya bozuk ya da gereğinden büyük
 * yüklenir.
 *
 * Bu yüzden **karar veren saf fonksiyonlar** sınanıyor: ölçü hesabı, biçim
 * seçimi, dokunulacak dosyanın seçimi ve ad değişimi. Tarayıcı tarafı elle
 * doğrulandı (Chrome + DevTools Network).
 */
import {
  MAX_EDGE_PX,
  QUALITY_STEPS,
  TARGET_BYTES,
  outputTypeFor,
  renameForType,
  shouldCompress,
  targetSize,
} from '../src/utils/compressImage';

let failures = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  const same = JSON.stringify(actual) === JSON.stringify(expected);

  if (same) {
    console.log(`  ✓ ${label}`);
    return;
  }

  failures += 1;
  console.error(
    `  ✗ ${label}\n      beklenen: ${JSON.stringify(expected)}\n      gelen:    ${JSON.stringify(actual)}`,
  );
}

const MB = 1024 * 1024;

function main(): void {
  console.log('\nHedef ölçü — sınır EN UZUN KENARA uygulanır');

  // 🔴 Backend'de tam olarak bu hata vardı: yalnızca genişlik sınırlanınca
  // dikey fotoğraf hiç küçültülmüyordu. Telefonla çekilen fotoğrafların
  // çoğunluğu dikeydir.
  check('yatay 3000x2000 → 2000x1333', targetSize(3000, 2000), { width: 2000, height: 1333 });
  check('dikey 2000x3000 → 1333x2000', targetSize(2000, 3000), { width: 1333, height: 2000 });
  check('kare 4000x4000 → 2000x2000', targetSize(4000, 4000), { width: 2000, height: 2000 });

  // Zaten sınırın altındaki görsel BÜYÜTÜLMEZ: yukarı ölçekleme bayt ekler,
  // kalite eklemez.
  check('sınırın altı olduğu gibi kalır', targetSize(800, 600), { width: 800, height: 600 });
  check('tam sınır olduğu gibi kalır', targetSize(MAX_EDGE_PX, 1000), {
    width: MAX_EDGE_PX,
    height: 1000,
  });

  // Aşırı ince bir panorama: kısa kenar 1'in altına yuvarlanmamalı.
  check('kısa kenar en az 1 px', targetSize(20000, 3), { width: 2000, height: 1 });
  check('sıfır ölçü çökmez', targetSize(0, 0), { width: 0, height: 0 });

  console.log('\nÇıktı biçimi');

  check('JPEG kendi biçiminde kalır', outputTypeFor('image/jpeg'), 'image/jpeg');
  // PNG kayıpsızdır: küçültülse bile megabaytlarca yer tutar. WebP hem kayıplı
  // sıkıştırır hem alfa kanalını taşır — JPEG şeffaflığı siyahlatırdı.
  check('PNG → WebP', outputTypeFor('image/png'), 'image/webp');
  check('WebP kendi biçiminde kalır', outputTypeFor('image/webp'), 'image/webp');

  console.log('\nHangi dosyaya dokunuluyor?');

  check('büyük JPEG sıkıştırılır', shouldCompress({ type: 'image/jpeg', size: 8 * MB }), true);
  // Zaten küçük bir JPEG'i yeniden kodlamak kalite kaybıdır, karşılığında
  // kazanılacak bayt yoktur.
  check('küçük JPEG dokunulmaz', shouldCompress({ type: 'image/jpeg', size: 300 * 1024 }), false);
  check('tam hedefte olan dosya dokunulmaz', shouldCompress({ type: 'image/jpeg', size: TARGET_BYTES }), false);
  // PNG boyutuna BAKILMADAN dönüştürülür: biçim değişimi de bir kazanç.
  check('küçük PNG bile dönüştürülür', shouldCompress({ type: 'image/png', size: 100 * 1024 }), true);
  check('video dokunulmaz', shouldCompress({ type: 'video/mp4', size: 18 * MB }), false);
  check('bilinmeyen biçim dokunulmaz', shouldCompress({ type: 'image/heic', size: 5 * MB }), false);

  console.log('\nDosya adı içerikle tutarlı');

  check('uzantı değişir', renameForType('dugun.png', 'image/webp'), 'dugun.webp');
  check('JPEG uzantısı jpg olur', renameForType('foto.jpeg', 'image/jpeg'), 'foto.jpg');
  check('nokta içeren ad korunur', renameForType('nisan.2026.png', 'image/webp'), 'nisan.2026.webp');
  check('uzantısız ad', renameForType('foto', 'image/webp'), 'foto.webp');
  check('yalnızca uzantıdan oluşan ad', renameForType('.png', 'image/webp'), 'foto.webp');

  console.log('\nKalite basamakları');

  check('basamaklar azalan sırada', [...QUALITY_STEPS].sort((a, b) => b - a), [...QUALITY_STEPS]);
  check(
    'basamaklar 0-1 aralığında',
    QUALITY_STEPS.every((q) => q > 0 && q <= 1),
    true,
  );

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Ön küçültme kararları doğru: ölçü, biçim, seçim ve ad.');
}

main();
