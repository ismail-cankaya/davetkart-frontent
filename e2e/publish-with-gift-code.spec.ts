import { expect, test } from '@playwright/test';
import { createInvitation, draftSurvivesReload, newOwner, openGuestPage, publishWithGiftCode, register } from './support/flows';
import { GIFT_CODE, OWNER_STORAGE, savePublished } from './support/state';

/** Yolculuk 1 (TST-04): kayıt → davetiye → hediye koduyla yayın → misafir sayfası. */
test('kayıt, davetiye ve hediye koduyla yayın', async ({ page }) => {
  const owner = newOwner();
  const names = { first: 'Zeynep', second: 'Emre' };

  await register(page, owner);
  await createInvitation(page, names);
  await draftSurvivesReload(page, names);
  const invitationId = await publishWithGiftCode(page, GIFT_CODE);

  await openGuestPage(page, invitationId);
  await expect(page.getByText(names.first).first()).toBeVisible();
  await expect(page.getByText(names.second).first()).toBeVisible();

  await page.context().storageState({ path: OWNER_STORAGE });
  savePublished({ invitationId, ownerEmail: owner.email, names });
});
