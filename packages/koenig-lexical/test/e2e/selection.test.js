import {assertHTML, assertSelection, dragMouse, focusEditor, html, initialize} from '../utils/e2e';
import {test} from '@playwright/test';

test.describe('Selection behaviour', async () => {
    test.beforeEach(async function ({page}) {
        await initialize({page});
    });

    // TODO: skipped because Playwright doesn't fire the `click` event when the
    // mouse is released after a drag meaning it wasn't triggering the buggy behaviour.
    // Unskip when this is fixed: https://github.com/microsoft/playwright/issues/20717
    test.skip('can create range selection covering a card', async function ({page}) {
        await focusEditor(page);
        await page.keyboard.type('First paragraph');
        await page.keyboard.press('Enter');
        await page.keyboard.type('--- ');
        await page.keyboard.type('Second paragraph');

        const firstPBoundingBox = await page.locator('p').nth(0).boundingBox();
        const secondPBoundingBox = await page.locator('p').nth(1).boundingBox();

        await dragMouse(page, firstPBoundingBox, secondPBoundingBox, 'start', 'end');

        // make sure we're waiting for any card behaviours to finish
        await page.waitForTimeout(100);

        await assertSelection(page, {
            anchorPath: [0, 0, 0],
            anchorOffset: 0,
            focusPath: [2, 0, 0],
            focusOffset: 16
        });
    });

    test('cards do not show as selected in range selections', async function ({page}) {
        await focusEditor(page);
        await page.keyboard.type('First paragraph');
        await page.keyboard.press('Enter');
        await page.keyboard.type('--- ');
        await page.keyboard.type('Second paragraph');

        const firstPBoundingBox = await page.locator('p').nth(0).boundingBox();
        const secondPBoundingBox = await page.locator('p').nth(1).boundingBox();

        await dragMouse(page, firstPBoundingBox, secondPBoundingBox, 'start', 'end');

        await assertHTML(page, html`
            <p dir="ltr"><span data-lexical-text="true">First paragraph</span></p>
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="horizontalrule">
                    <hr>
                </div>
            </div>
            <p><span data-lexical-text="true">Second paragraph</span></p>
        `);
    });
});
