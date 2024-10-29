import {expect, test} from '@playwright/test';
import {focusEditor,initialize, insertCard} from '../utils/e2e';

test.describe('Content Visibility', async () => {
    let page;

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
    });

    test.beforeEach(async () => {
        await initialize({page, uri: '/#/?content=false&labs=contentVisibility'});
    });

    test.afterAll(async () => {
        await page.close();
    });

    test.describe('HTML card', async function () {
        async function insertHtmlCard() {
            await focusEditor(page);
            await insertCard(page, {cardName: 'html'});
            await expect(await page.locator('.cm-content[contenteditable="true"]')).toBeVisible();
            await page.keyboard.type('Testing');
            await page.keyboard.press('Meta+Enter');
            return page.locator('[data-kg-card="html"]');
        }

        test('toolbar shows edit icon', async function () {
            await insertHtmlCard();

            await expect(page.locator('[data-kg-card="html"]')).toHaveAttribute('data-kg-card-selected', 'true');
            await expect(page.locator('[data-kg-card="html"]')).toHaveAttribute('data-kg-card-editing', 'false');
            await expect(page.locator('[data-kg-card-toolbar="html"]')).toBeVisible();
            await expect(page.locator('[data-kg-card-toolbar="html"] [data-testid="edit-html"]')).toBeVisible();
        });

        test('toolbar shows settings panel on click', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();

            // settings are visible
            await expect(card.getByTestId('settings-panel')).toBeVisible();
            await card.getByTestId('tab-visibility').click();
            await expect(card.getByTestId('visibility-show-on-web')).toBeVisible();
        });

        test('clicking on edit button transitions card into edit mode', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();

            await expect(card).toHaveAttribute('data-kg-card-editing', 'true');
        });

        test('visibility settings - defaults to show on email and web and all members', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();

            await expect(card.getByTestId('visibility-message')).not.toBeVisible();
        });

        test('can toggle visibility settings - show on web is off', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();
            await card.getByTestId('tab-visibility').click();
            await card.getByTestId('visibility-show-on-web-Toggle').click();

            await expect(card.getByTestId('visibility-message')).toContainText('Only shown in email');
        });

        test('can toggle visibility settings - show on email is off', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();
            await card.getByTestId('tab-visibility').click();
            await card.getByTestId('visibility-show-on-email-Toggle').click();

            await expect(card.getByTestId('visibility-message')).toContainText('Only shown on web');
        });

        test('can toggle visibility settings segments - free members', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();
            await card.getByTestId('tab-visibility').click();
            await card.getByTestId('visibility-dropdown-segment').click();
            await card.locator('[data-test-value="status:free"]').click();

            await expect(card.getByTestId('visibility-message')).toContainText('Shown on web, and to free members only in email');
        });

        test('can toggle visibility settings segments - paid members', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();
            await card.getByTestId('tab-visibility').click();
            await card.getByTestId('visibility-dropdown-segment').click();
            await card.locator('[data-test-value="status:-free"]').click();

            await expect(card.getByTestId('visibility-message')).toContainText('Shown on web, and to paid members only in email');
        });

        test('can toggle visibility settings segments - all members', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();
            await card.getByTestId('tab-visibility').click();
            await card.getByTestId('visibility-dropdown-segment').click();
            await card.locator('[data-test-value=""]').click();

            await expect(card.getByTestId('visibility-message')).not.toBeVisible();
        });

        test('can toggle visibility - disable everything', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();
            await card.getByTestId('tab-visibility').click();
            await card.getByTestId('visibility-show-on-web-Toggle').click();
            await card.getByTestId('visibility-show-on-email-Toggle').click();

            await expect(card.getByTestId('visibility-message')).toContainText('Hidden from both web and email');
        });

        test('can toggle visibility - member settings hidden when stripe is not enabled', async function () {
            await initialize({page, uri: '/#/?content=false&labs=contentVisibility&stripe=false'});
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();
            await card.getByTestId('tab-visibility').click();

            await expect(card.getByTestId('visibility-dropdown-segment')).not.toBeVisible();
        });

        test('can click toggle label to change visibility settings', async function () {
            const card = await insertHtmlCard();

            await card.getByTestId('edit-html').click();
            await card.getByTestId('tab-visibility').click();
            
            await expect(page.getByTestId('visibility-show-on-web-Toggle').locator('input')).toBeChecked();
            // click on the surrounding label rather than the inner label/input
            await page.getByTestId('visibility-show-on-web').click();
            await expect(page.getByTestId('visibility-show-on-web-Toggle').locator('input')).not.toBeChecked();
        });
    });
});
