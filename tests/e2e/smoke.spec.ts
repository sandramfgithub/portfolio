import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', lang: 'es' },
  { path: '/projects', lang: 'es' },
  { path: '/about', lang: 'es' },
  { path: '/en', lang: 'en' },
  { path: '/en/projects', lang: 'en' },
  { path: '/en/about', lang: 'en' },
];

for (const route of routes) {
  test(`smoke: ${route.path}`, async ({ page }) => {
    const pageErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto(route.path);

    await expect(page).toHaveTitle(/Sandra Martínez Fernández/);
    await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
    await expect(page.locator("a[href='#main']")).toBeVisible();
    await expect(page.locator('#main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
}
