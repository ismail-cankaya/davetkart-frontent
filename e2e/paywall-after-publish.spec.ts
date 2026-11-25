import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { OWNER_STORAGE } from './support/state';

test.use({ storageState: OWNER_STORAGE });

/** Yolculuk 3 (TST-04, K-1): yayındaki davetiyede üst plan modülü → plan duvarı. */
test('yayındaki davetiyede Elit modülü plan duvarını açar', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: /Düzenle/ }).first().click();
  await expect(page).toHaveURL(/\/create/);

  const backToForm = page.getByRole('button', { name: 'Tasarımını Düzenle' });
  // The editor opens on the preview step; isVisible() would not wait for it.
  await backToForm.click();

  const gallery = page.getByRole('switch', { name: /Fotoğraf Galerisi/ });
  await expect(gallery).toHaveAttribute('aria-checked', 'false');
  const [save] = await Promise.all([
    page.waitForResponse(r => r.request().method() === 'PUT' && r.url().includes('/api/invitations/'), { timeout: 20_000 }),
    gallery.click()
  ]);
  expect(save.status(), 'PUT with an Elit module on a lower plan').toBe(402);

  await expect(page.getByRole('heading', { name: /Mevcut planınız\s+bu davetiyeye yetmiyor/ })).toBeVisible();
  await expect(gallery).toHaveAttribute('aria-checked', 'false');

  // B-H3: the wall is a real modal — named dialog, focus kept inside, Esc closes and gives focus back.
  const dialog = page.getByRole('dialog', { name: /Mevcut planınız\s+bu davetiyeye yetmiyor/ });
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog.getByRole('button', { name: 'Kapat' })).toBeFocused();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press(i % 3 === 2 ? 'Shift+Tab' : 'Tab');
    expect(await dialog.evaluate((el) => el.contains(document.activeElement)), `focus inside after key ${i}`).toBe(true);
  }
  await page.waitForTimeout(1_000); // entrance animation settles before contrast is measured
  const axe = await new AxeBuilder({ page }).include('[role="dialog"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(axe.violations.map((v) => `${v.id} ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`), 'axe on the open wall').toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(gallery).toBeFocused();
});
