import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', lang: 'es', finalPath: '/es' },
  { path: '/projects', lang: 'es', finalPath: '/es/projects' },
  { path: '/about', lang: 'es', finalPath: '/es/about' },
  { path: '/es', lang: 'es', finalPath: '/es' },
  { path: '/es/projects', lang: 'es', finalPath: '/es/projects' },
  { path: '/es/about', lang: 'es', finalPath: '/es/about' },
  { path: '/es/cv', lang: 'es', finalPath: '/es/cv' },
  {
    path: '/es/projects/portfolio',
    lang: 'es',
    finalPath: '/es/projects/portfolio',
  },
  {
    path: '/es/case-studies/pim',
    lang: 'es',
    finalPath: '/es/case-studies/pim',
  },
  { path: '/en', lang: 'en' },
  { path: '/en/projects', lang: 'en', finalPath: '/en/projects' },
  { path: '/en/about', lang: 'en', finalPath: '/en/about' },
  { path: '/en/cv', lang: 'en', finalPath: '/en/cv' },
  {
    path: '/en/projects/portfolio',
    lang: 'en',
    finalPath: '/en/projects/portfolio',
  },
  {
    path: '/en/case-studies/pim',
    lang: 'en',
    finalPath: '/en/case-studies/pim',
  },
];

for (const route of routes) {
  test(`smoke: ${route.path}`, async ({ page }) => {
    const pageErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto(route.path);

    await expect(page).toHaveTitle(/Sandra Martínez Fernández/);
    if (route.finalPath) {
      await expect(page).toHaveURL(new RegExp(`${route.finalPath}$`));
    }
    await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
    await expect(page.locator("a[href='#main']")).toBeVisible();
    await expect(page.locator('#main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
}
