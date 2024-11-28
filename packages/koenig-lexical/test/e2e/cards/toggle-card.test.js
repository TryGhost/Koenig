import {assertHTML, createSnippet, ctrlOrCmd, focusEditor, html, initialize} from '../../utils/e2e';
import {expect, test} from '@playwright/test';

async function insertToggleCard(page) {
    await page.keyboard.type('/toggle');
    await page.waitForSelector('[data-kg-card-menu-item="Toggle"][data-kg-cardmenu-selected="true"]');
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-kg-card="toggle"]');
}

test.describe('Toggle card', async () => {
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

    test('can import serialized toggle card nodes', async function () {
        const contentParam = encodeURIComponent(JSON.stringify({
            root: {
                children: [{
                    type: 'toggle',
                    heading: '<span><em>Heading</em></span>', // heading shouldn't have wrapper element like <p> or <h4>
                    content: '<p dir="ltr"><span>Content</span></p>'
                }],
                direction: null,
                format: '',
                indent: 0,
                type: 'root',
                version: 1
            }
        }));

        await initialize({page, uri: `/#/?content=${contentParam}`});

        await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="toggle">
                        <div class="rounded border border-grey/40 py-4 px-6 dark:border-grey/30">
                            <div class="flex cursor-text items-start justify-between">
                                <div class="mr-2 w-full">
                                    <div class="koenig-lexical-heading">
                                        <div data-kg="editor">
                                            <div
                                                contenteditable="false"
                                                role="textbox"
                                                spellcheck="true"
                                                data-lexical-editor="true"
                                                aria-autocomplete="none"
                                                aria-readonly="true"
                                            >
                                                <p dir="ltr"><em data-lexical-text="true">Heading</em></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="ml-auto mt-[-1px] flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center">
                                    <svg></svg>
                                </div>
                            </div>
                            <div class="mt-2 w-full visible">
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
                                            <p dir="ltr"><span data-lexical-text="true">Content</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
            `, {ignoreCardToolbarContents: true, ignoreInnerSVG: true});
    });

    test('renders toggle card node from slash command', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="true" data-kg-card-selected="true" data-kg-card="toggle">
                    <div class="rounded border border-grey/40 py-4 px-6 dark:border-grey/30">
                        <div class="flex cursor-text items-start justify-between">
                            <div class="mr-2 w-full">
                                <div class="koenig-lexical-heading">
                                    <div data-kg="editor">
                                        <div
                                            contenteditable="true"
                                            role="textbox"
                                            spellcheck="true"
                                            data-lexical-editor="true"
                                        >
                                            <p><br /></p>
                                        </div>
                                    </div>
                                    <div><div>Toggle header</div></div>
                                </div>
                            </div>
                            <div
                                class="ml-auto mt-[-1px] flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center">
                                <svg></svg>
                            </div>
                        </div>
                        <div class="mt-2 w-full visible">
                            <div>
                                <div data-kg="editor">
                                    <div
                                        contenteditable="true"
                                        role="textbox"
                                        spellcheck="true"
                                        data-lexical-editor="true"
                                    >
                                        <p><br /></p>
                                    </div>
                                </div>
                                <div><div>Collapsible content</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p><br /></p>
        `, {ignoreInnerSVG: true});
    });

    test('focuses on the heading input when rendered', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        await page.keyboard.type('Heading');

        const heading = page.locator('.koenig-lexical-heading');
        await expect(heading).toContainText('Heading');
    });

    test('focuses on the content input when "Enter" is pressed from the heading input', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        await page.keyboard.press('Enter');
        await page.keyboard.type('Content');
    });

    test('focuses on the content input when "Tab" is pressed from the heading input', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        await page.keyboard.press('Tab');
        await page.keyboard.type('Content');
    });

    test('focuses on the content input when "Arrow Down" is pressed from the heading input', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        await page.keyboard.press('ArrowDown');
        await page.keyboard.type('Content');
    });

    test('focuses on the heading input when "Arrow Up" is pressed from the content input', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        await page.keyboard.press('ArrowDown');
        await page.keyboard.type('Content');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.type('Heading');

        const heading = page.locator('.koenig-lexical-heading');
        await expect(heading).toContainText('Heading');
    });

    test('renders in display mode when unfocused', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        // add some content to avoid auto-removal when leaving empty
        await page.keyboard.type('Heading');

        // Shift focus away from heading field
        await page.keyboard.press('ArrowDown');

        // Shift focus away from content field
        await page.keyboard.press('ArrowDown');

        const toggleCard = page.locator('[data-kg-card="toggle"]');
        await expect(toggleCard).toHaveAttribute('data-kg-card-editing', 'false');
    });

    test('renders an action toolbar', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        // Add some content to avoid auto-removal
        await page.keyboard.type('Heading');

        // Shift focus away from toggle card
        await page.keyboard.press('Escape');

        const editButton = page.locator('[data-kg-card-toolbar="toggle"]');
        await expect(editButton).toBeVisible();
    });

    test('is removed when left empty', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        // Shift focus away from heading field
        await page.keyboard.press('ArrowDown');

        // Shift focus away from content field
        await page.keyboard.press('ArrowDown');

        const toggleCard = page.locator('[data-kg-card="toggle"]');
        await expect(toggleCard).not.toBeVisible();
    });

    test('can add snippet', async function () {
        await focusEditor(page);
        await insertToggleCard(page);

        // Add some content to avoid auto-removal
        await page.keyboard.type('Heading');

        // create snippet
        await page.keyboard.press('Escape');
        await createSnippet(page);

        // can insert card from snippet
        await page.keyboard.press('Enter');
        await page.keyboard.type('/snippet');
        await page.waitForSelector('[data-kg-cardmenu-selected="true"]');
        await page.keyboard.press('Enter');
        await expect(await page.locator('[data-kg-card="toggle"]')).toHaveCount(2);
    });

    test('can undo/redo without losing nested editor content', async () => {
        await focusEditor(page);
        await insertToggleCard(page);

        await page.keyboard.type('Test title');
        await page.keyboard.press('Enter');
        await page.keyboard.type('Test description');
        await page.keyboard.press('Escape');
        await page.keyboard.press('Backspace');
        await page.keyboard.press(`${ctrlOrCmd()}+z`);

        await assertHTML(page, html`
            <div data-lexical-decorator="true" contenteditable="false">
                <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="toggle">
                    <div class="rounded border border-grey/40 py-4 px-6 dark:border-grey/30">
                        <div class="flex cursor-text items-start justify-between">
                            <div class="mr-2 w-full">
                                <div class="koenig-lexical-heading">
                                    <div data-kg="editor">
                                        <div
                                            contenteditable="false"
                                            role="textbox"
                                            spellcheck="true"
                                            data-lexical-editor="true"
                                            aria-autocomplete="none"
                                            aria-readonly="true"
                                        >
                                            <p dir="ltr"><span data-lexical-text="true">Test title</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="ml-auto mt-[-1px] flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center">
                                <svg></svg>
                            </div>
                        </div>
                        <div class="mt-2 w-full visible">
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
                                        <p dir="ltr"><span data-lexical-text="true">Test description</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
            <p><br /></p>
        `, {ignoreCardToolbarContents: true, ignoreInnerSVG: true});
    });
});
