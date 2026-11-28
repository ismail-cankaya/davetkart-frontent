import { expect, test, type Page } from '@playwright/test';

// Arayüz dili tarayıcıdan gelir; seçiciler Türkçe metinleri kullanır.
test.use({ locale: 'tr-TR' });

/**
 * Faz 25 (K306–K311): tasarım stüdyosunda metin ve bölüm düzenleme. Oturumsuz tasarımcı akışı: backend gerekmez.
 * Ayrıntı: docs/rehber/src/components/editor/text/InlineTextEditor.md
 */

/** Sihirbazdan tasarım stüdyosuna: kategori → tema → ayrıntılar → oluştur. */
async function openStudio(page: Page): Promise<void> {
  await page.goto('/create');
  await page.getByRole('button', { name: /Düğün/ }).first().click();
  await page.locator('button:has(img), button.group').filter({ hasText: /Sadelik|Zarif/ }).first().click();
  const submit = page.getByRole('button', { name: 'Davetiyeni Oluştur' });
  await submit.scrollIntoViewIfNeeded();
  await submit.click();
  await expect(page.getByRole('button', { name: 'Bölüm ekle' })).toBeVisible({ timeout: 20_000 });
}

/**
 * Önizlemede "Tarih ve mekân" bölümü görünsün diye mekân yazar; zarf kapısı tıklamaları örtmesin diye
 * zarfı kapatır (bölüm listesinden).
 */
async function giveVenue(page: Page): Promise<void> {
  await page.getByLabel('Davet Konumu').fill('Kuzguncuk Bahçe');
  const envelope = page.getByRole('switch', { name: 'Zarf açılışı' });
  if ((await envelope.getAttribute('aria-checked')) === 'true') await envelope.click();
}

const mark = (page: Page, key: string) => page.locator(`[data-text-slot="${key}"]`).first();

/** Önizleme kendi kabında kaydırılır; işareti ortaya alıp tıklar (yapışkan başlığın altında kalmasın). */
async function clickMark(page: Page, key: string): Promise<void> {
  const target = mark(page, key);
  await target.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.evaluate(() => {
    const preview = document.querySelector('[data-text-slot]')?.closest('.device-screen-canvas');
    preview?.scrollIntoView({ block: 'center' });
  });
  await target.click();
}

test('metne tıkla, değiştir, geri al, yinele ve onayla sıfırla', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openStudio(page);
  await giveVenue(page);

  const eyebrow = mark(page, 'details.eyebrow');
  await expect(eyebrow).toHaveText('Ne Zaman & Nerede');
  await clickMark(page, 'details.eyebrow');

  const dialog = page.getByRole('dialog', { name: 'Metni düzenle' });
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill('Buluşma Noktası');
  await dialog.locator('input').press('Enter');
  await expect(dialog).toBeHidden();
  await expect(eyebrow).toHaveText('Buluşma Noktası');

  // Metinler panelinde "değişti" ve geri al / yinele.
  await expect(page.getByText('değişti').first()).toBeVisible();
  await page.getByRole('button', { name: 'Geri al' }).click();
  await expect(eyebrow).toHaveText('Ne Zaman & Nerede');
  await page.getByRole('button', { name: 'Yinele' }).click();
  await expect(eyebrow).toHaveText('Buluşma Noktası');

  // Toplu sıfırlama onay ister; vazgeçince değişmez.
  await page.getByRole('button', { name: /Tüm metinleri sıfırla/ }).click();
  await page.getByRole('button', { name: 'Vazgeç' }).last().click();
  await expect(eyebrow).toHaveText('Buluşma Noktası');
  await page.getByRole('button', { name: /Tüm metinleri sıfırla/ }).click();
  await page.getByRole('button', { name: 'Hepsini sıfırla' }).click();
  await expect(eyebrow).toHaveText('Ne Zaman & Nerede');
});

test('sınırı aşan ve boş metin kaydedilmez', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openStudio(page);
  await giveVenue(page);

  await clickMark(page, 'details.eyebrow');
  const dialog = page.getByRole('dialog', { name: 'Metni düzenle' });
  await dialog.locator('input').fill('x'.repeat(200));
  await expect(dialog.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
  await dialog.locator('input').fill('   ');
  await expect(dialog.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
  await dialog.locator('input').press('Escape');
  await expect(dialog).toBeHidden();
});

test('➕ ile hediye bölümü eklenir, ayarı açılır, gizlenince veri kalır', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openStudio(page);

  // Varsayılanda hediye kapalı olabilir; önce kapat ki ➕ listesinde görünsün.
  const giftSwitch = page.getByRole('switch', { name: 'Hediye ve IBAN' });
  if ((await giftSwitch.getAttribute('aria-checked')) === 'true') await giftSwitch.click();

  await page.getByRole('button', { name: 'Bölüm ekle' }).click();
  await page.getByRole('menuitem', { name: /Hediye ve IBAN/ }).click();

  const drawer = page.getByRole('dialog', { name: 'Hediye ve IBAN' });
  await expect(drawer).toBeVisible();
  await drawer.getByLabel('Banka Adı').fill('Örnek Bankası');
  await expect(mark(page, 'gift.heading')).toBeAttached();

  await drawer.getByRole('button', { name: 'Gizle' }).click();
  await expect(drawer).toBeHidden();
  await expect(mark(page, 'gift.heading')).toHaveCount(0);

  await page.getByRole('button', { name: 'Bölüm ekle' }).click();
  await page.getByRole('menuitem', { name: /Hediye ve IBAN/ }).click();
  await expect(page.getByRole('dialog', { name: 'Hediye ve IBAN' }).getByLabel('Banka Adı')).toHaveValue('Örnek Bankası');
});
