import { expect, test } from '@playwright/test';
import { OWNER_STORAGE } from './support/state';

test.use({ storageState: OWNER_STORAGE });

/**
 * B-D10 (FE-02): the editor is unmounted when it crashes (route errorElement) or is left; the pending edit must still
 * reach the backend. Leaving within the draft (~400 ms) and auto-save (1.5 s) windows takes the same cleanup path.
 */
test('editörden hemen çıkınca son düzenleme kaydedilir', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: /Düzenle/ }).first().click();
  await expect(page).toHaveURL(/\/create/);
  await page.getByRole('button', { name: 'Tasarımını Düzenle' }).click();

  // ASCII on purpose: the request body is matched as text.
  const venue = `Flush Bahce ${Date.now() % 100000}`;
  const field = page.getByLabel('Davet Konumu');
  await expect(field).toBeVisible();

  const saved = page.waitForRequest(
    (r) => r.method() === 'PUT' && r.url().includes('/api/invitations/') && (r.postData() ?? '').includes(venue),
    { timeout: 15_000 }
  );
  await field.fill(venue);
  // No wait: leave while both debounce windows are still open.
  await page.locator('header a[href="/dashboard"]').first().click();

  const request = await saved;
  expect((await request.response())?.status(), 'PUT after leaving the editor').toBe(200);
  await expect(page).toHaveURL(/\/dashboard/);
});
