import {assertHTML, assertSelection, focusEditor, html, initialize} from '../utils/e2e';
import {test} from '@playwright/test';

test.describe('List behaviour', async () => {
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

    test.describe('BACKSPACE', function () {
        test('at beginning of populated list item after paragraph', async function () {
            await focusEditor(page);
            await page.keyboard.type('Paragraph');
            await page.keyboard.press('Enter');
            await page.keyboard.type('- first li');
            await page.keyboard.press('Enter');
            await page.keyboard.type('second li');

            // sanity check - contents are as we expect
            await assertHTML(page, html`
                <p dir="ltr"><span data-lexical-text="true">Paragraph</span></p>
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">first li</span></li>
                    <li value="2" dir="ltr"><span data-lexical-text="true">second li</span></li>
                </ul>
            `);

            await page.keyboard.press('ArrowUp');
            for (let i = 0; i < 'first li'.length; i++) {
                await page.keyboard.press('ArrowLeft');
            }

            // sanity check - cursor is at beginning of list
            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [1,0,0,0],
                focusOffset: 0,
                focusPath: [1,0,0,0]
            });

            // should convert list item to a paragraph
            await page.keyboard.press('Backspace');

            // first list item converted to a paragraph
            await assertHTML(page, html`
                <p dir="ltr"><span data-lexical-text="true">Paragraph</span></p>
                <p dir="ltr"><span data-lexical-text="true">first li</span></p>
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">second li</span></li>
                </ul>
            `);

            // selection is at beginning of li->p paragraph
            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [1,0,0],
                focusOffset: 0,
                focusPath: [1,0,0]
            });

            // pressing again reverts to default Lexical behaviour of smushing paragraphs
            await page.keyboard.press('Backspace');

            await assertHTML(page, html`
                <p dir="ltr"><span data-lexical-text="true">Paragraphfirst li</span></p>
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">second li</span></li>
                </ul>
            `);
        });

        test('at beginning of populated list after card', async function () {
            await focusEditor(page);
            await page.keyboard.type('---');
            await page.keyboard.type('- first li');
            await page.keyboard.press('Enter');
            await page.keyboard.type('second li');

            // sanity check - contents are as we expect
            await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="horizontalrule"><hr /></div>
                </div>
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">first li</span></li>
                    <li value="2" dir="ltr"><span data-lexical-text="true">second li</span></li>
                </ul>
            `);

            await page.keyboard.press('ArrowUp');
            for (let i = 0; i < 'first li'.length; i++) {
                await page.keyboard.press('ArrowLeft');
            }

            // sanity check - cursor is at beginning of list
            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [1,0,0,0],
                focusOffset: 0,
                focusPath: [1,0,0,0]
            });

            // should convert list item to a paragraph
            await page.keyboard.press('Backspace');

            // first list item converted to a paragraph
            await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="horizontalrule"><hr /></div>
                </div>
                <p dir="ltr"><span data-lexical-text="true">first li</span></p>
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">second li</span></li>
                </ul>
            `);
        });

        test('at beginning of populated list-item mid list', async function () {
            await focusEditor(page);
            await page.keyboard.type('- first li');
            await page.keyboard.press('Enter');
            await page.keyboard.type('second li');
            await page.keyboard.press('Enter');
            await page.keyboard.type('third li');

            for (let i = 0; i < 'third li'.length; i++) {
                await page.keyboard.press('ArrowLeft');
            }
            await page.keyboard.press('ArrowUp');

            // sanity check - cursor is at beginning of second list item
            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [0,1,0,0],
                focusOffset: 0,
                focusPath: [0,1,0,0]
            });

            // should split list converting second li to paragraph
            await page.keyboard.press('Backspace');

            await assertHTML(page, html`
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">first li</span></li>
                </ul>
                <p dir="ltr"><span data-lexical-text="true">second li</span></p>
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">third li</span></li>
                </ul>
            `);

            // selection is at beginning of the converted paragraph
            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [1,0,0],
                focusOffset: 0,
                focusPath: [1,0,0]
            });
        });

        test('on empty list item after paragraph', async function () {
            await focusEditor(page);
            await page.keyboard.type('First paragraph');
            await page.keyboard.press('Enter');
            await page.keyboard.type('- ');

            // sanity check
            await assertHTML(page, html`
                <p dir="ltr"><span data-lexical-text="true">First paragraph</span></p>
                <ul>
                    <li value="1"><br /></li>
                </ul>
            `);

            // should convert list to a paragraph
            await page.keyboard.press('Backspace');

            await assertHTML(page, html`
                <p dir="ltr"><span data-lexical-text="true">First paragraph</span></p>
                <p><br /></p>
            `);

            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [1],
                focusOffset: 0,
                focusPath: [1]
            });
        });

        test('on empty list item at end of list', async function () {
            await focusEditor(page);
            await page.keyboard.type('- first li');
            await page.keyboard.press('Enter');

            // should convert last list item to empty paragraph
            await page.keyboard.press('Backspace');

            await assertHTML(page, html`
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">first li</span></li>
                </ul>
                <p><br /></p>
            `);
        });
    });

    test.describe('Merging', function () {
        test('merges two ULs after deleting a separating paragraph', async function () {
            await focusEditor(page);
            await page.keyboard.type('- one');
            await page.keyboard.press('Enter');
            await page.keyboard.type('two');
            await page.keyboard.press('ArrowUp');
            await page.keyboard.press('Enter');
            await page.keyboard.press('Enter');
            await page.keyboard.press('Backspace');

            await assertHTML(page, html`
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">one</span></li>
                    <li value="2" dir="ltr"><span data-lexical-text="true">two</span></li>
                </ul>
            `);
        });

        test('does not merge two lists of different types after deleting separating paragraph', async function () {
            await focusEditor(page);
            await page.keyboard.type('- ul one');
            await page.keyboard.press('Enter');
            await page.keyboard.press('Enter');
            await page.keyboard.type('1. ol one');
            await page.keyboard.press('ArrowUp');
            await page.keyboard.press('Enter');
            await page.keyboard.press('Enter');
            await page.keyboard.press('Backspace');

            await assertHTML(page, html`
                <ul>
                    <li value="1" dir="ltr"><span data-lexical-text="true">ul one</span></li>
                </ul>
                <ol>
                    <li value="1" dir="ltr"><span data-lexical-text="true">ol one</span></li>
                </ol>
            `);
        });
    });
});
