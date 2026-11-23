import { expect, type Page } from '@playwright/test';

/**
 * Journey steps shared by the specs. Each step is one function so a product
 * change (e.g. SEC-09 e-mail verification, FE-50 wizard) edits one place.
 * Selectors: role / label / placeholder — what a user (and a screen reader) sees.
 */

export interface Owner {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function newOwner(): Owner {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return { firstName: 'Elif', lastName: 'Deneme', email: `e2e.${id}@example.test`, password: 'E2e-Parola-2026!' };
}

export async function register(page: Page, owner: Owner): Promise<void> {
  await page.goto('/register');
  await page.getByLabel('Ad', { exact: true }).fill(owner.firstName);
  await page.getByLabel('Soyad', { exact: true }).fill(owner.lastName);
  await page.getByLabel('E-posta Adresi').fill(owner.email);
  await page.getByLabel('Şifre', { exact: true }).fill(owner.password);
  const [response] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/auth/register')),
    page.getByRole('button', { name: 'Ücretsiz Kayıt Ol' }).click()
  ]);
  expect(response.status(), 'POST /api/auth/register').toBe(201);
  await verifyEmailIfRequired(page, owner);
  await expect(page).not.toHaveURL(/\/register/);
}

/**
 * Hook for SEC-09 (Faz 19.14): when registration starts requiring e-mail
 * verification, open the link here. Today registration signs in directly.
 */
export async function verifyEmailIfRequired(_page: Page, _owner: Owner): Promise<void> {}

export async function createInvitation(page: Page, names: { first: string; second: string }): Promise<void> {
  await page.goto('/create');
  const main = page.locator('main');
  // Auto-save may create the record while the form is filled (1.5 s idle),
  // before "Davetiyeni Oluştur": listen from the start, not at the click.
  const created = page.waitForResponse(
    r => r.request().method() === 'POST' && new URL(r.url()).pathname.endsWith('/api/invitations'),
    { timeout: 60_000 }
  );
  await main.getByRole('button', { name: /^Düğün/ }).first().click();
  await main.getByRole('button', { name: /^Zarif Sadelik/ }).first().click();
  await page.getByLabel('Gelin Adı').fill(names.first);
  await page.getByLabel('Damat Adı').fill(names.second);
  await page.getByLabel(/Etkinlik Tarihi/).fill('2027-06-12T19:00');
  await page.getByLabel('Davet Konumu').fill('Çırağan Sarayı, Beşiktaş / İstanbul');
  await main.getByRole('button', { name: 'Davetiyeni Oluştur' }).click();
  expect((await created).status(), 'POST /api/invitations').toBe(201);
  await expect(page.getByRole('button', { name: 'Tasarımını Yayınla' })).toBeVisible({ timeout: 30_000 });
}

/** Publish → plan wall → checkout → gift code → free activation → published. Returns the invitation id. */
export async function publishWithGiftCode(page: Page, code: string): Promise<string> {
  const [attempt] = await Promise.all([
    page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith('/publish')),
    page.getByRole('button', { name: 'Tasarımını Yayınla' }).click()
  ]);
  // No plan yet: the server answers 402 and the plan wall opens.
  expect(attempt.status(), `POST publish → ${await attempt.text()}`).toBe(402);
  await expect(page.getByRole('heading', { name: /Davetiyenize uygun\s+paketi seçin/ })).toBeVisible();
  await page.getByRole('button', { name: /Ödemeye Geç/ }).first().click();
  await expect(page).toHaveURL(/\/odeme\?/);

  await page.getByRole('button', { name: /Hediye kodum var/ }).click();
  await page.getByLabel('Hediye kodu', { exact: true }).fill(code);
  await page.getByRole('button', { name: 'Uygula' }).click();
  // The input is visually hidden and its label holds links: tick it by keyboard.
  const consent = page.getByRole('checkbox', { name: /Kullanım Koşulları/ });
  await consent.focus();
  await page.keyboard.press('Space');
  await expect(consent).toBeChecked();
  await page.getByRole('button', { name: 'Ücretsiz etkinleştir' }).click();

  await expect(page).toHaveURL(/\/odeme\/basarili\?order=/, { timeout: 30_000 });
  await expect(page.getByRole('heading', { name: /Davetiyeniz\s+yayında/ })).toBeVisible({ timeout: 30_000 });
  const href = await page.getByRole('link', { name: /Davetiyeyi Görüntüle/ }).getAttribute('href');
  const id = href?.split('/invite/')[1];
  expect(id, 'link to the published invitation').toBeTruthy();
  return id as string;
}

/** Guest page: opens the envelope when the invitation has one. */
export async function openGuestPage(page: Page, invitationId: string): Promise<void> {
  await page.goto(`/invite/${invitationId}`);
  const envelope = page.getByRole('button', { name: 'Davetiyeyi aç' });
  // isVisible() does not wait: give the envelope time to mount, then wait for it to leave.
  const hasEnvelope = await envelope.waitFor({ state: 'visible', timeout: 10_000 }).then(() => true, () => false);
  if (!hasEnvelope) return;
  await envelope.click();
  await expect(envelope).toBeHidden({ timeout: 15_000 });
}
