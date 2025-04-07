import path from 'path';
import {CALLTOACTION_COLORS} from '../../../src/utils/callToActionColors.js';
import {assertHTML, createDataTransfer, focusEditor, getEditorStateJSON, html, initialize, insertCard} from '../../utils/e2e';
import {expect, test} from '@playwright/test';
import {fileURLToPath} from 'url';
import {selectCustomColor, selectNamedColor, selectTitledColor} from '../../utils/color-select-helper';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Call To Action Card', async () => {
    let page;
    let serializedTestCard;

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
    });

    test.beforeEach(async () => {
        await initialize({page, uri: '/#/?content=false&labs=contentVisibility'});

        serializedTestCard = {
            type: 'call-to-action',
            backgroundColor: 'green',
            buttonColor: '#F0F0F0',
            buttonText: 'Get access now',
            buttonTextColor: '#000000',
            buttonUrl: 'http://someblog.com/somepost',
            hasImage: true,
            hasSponsorLabel: true,
            sponsorLabel: '<p><span style="white-space: pre-wrap;">SPONSORED</span></p>',
            imageUrl: '/content/images/2022/11/koenig-lexical.jpg',
            layout: 'minimal',
            showButton: true,
            textValue: '<p><span style="white-space: pre-wrap;">This is a new CTA Card.</span></p>'
        };
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('can import serialized CTA card nodes', async function () {
        const contentParam = encodeURIComponent(JSON.stringify({
            root: {
                children: [serializedTestCard],
                direction: null,
                format: '',
                indent: 0,
                type: 'root',
                version: 1
            }
        }));

        await initialize({page, uri: `/#/?content=${contentParam}`});
        const ctaCardHtml = html`
<div data-lexical-decorator="true" contenteditable="false" data-koenig-dnd-draggable="true" data-koenig-dnd-droppable="true">
    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="call-to-action">
        <div data-cta-layout="minimal">
            <div>
                <p data-testid="sponsor-label">Sponsored</p>
            </div>
            <div>
                <div>
                    <img alt="Placeholder" src="/content/images/2022/11/koenig-lexical.jpg">
                </div>
                <div>
                    <div data-koenig-dnd-disabled="true" data-testid="cta-card-content-editor">
                        <div data-kg="editor">
                            <div contenteditable="false" role="textbox" spellcheck="true" data-lexical-editor="true" aria-autocomplete="none" aria-readonly="true">
                                <p dir="ltr">
                                    <span data-lexical-text="true">This is a new CTA Card.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div data-test-cta-button-current-url="http://someblog.com/somepost">
                        <button data-testid="cta-button" type="button">
                            <span data-testid="cta-button-span">Get access now</span>
                        </button>
                    </div>
                </div>
            </div>
            <div></div>
        </div>
        <div data-kg-card-toolbar="button">
            <ul>
                <li>
                    <button aria-label="Edit" data-kg-active="false" data-testid="edit-button-card" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m14.2 4.3 5.5 5.5m-11 11L1 23l2.2-7.7L16.856 1.644a2.2 2.2 0 0 1 3.11 0l2.39 2.39a2.2 2.2 0 0 1 0 3.11L8.7 20.8Z"></path>
                        </svg>
                    </button>
                </li>
                <li></li>
                <li>
                    <button aria-label="Save as snippet" data-kg-active="false" data-testid="create-snippet" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M22 13.667V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h9.667M22 13.667 13.667 22M22 13.667h-6.333a2 2 0 0 0-2 2V22"></path>
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</div>
`;
        await assertHTML(page, ctaCardHtml, {ignoreCardContents: true});
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

    test('button and button settings are visible by default', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        expect(await page.isVisible('[data-testid="cta-button"]')).toBe(true);
        expect(await page.isVisible('[data-testid="button-text"]')).toBe(true);
        expect(await page.isVisible('[data-testid="button-url"]')).toBe(true);
    });

    test('can toggle button on card and expands settings', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        expect(await page.isVisible('[data-testid="cta-button"]')).toBe(true);
        await page.click('[data-testid="button-settings"]');
        expect(await page.isVisible('[data-testid="cta-button"]')).toBe(false);

        await page.click('[data-testid="button-settings"]');

        expect(await page.isVisible('[data-testid="cta-button"]')).toBe(true);
    });

    test('can set button text', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.fill('[data-testid="button-text"]', 'Click me');
        expect(await page.textContent('[data-testid="cta-button"]')).toBe('Click me');
    });

    test('can set button url', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.fill('[data-testid="button-url"]', 'https://example.com/somepost');
        const buttonContainer = await page.$('[data-test-cta-button-current-url]');
        const currentUrl = await buttonContainer.getAttribute('data-test-cta-button-current-url');
        expect(currentUrl).toBe('https://example.com/somepost');
    });

    // NOTE: an improvement would be to pass in suggested url options, but the construction now doesn't make that straightforward
    test('suggested urls display', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});

        const buttonTextInput = await page.getByTestId('button-url');
        await expect(buttonTextInput).toHaveValue('');

        await page.getByTestId('button-url').fill('Home');
        await page.waitForSelector('[data-testid="button-url-listOption"]');

        await expect(await page.getByTestId('button-url-listOption')).toContainText('Homepage');
        await page.getByTestId('button-url-listOption').click();
        const buttonContainer = await page.$('[data-test-cta-button-current-url]');
        const currentUrl = await buttonContainer.getAttribute('data-test-cta-button-current-url');
        // current view can be any url, so check for a valid url
        const validUrlRegex = /^(https?:\/\/)([\w.-]+)(:[0-9]+)?(\/[\w.-]*)*(\?.*)?(#.*)?$/;
        // Assert the URL is valid
        expect(currentUrl).toMatch(validUrlRegex);
    });

    test('button doesnt disappear when toggled, has text, has url and loses focus', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.fill('[data-testid="button-text"]', 'Click me');
        await page.fill('[data-testid="button-url"]', 'https://example.com/somepost');
        expect(await page.isVisible('[data-testid="cta-button"]')).toBe(true);
        expect(await page.textContent('[data-testid="cta-button"]')).toBe('Click me');
        const buttonContainer = await page.$('[data-test-cta-button-current-url]');
        const currentUrl = await buttonContainer.getAttribute('data-test-cta-button-current-url');
        expect(currentUrl).toBe('https://example.com/somepost');

        // lose focus and editing mode
        await page.keyboard.press('Escape');
        await page.keyboard.press('Enter');

        // check if editing is false
        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="call-to-action">
                </div>
            </div>
            <p><br /></p>
            <p><br /></p>
        `, {ignoreCardContents: true});

        expect(await page.isVisible('[data-testid="cta-button"]')).toBe(true);
    });

    test('can toggle sponsor label', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.click('[data-testid="sponsor-label-toggle"]');
        expect(await page.isVisible('[data-testid="sponsor-label-editor"]')).toBe(false);
        await page.click('[data-testid="sponsor-label-toggle"]');
        expect(await page.isVisible('[data-testid="sponsor-label-editor"]')).toBe(true);
    });

    test('sponsor label is active by default', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        const sponsorLabel = await page.locator('[data-testid="sponsor-label-editor"]');
        await expect(sponsorLabel).toBeVisible();
    });

    test('sponsor label text is SPONSORED by default', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        const sponsorLabel = await page.locator('[data-testid="sponsor-label-editor"]');
        await expect(sponsorLabel).toContainText('SPONSORED');
    });

    test('can modify sponsor label text', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        const sponsorEditor = await page.locator('[data-testid="sponsor-label-editor"]');
        await page.click('[data-testid="sponsor-label-editor"]');
        // clear the default text by hitting backspace 9 times
        for (let i = 0; i < 9; i++) {
            await page.keyboard.press('Backspace');
        }
        await expect(sponsorEditor).toContainText('');
        await page.keyboard.type('Sponsored by Ghost');
        const content = page.locator('[data-testid="sponsor-label-editor"]');
        await expect(content).toContainText('Sponsored by Ghost');
    });

    test('content editor placeholder is visible', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        const contentEditor = await page.locator('[data-testid="cta-card-content-editor"]');
        await expect(contentEditor).toContainText('Write something worth clicking...');
    });

    test('can modify content editor text', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.click('[data-testid="cta-card-content-editor"]');
        await page.keyboard.type('This is a new CTA Card.');
        const content = page.locator('[data-testid="cta-card-content-editor"]');
        await expect(content).toContainText('This is a new CTA Card.');
    });

    test('can add and remove CTA Card image', async function () {
        const filePath = path.relative(process.cwd(), __dirname + `/../fixtures/large-image.jpeg`);

        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});

        const fileChooserPromise = page.waitForEvent('filechooser');

        await page.click('[data-testid="media-upload-placeholder"]');

        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles([filePath]);

        const imgLocator = page.locator('[data-kg-card="call-to-action"] img[src^="blob:"]');
        const imgElement = await imgLocator.first();
        await expect(imgElement).toHaveAttribute('src', /blob:/);
        await page.click('[data-testid="media-upload-remove"]');
        await expect(imgLocator).not.toBeVisible();
    });

    test('has a progress bar while uploading', async function () {
        const filePath = path.relative(process.cwd(), __dirname + `/../fixtures/large-image.jpeg`);

        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.click('[data-testid="media-upload-placeholder"]');
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles([filePath]);
        const progressBar = page.locator('[data-testid="progress-bar"]');
        await expect(progressBar).toBeVisible();

        const imgLocator = page.locator('[data-kg-card="call-to-action"] img[src^="blob:"]');
        const imgElement = await imgLocator.first();
        await expect(imgElement).toHaveAttribute('src', /blob:/);

        // check for progress bar to disappear

        await expect(progressBar).not.toBeVisible();
    });

    test('can drag and drop image over upload button', async function () {
        const filePath = path.relative(process.cwd(), __dirname + '/../fixtures/large-image.png');
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});

        // Create and dispatch data transfer
        const dataTransfer = await createDataTransfer(page, [{filePath, fileName: 'large-image.png', fileType: 'image/png'}]);
        await page.getByTestId('media-upload-placeholder').dispatchEvent('dragover', {dataTransfer});
        // Dragover text should be visible
        // check that "Drop it like it's hot" is visible
        await expect(await page.locator('[data-kg-card-drag-text="true"]')).toBeVisible();

        await page.getByTestId('media-upload-placeholder').dispatchEvent('drop', {dataTransfer});

        await expect (await page.getByTestId('cta-card-image')).toBeVisible();
    });

    test('has image preview', async function () {
        const filePath = path.relative(process.cwd(), __dirname + `/../fixtures/large-image.jpeg`);

        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});

        const fileChooserPromise = page.waitForEvent('filechooser');

        await page.click('[data-testid="media-upload-placeholder"]');

        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles([filePath]);

        await page.waitForSelector('[data-testid="media-upload-filled"]');
        const previewImage = await page.locator('[data-testid="media-upload-filled"] img');
        await expect(previewImage).toBeVisible();
    });

    test('default layout is minimal', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        // find data-cta-layout and check if it data-cta-layout="minimal"
        const firstChildSelector = '[data-kg-card="call-to-action"] > :first-child';
        await expect(page.locator(firstChildSelector)).toHaveAttribute('data-cta-layout', 'minimal');
    });

    test('can toggle layout to immersive', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.getByTestId('tab-design').click();
        await page.click('[data-testid="immersive-layout"]');
        const firstChildSelector = '[data-kg-card="call-to-action"] > :first-child';
        await expect(page.locator(firstChildSelector)).toHaveAttribute('data-cta-layout', 'immersive');
    });

    test('can toggle layout to immersive and then back to minimal', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.getByTestId('tab-design').click();
        await page.click('[data-testid="immersive-layout"]');
        const firstChildSelector = '[data-kg-card="call-to-action"] > :first-child';
        await expect(page.locator(firstChildSelector)).toHaveAttribute('data-cta-layout', 'immersive');

        await page.click('[data-testid="minimal-layout"]');
        await expect(page.locator(firstChildSelector)).toHaveAttribute('data-cta-layout', 'minimal');
    });

    test('alignment settings are hidden when layout is minimal', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.getByTestId('tab-design').click();

        // Verify alignment settings are not visible by default (minimal layout)
        await expect(page.getByTestId('left-align')).not.toBeVisible();
        await expect(page.getByTestId('center-align')).not.toBeVisible();
    });

    test('alignment settings are visible when layout is immersive', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.getByTestId('tab-design').click();
        await page.click('[data-testid="immersive-layout"]');

        // Verify alignment settings are now visible
        await expect(page.getByTestId('left-align')).toBeVisible();
        await expect(page.getByTestId('center-align')).toBeVisible();

        // Switch back to minimal layout and verify alignment settings are hidden
        await page.click('[data-testid="minimal-layout"]');
        await expect(page.getByTestId('left-align')).not.toBeVisible();
        await expect(page.getByTestId('center-align')).not.toBeVisible();
    });

    test('can change text alignment in immersive layout', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.click('[data-testid="cta-card-content-editor"]');
        await page.keyboard.type('Test content for alignment');
        await page.getByTestId('tab-design').click();
        await page.click('[data-testid="immersive-layout"]');

        // Test left alignment (default)
        const contentEditor = page.locator('[data-testid="cta-card-content-editor"]');
        await expect(contentEditor).toHaveClass(/text-left/);

        // Test center alignment
        await page.click('[data-testid="center-align"]');
        await expect(contentEditor).toHaveClass(/text-center/);

        // Test switching back to left alignment
        await page.click('[data-testid="left-align"]');
        await expect(contentEditor).toHaveClass(/text-left/);
    });

    test('can change background colors', async function () {
        const colors = ['none', 'white', 'grey', 'green', 'blue', 'yellow', 'red', 'pink', 'purple'];
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});

        await page.getByTestId('tab-design').click();

        const firstChildSelector = '[data-kg-card="call-to-action"] > :first-child';
        await expect(page.locator(firstChildSelector)).not.toHaveClass(/bg-(green|blue|yellow|red|pink|purple)/); // shouldn't have any of the classes yet
        for (const color of colors) {
            const colorOptionsButton = page.locator('[data-testid="cta-background-color-picker"] [data-testid="color-options-button"]');
            await colorOptionsButton.click();
            await selectNamedColor(page, color, null);
            const className = CALLTOACTION_COLORS[color];
            await expect(page.locator(firstChildSelector)).toHaveClass(new RegExp(className));
        }
    });

    test('background color popup closes on outside click', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});

        await page.getByTestId('tab-design').click();

        const colorOptions = page.getByTestId('cta-background-color-picker');
        await colorOptions.getByTestId('color-options-button').click();

        await expect(colorOptions.getByTestId('color-options-popover')).toBeVisible();

        await page.click('[data-testid="cta-link-color-picker"]');

        await expect(colorOptions.getByTestId('color-options-popover')).not.toBeVisible();
    });

    test('can change link color', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.getByTestId('tab-design').click();

        // Get the initial link color (should be text color by default)
        const ctaCard = await page.locator('[data-kg-card="call-to-action"] > :first-child');
        const initialColor = await ctaCard.evaluate(el => getComputedStyle(el).getPropertyValue('--cta-link-color'));
        expect(initialColor.trim()).toBe('#394047'); // Default text color

        // Change to accent color
        await page.locator('[data-testid="cta-link-color-picker"] button').click();
        await page.locator('[data-testid="color-picker-accent"]').click();
        const accentColor = await ctaCard.evaluate(el => getComputedStyle(el).getPropertyValue('--cta-link-color'));
        expect(accentColor.trim()).toBe('#ff0095'); // Default accent color

        // Change back to text color
        await page.locator('[data-testid="cta-link-color-picker"] button').click();
        await page.locator('[data-testid="color-picker-text"]').click();
        const finalColor = await ctaCard.evaluate(el => getComputedStyle(el).getPropertyValue('--cta-link-color'));
        expect(finalColor.trim()).toBe('#394047'); // Back to default text color
    });

    test('default button color is accent', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        expect(await page.getAttribute('[data-testid="cta-button"]', 'class')).toContain('bg-accent');
    });

    test('can change button color to black', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        // Switch to Design tab for button color settings
        await page.getByTestId('tab-design').click();

        const colorOptionsButton = page.locator('[data-testid="cta-button-color"] [data-testid="color-selector-button"]');
        await colorOptionsButton.click();
        await selectTitledColor(page, 'Black', null);
        // await cardBackgroundColorSettings(page, {cardColorPickerTestId: 'cta-button-color', findByColorTitle: 'Black'});

        expect(await page.getAttribute('[data-testid="cta-button"]', 'style')).toContain('background-color: rgb(0, 0, 0);');
    });

    test('can change button color to grey', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        // Switch to Design tab for button color settings
        await page.getByTestId('tab-design').click();
        const colorOptionsButton = page.locator('[data-testid="cta-button-color"] [data-testid="color-selector-button"]');
        await colorOptionsButton.click();
        await selectTitledColor(page, 'Grey', null);
        expect(await page.getAttribute('[data-testid="cta-button"]', 'style')).toContain('background-color: rgb(240, 240, 240);');
    });

    test('can use color picker to change button color', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.getByTestId('tab-design').click();
        const colorOptionsButton = page.locator('[data-testid="cta-button-color"] [data-testid="color-selector-button"]');
        await colorOptionsButton.click();
        await page.locator('[data-testid="color-picker-toggle"]').click();
        await selectCustomColor(page, 'ff0000', null);
        // await cardBackgroundColorSettings(page, {cardColorPickerTestId: 'cta-button-color', customColor: 'ff0000'});
        expect(await page.getAttribute('[data-testid="cta-button"]', 'style')).toContain('background-color: rgb(255, 0, 0);');
    });

    test('button text color changes with button color', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'call-to-action'});
        await page.getByTestId('tab-content').click();
        await page.fill('[data-testid="button-text"]', 'Click me');

        await page.getByTestId('tab-design').click();
        const colorOptionsButton = page.locator('[data-testid="cta-button-color"] [data-testid="color-selector-button"]');
        // await colorOptionsButton.click();
        // await selectTitledColor(page, 'Grey', null);
        // await cardBackgroundColorSettings(page, {cardColorPickerTestId: 'cta-button-color', customColor: 'FFFFFF'});
        expect(await page.getAttribute('[data-testid="cta-button"]', 'style')).toContain('color: rgb(255, 255, 255);');

        // change button color to black
        await colorOptionsButton.click();
        await selectTitledColor(page, 'Black', null);
        expect(await page.getAttribute('[data-testid="cta-button"]', 'style')).toContain('color: rgb(0, 0, 0);');
    });

    test('can change visibility settings', async function () {
        await focusEditor(page);
        const card = await insertCard(page, {cardName: 'call-to-action'});

        // switch to visibility settings
        await card.getByTestId('tab-visibility').click();

        // check visibility icon and toggles match default state
        await expect(page.getByTestId('visibility-indicator')).not.toBeVisible();
        await expect(card.getByTestId('visibility-toggle-web-nonMembers')).toBeChecked();
        await expect(card.getByTestId('visibility-toggle-web-freeMembers')).toBeChecked();
        await expect(card.getByTestId('visibility-toggle-web-paidMembers')).toBeChecked();
        await expect(card.getByTestId('visibility-toggle-email-freeMembers')).toBeChecked();
        await expect(card.getByTestId('visibility-toggle-email-paidMembers')).toBeChecked();

        // change toggles
        await card.getByTestId('visibility-toggle-web-paidMembers').click();
        await card.getByTestId('visibility-toggle-email-paidMembers').click();

        // visibility icon appears
        await expect(page.getByTestId('visibility-indicator')).toBeVisible();

        // serialized state gets updated
        const serializedState = JSON.parse(await getEditorStateJSON(page));
        expect(serializedState.root.children[0].visibility).toEqual({
            web: {
                nonMember: true,
                memberSegment: 'status:free'
            },
            email: {
                memberSegment: 'status:free'
            }
        });
    });

    test('can toggle settings from visibility icon', async function () {
        await focusEditor(page);
        const card = await insertCard(page, {cardName: 'call-to-action'});

        await page.fill('[data-testid="button-text"]', 'Click me');
        await page.fill('[data-testid="button-url"]', 'https://example.com/somepost');
        await card.getByTestId('tab-visibility').click();
        // activate visibility settings
        await card.getByTestId('visibility-toggle-web-nonMembers').click();

        await page.getByTestId('post-title').click();

        await page.getByTestId('visibility-indicator').click();
        await expect(page.getByTestId('settings-panel')).toBeVisible();
    });

    test('can toggle visibility settings from visibility icon', async function () {
        await focusEditor(page);
        const card = await insertCard(page, {cardName: 'call-to-action'});

        await page.fill('[data-testid="button-text"]', 'Click me');
        await page.fill('[data-testid="button-url"]', 'https://example.com/somepost');
        await card.getByTestId('tab-visibility').click();
        // activate visibility settings
        await card.getByTestId('visibility-toggle-web-nonMembers').click();

        await page.getByTestId('post-title').click();

        await page.getByTestId('visibility-indicator').click();
        await expect(page.getByTestId('settings-panel')).toBeVisible();
        await expect(page.getByTestId('tab-contents-visibility')).toBeVisible();
    });

    test('can import serialized visibility settings', async function () {
        const contentParam = encodeURIComponent(JSON.stringify({
            root: {
                children: [{
                    ...serializedTestCard,
                    visibility: {
                        web: {
                            nonMember: false,
                            memberSegment: 'status:free'
                        },
                        email: {
                            memberSegment: 'status:free'
                        }
                    }
                }],
                direction: null,
                format: '',
                indent: 0,
                type: 'root',
                version: 1
            }
        }));

        await initialize({page, uri: `/#/?content=${contentParam}&labs=contentVisibility`});

        // assert visibility icon is visible
        await expect(page.getByTestId('visibility-indicator')).toBeVisible();

        // put card into edit mode
        await page.dblclick('[data-kg-card="call-to-action"]');

        // check toggles match the serialized data
        await page.click('[data-testid="tab-visibility"]');
        await expect(page.getByTestId('visibility-toggle-web-nonMembers')).not.toBeChecked();
        await expect(page.getByTestId('visibility-toggle-web-freeMembers')).toBeChecked();
        await expect(page.getByTestId('visibility-toggle-web-paidMembers')).not.toBeChecked();
        await expect(page.getByTestId('visibility-toggle-email-freeMembers')).toBeChecked();
        await expect(page.getByTestId('visibility-toggle-email-paidMembers')).not.toBeChecked();
    });
});
