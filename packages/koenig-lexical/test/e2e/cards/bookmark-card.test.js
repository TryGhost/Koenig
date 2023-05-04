import {assertHTML, createSnippet, focusEditor, html, initialize, insertCard} from '../../utils/e2e';
import {expect, test} from '@playwright/test';

test.describe('Bookmark card', async () => {
    test.beforeEach(async ({page}) => {
        await initialize({page});
    });

    test('can import serialized bookmark card nodes', async function ({page}) {
        await page.evaluate(() => {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'bookmark',
                        url: 'https://www.ghost.org/',
                        icon: 'https://www.ghost.org/favicon.ico',
                        title: 'Ghost: The Creator Economy Platform',
                        description: 'lorem ipsum dolor amet lorem ipsum dolor amet',
                        author: 'ghost',
                        publisher: 'Ghost - The Professional Publishing Platform',
                        thumbnail: 'https://ghost.org/images/meta/ghost.png',
                        caption: 'caption here'
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
                <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="bookmark">
                </div>
            </div>
        `, {ignoreCardContents: true});
    });

    test('renders bookmark card node', async function ({page}) {
        await focusEditor(page);
        await insertCard(page, {cardName: 'bookmark'});

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="bookmark"></div>
            </div>
            <p><br /></p>
        `, {ignoreCardContents: true});
    });

    test('can interact with url input after inserting', async function ({page}) {
        await focusEditor(page);
        await insertCard(page, {cardName: 'bookmark'});

        const urlInput = await page.getByTestId('bookmark-url');
        await expect(urlInput).toHaveAttribute('placeholder','Paste URL to add bookmark content...');

        await urlInput.fill('test');
        await expect(urlInput).toHaveValue('test');
    });

    test.describe('Valid URL handling', async () => {
        test('shows loading wheel', async function ({page}) {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});

            const urlInput = await page.getByTestId('bookmark-url');
            await urlInput.fill('https://ghost.org/');
            await urlInput.press('Enter');

            await expect(await page.getByTestId('bookmark-url-loading-container')).toBeVisible();
            await expect(await page.getByTestId('bookmark-url-loading-spinner')).toBeVisible();
        });

        test('displays expected metadata', async function ({page}) {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});

            const urlInput = await page.getByTestId('bookmark-url');
            await urlInput.fill('https://ghost.org/');
            await urlInput.press('Enter');

            await expect(await page.getByTestId('bookmark-title')).toHaveText('Ghost: The Creator Economy Platform');
            await expect(await page.getByTestId('bookmark-description')).toContainText('The former of the two songs addresses the issue of negative rumors in a relationship, while the latter, with a more upbeat pulse, is a classic club track; the single is highlighted by a hyped bridge.');
            await expect(await page.getByTestId('bookmark-publisher')).toContainText('Ghost - The Professional Publishing Platform');
        });

        // TODO: the caption editor is very nested, and we don't have an actual input field here, so we aren't testing for filling it
        test('caption displays on insert', async function ({page}) {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});

            const urlInput = await page.getByTestId('bookmark-url');
            await urlInput.fill('https://ghost.org/');
            await urlInput.press('Enter');

            const captionInput = await page.getByTestId('bookmark-caption');
            await expect(captionInput).toContainText('Type caption for bookmark (optional)');
        });
    });

    test.describe('Error Handling', async () => {
        test('bad url entry shows error message', async function ({page}) {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});

            const urlInput = await page.getByTestId('bookmark-url');
            await urlInput.fill('badurl');
            await expect(urlInput).toHaveValue('badurl');
            await urlInput.press('Enter');

            await expect(await page.getByTestId('bookmark-url-error-message')).toContainText('There was an error when parsing the URL.');
        });

        test('retry button bring back url input', async function ({page}) {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});

            const urlInput = await page.getByTestId('bookmark-url');
            await expect(urlInput).toHaveAttribute('placeholder','Paste URL to add bookmark content...');

            await urlInput.fill('badurl');
            await expect(urlInput).toHaveValue('badurl');
            await urlInput.press('Enter');

            const retryButton = await page.getByTestId('bookmark-url-error-retry');
            await retryButton.click();

            const urlInputRetry = await page.getByTestId('bookmark-url');
            await expect(urlInputRetry).toHaveValue('badurl');
            await expect(retryButton).not.toBeVisible();
        });

        // todo: test is failing, need to figure if the error in test logic or on code
        test.skip('paste as link button removes card and inserts text node link', async function ({page}) {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});

            const urlInput = await page.getByTestId('bookmark-url');
            await expect(urlInput).toHaveAttribute('placeholder','Paste URL to add bookmark content...');

            await urlInput.fill('badurl');
            await expect(urlInput).toHaveValue('badurl');
            await urlInput.press('Enter');

            const retryButton = await page.getByTestId('bookmark-url-error-pasteAsLink');
            await retryButton.click();

            await assertHTML(page, html`
                <p>
                    <a href="badurl" dir="ltr"><span data-lexical-text="true">badurl</span></a>
                </p>
                <p><br /></p>
            `);
        });

        test('close button removes card', async function ({page}) {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});

            const urlInput = await page.getByTestId('bookmark-url');
            await expect(urlInput).toHaveAttribute('placeholder','Paste URL to add bookmark content...');

            await urlInput.fill('badurl');
            await expect(urlInput).toHaveValue('badurl');
            await urlInput.press('Enter');

            const retryButton = await page.getByTestId('bookmark-url-error-close');
            await retryButton.click();

            await assertHTML(page, html`<p><br /></p>`);
        });
    });

    test('can add snippet', async function ({page}) {
        await focusEditor(page);
        await insertCard(page, {cardName: 'bookmark'});

        const urlInput = await page.getByTestId('bookmark-url');
        await urlInput.fill('https://ghost.org/');
        await urlInput.press('Enter');
        await expect(await page.getByTestId('bookmark-description')).toBeVisible();

        // create snippet
        await page.keyboard.press('Escape');
        await createSnippet(page);

        // can insert card from snippet
        await page.keyboard.press('Enter');
        await page.keyboard.type('/snippet');
        await page.waitForSelector('[data-kg-cardmenu-selected="true"]');
        await page.keyboard.press('Enter');
        await expect(await page.locator('[data-kg-card="bookmark"]')).toHaveCount(2);
    });
});
