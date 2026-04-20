import { expect, test } from "../../support/fixtures"


test.beforeEach(async ({ app }) => {
  await app.configurator.open()
})

test.describe('CT02 - Exterior color selection and image update', () => {

  test('should update the stage when selecting Midnight Black and Lunar White', async ({
    app,
  }) => {
    await app.configurator.expectExteriorStage('glacier-blue')

    await app.configurator.selectExteriorColor('Midnight Black')
    await app.configurator.expectExteriorStage('midnight-black')

    await app.configurator.selectExteriorColor('Lunar White')
    await app.configurator.expectExteriorStage('lunar-white')
  })
})

test.describe('CT03 - Wheel selection and Final Price Impact', () => {

  test('should validate that changing to Sport wheels updates the image and adds R$ 2.000 to the total price', async ({
    app,
  }) => {
    await app.configurator.expectExteriorStage('glacier-blue', 'aero')
    await app.configurator.expectTotalPrice(/40\.000,00/)

    await app.configurator.selectWheel('sport')
    await app.configurator.expectExteriorStage('glacier-blue', 'sport')
    await app.configurator.expectTotalPrice(/42\.000,00/)

    await app.configurator.selectWheel('aero')
    await app.configurator.expectExteriorStage('glacier-blue', 'aero')
    await app.configurator.expectTotalPrice(/40\.000,00/)
  })
})
