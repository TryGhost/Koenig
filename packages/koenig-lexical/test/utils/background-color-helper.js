// import {expect} from '@playwright/test';

export async function cardBackgroundColorSettings(page, {cardColorPickerTestId, customColor, colorTestId, findByColorTitle}) {
    const colorSetting = page.locator(`[data-testid="${cardColorPickerTestId}"]`);
    const colorButton = colorSetting.locator('button');
    await colorButton.click();

    if (findByColorTitle) {
        const colorTitle = page.locator(`[title="${findByColorTitle}"]`);
        await colorTitle.click();
    }

    if (customColor) {
        const picker = page.locator(`[data-testid="color-picker-toggle"]`);
        await picker.click();
        const colorInput = page.locator(`input[aria-label="Color value"]`);
        await colorInput.click({clickCount: 3});
        await colorInput.type(customColor);
    }
    if (colorTestId) {
        await page.locator(`[data-test-id="${colorTestId}"]`).click();
    }
    // await page.locator(`[data-test-id="${colorTestId}"]`).click();

    // Ensure the expected background color is applied
    // const coloredCard = page.locator(`[data-testid="${expectedBgTestId}"]`);
    // await expect(coloredCard).toBeVisible();
}
