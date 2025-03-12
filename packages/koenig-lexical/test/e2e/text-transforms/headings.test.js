import {assertHTML, focusEditor, html, initialize} from '../../utils/e2e';
import {test} from '@playwright/test';

test.describe('Text transforms > Headings', async () => {
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

    test.describe('on blank paragraph', function () {
        const BASIC_TRANSFORMS = [{
            text: '# ',
            html: html`<h1><br /></h1>`
        }, {
            text: '# Test',
            html: html`<h1 dir="ltr"><span data-lexical-text="true">Test</span></h1>`
        }, {
            text: '## Test',
            html: html`<h2 dir="ltr"><span data-lexical-text="true">Test</span></h2>`
        }, {
            text: '### Test',
            html: html`<h3 dir="ltr"><span data-lexical-text="true">Test</span></h3>`
        }, {
            text: '#### Test',
            html: html`<h4 dir="ltr"><span data-lexical-text="true">Test</span></h4>`
        }, {
            text: '##### Test',
            html: html`<h5 dir="ltr"><span data-lexical-text="true">Test</span></h5>`
        }, {
            text: '###### Test',
            html: html`<h6 dir="ltr"><span data-lexical-text="true">Test</span></h6>`
        }, {
            text: '####### Test',
            html: html`<p dir="ltr"><span data-lexical-text="true">####### Test</span></p>`
        }];

        BASIC_TRANSFORMS.forEach((testCase) => {
            test(`${testCase.text} -> heading`, async function () {
                await focusEditor(page);
                await page.keyboard.type(testCase.text);
                await assertHTML(page, testCase.html);
            });
        });
    });

    test.describe('on paragraph with text', function () {
        test('"# " before plain text converts to heading', async function () {
            await focusEditor(page);
            await page.keyboard.type('existing text');
            await assertHTML(page, html`<p dir="ltr"><span data-lexical-text="true">existing text</span></p>`);

            // move caret to beginning of line via mouse
            const pHandle = await page.locator('div[contenteditable="true"] p');
            const pBox = await pHandle.boundingBox();
            await page.mouse.click(pBox.x + 1, pBox.y + 5);

            // type `# ` at beginning to convert to heading
            await page.keyboard.type('# ');
            await assertHTML(page, html`<h1 dir="ltr"><span data-lexical-text="true">existing text</span></h1>`);
        });

        test('"# " before formatted text converts to heading', async function () {
            await focusEditor(page);
            await page.keyboard.type('existing **formatted** text');
            await assertHTML(page, html`
                <p dir="ltr">
                    <span data-lexical-text="true">existing</span>
                    <strong data-lexical-text="true">formatted</strong>
                    <span data-lexical-text="true">text</span>
                </p>
            `);

            // move caret to beginning of line
            const pHandle = await page.locator('div[contenteditable="true"] p');
            const pBox = await pHandle.boundingBox();
            await page.mouse.click(pBox.x + 1, pBox.y + 5);

            // type `# ` at beginning to convert to heading
            await page.keyboard.type('# ');
            await assertHTML(page, html`
                <h1 dir="ltr">
                    <span data-lexical-text="true">existing</span>
                    <strong data-lexical-text="true">formatted</strong>
                    <span data-lexical-text="true">text</span>
                </h1>
            `);
        });
    });

    test.describe('on existing heading', function () {
        test('"# " before existing h1 text removes "# "', async function () {
            await focusEditor(page);
            await page.keyboard.type('# existing h1');
            await assertHTML(page, html`
                <h1 dir="ltr">
                    <span data-lexical-text="true">existing h1</span>
                </h1>
            `);

            // move caret to beginning of line
            const h1Handle = await page.locator('div[contenteditable="true"] h1');
            const h1Box = await h1Handle.boundingBox();
            await page.mouse.click(h1Box.x + 1, h1Box.y + 5);

            // type `# ` at beginning to convert to heading
            await page.keyboard.type('# ');
            await assertHTML(page, html`
                <h1 dir="ltr">
                    <span data-lexical-text="true">existing h1</span>
                </h1>
            `);
        });

        test('"# " before existing h2 text converts to h1', async function () {
            await focusEditor(page);
            await page.keyboard.type('## existing h2');
            await assertHTML(page, html`
                <h2 dir="ltr">
                    <span data-lexical-text="true">existing h2</span>
                </h2>
            `);

            // move caret to beginning of line
            const h2Handle = await page.locator('div[contenteditable="true"] h2');
            const h2Box = await h2Handle.boundingBox();
            await page.mouse.click(h2Box.x + 1, h2Box.y + 5);

            // type `# ` at beginning to convert to heading
            await page.keyboard.type('# ');
            await assertHTML(page, html`
                <h1 dir="ltr">
                    <span data-lexical-text="true">existing h2</span>
                </h1>
            `);
        });

        test('"##" before existing h1 text converts to h2', async function () {
            await focusEditor(page);
            await page.keyboard.type('# existing h1');
            await assertHTML(page, html`
                <h1 dir="ltr">
                    <span data-lexical-text="true">existing h1</span>
                </h1>
            `);

            // move caret to beginning of line
            const h1Handle = await page.locator('div[contenteditable="true"] h1');
            const h1Box = await h1Handle.boundingBox();
            await page.mouse.click(h1Box.x + 1, h1Box.y + 5);

            // type `## ` at beginning to convert to heading
            await page.keyboard.type('## ');
            await assertHTML(page, html`
                <h2 dir="ltr">
                    <span data-lexical-text="true">existing h1</span>
                </h2>
            `);
        });
    });

    test.describe('on lists', function () {
        // TODO: core lexical behaviour differs from our mobiledoc editor here
        test.skip('"# " before list item converts list to h1', async function () {
            await focusEditor(page);
            await page.keyboard.type('- list item');
            await assertHTML(page, html`
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">list item</span></li>
                </ul>
            `);

            // move caret to beginning of list item
            const liHandle = await page.locator('div[contenteditable="true"] li');
            const liBox = await liHandle.boundingBox();
            await page.mouse.click(liBox.x + 1, liBox.y + 5);

            // type `# ` at beginning to convert to heading
            await page.keyboard.type('# ');
            await assertHTML(page, html`
                <h1 dir="ltr">
                    <span data-lexical-text="true">list item</span>
                </h1>
            `);
        });
    });

    test.describe('on quotes', function () {
        test('"# " at beginning of blockquote converts to h1', async function () {
            await focusEditor(page);
            await page.keyboard.type('> ');
            await assertHTML(page, html`
                <blockquote><br /></blockquote>
            `);

            // move caret to beginning of quote
            const bqHandle = await page.locator('div[contenteditable="true"] blockquote');
            const bqBox = await bqHandle.boundingBox();
            await page.mouse.click(bqBox.x + 1, bqBox.y + 5);

            // type `# ` at beginning to convert to heading
            await page.keyboard.type('# ');
            await assertHTML(page, html`
                <h1><br /></h1>
            `);
        });

        // TODO: add aside node support
        //test.fixme('aside #\\s -> h1');
    });
});
