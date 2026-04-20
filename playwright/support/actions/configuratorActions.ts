import { expect, Page } from '@playwright/test';

export type ExteriorColorSlug = 'glacier-blue' | 'midnight-black' | 'lunar-white';

export function createConfiguratorActions(page: Page) {
  const carExteriorImage = page.getByTestId('car-exterior-image');
  const veloSprintHeading = page.getByRole('heading', { name: 'Velô Sprint', level: 1 });

  return {
    elements: {
      carExteriorImage,
      veloSprintHeading,
    },

    colorButton(name: string) {
      return page.getByRole('button', { name });
    },

    async open() {
      await page.goto('/configure');
      await expect(page).toHaveURL(/\/configure$/);
      await expect(veloSprintHeading).toBeVisible();
    },

    async selectExteriorColor(name: string) {
      await page.getByRole('button', { name }).click();
    },

    async expectExteriorStage(
      exteriorSlug: ExteriorColorSlug,
      wheelSlug: string = 'aero'
    ) {
      const carImage = page.getByRole('img', {
        name: `Velô Sprint - ${exteriorSlug} with ${wheelSlug} wheels`,
      });
      await expect(carImage).toBeVisible();
      await expect(carImage).toHaveAttribute(
        'src',
        new RegExp(`${exteriorSlug}-${wheelSlug}-wheels.*\\.png`)
      );
    },

    async selectWheel(wheelType: 'aero' | 'sport') {
      await page.getByTestId(`wheel-option-${wheelType}`).click();
    },

    async expectTotalPrice(price: string | RegExp) {
      await expect(page.getByTestId('total-price')).toHaveText(price);
    },
  };
}
