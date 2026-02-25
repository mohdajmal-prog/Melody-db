import { test, expect } from '@playwright/test';

test('services panel opens and closes', async ({ page }) => {
  await page.goto('/customer');

  // Wait for and open services panel
  await page.waitForSelector('button[aria-label="Open services"]', { timeout: 15000 });
  await page.click('button[aria-label="Open services"]');
  await expect(page.locator('h2', { hasText: 'Services' })).toBeVisible();

  // Interact with a service card to ensure the panel is interactive
  const firstCard = page.locator('text=Function Hall Workers').first();
  await expect(firstCard).toBeVisible();

  // Close services panel and assert it is translated out of view
  const panel = page.locator('div.fixed.top-0.right-0.h-full.w-full.max-w-md');
  await page.click('button[aria-label="Close services"]');
  // wait for the close animation to complete
  await page.waitForTimeout(250);
  await expect(panel).toHaveAttribute('class', /translate-x-full/);
});
