import path from 'path';
import {focusEditor, initialize, insertCard} from '../../utils/e2e';
import {expect, test} from '@playwright/test';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// BER-3595 — original report (TryGhost/Product#4114, 2023):
//   1. Add a file card, leave empty
//   2. Add a product card, try to set the rating — see that it works
//   3. Add a file to the file card
//   4. Try to set the rating on the product card — see it no longer works
//
// Root cause: uploading the file moves Lexical selection to the file card,
// dropping the product card out of editing state. The product card's
// ReadOnlyOverlay then sits over the rating widget. The rating widget still
// looks interactive because RatingButton always renders <button>s, so the
// user clicks a star expecting it to work — and the click is silently
// swallowed.
//
// The fix:
//   - The rating widget stacks above the ReadOnlyOverlay (z-20) and opts out
//     of the wrapper's mousedown promotion via `data-kg-allow-clickthrough`.
//   - KoenigCardWrapper's mousedown handler now early-returns for clickthrough
//     elements rather than dispatching SELECT_CARD_COMMAND on mousedown. That
//     dispatch was causing a synchronous re-render (sibling card losing
//     editing state, placeholder inputs unmounting, vertical layout shift)
//     between mousedown and mouseup, so the click event landed on a common
//     ancestor instead of the button.
//   - handleRatingChange (and handleRatingToggle) now call setEditing(true)
//     so the very act of changing the rating focuses the card — the
//     affordance the user just acted on is honoured in a single gesture.

test.describe('BER-3595: clicking a product card rating star promotes the card to editing', async () => {
    let page: import('@playwright/test').Page;

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
    });

    test.beforeEach(async () => {
        await initialize({page});
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('clicking a star after the card has lost focus updates the rating AND re-enters editing in one gesture', async () => {
        await focusEditor(page);

        // Add an empty file card. Cancel the chooser so it stays empty.
        const initialChooser = page.waitForEvent('filechooser');
        await insertCard(page, {cardName: 'file'});
        await (await initialChooser).setFiles([]);

        // Add a product card below it and enable rating.
        await page.keyboard.press('Escape');
        await page.keyboard.press('ArrowDown');
        await insertCard(page, {cardName: 'product'});
        await page.getByTestId('product-rating-toggle').check();

        const productCard = page.locator('[data-kg-card="product"]');
        const productStars = page.getByTestId('product-stars');
        const starButtons = productStars.locator('button');
        const activeStars = productStars.locator('button.fill-grey-900.dark\\:fill-white');

        // Pre-condition: the rating works while the product card is editing.
        await starButtons.nth(4).click();
        await expect(activeStars).toHaveCount(5);
        await expect(productCard).toHaveAttribute('data-kg-card-editing', 'true');

        // Click the empty file card. This matches the user flow ("add a file
        // to the file card") and transfers selection to the file card; the
        // product card silently leaves editing state.
        await page.locator('[data-kg-card="file"]').click();
        const fileInput = page.locator('[data-kg-card="file"] input[type="file"]');
        await fileInput.setInputFiles(path.relative(process.cwd(), __dirname + '/../fixtures/large-image-0.png'));
        await expect(page.locator('[data-kg-card="file"]').first()).toContainText('large-image-0');
        await expect(productCard).toHaveAttribute('data-kg-card-editing', 'false');

        // The actual regression: a single click on a star both applies the
        // rating change AND puts the product card back into editing state.
        // Pre-fix, this click was absorbed by the layout shift caused by
        // the wrapper's mousedown SELECT command.
        await starButtons.nth(2).click();
        await expect(activeStars).toHaveCount(3);
        await expect(productCard).toHaveAttribute('data-kg-card-editing', 'true');
    });
});
