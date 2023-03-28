import {afterAll, beforeAll, beforeEach, describe, it, test} from 'vitest';
import {assertHTML, assertSelection, focusEditor, html, initialize, startApp} from '../utils/e2e';
import {expect} from '@playwright/test';

describe('Slash menu', async () => {
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

    describe('open/close', function () {
        it('opens with / on blank paragraph', async function () {
            await focusEditor(page);
            await expect(page.locator('[data-kg-slash-menu]')).not.toBeVisible();
            await page.keyboard.type('/');
            await expect(page.locator('[data-kg-slash-menu]')).toBeVisible();
        });

        it('opens with / on paragraph that is entirely selected', async function () {
            await focusEditor(page);
            await page.keyboard.type('testing');

            const paragraph = await page.$('[data-lexical-editor] > p');
            await paragraph.click({clickCount: 3});

            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [0, 0, 0],
                focusOffset: 7,
                focusPath: [0, 0, 0]
            });

            await page.keyboard.type('/');

            // sanity check that text was fully selected + replaced
            await assertHTML(page, html`<p><span data-lexical-text="true">/</span></p>`);

            await expect(page.locator('[data-kg-slash-menu]')).toBeVisible();
        });

        it('opens with / + SHIFT', async function () {
            await focusEditor(page);
            await page.keyboard.down('Shift');
            await page.keyboard.type('/');
            await page.keyboard.up('Shift');
            await expect(page.locator('[data-kg-slash-menu]')).toBeVisible();
        });

        it('does not open with / on populated paragraph', async function () {
            await focusEditor(page);
            await page.keyboard.type('testing');
            await page.keyboard.type('/');

            await expect(page.locator('[data-kg-slash-menu]')).not.toBeVisible();

            await page.keyboard.press('Backspace');
            for (let i = 0; i < 'testing'.length; i++) {
                await page.keyboard.press('ArrowLeft');
            }

            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [0, 0, 0],
                focusOffset: 0,
                focusPath: [0, 0, 0]
            });

            await page.keyboard.type('/');

            await expect(page.locator('[data-kg-slash-menu]')).not.toBeVisible();
        });

        it('closes when / deleted', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');

            await expect(page.locator('[data-kg-slash-menu]')).toBeVisible();

            await page.keyboard.press('Backspace');

            await expect(page.locator('[data-kg-slash-menu]')).not.toBeVisible();
        });

        it('closes on Escape', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');
            await page.keyboard.press('Escape');

            await expect(page.locator('[data-kg-slash-menu]')).not.toBeVisible();

            await assertSelection(page, {
                anchorOffset: 1,
                anchorPath: [0, 0, 0],
                focusOffset: 1,
                focusPath: [0, 0, 0]
            });
        });

        it('closes on click outside menu', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');
            await page.click('body');

            await expect(page.locator('[data-kg-slash-menu]')).not.toBeVisible();
        });

        it('does not close on click inside menu', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');
            await page.click('[data-kg-slash-menu] [role="separator"] > span'); // better selector for menu headings?

            await expect(page.locator('[data-kg-slash-menu]')).toBeVisible();
        });

        it('does not re-open when cursor placed back on /', async function () {
            await focusEditor(page);
            await page.keyboard.press('Enter');
            await page.keyboard.type('/');
            await page.click('body');
            await page.click('[data-lexical-editor] > p:nth-of-type(2)');

            await expect(page.locator('[data-kg-slash-menu]')).not.toBeVisible();

            // TODO: this fails in CI but passes locally
            // await assertSelection(page, {
            //     anchorOffset: 1,
            //     anchorPath: [1, 0, 0],
            //     focusOffset: 1,
            //     focusPath: [1, 0, 0]
            // });

            // Temp workaround for above to ensure the focus is in the right place
            await page.keyboard.type('words');
            await assertHTML(page, html`
                <p><br /></p>
                <p dir="ltr"><span data-lexical-text="true">/words</span></p>
            `);
        });
    });

    describe('filtering', function () {
        it('matches text after /', async function () {
            await focusEditor(page);
            await page.keyboard.type('/img');

            const $$menuitems = await page.$$('[data-kg-slash-menu] [role="menuitem"]');
            expect($$menuitems).toHaveLength(1);

            expect(await page.evaluate(el => el.innerText, $$menuitems[0])).toContain('Image');
        });

        it('shows no menu with no matches', async function () {
            await focusEditor(page);
            await page.keyboard.type('/unknown');

            await expect(page.locator('[data-kg-slash-menu]')).not.toBeVisible();
        });
    });

    describe('selection', function () {
        test('first item is selected when opening', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');

            const $$menuitems = await page.$$('[data-kg-slash-menu] [role="menuitem"]');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[0])).toEqual('true');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[1])).toEqual('false');
        });

        test('DOWN selects next item', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');
            await page.keyboard.press('ArrowDown');

            const $$menuitems = await page.$$('[data-kg-slash-menu] [role="menuitem"]');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[0])).toEqual('false');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[1])).toEqual('true');
        });

        test('RIGHT selects next item', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');
            await page.keyboard.press('ArrowRight');

            const $$menuitems = await page.$$('[data-kg-slash-menu] [role="menuitem"]');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[0])).toEqual('false');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[1])).toEqual('true');
        });

        test('UP selects previous item', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowUp');

            const $$menuitems = await page.$$('[data-kg-slash-menu] [role="menuitem"]');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[0])).toEqual('true');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[1])).toEqual('false');
        });

        test('LEFT selects previous time', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowLeft');

            const $$menuitems = await page.$$('[data-kg-slash-menu] [role="menuitem"]');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[0])).toEqual('true');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[1])).toEqual('false');
        });

        test('first item is selected after changing query', async function () {
            await focusEditor(page);
            await page.keyboard.type('/');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.type('hr');

            const $$menuitems = await page.$$('[data-kg-slash-menu] [role="menuitem"]');
            expect(await page.evaluate(e => e.dataset.kgCardmenuSelected, $$menuitems[0])).toEqual('true');
        });
    });

    describe('insertion', function () {
        test('ENTER inserts card', async function () {
            await focusEditor(page);
            await page.keyboard.type('/hr');
            await page.keyboard.press('Enter');

            await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="horizontalrule"><hr /></div>
                </div>
                <p><br /></p>
            `);

            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [1],
                focusOffset: 0,
                focusPath: [1]
            });

            await expect(page.locator('[data-kg-slash-menu]')).not.toBeVisible();
        });

        it('has correct order when inserting after text', async function () {
            await focusEditor(page);
            await page.keyboard.type('Testing');
            await page.keyboard.press('Enter');
            await page.keyboard.type('/hr');
            await page.keyboard.press('Enter');

            await assertHTML(page, html`
                <p dir="ltr"><span data-lexical-text="true">Testing</span></p>
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="horizontalrule"><hr /></div>
                </div>
                <p><br /></p>
            `);

            // HR card puts focus on paragraph after insert
            await assertSelection(page, {
                anchorOffset: 0,
                anchorPath: [2],
                focusOffset: 0,
                focusPath: [2]
            });
        });

        it('has correct order when inserting after a card', async function () {
            await focusEditor(page);
            await page.keyboard.type('/hr');
            await page.waitForSelector('li:first-child > [data-kg-card-menu-item="Divider"]');
            await page.keyboard.press('Enter');
            await page.keyboard.type('/img');
            await page.waitForSelector('li:first-child > [data-kg-card-menu-item="Image"]');
            await page.keyboard.press('Enter');

            // image card retains focus after insert
            await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="horizontalrule"></div>
                </div>
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="true" data-kg-card="image"></div>
                </div>
                <p><br /></p>
            `, {ignoreCardContents: true});
        });

        it('uses query params', async function () {
            await focusEditor(page);
            await page.keyboard.type('/image https://example.com/image.jpg');
            await page.keyboard.press('Enter');

            await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="true" data-kg-card="image"></div>
                </div>
                <p><br /></p>
            `, {ignoreCardContents: true});

            expect(await page.evaluate(() => {
                return document.querySelector('[data-kg-card="image"] img').src;
            })).toEqual('https://example.com/image.jpg');
        });

        it('can insert card at beginning of document before text', async function () {
            await focusEditor(page);
            await page.keyboard.press('Enter');
            await page.keyboard.type('Testing');
            await page.keyboard.press('ArrowUp');
            await page.keyboard.type('/callout');
            await page.waitForSelector('li:first-child > [data-kg-card-menu-item="Callout"]');
            await page.keyboard.press('Enter');
            await page.waitForSelector('[data-kg-card="callout"]');

            await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="callout"></div>
                </div>
                <p dir="ltr"><span data-lexical-text="true">Testing</span></p>
            `, {ignoreCardContents: true});
        });

        it('can insert card at beginning of document before card', async function () {
            await focusEditor(page);
            await page.keyboard.press('Enter');
            await page.keyboard.type('--- ');
            await page.keyboard.press('ArrowUp');
            await page.keyboard.press('ArrowUp');
            await page.keyboard.type('/callout');
            await page.waitForSelector('li:first-child > [data-kg-card-menu-item="Callout"]');
            await page.keyboard.press('Enter');
            await page.waitForSelector('[data-kg-card="callout"]');

            await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="callout"></div>
                </div>
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="horizontalrule"></div>
                </div>
                <p><br /></p>
            `, {ignoreCardContents: true});
        });
    });
});
