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
});
