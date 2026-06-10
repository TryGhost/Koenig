import {expect, test} from '@playwright/test';
import {focusEditor, initialize, selectBackwards} from '../../utils/e2e';

test.describe('Selection Word Count Plugin', async function () {
    let page;

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
    });

    test.beforeEach(async () => {
        await initialize({page});
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('shows no selection count without a selection', async function () {
        await focusEditor(page);
        await page.keyboard.type('Hello beautiful world');
        await expect(page.getByTestId('word-count')).toHaveText('3');
        await expect(page.getByTestId('selection-word-count')).not.toBeVisible();
    });

    test('shows selection count for selected text', async function () {
        await focusEditor(page);
        await page.keyboard.type('Hello beautiful world');
        await selectBackwards(page, 5); // selects "world"
        await expect(page.getByTestId('selection-word-count')).toHaveText('1');
        // total stays visible alongside the selection count
        await expect(page.getByTestId('word-count')).toHaveText('3');
    });

    test('shows 0 for a whitespace-only selection', async function () {
        await focusEditor(page);
        await page.keyboard.type('Hello world');
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('ArrowLeft');
        }

        // Chrome for Testing occasionally drops the programmatic selection;
        // retry until the DOM reports a non-collapsed selection
        await expect(async () => {
            if (!(await page.evaluate(() => window.getSelection().isCollapsed))) {
                // a previous attempt selected; collapse back to just before "world"
                await page.keyboard.press('ArrowRight');
            }
            await selectBackwards(page, 1); // selects the space between the words
            expect(await page.evaluate(() => window.getSelection().isCollapsed)).toBe(false);
        }).toPass();

        await expect(page.getByTestId('selection-word-count')).toHaveText('0');
    });

    test('counts partial word fragments as words', async function () {
        await focusEditor(page);
        await page.keyboard.type('Hello world');
        await selectBackwards(page, 3); // selects "rld"
        await expect(page.getByTestId('selection-word-count')).toHaveText('1');
    });

    test('reverts to total-only display when selection collapses', async function () {
        await focusEditor(page);
        await page.keyboard.type('Hello world');
        await selectBackwards(page, 5);
        await expect(page.getByTestId('selection-word-count')).toHaveText('1');
        await page.keyboard.press('ArrowRight'); // collapse the selection
        await expect(page.getByTestId('selection-word-count')).not.toBeVisible();
        await expect(page.getByTestId('word-count')).toHaveText('2');
    });
});
