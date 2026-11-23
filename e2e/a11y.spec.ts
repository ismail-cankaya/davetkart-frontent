import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Browser } from '@playwright/test';
import { OWNER_STORAGE, readPublished } from './support/state';

/**
 * Erişilebilirlik taraması (Faz 19.27, FE-54, K229): denetimin 14 sayfası (AUD-2026-11-12 axe-scan.mjs).
 * Sıfır olmalı: `color-contrast`, `aria-*`, `landmark-*`, `region`. `heading-order` (best-practice) kapsam dışı.
 */
const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 390, height: 844 };
const GATED = /^(color-contrast|aria-.+|landmark-.+|region)$/;

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

test('14 sayfada kontrast ve yer işareti ihlali yok', async ({ browser }) => {
  test.setTimeout(300_000);
  const { invitationId } = readPublished();
  const pages: [string, string, boolean, typeof DESKTOP][] = [
    ['Ana sayfa', '/', false, DESKTOP], ['Giriş', '/login', false, DESKTOP], ['Kayıt', '/register', false, DESKTOP],
    ['Fiyatlar', '/pricing', false, DESKTOP], ['İletişim', '/contact', false, DESKTOP], ['Gizlilik', '/privacy', false, DESKTOP],
    ['Sihirbaz', '/create', true, DESKTOP], ['Panel', '/dashboard', true, DESKTOP],
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
