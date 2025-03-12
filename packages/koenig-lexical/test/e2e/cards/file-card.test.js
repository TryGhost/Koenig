import path from 'path';
import {assertHTML, createDataTransfer, focusEditor, html, initialize, insertCard} from '../../utils/e2e';
import {expect, test} from '@playwright/test';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('File card', async () => {
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

    test('can import serialized file card nodes', async function () {
        await page.evaluate(() => {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'file',
                        src: '/content/images/2022/11/koenig-lexical.jpg',
                        fileTitle: 'This is a title',
                        fileCaption: 'This is a description',
                        fileName: 'koenig-lexical.jpg',
                        fileSize: '1.2 MB'
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

        // page.pause();
        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="file">
                </div>
            </div>
        `, {ignoreCardContents: true});
    });

    test('renders file card node', async function () {
        const filePath = path.relative(process.cwd(), __dirname + '/../fixtures/print-img.pdf');

        await focusEditor(page);
        const fileChooserPromise = page.waitForEvent('filechooser');
        await insertCard(page, {cardName: 'file'});
        const fileChooser = await fileChooserPromise;

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="file"></div>
            </div>
            <p><br /></p>
        `, {ignoreCardContents: true});

        // Close the fileChooser by selecting a file
        // Without this line, fileChooser stays open for subsequent tests
        await fileChooser.setFiles([filePath]);
    });

    test('can upload a file', async function () {
        await focusEditor(page);
        await uploadFile(page);

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="file">
                </div>
            </div>
            <p><br /></p>
        `, {ignoreCardContents: true}); // TODO: assert on HTML of inner card (not working due to error in prettier)
    });

    test('can upload dropped file', async function () {
        const filePath = path.relative(process.cwd(), __dirname + '/../fixtures/print-img.pdf');
        const fileChooserPromise = page.waitForEvent('filechooser');

        await focusEditor(page);

        // Open file card and dismiss files chooser to prepare card for file dropping
        await insertCard(page, {cardName: 'file'});
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles([]);

        // Create and dispatch data transfer
        const dataTransfer = await createDataTransfer(page, [{filePath, fileName: 'print-img.pdf', fileType: 'application/pdf'}]);
        await page.getByTestId('media-placeholder').dispatchEvent('dragover', {dataTransfer});

        // Dragover text should be visible
        await expect(await page.locator('[data-kg-card-drag-text="true"]')).toBeVisible();

        // Drop file
        await page.getByTestId('media-placeholder').dispatchEvent('drop', {dataTransfer});

        // Dragover text should not be visible
        // expect data-kg-file-card="dataset
        await expect(await page.locator('[data-kg-file-card="dataset"]')).toBeVisible();
    });

    test('file input opens immediately when added via card menu', async function () {
        await focusEditor(page);
        await page.click('[data-kg-plus-button]');
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            page.click('[data-kg-card-menu-item="File"]')
        ]);

        expect(fileChooser).not.toBeNull();
    });

    test('file input opens immediately when added via slash menu', async function () {
        await focusEditor(page);
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            await insertCard(page, {cardName: 'file'})
        ]);

        expect(fileChooser).not.toBeNull();
    });

    test('can edit file card title', async function () {
        await focusEditor(page);
        await uploadFile(page);
        await page.locator('[data-kg-file-card="fileTitle"]').fill('Free printable pdf');
        await expect(await page.locator('[data-kg-file-card="fileTitle"]')).toHaveValue('Free printable pdf');
    });

    test('can edit file card description', async function () {
        await focusEditor(page);
        await uploadFile(page);
        await page.locator('[data-kg-file-card="fileDescription"]').fill('Enjoy this free download of a puppy pdf');
        await expect(await page.locator('[data-kg-file-card="fileDescription"]')).toHaveValue('Enjoy this free download of a puppy pdf');
    });
});

async function uploadFile(page, fileName = 'print-img.pdf') {
    const filePath = path.relative(process.cwd(), __dirname + `/../fixtures/${fileName}`);

    const fileChooserPromise = page.waitForEvent('filechooser');
    await insertCard(page, {cardName: 'file'});
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([filePath]);
}
