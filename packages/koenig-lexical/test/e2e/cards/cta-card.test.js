import {assertHTML, focusEditor, html, initialize, insertCard} from '../../utils/e2e';
import {expect, test} from '@playwright/test';

test.describe('Call To Action Card', async () => {
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

    test('renders CTA Card', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="call-to-action">
                </div>
            </div>
            <p><br /></p>
        `, {ignoreCardContents: true});
    });

    test('can toggle button on card', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.click('[data-testid="button-settings"]');
        expect(await page.isVisible('[data-testid="cta-button"]')).toBe(true);

        await page.click('[data-testid="button-settings"]');

        expect(await page.isVisible('[data-testid="cta-button"]')).toBe(false);
    });

    test('button settings expands and collapses when toggled', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.click('[data-testid="button-settings"]');
        // determine if settings are open byy looking for cta-button-color, button-text & button-url
        expect(await page.isVisible('[data-testid="cta-button-color"]')).toBe(true);
        expect(await page.isVisible('[data-testid="button-text"]')).toBe(true);
        expect(await page.isVisible('[data-testid="button-url"]')).toBe(true);

        await page.click('[data-testid="button-settings"]');
        // determine if settings are closed by looking for cta-button-color, button-text & button-url
        expect(await page.isVisible('[data-testid="cta-button-color"]')).toBe(false);
        expect(await page.isVisible('[data-testid="button-text"]')).toBe(false);
        expect(await page.isVisible('[data-testid="button-url"]')).toBe(false);
    });

    test('can set button text', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.click('[data-testid="button-settings"]');
        await page.fill('[data-testid="button-text"]', 'Click me');
        expect(await page.textContent('[data-testid="cta-button"]')).toBe('Click me');
    });

    test('can set button url', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.click('[data-testid="button-settings"]');
        await page.fill('[data-testid="button-url"]', 'https://example.com');
        // Check that the `data-test-cta-button-current-url` attribute is set correctly
        const buttonContainer = await page.$('[data-test-cta-button-current-url]');
        const currentUrl = await buttonContainer.getAttribute('data-test-cta-button-current-url');
        // Assert the value
        expect(currentUrl).toBe('https://example.com');
    });
});
