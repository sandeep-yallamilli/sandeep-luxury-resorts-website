import { Page } from '@playwright/test';

export async function mockResortApi(page: Page) {
  // Mock resorts endpoint
  await page.route('**/api/resorts/**', async (route) => {
    const json = [
      {
        id: 1,
        slug: 'aura-sanctuary-maldives',
        name: 'Aura Sanctuary Maldives',
        location: 'Baa Atoll, Maldives',
        description: 'Luxury overwater villas surrounded by turquoise lagoons.',
        tagline: 'Private island sanctuary',
        rating: 4.9,
        priceStart: 1200,
        region: 'Indian Ocean',
        image: '/media/resorts/aura-maldives.webp',
        inclusions: ['Private Pool', 'Butler Service', 'Seaplane Transfer'],
      },
      {
        id: 2,
        slug: 'alpine-horizon-chalet',
        name: 'Alpine Horizon Chalet',
        location: 'Zermatt, Switzerland',
        description: 'Ultra-luxury ski-in chalets facing the iconic Matterhorn.',
        tagline: 'High-altitude luxury',
        rating: 5.0,
        priceStart: 2500,
        region: 'Europe',
        image: '/media/resorts/alpine-chalet.webp',
        inclusions: ['Ski-in / Ski-out', 'Private Chef', 'Heated Outdoor Pool'],
      },
    ];
    await route.fulfill({ json });
  });

  // Mock banners endpoint
  await page.route('**/api/banners/**', async (route) => {
    const json = [
      {
        id: 1,
        page: 'home',
        title: 'Experience The Unrivaled Sanctuary',
        subtitle: 'Ultra-luxury resorts & private estates across the globe',
        image: '/media/banners/home.webp',
      },
    ];
    await route.fulfill({ json });
  });

  // Mock subscribe endpoint
  await page.route('**/api/subscribe/**', async (route) => {
    await route.fulfill({
      status: 201,
      json: { message: 'Subscription successful', email: 'guest@example.com' },
    });
  });
}
