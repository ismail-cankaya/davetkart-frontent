import { expect, test, type FrameLocator, type Page } from '@playwright/test';

// Arayüz dili tarayıcıdan gelir; seçiciler Türkçe metinleri kullanır.
test.use({ locale: 'tr-TR' });

/**
 * Faz 25 (K306–K311) ve Faz 28 (K318–K325): Tasarım Stüdyosu'nda metin, kullanıcı alanı ve bölüm düzenleme.
 * Oturumsuz tasarımcı akışı: backend gerekmez. Önizleme aynı uygulamadaki iframe'dedir (K320).
 * Ayrıntı: docs/rehber/src/pages/StudioPage.md
 */

const canvas = (page: Page): FrameLocator => page.frameLocator('iframe[title="Davetiye önizlemesi"]');
const mark = (page: Page, key: string) => canvas(page).locator(`[data-text-slot="${key}"]`).first();

/** Sihirbazdan stüdyoya: kategori → tema → ayrıntılar → oluştur → `/studio`. */
async function openStudio(page: Page): Promise<void> {
  await page.goto('/create');
  await page.getByRole('button', { name: /Düğün/ }).first().click();
  await page.locator('button:has(img), button.group').filter({ hasText: /Sadelik|Zarif/ }).first().click();
  const submit = page.getByRole('button', { name: 'Davetiyeni Oluştur' });
  await submit.scrollIntoViewIfNeeded();
  await submit.click();
  await expect(page).toHaveURL(/\/studio/, { timeout: 30_000 });
  await expect(canvas(page).locator('[data-text-slot]').first()).toBeAttached({ timeout: 30_000 });
}

/** Bölümler sekmesinden zarfı kapatır (zarf tıklamaları örtmesin) ve Bilgiler'den mekân yazar. */
async function prepare(page: Page): Promise<void> {
  await page.getByRole('tab', { name: 'Bölümler' }).click();
  const envelope = page.getByRole('switch', { name: 'Zarf açılışı' });
  if ((await envelope.getAttribute('aria-checked')) === 'true') await envelope.click();
  await page.getByRole('tab', { name: 'Bilgiler' }).click();
  await page.getByLabel('Mekân').fill('Kuzguncuk Bahçe');
  await expect(canvas(page).getByText('Kuzguncuk Bahçe').first()).toBeAttached();
}

async function clickInCanvas(page: Page, locator: ReturnType<FrameLocator['locator']>): Promise<void> {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await locator.click();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
});

test('metne tıkla, değiştir, geri al, yinele ve onayla sıfırla', async ({ page }) => {
  await openStudio(page);
  await prepare(page);

  const eyebrow = mark(page, 'details.eyebrow');
  await expect(eyebrow).toHaveText('Ne Zaman & Nerede');
  await clickInCanvas(page, eyebrow);

  const dialog = page.getByRole('dialog', { name: 'Metni düzenle' });
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill('Buluşma Noktası');
  await dialog.locator('input').press('Enter');
  await expect(dialog).toBeHidden();
  await expect(eyebrow).toHaveText('Buluşma Noktası');

  // Üst çubukta geri al / yinele; Metinler sekmesinde "değişti".
  const top = page.locator('header').first();
  await top.getByRole('button', { name: 'Geri al' }).click();
  await expect(eyebrow).toHaveText('Ne Zaman & Nerede');
  await top.getByRole('button', { name: 'Yinele' }).click();
  await expect(eyebrow).toHaveText('Buluşma Noktası');

  await page.getByRole('tab', { name: 'Metinler' }).click();
  await expect(page.getByText('değişti').first()).toBeVisible();
  await page.getByRole('button', { name: /Tüm metinleri sıfırla/ }).click();
  await page.getByRole('button', { name: 'Vazgeç' }).last().click();
  await expect(eyebrow).toHaveText('Buluşma Noktası');
  await page.getByRole('button', { name: /Tüm metinleri sıfırla/ }).click();
  await page.getByRole('button', { name: 'Hepsini sıfırla' }).click();
  await expect(eyebrow).toHaveText('Ne Zaman & Nerede');
});

