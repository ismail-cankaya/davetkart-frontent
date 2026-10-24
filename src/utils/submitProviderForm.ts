import type { CheckoutAction } from '../types';

/**
 * Ödeme sağlayıcısının imzalı formunu tarayıcıdan POST eder (Faz 12, Shopier).
 *
 * Shopier'in ödeme sayfası bir adrese GİDİLEREK değil, imzalı alanlar taşıyan
 * bir form GÖNDERİLEREK açılır. Bu fonksiyon görünmez bir `<form>` kurar ve
 * gönderir; sayfa Shopier'e geçer.
 *
 * 🔴 XSS: değerler `innerHTML` ile ya da metin birleştirerek YAZILMAZ. Her alan
 * `createElement('input')` + `input.value = …` ile atanır; tarayıcı değeri
 * metin olarak tutar, HTML olarak yorumlamaz. Alıcı adı `"><script>` olsa bile
 * yalnızca bir alan değeri olarak gider.
 *
 * 🔴 Kart bilgisi bu forma GİRMEZ: kart Shopier'in sayfasında yazılır.
 * Ayrıntılı açıklama: docs/rehber/src/utils/submitProviderForm.md
 */
export type FormPostAction = Extract<CheckoutAction, { type: 'form' }>;

/**
 * Formun gideceği adres güvenli mi? Yalnızca `https:` (geliştirmede yerel
 * `http://localhost`). `javascript:` gibi bir adres form hedefi olamaz.
 */
export function isSafeFormTarget(url: string, location: Pick<Location, 'hostname'> = window.location): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol === 'https:') return true;
  return parsed.protocol === 'http:' && parsed.hostname === 'localhost' && location.hostname === 'localhost';
}

/** Görünmez formu kurar ve gönderir. Adres güvenli değilse hiçbir şey göndermez. */
export function submitProviderForm(action: FormPostAction, doc: Document = document): void {
  if (!isSafeFormTarget(action.url, doc.location)) {
    throw new Error('Refusing to post the payment form to an unsafe address');
  }

  const form = doc.createElement('form');
  form.method = 'post';
  form.action = action.url;
  form.acceptCharset = 'UTF-8';
  form.style.display = 'none';

  for (const [name, value] of Object.entries(action.fields)) {
    const input = doc.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  doc.body.appendChild(form);
  form.submit();
}
