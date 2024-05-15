import {expect, test} from '@playwright/test';
import {focusEditor, initialize} from '../../utils/e2e';

test.describe('Snippet Plugin', async function () {
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

    test.describe('Snippets Plugin', async function () {
        test('Can Insert a snippet with multiple nodes', async function () {
            await focusEditor(page);
            await page.keyboard.type('/snippet');
            await page.keyboard.press('Enter');
            await page.waitForSelector('[data-kg-card="image"]');
            expect(await page.$('[data-kg-card="image"]')).not.toBeNull();
        });
    });
});
