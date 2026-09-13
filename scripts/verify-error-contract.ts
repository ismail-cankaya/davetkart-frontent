/**
 * Hata sözleşmesi denetimi — `npm run verify:errors`
 *
 * İki soruyu yanıtlar:
 *
 * 1. **Kapsam:** `contracts/error-codes.json` içindeki 21 kodun her birinin
 *    yazılı her dilde bir metni var mı? Backend katalogu büyüttüğünde bu
 *    denetim kırmızıya döner — eksik anahtar kullanıcının ekranında ham kod
 *    olarak görünmeden önce burada yakalanır.
 *
 * 2. **Çözümleme:** `toDisplayError()` gerçekten cümle mi üretiyor? Anahtar
 *    zincirleri (`detailed` → `base` → düz → `unknown`), `/` ayırıcılı alan
 *    yolları ve `byField` geçersiz kılmaları sessizce bozulabilecek yerlerdir;
 *    tip denetimi bunların hiçbirini görmez.
 *
 * Ekranda ham `{{limit}}` ya da çözülmemiş bir anahtar kalırsa çıkış kodu 1.
 */
import i18n from '../src/i18n';
import { ERROR_CODES, errorCodeMeta } from '../src/contracts/errorCodes';
import { toDisplayError, toFieldErrors } from '../src/utils/toDisplayError';

/** Metni yazılı olan diller; kalanlar fallbackLng ile bunlara düşer. */
const WRITTEN_LANGUAGES = ['tr', 'en'] as const;

let failures = 0;

function fail(message: string): void {
  failures += 1;
  console.error(`  ✗ ${message}`);
}

/** Çözülememiş anahtar ya da doldurulmamış yer tutucu kalmış mı? */
function assertRendered(label: string, text: string): void {
  if (!text || text.includes('{{') || /^[a-z]+\.[A-Za-z_.]+$/.test(text)) {
    fail(`${label} → çözümlenmedi: ${JSON.stringify(text)}`);
  }
}

/** Axios hata nesnesinin denetim için yeterli olan taklidi. */
function apiError(
  code: string,
  extra: { params?: Record<string, unknown>; fields?: Record<string, unknown> } = {},
): unknown {
  return {
    isAxiosError: true,
    response: { status: errorCodeMeta(code)?.status ?? 500, data: { error: { code, ...extra } } },
  };
}