test('sınırı aşan ve boş metin kaydedilmez', async ({ page }) => {
  await openStudio(page);
  await prepare(page);

  await clickInCanvas(page, mark(page, 'details.eyebrow'));
  const dialog = page.getByRole('dialog', { name: 'Metni düzenle' });
  await dialog.locator('input').fill('x'.repeat(200));
  await expect(dialog.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
  await dialog.locator('input').fill('   ');
  await expect(dialog.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
  await dialog.locator('input').press('Escape');
  await expect(dialog).toBeHidden();
});

test('isimlere ve mekâna tıklayınca kendi bilgisi açılır, paket notu yok (K321)', async ({ page }) => {
  await openStudio(page);
  await prepare(page);

  await clickInCanvas(page, canvas(page).getByText('Kuzguncuk Bahçe').first());
  const dialog = page.getByRole('dialog', { name: 'Bilgiyi düzenle' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('input')).toHaveValue('Kuzguncuk Bahçe');
  await expect(dialog.getByText(/her pakette serbest/)).toBeVisible();
  await dialog.locator('input').fill('Moda Sahili');
  await dialog.locator('input').press('Enter');
  await expect(canvas(page).getByText('Moda Sahili').first()).toBeAttached();
  await expect.poll(() => page.getByRole('tabpanel').getByLabel('Mekân').inputValue()).toBe('Moda Sahili');
});

test('➕ ile hediye bölümü eklenir, ayarı yanda açılır, gizlenince veri kalır', async ({ page }) => {
  await openStudio(page);
  await page.getByRole('tab', { name: 'Bölümler' }).click();

  const giftSwitch = page.getByRole('switch', { name: 'Hediye ve IBAN' });
  if ((await giftSwitch.getAttribute('aria-checked')) === 'true') await giftSwitch.click();

  await page.getByRole('button', { name: 'Bölüm ekle' }).click();
  await page.getByRole('menuitem', { name: /Hediye ve IBAN/ }).click();

  // 1440 px: ayar paneli tuvalin sağında sütun (K319).
  const inspector = page.getByRole('complementary', { name: 'Hediye ve IBAN' });
  await expect(inspector).toBeVisible();
  await inspector.getByLabel('Banka Adı').fill('Örnek Bankası');
  await expect(mark(page, 'gift.heading')).toBeAttached();

  await inspector.getByRole('button', { name: 'Gizle' }).click();
  await expect(inspector).toBeHidden();
  await expect(mark(page, 'gift.heading')).toHaveCount(0);

  await page.getByRole('button', { name: 'Bölüm ekle' }).click();
  await page.getByRole('menuitem', { name: /Hediye ve IBAN/ }).click();
  await expect(page.getByRole('complementary', { name: 'Hediye ve IBAN' }).getByLabel('Banka Adı')).toHaveValue('Örnek Bankası');
});

test('cihaz değişince önizleme gerçek genişlikte çizilir (K320)', async ({ page }) => {
  await openStudio(page);
  const width = () => page.locator('iframe[title="Davetiye önizlemesi"]').evaluate((f) => (f as HTMLIFrameElement).contentWindow?.innerWidth);
  expect(await width()).toBe(390);
  await page.getByRole('radio', { name: 'Tablet' }).click();
  await expect.poll(width).toBe(820);
  await page.getByRole('radio', { name: 'Bilgisayar' }).click();
  await expect.poll(width).toBe(1280);
});

test('kontrol listesi, misafir gözüyle ve tam ekranda düzenle (K325, K319)', async ({ page }) => {
  await openStudio(page);
  const chip = page.getByRole('button', { name: /^Hazır \d\/\d$/ });
  const before = await chip.textContent();
  await page.getByRole('tab', { name: 'Bilgiler' }).click();
  await page.getByLabel('Mekân').fill('Kuzguncuk Bahçe');
  await expect(chip).not.toHaveText(before ?? '');

  // Misafir gözüyle: editör çerçevesi yok (tıklanabilir işaret yok), Esc ile kapanır.
  await page.getByRole('button', { name: 'Misafir gözüyle' }).click();
  const guest = page.getByRole('dialog', { name: 'Misafir gözüyle önizleme' });
  await expect(guest).toBeVisible();
  await expect(guest.frameLocator('iframe').locator('[data-text-slot]')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(guest).toBeHidden();

  // Tam ekranda düzenle: sol menü gizlenir, tuval kalır; çıkınca geri gelir.
  await page.getByRole('button', { name: 'Tam ekranda düzenle' }).click();
  await expect(page.getByRole('tab', { name: 'Bilgiler' })).toBeHidden();
  await expect(page.locator('iframe[title="Davetiye önizlemesi"]')).toBeVisible();
  await page.getByRole('button', { name: /Tam ekrandan çık/ }).first().click();
  await expect(page.getByRole('tab', { name: 'Bilgiler' })).toBeVisible();
});
