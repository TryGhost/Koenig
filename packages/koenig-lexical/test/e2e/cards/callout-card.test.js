import {assertHTML, createSnippet, focusEditor, html, initialize, insertCard, isMac} from '../../utils/e2e';
// import {calloutColorPicker} from '../../../src/components/ui/cards/CalloutCardx';
import {expect, test} from '@playwright/test';

test.describe('Callout Card', async () => {
    const ctrlOrCmd = isMac() ? 'Meta' : 'Control';

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

    test('can import serialized callout card nodes', async function () {
        const contentParam = encodeURIComponent(JSON.stringify({
            root: {
                children: [{
                    type: 'callout',
                    calloutText: '<p dir="ltr"><span>Hello World</span></p>',
                    calloutEmoji: '😚',
                    backgroundColor: 'blue'
                }],
                direction: null,
                format: '',
                indent: 0,
                type: 'root',
                version: 1
            }
        }));

        await initialize({page, uri: `/#/?content=${contentParam}`});

        // NOTE: don't ignore contents, we care that the data is deserialized and displayed correctly
        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="callout">
                    <div>
                        <div><button type="button">😚</button></div>
                        <div>
                            <div data-kg="editor">
                                <div
                                    contenteditable="false"
                                    role="textbox"
                                    spellcheck="true"
                                    data-lexical-editor="true"
                                    aria-autocomplete="none"
                                    aria-readonly="true"
                                >
                                    <p dir="ltr"><span data-lexical-text="true">Hello World</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        `);

        // check the background color
        await expect(page.getByTestId('callout-bg-blue')).toBeVisible();
    });

    test('renders callout card', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="callout">
                </div>
            </div>
            <p><br /></p>
        `, {ignoreCardContents: true});
    });

    test('has settings panel', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        // the settings panel consists of emoji-toggle and colour picker
        const emojiToggle = page.locator('[data-testid="emoji-toggle"]');
        await expect(emojiToggle).toBeVisible();
        const colorPicker = page.locator('[data-testid="callout-color-picker"]');
        await expect(colorPicker).toBeVisible();
    });

    test('can edit callout card', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        await page.keyboard.type('Hello World');

        const calloutCard = page.locator('[data-kg-card="callout"]');
        await expect(calloutCard).toContainText('💡Hello World ');
    });

    test('can toggle emoji', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        const toggle = page.locator('[data-testid="emoji-toggle"]');
        await toggle.click();
        // click on data-kg-card="callout"
        await page.click('[data-kg-card="callout"]');
        await page.keyboard.type('Hello World');

        const calloutCard = page.locator('[data-kg-card="callout"]');
        await expect(calloutCard).not.toContainText('💡');
    });

    test('can render emoji picker', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        await page.getByRole('button', {name: '💡'}).click();
        const emojiPickerContainer = page.locator('[data-testid="emoji-picker-container"]');
        await expect(emojiPickerContainer).toBeVisible();
    });

    test('colour picker renders all colours', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        // await Promise.all(calloutColorPicker.map(async (color) => {
        //     const colorPicker = page.locator(`[data-test-id="color-picker-${color.name}"]`);
        //     await expect(colorPicker).toBeVisible();
        // }));
    });

    test('can change background color', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        const colorPicker = page.locator(`[data-test-id="color-picker-green"]`);
        await colorPicker.click();

        // ensure data-test-id="callout-bg-blue" is visible
        const greenCallout = page.locator('[data-testid="callout-bg-green"]');
        await expect(greenCallout).toBeVisible();
    });

    test('can select an emoji', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        await page.getByRole('button', {name: '💡'}).click();
        const lolEmoji = page.locator('[aria-label="😂"]').nth(0); // nth(0) is required because there could two emojis with the same label (eg from frequently used)
        await lolEmoji.click();
        // await page.keyboard.type('Joke of the day');
        const calloutCard = page.locator('[data-kg-card="callout"]');
        await expect(calloutCard).toContainText('😂');
    });

    test('has edit toolbar', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        // press arrow down
        // TODO: this is a bug! ArrowDown should only be required once
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown'); // press twice to make sure card gets unselected

        // press arrow up
        await page.keyboard.press('ArrowUp');

        const editButton = page.locator('[data-testid="edit-callout-card"]');
        await expect(editButton).toBeVisible();
    });

    test('can toggle edit', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        // press arrow down
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown'); // press twice to make sure card gets unselected

        // press arrow up
        await page.keyboard.press('ArrowUp');

        const editButton = page.locator('[data-testid="edit-callout-card"]');
        await editButton.click();

        const calloutCard = page.locator('[data-kg-card="callout"]');
        await expect(calloutCard).toHaveAttribute('data-kg-card-editing', 'true');
    });

    test('syncs display state content', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});
        await page.keyboard.type('testing nesting');
        await page.keyboard.press('Enter');

        await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="callout">
                        <div>
                            <div><button type="button">💡</button></div>
                            <div>
                                <div data-kg="editor">
                                    <div
                                        contenteditable="false"
                                        role="textbox"
                                        spellcheck="true"
                                        data-lexical-editor="true"
                                        aria-autocomplete="none"
                                        aria-readonly="true">
                                        <p dir="ltr">
                                            <span data-lexical-text="true">testing nesting</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
                <p><br /></p>
                <p><br /></p>
            `, {ignoreCardContents: false});
    });

    test('can toggle edit mode with CMD+ENTER', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});
        await page.keyboard.type('testing nesting');

        await page.keyboard.press(`${ctrlOrCmd}+Enter`);

        await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="true" data-kg-card="callout">
                        <div>
                            <div><button type="button">💡</button></div>
                            <div>
                                <div data-kg="editor">
                                    <div
                                        contenteditable="false"
                                        role="textbox"
                                        spellcheck="true"
                                        data-lexical-editor="true"
                                        aria-autocomplete="none"
                                        aria-readonly="true">
                                        <p dir="ltr">
                                            <span data-lexical-text="true">testing nesting</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div></div>
                        <div data-kg-card-toolbar="callout">
                        </div>
                    </div>
                </div>
                <p><br /></p>
            `, {ignoreCardToolbarContents: true});

        await page.keyboard.press(`${ctrlOrCmd}+Enter`);

        await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="callout">
                    </div>
                </div>
                <p><br /></p>
            `, {ignoreCardContents: true});
    });

    test('can leave edit mode with ESCAPE', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});
        await page.keyboard.type('testing nesting');
        await page.keyboard.press('Escape');

        await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="true" data-kg-card="callout">
                    </div>
                </div>
                <p><br /></p>
            `, {ignoreCardContents: true});
    });

    test('can add snippet', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});
        await page.keyboard.type('testing nesting');

        // create snippet
        await page.keyboard.press('Escape');
        await createSnippet(page);

        // can insert card from snippet
        await page.keyboard.press('Enter');
        await page.keyboard.type('/snippet');
        await page.waitForSelector('[data-kg-cardmenu-selected="true"]');
        await page.keyboard.press('Enter');
        await expect(await page.locator('[data-kg-card="callout"]')).toHaveCount(2);
    });

    test('keeps focus on previous editor when changing size opts', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        // Start editing the content
        await page.keyboard.type('Hello ');

        // Change color
        await page.locator(`[data-test-id="color-picker-green"]`).click();

        // Continue editing the content
        await page.keyboard.type('world');

        // Expect content to have 'Hello World'
        const content = page.locator('[data-kg-card="callout"]');
        await expect(content).toContainText('Hello world');
    });

    test('can undo/redo without losing content', async function () {
        await focusEditor(page);
        await insertCard(page, {cardName: 'callout'});

        await page.keyboard.type('Hello world');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.keyboard.press(`${ctrlOrCmd}+z`);
        await expect(page.locator('[data-kg-card="callout"]')).toBeVisible();

        // NOTE: don't ignore contents, we care that the data is displayed correctly
        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="false" data-kg-card-selected="true" data-kg-card="callout">
                    <div>
                        <div><button type="button">💡</button></div>
                        <div>
                            <div data-kg="editor">
                                <div
                                    contenteditable="false"
                                    role="textbox"
                                    spellcheck="true"
                                    data-lexical-editor="true"
                                    aria-autocomplete="none"
                                    aria-readonly="true"
                                >
                                    <p dir="ltr"><span data-lexical-text="true">Hello world</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div></div>
                    <div data-kg-card-toolbar="callout"></div>
                </div>
            </div>
            <p><br /></p>
        `, {ignoreCardToolbarContents: true});
    });
});
