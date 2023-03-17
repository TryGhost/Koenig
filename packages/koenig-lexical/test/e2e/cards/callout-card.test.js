import {afterAll, beforeAll, beforeEach, describe, test} from 'vitest';
import {assertHTML, focusEditor, html, initialize, startApp} from '../../utils/e2e';
import {expect} from '@playwright/test';

describe('Callout Card', async () => {
    let app;
    let page;

    beforeAll(async () => {
        ({app, page} = await startApp());
    });

    afterAll(async () => {
        await app.stop();
    });

    beforeEach(async () => {
        await initialize({page});
    });

    test('can import serialized callout card nodes', async function () {
        await page.evaluate(() => {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'callout',
                        text: '<p dir="ltr"><span>Hello World</span></p>',
                        hasEmoji: true,
                        emojiValue: '😚',
                        backgroundColor: 'blue'
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
                <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="callout">
                </div>
            </div>
        `, {ignoreCardContents: true});
    });

    test('renders callout card', async function () {
        await focusEditor(page);
        await page.keyboard.type('/callout');
        await page.keyboard.press('Enter');

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="false" data-kg-card-selected="true" data-kg-card="callout">
                </div>
            </div>
            <p><br /></p>
        `, {ignoreCardContents: true});
    });

    test('can edit callout card', async function () {
        await focusEditor(page);
        await page.keyboard.type('/callout');
        await page.keyboard.press('Enter');

        await page.keyboard.type('Hello World');

        const calloutCard = await page.locator('[data-kg-card="callout"]');
        await expect(calloutCard).toContainText('💡Hello World ');
    });

    test('can toggle emoji', async function () {
        await focusEditor(page);
        await page.keyboard.type('/callout');
        await page.keyboard.press('Enter');

        // click <button data-testid="edit-callout-card"
        const editButton = await page.locator('[data-testid="edit-callout-card"]');
        await editButton.click();

        const toggle = await page.locator('[data-testid="emoji-toggle"]');
        await toggle.click();
        // click on data-kg-card="callout"
        await page.click('[data-kg-card="callout"]');
        await page.keyboard.type('Hello World');

        const calloutCard = await page.locator('[data-kg-card="callout"]');
        await expect(calloutCard).not.toContainText('💡');
    });
});
