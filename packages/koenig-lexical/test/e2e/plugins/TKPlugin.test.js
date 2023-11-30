import {assertSelection, focusEditor, initialize} from '../../utils/e2e';
import {expect, test} from '@playwright/test';

test.describe('TK Plugin', async function () {
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

    test.describe('highlights TK nodes', async function () {
        test('highlights a TK node when TK is typed in text', async function () {
            await focusEditor(page);

            await page.keyboard.type('TK');

            await expect(await page.getByRole('paragraph').getByText('TK')).toHaveAttribute('data-kg-tk', 'true');
        });

        test('highlights a TK when surrounded by symbols', async function () {
            await focusEditor(page);
            await page.keyboard.type('[TK],');
            await expect(await page.getByRole('paragraph').getByText('[TK],')).toHaveAttribute('data-kg-tk', 'true');
        });

        test('highlights a TK when TK is repeated', async function () {
            await focusEditor(page);
            await page.keyboard.type('TKTK');
            await expect(await page.getByRole('paragraph').getByText('TKTK')).toHaveAttribute('data-kg-tk', 'true');
        });

        test('does not highlight TK when surrounded by letters', async function () {
            await focusEditor(page);
            await page.keyboard.type('TKtest');
            await expect(await page.getByRole('paragraph').getByText('TKtest')).not.toHaveAttribute('data-kg-tk', 'true');
        });

        test('highlights a TK node when TK is typed in a heading', async function () {
            await focusEditor(page);

            await page.keyboard.type('# TK');

            await expect(await page.getByRole('heading').getByText('TK')).toHaveAttribute('data-kg-tk', 'true');
        });

        test('highlights a TK node when TK is typed in a list item', async function () {
            await focusEditor(page);

            await page.keyboard.type('- TK');

            await expect(await page.getByRole('listitem').getByText('TK')).toHaveAttribute('data-kg-tk', 'true');
        });

        test('changes highlight when TK indicator is hovered', async function () {
            await focusEditor(page);

            await page.keyboard.type('TK');
            await page.getByTestId('tk-indicator').hover();

            await expect(await page.getByRole('paragraph').getByText('TK')).toHaveClass('bg-lime-500 dark:bg-lime-800 py-1');
        });
    });

    test.describe('indicators', async function () {
        test('creates a TK indicator for each TK node', async function () {
            await focusEditor(page);

            await page.keyboard.type('TK and TK and TK');
            await expect(await page.getByTestId('tk-indicator')).toBeVisible();
        });

        test('creates a TK indicator for each parent element with a TK', async function () {
            await focusEditor(page);

            await page.keyboard.type('TK and some text');
            await page.keyboard.press('Enter');
            await page.keyboard.type('TK and some text');
            await page.keyboard.press('Enter');
            await page.keyboard.type('TK and some text');

            await expect(await page.getByTestId('tk-indicator').all()).toHaveLength(3);
        });

        test('clicking the indicator selects the first TK node in the parent', async function () {
            await focusEditor(page);

            await page.keyboard.type('TK and TK and TK');

            await page.evaluate(() => window.getSelection().toString()).then((selection) => {
                expect(selection).toEqual('');
            });

            await page.getByTestId('tk-indicator').click();

            await page.evaluate(() => window.getSelection().toString()).then((selection) => {
                expect(selection).toEqual('TK');
            });
        });

        test('continuing to click the indicator cycles through the TK nodes in the parent', async function () {
            await focusEditor(page);

            await page.keyboard.type('TK and TK and TK');
            await page.getByTestId('tk-indicator').click();

            // piece 2 in the array is the child node
            await assertSelection(page, {
                anchorPath: [0, 0, 0],
                anchorOffset: 0,
                focusPath: [0, 0, 0],
                focusOffset: 2
            });

            await page.getByTestId('tk-indicator').click();

            await assertSelection(page, {
                anchorPath: [0, 2, 0],
                anchorOffset: 0,
                focusPath: [0, 2, 0],
                focusOffset: 2
            });

            await page.getByTestId('tk-indicator').click();

            await assertSelection(page, {
                anchorPath: [0, 4, 0],
                anchorOffset: 0,
                focusPath: [0, 4, 0],
                focusOffset: 2
            });
        });
    });
});
