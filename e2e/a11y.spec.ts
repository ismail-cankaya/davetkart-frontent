import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { OWNER_STORAGE, readPublished } from './support/state';

/**
 * Erişilebilirlik taraması (Faz 19.27, FE-54, K229): denetimin 14 sayfası (AUD-2026-11-12 axe-scan.mjs);
 * Faz 29.5: Tasarım Stüdyosu ve hızlı önizleme.
 * Sıfır olmalı: `color-contrast`, `aria-*`, `landmark-*`, `region`. `heading-order` (best-practice) B-H4'ten beri kapıda.
 */
const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 390, height: 844 };
const GATED = /^(color-contrast|aria-.+|landmark-.+|region|heading-order)$/;

async function scan(browser: Browser, path: string, auth: boolean, viewport: { width: number; height: number }): Promise<string[]> {
  const context = await browser.newContext({ viewport, locale: 'tr-TR', ...(auth ? { storageState: OWNER_STORAGE } : {}) });
  const page = await context.newPage();
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1_500); // entrance animations (opacity) settle before contrast is measured
  const result = await new AxeBuilder({ page })
    .exclude('[data-logotype]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze();
  await context.close();
  return result.violations
    .filter((v) => GATED.test(v.id))
    .flatMap((v) => v.nodes.map((n) => {
      const data = n.any[0]?.data as { fgColor?: string; bgColor?: string; contrastRatio?: number } | undefined;
      const ratio = data?.contrastRatio ? ` ${data.fgColor} on ${data.bgColor} = ${data.contrastRatio}` : '';
      return `${v.id} ${n.target.join(' ')}${ratio} ${n.html.slice(0, 90)}`;
    }));
}

test('17 sayfada kontrast ve yer işareti ihlali yok', async ({ browser }) => {
  test.setTimeout(300_000);
  const { invitationId } = readPublished();
  const pages: [string, string, boolean, typeof DESKTOP][] = [
    ['Ana sayfa', '/', false, DESKTOP], ['Giriş', '/login', false, DESKTOP], ['Kayıt', '/register', false, DESKTOP],
    ['Fiyatlar', '/pricing', false, DESKTOP], ['İletişim', '/contact', false, DESKTOP], ['Gizlilik', '/privacy', false, DESKTOP],
    ['Hakkımızda', '/about', false, DESKTOP],
    ['Sihirbaz', '/create', true, DESKTOP], ['Panel', '/dashboard', true, DESKTOP],
    ['Stüdyo', `/studio/${invitationId}`, true, DESKTOP], ['Hızlı önizleme', `/dashboard/preview/${invitationId}`, true, DESKTOP],
    ['Ödeme', `/odeme?tier=gold&invitation=${invitationId}`, true, DESKTOP],
    ['Hesap · güvenlik', '/hesap/guvenlik', true, DESKTOP], ['Hesap · planlarım', '/hesap/planlarim', true, DESKTOP],
    ['Misafir (390)', `/invite/${invitationId}`, false, MOBILE], ['Ana sayfa (390)', '/', false, MOBILE], ['Panel (390)', '/dashboard', true, MOBILE],
  ];
  for (const [name, path, auth, viewport] of pages) {
    const found = await scan(browser, path, auth, viewport);
    if (found.length) console.log(`${name}:\n  ${found.slice(0, 12).join('\n  ')}${found.length > 12 ? `\n  … +${found.length - 12}` : ''}`);
    expect.soft(found, name).toEqual([]);
  }
});

/** B-E7: every invalid field points at a visible message (aria-describedby), and the error state passes axe. */
async function invalidFieldsAreDescribed(page: Page): Promise<string[]> {
  return page.locator('[aria-invalid="true"]').evaluateAll((fields) => fields.flatMap((field) => {
    const id = field.getAttribute('aria-describedby');
    const message = id ? document.getElementById(id) : null;
    return message && message.textContent?.trim() && message.getClientRects().length > 0 ? [] : [`${field.id}: describedby → ${id ?? 'yok'}`];
  }));
}

test('hatalı form hâlinde hata mesajı alana bağlı ve axe temiz', async ({ browser }) => {
  const context = await browser.newContext({ viewport: DESKTOP, locale: 'tr-TR', storageState: OWNER_STORAGE });
  const page = await context.newPage();
  await page.goto('/hesap/guvenlik');
  const form = page.locator('form', { has: page.locator('#password-current') });

  // Client-side error: the two new passwords differ.
  await form.locator('#password-current').fill('yanlis-parola-123');
  await form.locator('#password-new').fill('YeniParola!2026x');
  await form.locator('#password-repeat').fill('Farkli!2026x');
  await form.getByRole('button', { name: 'Parolayı Değiştir' }).click();
  await expect(form.locator('#password-repeat')).toHaveAttribute('aria-invalid', 'true');
  expect(await invalidFieldsAreDescribed(page), 'istemci hatası').toEqual([]);

  // Server-side error: the current password is wrong (nothing changes on the account).
  await form.locator('#password-repeat').fill('YeniParola!2026x');
  await form.getByRole('button', { name: 'Parolayı Değiştir' }).click();
  await expect(form.locator('#password-current')).toHaveAttribute('aria-invalid', 'true');
  expect(await invalidFieldsAreDescribed(page), 'sunucu hatası').toEqual([]);

  const result = await new AxeBuilder({ page }).exclude('[data-logotype]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
  expect(result.violations.filter((v) => GATED.test(v.id)).map((v) => `${v.id} ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  await context.close();
});
