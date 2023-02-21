import {afterAll, beforeAll, describe, test} from 'vitest';
import {startApp, focusEditor, assertHTML, html, initialize, pasteText, pasteHtml, pasteLexical} from '../../utils/e2e';

describe('Restrict Content Plugin', async function () {
    let app;
    let page;

    beforeAll(async function () {
        ({app, page} = await startApp());
    });

    afterAll(async function () {
        await app.stop();
    });

    test('restricted content editor accepts input', async function () {
        await initialize({page, uri: '/contentrestricted/?paragraphs=1'});

        await focusEditor(page);

        await page.keyboard.type('Hello World');

        await assertHTML(page, html`
            <p dir="ltr"><span data-lexical-text="true">Hello World</span></p>
        `);
    });

    test('can not add more than specified number of paragraphs by typing manually', async function () {
        await initialize({page, uri: '/contentrestricted/?paragraphs=1'});

        await focusEditor(page);

        await page.keyboard.type('Hello World');
        await page.keyboard.press('Enter');

        await assertHTML(page, html`
            <p dir="ltr"><span data-lexical-text="true">Hello World</span></p>
        `);
    });

    test('can not add more than specified number of paragraphs by pasting plain text', async function () {
        await initialize({page, uri: '/contentrestricted/?paragraphs=1'});

        await focusEditor(page);

        await pasteText(page, 'Hello world \n Hello world');

        await assertHTML(page, html`
            <p dir="ltr"><span data-lexical-text="true">Hello world</span></p>
        `);
    });

    test('can not add more than specified number of paragraphs by pasting HTML', async function () {
        await initialize({page, uri: '/contentrestricted/?paragraphs=1'});

        await focusEditor(page);

        await pasteHtml(page, html`<p>Hello world</p><p>Hello world</p>`);

        await assertHTML(page, html`
            <p dir="ltr"><span data-lexical-text="true">Hello world</span></p>
        `);
    });

    test('can not add more than specified number of paragraphs by pasting Lexical', async function () {
        await initialize({page, uri: '/contentrestricted/?paragraphs=1'});

        await focusEditor(page);

        const content = {namespace: 'KoenigEditor',nodes: [{children: [{children: [{detail: 0,format: 0,mode: 'normal',style: '',text: 'This is the first line',type: 'text',version: 1}],direction: 'ltr',format: '',indent: 0,type: 'listitem',version: 1,value: 1},{children: [{children: [{children: [{detail: 0,format: 0,mode: 'normal',style: '',text: 'This is the second line',type: 'text',version: 1}],direction: 'ltr',format: '',indent: 1,type: 'listitem',version: 1,value: 1},{children: [{children: [{children: [{detail: 0,format: 0,mode: 'normal',style: '',text: 'This is the third line',type: 'text',version: 1}],direction: 'ltr',format: '',indent: 2,type: 'listitem',version: 1,value: 1}],direction: 'ltr',format: '',indent: 0,type: 'list',version: 1,listType: 'bullet',start: 1,tag: 'ul'}],direction: null,format: '',indent: 1,type: 'listitem',version: 1,value: 2}],direction: 'ltr',format: '',indent: 0,type: 'list',version: 1,listType: 'bullet',start: 1,tag: 'ul'}],direction: 'ltr',format: '',indent: 0,type: 'listitem',version: 1,value: 2}],direction: 'ltr',format: '',indent: 0,type: 'list',version: 1,listType: 'bullet',start: 1,tag: 'ul'},{children: [{detail: 0,format: 0,mode: 'normal',style: '',text: 'Here is a paragraph',type: 'text',version: 1}],direction: 'ltr',format: '',indent: 0,type: 'paragraph',version: 1}]};

        await pasteLexical(page, JSON.stringify(content));

        await assertHTML(page, html`
            <p dir="ltr"><span data-lexical-text="true">This is the first line</span></p>
        `);
    });

    test('can not add more than specified number of paragraphs when paragraphs > 1', async function () {
        await initialize({page, uri: '/contentrestricted/?paragraphs=3'});

        await focusEditor(page);

        await page.keyboard.type('Hello World');
        await page.keyboard.press('Enter');
        await page.keyboard.type('Hello World');
        await page.keyboard.press('Enter');
        await page.keyboard.type('Hello World');
        await page.keyboard.press('Enter');
        await page.keyboard.type('Hello World');

        await assertHTML(page, html`
            <p dir="ltr"><span data-lexical-text="true">Hello World</span></p>
            <p dir="ltr"><span data-lexical-text="true">Hello World</span></p>
            <p dir="ltr"><span data-lexical-text="true">Hello WorldHello World</span></p>
        `);
    });
});
