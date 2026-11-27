import { expect, test, type Page } from '@playwright/test';

/**
 * Ana sayfa vitrin sahnesi (Faz 23): hero'dan sonra üç telefon, kaydırmayla açılma, hareketi azaltta sabit sahne,
 * telefona basınca önizleme. Backend gerekmez. Ayrıntı: docs/rehber/src/components/home/showcase.md
 */
const SECTION = '#vitrin-sahnesi';

/** Sahnenin kaydırma yolunda `fraction` (0–1) noktasına anında gider. */
async function scrollScene(page: Page, fraction: number): Promise<void> {
  await page.evaluate(([selector, f]) => {
    const section = document.querySelector<HTMLElement>(selector as string)!;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(0, section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + (f as number) * travel, behavior: 'instant' });
  }, [SECTION, fraction] as const);
  await page.waitForTimeout(400);
}

const phones = (page: Page) => page.locator(`${SECTION} button[aria-label]`);
const opacity = (page: Page, index: number) =>
  phones(page).nth(index).evaluate((el) => Number(getComputedStyle(el).opacity));

for (const viewport of [
  { name: 'telefon', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'masaüstü', width: 1440, height: 900 }
]) {
  test(`${viewport.name}: yan telefonlar kaydırmayla açılır, sonda bağlantı görünür`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await page.locator(SECTION).waitFor();
    await expect(phones(page)).toHaveCount(3);

    await scrollScene(page, 0);
    expect(await opacity(page, 1)).toBeLessThan(0.05); // yan telefon ortadakinin arkasında, görünmez
    await expect(page.locator(`${SECTION} a[href="#animasyon-ve-onizleme"]`)).toBeHidden();

    await scrollScene(page, 1);
    expect(await opacity(page, 1)).toBeGreaterThan(0.95);
    expect(await opacity(page, 2)).toBeGreaterThan(0.95);
    await expect(page.locator(`${SECTION} a[href="#animasyon-ve-onizleme"]`)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);
  });
}

test('hareketi azalt: sahne sabitlenmez, üç telefon ve bağlantı baştan görünür', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await page.locator(SECTION).waitFor();
  const stage = page.locator(`${SECTION} > div`);
  expect(await stage.evaluate((el) => getComputedStyle(el).position)).toBe('static');
  for (const i of [0, 1, 2]) expect(await opacity(page, i)).toBeGreaterThan(0.95);
  await expect(page.locator(`${SECTION} a[href="#animasyon-ve-onizleme"]`)).toBeVisible();
  await context.close();
});

test('telefona basınca o şablon önizlemeye gelir', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator(SECTION).waitFor();
  await scrollScene(page, 1);
  await phones(page).nth(2).click(); // Nişan — Koi Havuzu
  await expect(page.locator('#animasyon-ve-onizleme')).toBeInViewport({ ratio: 0.3, timeout: 5_000 });
  // Koi öne çıkan beş kartta yok; seçimi simülatör gösterir (Düğün → Nişan zarfı).
  await expect(page.locator('#animasyon-ve-onizleme .device-screen-canvas')).toContainText(/Nişan Davetiyesi/, { timeout: 15_000 });
});
