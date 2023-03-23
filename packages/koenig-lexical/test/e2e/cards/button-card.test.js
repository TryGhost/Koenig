import {afterAll, beforeAll, beforeEach, describe, test} from 'vitest';
import {assertHTML, focusEditor, html, initialize, startApp} from '../../utils/e2e';
import {expect} from '@playwright/test';

describe('Button Card', async () => {
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

    test('can import serialized button card nodes', async function () {
        await page.evaluate(() => {
            const serializedState = JSON.stringify({
                root: {
                    children: [{
                        type: 'button',
                        buttonUrl: 'http://someblog.com/somepost',
                        buttonText: 'button text',
                        alignment: 'center'
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
            <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="button">
            </div>
        </div>
        `, {ignoreCardContents: true});
    });

    test('renders button card', async function () {
        await focusEditor(page);
        await page.keyboard.type('/button');
        await page.keyboard.press('Enter');

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="button">
                </div>
            </div>
            <p><br /></p>
        `, {ignoreCardContents: true});
    });

    test('has settings panel', async function () {
        await focusEditor(page);
        await page.keyboard.type('/button');
        await page.keyboard.press('Enter');

        await expect(await page.getByTestId('settings-panel')).toBeVisible();
        await expect(await page.getByTestId('button-align-left')).toBeVisible();
        await expect(await page.getByTestId('button-align-center')).toBeVisible();
        await expect(await page.getByTestId('button-text-input')).toBeVisible();
        await expect(await page.getByTestId('button-text-url')).toBeVisible();
    });

    test('alignment buttons work', async function () {
        await focusEditor(page);
        await page.keyboard.type('/button');
        await page.keyboard.press('Enter');

        // align center by default
        const buttonCard = await page.getByTestId('button-card');
        await expect(buttonCard).toHaveClass(/justify-center/);

        const leftAlignButton = await page.getByTestId('button-align-left');
        leftAlignButton.click();
        await expect(buttonCard).toHaveClass(/justify-start/);

        const centerAlignButton = await page.getByTestId('button-align-center');
        centerAlignButton.click();
        await expect(buttonCard).toHaveClass(/justify-center/);
    });

    test('default settings are appropriate', async function () {
        await focusEditor(page);
        await page.keyboard.type('/button');
        await page.keyboard.press('Enter');

        const button = await page.getByTestId('button-card-btn');
        await expect(button).toHaveAttribute('placeholder','Add button text');
        const buttonTextInput = await page.getByTestId('button-text-input');
        await expect(buttonTextInput).toHaveAttribute('placeholder','Add button text');
        const buttonUrlInput = await page.getByTestId('button-text-url');
        await expect(buttonUrlInput).toHaveAttribute('placeholder','https://yoursite.com/#/portal/signup/');
    });

    // TODO: debug why .click() doesn't work on the locator
    // test('text input field works', async function () {
    //     await focusEditor(page);
    //     await page.keyboard.type('/button');
    //     await page.keyboard.press('Enter');

    //     // verify default values
    //     const button = await page.getByTestId('button-card-btn');
    //     await expect(button).toHaveAttribute('value','');

    //     const buttonTextInput = await page.getByTestId('button-text-input');
    //     await expect(buttonTextInput).toHaveValue('test');

    //     // await page.getByTestId('button-text-input').click();
    //     const box = await page.getByTestId('button-text-input').boundingBox();
    //     await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    //     await page.keyboard.type('test');
    //     await expect(buttonTextInput).toHaveValue('test');
    //     await expect(button).toHaveAttribute('value','test');
    // });

    // TODO: test for the url input
    // TODO: test suggested urls
});
