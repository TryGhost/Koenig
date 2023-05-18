import path from 'path';
import {assertHTML, focusEditor, html, initialize} from '../../utils/e2e';
import {expect, test} from '@playwright/test';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createHeaderCard({page}) {
    await focusEditor(page);
    await page.keyboard.type('/header');
    await page.waitForSelector('[data-kg-card-menu-item="Header"][data-kg-cardmenu-selected="true"]');
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-kg-card="header"]');
}

test.describe('Header card', async () => {
    test.beforeEach(async ({page}) => {
        await initialize({page});
    });

    test('can import serialized header card nodes', async function ({page}) {
        await page.evaluate(() => {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'header',
                        size: 'small',
                        style: 'image',
                        buttonEnabled: false,
                        buttonUrl: '',
                        buttonText: '',
                        header: '<span>hello world</span>',
                        subheader: '<span>hello sub</span>',
                        backgroundImageSrc: 'blob:http://localhost:5173/fa0956a8-5fb4-4732-9368-18f9d6d8d25a'
                    }],
                    direction: null,
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1
                }
            });
            const editor = window.lexicalEditor;
            const editorState = editor.parseEditorState(serializedState);
            editor.setEditorState(editorState);
        });

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
            <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="header">
                <div>
                    <div>
                        <div data-kg="editor">
                        <div
                            contenteditable="false"
                            spellcheck="true"
                            data-lexical-editor="true"
                            aria-autocomplete="none">
                            <p dir="ltr"><span data-lexical-text="true">hello world</span></p>
                        </div>
                        </div>
                    </div>
                    <div>
                        <div data-kg="editor">
                        <div
                            contenteditable="false"
                            spellcheck="true"
                            data-lexical-editor="true"
                            aria-autocomplete="none">
                            <p dir="ltr"><span data-lexical-text="true">hello sub</span></p>
                        </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
            </div>
        `, {});
    });

    test('renders header card node', async function ({page}) {
        await createHeaderCard({page});

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="header">
                </div>
            </div>
            <p><br /></p>
        `, {ignoreCardContents: true});
    });

    test('can edit header', async function ({page}) {
        await createHeaderCard({page});

        await page.keyboard.type('Hello world');
        const firstEditor = page.locator('[data-kg-card="header"] [data-kg="editor"]').nth(0);
        await expect(firstEditor).toHaveText('Hello world');
    });

    test('can edit sub header', async function ({page}) {
        await createHeaderCard({page});

        await page.keyboard.type('Hello world');

        await page.keyboard.press('Enter');
        await page.keyboard.type('Hello subheader');

        const firstEditor = page.locator('[data-kg-card="header"] [data-kg="editor"]').nth(0);
        const secondEditor = page.locator('[data-kg-card="header"] [data-kg="editor"]').nth(1);

        await expect(firstEditor).toHaveText('Hello world');
        await expect(secondEditor).toHaveText('Hello subheader');
    });

    test('can edit sub header via arrow keys', async function ({page}) {
        await createHeaderCard({page});

        await page.keyboard.type('Hello');

        await page.keyboard.press('ArrowDown');
        await page.keyboard.type('blah blah blah something very long');

        // Go back up again and add an extra word
        await page.keyboard.press('ArrowUp');
        await page.keyboard.type(' world');

        const firstEditor = page.locator('[data-kg-card="header"] [data-kg="editor"]').nth(0);
        const secondEditor = page.locator('[data-kg-card="header"] [data-kg="editor"]').nth(1);

        await expect(firstEditor).toHaveText('Hello world');
        await expect(secondEditor).toHaveText('blah blah blah something very long');
    });

    test('can add and remove button', async function ({page}) {
        await createHeaderCard({page});

        // click on the toggle with data-testid="header-button-toggle"
        await page.click('[data-testid="header-button-toggle"]');

        // check button is visible
        await expect(page.getByTestId('header-card-button')).toHaveText('Add button text');

        // Enter some text for the button in data-testid="header-button-text"
        await page.click('[data-testid="header-button-text"]');
        await page.keyboard.type('Click me');

        // Enter some url for the button in data-testid="header-button-url"
        await page.click('[data-testid="header-button-url"]');
        await page.keyboard.type('https://example.com');

        // check button is visible, and not an <a> tag (so not clickable)
        // Page contains `<button type="button"><span>Click me</span></button>`
        await expect(page.getByTestId('header-card-button')).toHaveText('Click me');

        // Can toggle button off again
        await page.click('[data-testid="header-button-toggle"]');

        // check button is not visible by using expect
        await expect(page.getByTestId('header-card-button')).toHaveCount(0);
    });

    test('can change the size', async function ({page}) {
        await createHeaderCard({page});

        // Check that the default size is small
        await expect(page.getByLabel('S')).toHaveClass(/ bg-white /);
        await expect(page.getByLabel('M')).not.toHaveClass(/ bg-white /);

        // Get height of the card
        const box = await page.locator('[data-kg-card="header"] > div:first-child').nth(0).boundingBox();
        const height = box.height;

        // Click on the medium button
        await page.getByLabel('M').click();
        await expect(page.getByLabel('M')).toHaveClass(/ bg-white /);

        // Check that the height has changed
        const box2 = await page.locator('[data-kg-card="header"] > div:first-child').nth(0).boundingBox();
        const height2 = box2.height;

        expect(height2).toBeGreaterThan(height);

        // Switch to large
        const largeButton = page.locator('[aria-label="L"]');
        await largeButton.click();
        await expect(largeButton).toHaveClass(/ bg-white /);

        // Check that the height has changed
        const box3 = await page.locator('[data-kg-card="header"] > div:first-child').nth(0).boundingBox();
        const height3 = box3.height;

        expect(height3).toBeGreaterThan(height2);
    });

    test('can change the background color', async function ({page}) {
        await createHeaderCard({page});

        const lightButton = page.locator('[aria-label="Light"]');
        const darkButton = page.locator('[aria-label="Dark"]');
        const accentButton = page.locator('[aria-label="Accent"]');

        // Default class should be 'bg-black' on the card
        await expect(page.locator('[data-kg-card="header"] > div:first-child')).toHaveClass(/ bg-black /);

        // Switch to light
        await lightButton.click();

        // Check that the background color has changed
        await expect(page.locator('[data-kg-card="header"] > div:first-child')).toHaveClass(/ bg-grey-100 /);

        // Switch back to dark
        await darkButton.click();

        // Check that the background color has changed
        await expect(page.locator('[data-kg-card="header"] > div:first-child')).toHaveClass(/ bg-black /);

        // Switch to accent
        await accentButton.click();

        // Check that the background color has changed
        await expect(page.locator('[data-kg-card="header"] > div:first-child')).toHaveClass(/ bg-accent /);
    });

    test('can add and remove background image', async function ({page}) {
        const filePath = path.relative(process.cwd(), __dirname + `/../fixtures/large-image.jpeg`);

        await createHeaderCard({page});

        const fileChooserPromise = page.waitForEvent('filechooser');

        // Click data-testid="background-image-color-button"
        await page.click('[data-testid="background-image-color-button"]');

        // Set files
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles([filePath]);

        // Check if it is set as a background image
        await expect(page.locator('[data-kg-card="header"] > div:first-child')).toHaveCSS('background-image', /blob:/);

        // Check if it is also set as an image in the panel
        await expect(page.getByTestId('image-picker-background')).toHaveAttribute('src', /blob:/);
    });

    test('can select the text by dragging and replace it', async function ({page}) {
        await createHeaderCard({page});

        await page.keyboard.type('HelloHello');

        // Get locator to 'Hello Hello' span
        const helloSpan = page.locator('[data-kg-card="header"] [data-kg="editor"] span').nth(0);

        // Get the bounding box of the span
        const box = await helloSpan.boundingBox();
        const y = box.y + box.height / 2;
        const startX = box.x + box.width / 2;
        const endX = box.x + box.width;

        await page.mouse.move(startX, y);
        await page.mouse.down();
        await page.mouse.move(endX, y);
        await page.mouse.up();

        await page.keyboard.type(' world');
        await expect(page.locator('[data-kg-card="header"] [data-kg="editor"]').nth(0)).toHaveText('Hello world');
    });

    test('can select the text by dragging and bold it', async function ({page}) {
        await createHeaderCard({page});

        await page.keyboard.type('HelloHello');

        // Get locator to 'Hello Hello' span
        const helloSpan = page.locator('[data-kg-card="header"] [data-kg="editor"] span').nth(0);

        // Get the bounding box of the span
        const box = await helloSpan.boundingBox();
        const y = box.y + box.height / 2;
        const startX = box.x + box.width / 2;
        const endX = box.x + box.width;

        await page.mouse.move(startX, y);
        await page.mouse.down();
        await page.mouse.move(endX, y);
        await page.mouse.up();

        // click data-kg-toolbar-button="bold"
        await page.locator('[data-kg-toolbar-button="bold"]').click();

        // check it is now bold
        const boldSpan = page.locator('[data-kg-card="header"] [data-kg="editor"] strong').nth(0);
        await expect(boldSpan).toHaveText('Hello');
        await expect(helloSpan).toHaveText('Hello');

        // check if text is still selected by continuing typing
        await page.keyboard.type(' world');

        // check the typed text is still bold
        await expect(boldSpan).toHaveText(' world');
        await expect(helloSpan).toHaveText('Hello');
    });

    test('keeps focus on previous editor when changing size opts', async function ({page}) {
        await createHeaderCard({page});

        // Start editing the header
        await page.keyboard.type('Hello ');

        // Change size to medium
        await page.getByLabel('M').click();

        // Continue editing the subheader
        await page.keyboard.type('world');

        // Expect header to have 'Hello World'
        const header = page.locator('[data-kg-card="header"] [data-kg="editor"]').nth(0);
        await expect(header).toHaveText('Hello world');
    });
});
