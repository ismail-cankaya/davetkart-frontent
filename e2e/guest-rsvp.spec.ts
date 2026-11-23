import { expect, test } from '@playwright/test';
import { openGuestPage } from './support/flows';
import { OWNER_STORAGE, readPublished } from './support/state';

/** Yolculuk 2 (TST-04): misafir LCV'si → sahibin panelinde görünmesi. */
test('misafir yanıtı sahibin panelinde görünür', async ({ browser }) => {
  const { invitationId } = readPublished();
  const guestName = `Misafir ${Date.now() % 100000}`;

  const guestContext = await browser.newContext();
  const guest = await guestContext.newPage();
  await openGuestPage(guest, invitationId);
  const name = guest.getByLabel('Ad Soyad');
  // The form can remount once after the envelope opens (local state resets): refill until it holds.
  await expect(guest.getByRole('heading', { name: 'Lütfen Cevap Veriniz' })).toBeVisible();
  await expect(async () => {
    await name.fill(guestName);
    await guest.waitForTimeout(500);
    await expect(name).toHaveValue(guestName, { timeout: 500 });
  }).toPass({ timeout: 15_000 });
  const [reply] = await Promise.all([
    guest.waitForResponse(r => r.request().method() === 'POST' && r.url().includes(`/api/public/invitations/${invitationId}/rsvps`)),
    guest.getByRole('button', { name: /Katılımımı Bildir/i }).click()
  ]);
  expect(reply.status(), 'POST public rsvps').toBe(201);
  await guestContext.close();

  const ownerContext = await browser.newContext({ storageState: OWNER_STORAGE });
  const owner = await ownerContext.newPage();
  await owner.goto('/dashboard');
  await expect(owner.getByText(guestName).first()).toBeVisible();
  await ownerContext.close();
});