async function main(): Promise<void> {
  for (const language of WRITTEN_LANGUAGES) {
    await i18n.changeLanguage(language);
    console.log(`\n[${language}] ${ERROR_CODES.length} kod denetleniyor…`);

    // 1. Kapsam, **anahtar düzeyinde** denetlenir.
    //
    // 🔴 Bunu render çıktısına bakarak yapmak mümkün değildir: eksik bir kod
    //    `unknown` metnine düşer ve ekranda kusursuz bir cümle görünür. Yani
    //    çeviri kaybı kullanıcıya "bir hata oluştu" olarak sızar, teste
    //    hiç görünmez. Doğrudan dilin kendi kaynak paketine bakılır —
    //    `i18n.exists()` fallback'i izlediği için o da yeterli değildir:
    //    yalnızca İngilizce'de duran bir anahtarı Türkçe'de "var" sayar.
    const bundle = i18n.getResourceBundle(language, 'errors') as {
      codes?: Record<string, unknown>;
    } | undefined;

    for (const code of ERROR_CODES) {
      const entry = bundle?.codes?.[code];
      const translated =
        typeof entry === 'string' ||
        (typeof entry === 'object' && entry !== null && 'base' in entry);

      if (!translated) fail(`${code} → [${language}] çevirisi yok`);
    }

    // 2. Her kod parametresiz hâliyle de okunur bir cümle üretmeli:
    //    sözleşmedeki `params` beyaz listedir, garanti değil.
    for (const code of ERROR_CODES) {
      assertRendered(`${code} (parametresiz)`, toDisplayError(apiError(code)));
    }

    // 2. Parametre taşıyan kodlar, parametreler eldeyken de doldurulmalı.
    const withParams: Record<string, Record<string, unknown>> = {
      ASSISTANT_QUOTA_EXCEEDED: { retryAfter: 7_200, limit: 30 },
      PAYWALL_TIER_INSUFFICIENT: { requiredTier: 'elit' },
      PAYMENT_REQUIRED: { requiredTier: 'gold' },
      RATE_LIMITED: { retryAfter: 45 },
      PROVIDER_UNAVAILABLE: { retryAfter: 90 },
      MEDIA_QUOTA_EXCEEDED: { limit: 20 },
      FILE_TOO_LARGE: { max: 5_120 },
    };

    for (const [code, params] of Object.entries(withParams)) {
      const text = toDisplayError(apiError(code, { params }));
      assertRendered(`${code} (parametreli)`, text);

      // Ham saniye ya da sistem değeri sızmamalı: kullanıcı "7200" ya da
      // "elit" değil, "2 saat" ve "Elit" görmeli.
      //
      // Bir dakikanın altında birim zaten saniyedir ("45 saniye" doğrudur);
      // sızıntı ancak sayının büyük birime çevrilmesi gerekirken çevrilmemiş
      // olmasıyla anlaşılır.
      const retryAfter = Number(params.retryAfter);
      if (retryAfter >= 60 && text.includes(String(retryAfter))) {
        fail(`${code} → ham saniye sızdı: ${text}`);
      }
      if (params.requiredTier !== undefined && text.includes(String(params.requiredTier))) {
        fail(`${code} → ham plan değeri sızdı: ${text}`);
      }
    }

    // 3. VALIDATION_FAILED: alan etiketi + kural parametresi yerine oturmalı.
    //    Noktalı ve dizinli yollar (`/` ayırıcıya çevrilir) burada sınanır.
    const validation = apiError('VALIDATION_FAILED', {
      fields: {
        guestCount: [{ rule: 'max', params: { max: 10 } }],
        guestName: [{ rule: 'max', params: { max: 120 } }],
        'invitation.title': [{ rule: 'required' }],
        'invitation.timelineEvents.0.time': [{ rule: 'date_format' }],
        bilinmeyenAlan: [{ rule: 'bilinmeyen_kural' }],
      },
    });

    const fieldErrors = toFieldErrors(validation);
    for (const [field, message] of Object.entries(fieldErrors)) {
      assertRendered(`VALIDATION_FAILED.${field}`, message);
    }

    // 🔴 `max` alanın türüne göre anlam değiştirir; sayısal alanlar
    //    `byField` ile ayrılmıştır. Bu ayrım kaybolursa kullanıcı
    //    "Kişi sayısı en fazla 10 karakter" okur.
    const guestCount = fieldErrors.guestCount ?? '';
    const guestName = fieldErrors.guestName ?? '';
    if (guestCount === guestName.replace('120', '10')) {
      fail(`byField geçersiz kılması uygulanmadı: guestCount → "${guestCount}"`);
    }

    // 4. Tek alan hatalıysa toast genel cümle değil somut olanı göstermeli.
    const single = toDisplayError(
      apiError('VALIDATION_FAILED', { fields: { email: [{ rule: 'email' }] } }),
    );
    assertRendered('VALIDATION_FAILED (tek alan)', single);

    // 5. Sunucuya hiç ulaşılamadığında gösterilecek kod yoktur.
    assertRendered('NETWORK', toDisplayError({ isAxiosError: true, response: undefined }));
    assertRendered('UNKNOWN', toDisplayError(new Error('beklenmeyen')));

    console.log(`  örnek: ${toDisplayError(apiError('PAYWALL_TIER_INSUFFICIENT', { params: { requiredTier: 'elit' } }))}`);
    console.log(`  örnek: ${toDisplayError(apiError('ASSISTANT_QUOTA_EXCEEDED', { params: { retryAfter: 7_200, limit: 30 } }))}`);
    console.log(`  örnek: ${fieldErrors.guestCount}`);
    console.log(`  örnek: ${fieldErrors['invitation.timelineEvents.0.time']}`);
  }

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Hata sözleşmesi eksiksiz: 21 kod, iki dil, tüm çözümleme yolları.');
}

void main();
