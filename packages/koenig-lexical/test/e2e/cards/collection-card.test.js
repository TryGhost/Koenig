import {assertHTML, focusEditor, html, initialize, insertCard} from '../../utils/e2e';
import {expect, test} from '@playwright/test';

test.describe('Collection Card', async () => {
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

    test('can import serialized collection card nodes', async function () {
        await page.evaluate(() => {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'collection',
                        collection: {slug: 'index'},
                        postCount: 3,
                        layout: 'grid',
                        columns: 3,
                        header: 'Latest'
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
            <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="collection">
            </div>
        </div>
        `, {ignoreCardContents: true});
    });

    test('renders collection card', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'collection'});

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="collection">
                </div>
            </div>
            <p><br /></p>
        `, {ignoreCardContents: true});
    });

    test('has settings panel', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'collection'});

        await expect(await page.getByTestId('collection-dropdown')).toBeVisible();
        await expect(await page.getByTestId('collection-layout-list')).toBeVisible();
        await expect(await page.getByTestId('collection-layout-grid')).toBeVisible();
        await expect(await page.getByTestId('collection-postCount-slider')).toBeVisible();
        await expect(await page.getByTestId('collection-columns-slider')).toBeVisible();
    });

    test('layout buttons work', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'collection'});

        // grid by default - no notable class for this change
        const collectionCard = await page.getByTestId('collection-post-container');
        await expect(collectionCard).toHaveClass('grid w-full grid-cols-3 gap-8');

        const leftAligncollection = await page.getByTestId('collection-layout-list');
        leftAligncollection.click();
        await expect(collectionCard).toHaveClass(/grid w-full gap-5/);

        const centerAligncollection = await page.getByTestId('collection-layout-grid');
        centerAligncollection.click();
        await expect(collectionCard).toHaveClass(/grid w-full grid-cols-3 gap-8/);
    });
    // more tests
    // test sliders somehow?
    //  post count
    //  columns

    // test dropdown

    // test loader

    // test placeholder?

    // test header editor

    // test snippet?
});
