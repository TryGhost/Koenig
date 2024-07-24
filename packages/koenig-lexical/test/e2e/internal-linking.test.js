import {assertHTML, focusEditor, html, initialize, insertCard, pasteText} from '../utils/e2e';
import {expect, test} from '@playwright/test';

test.describe('Internal linking', async () => {
    let page;

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
    });

    test.beforeEach(async () => {
        await initialize({page, uri: '/#/?content=false&labs=internalLinking'});
    });

    test.afterAll(async () => {
        await page.close();
    });

    test.describe('Bookmark card', function () {
        test('shows default options when opening', async function () {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});
            await expect(page.getByTestId('bookmark-url-dropdown')).toBeVisible();
            await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                  <div
                    data-kg-card-editing="false"
                    data-kg-card-selected="true"
                    data-kg-card="bookmark">
                    <div>
                      <div>
                        <div><input placeholder="Paste URL or search posts and pages..." value="" /></div>
                        <ul>
                          <li><div>Latest posts</div></li>
                          <li aria-selected="true" role="option">
                            <span><span>Remote Work's Impact on Job Markets and Employment</span></span>
                            <span>
                              <span title="Members only"><svg></svg></span>
                              <span>8 May 2024</span>
                            </span>
                          </li>
                          <li aria-selected="false" role="option">
                            <span><span>Robotics Renaissance: How Automation is Transforming Industries</span></span>
                          </li>
                          <li aria-selected="false" role="option">
                            <span><span>Biodiversity Conservation in Fragile Ecosystems</span></span>
                          </li>
                          <li aria-selected="false" role="option">
                            <span><span>Unveiling the Crisis of Plastic Pollution: Analyzing Its Profound Impact on the Environment</span></span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <p><br /></p>
            `);
        });

        test('shows metadata on selected items', async function () {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});
            await expect(page.getByTestId('bookmark-url-dropdown')).toBeVisible();

            await assertHTML(page, html`
                <span><span>Remote Work's Impact on Job Markets and Employment</span></span>
                <span>
                  <span title="Members only"><svg></svg></span>
                  <span>8 May 2024</span>
                </span>
            `, {selector: '[data-testid="bookmark-url-listOption"][aria-selected="true"]'});

            await page.keyboard.press('ArrowDown');

            // first item no longer shows metadata

            await assertHTML(page, html`
                <span><span>Remote Work's Impact on Job Markets and Employment</span></span>
            `, {selector: '[data-testid="bookmark-url-listOption"]'});

            // second now-selected item shows metadata
            await assertHTML(page, html`
                <span><span>Robotics Renaissance: How Automation is Transforming Industries</span></span>
                <span>
                  <span title="Specific tiers only"><svg></svg></span>
                  <span>2 May 2024</span>
                </span>
            `, {selector: '[data-testid="bookmark-url-listOption"][aria-selected="true"]'});
        });

        test('highlights matches in results', async function () {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});
            await expect(page.getByTestId('bookmark-url-dropdown')).toBeVisible();

            await page.keyboard.type('Emoji');

            await expect(page.locator('[data-testid="bookmark-url-listOption"]')).toBeVisible();
            await expect(page.locator('span.font-bold').first()).toHaveText('Emoji');
        });

        test('does not crash with regexp chars in search', async function () {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});
            await expect(page.getByTestId('bookmark-url-dropdown')).toBeVisible();

            await page.keyboard.type('[');

            await expect(page.locator('[data-testid="bookmark-url-dropdown"]')).toBeVisible();
        });

        test('matches URL queries (http)', async function () {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});
            await expect(page.getByTestId('bookmark-url-dropdown')).toBeVisible();

            await page.keyboard.type('http');
            await expect(page.getByTestId('input-list-spinner')).not.toBeVisible();

            await assertHTML(page, html`
                <li><div>Link to web page</div></li>
                <li aria-selected="true" role="option">
                  <span>
                    <svg></svg>
                    <span>http</span>
                  </span>
                </li>
            `, {selector: '[data-testid="bookmark-url-dropdown"]'});
        });

        test('matches URL queries (anchor)', async function () {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});
            await expect(page.getByTestId('bookmark-url-dropdown')).toBeVisible();

            await page.keyboard.type('#test');
            await expect(page.getByTestId('input-list-spinner')).not.toBeVisible();

            await assertHTML(page, html`
                <li><div>Link to web page</div></li>
                <li aria-selected="true" role="option">
                  <span>
                    <svg></svg>
                    <span>#test</span>
                  </span>
                </li>
            `, {selector: '[data-testid="bookmark-url-dropdown"]'});
        });

        test('matches URL queries (relative)', async function () {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});
            await expect(page.getByTestId('bookmark-url-dropdown')).toBeVisible();

            await page.keyboard.type('/test');
            await expect(page.getByTestId('input-list-spinner')).not.toBeVisible();

            await assertHTML(page, html`
                <li><div>Link to web page</div></li>
                <li aria-selected="true" role="option">
                  <span>
                    <svg></svg>
                    <span>/test</span>
                  </span>
                </li>
            `, {selector: '[data-testid="bookmark-url-dropdown"]'});
        });

        test('matches URL queries (mailto)', async function () {
            await focusEditor(page);
            await insertCard(page, {cardName: 'bookmark'});
            await expect(page.getByTestId('bookmark-url-dropdown')).toBeVisible();

            await page.keyboard.type('mailto:test@example.com');
            await expect(page.getByTestId('input-list-spinner')).not.toBeVisible();

            await assertHTML(page, html`
                <li><div>Link to web page</div></li>
                <li aria-selected="true" role="option">
                  <span>
                    <svg></svg>
                    <span>mailto:test@example.com</span>
                  </span>
                </li>
            `, {selector: '[data-testid="bookmark-url-dropdown"]'});
        });
    });

    test.describe('Link toolbar', function () {});

    test.describe('At-linking', function () {
        test('displays default links with no query', async function () {
            await focusEditor(page);
            await page.keyboard.type('@');

            await assertHTML(page, html`
                <p>
                    <span>
                        <svg></svg>
                        <span data-lexical-text="true">‌</span>
                        <span
                            data-placeholder="Find a post, tag or author"
                            data-lexical-text="true"
                        ></span>
                    </span>
                </p>
            `);

            await assertHTML(page, html`
                <div>
                    <div>
                        <div>
                            <ul>
                                <li><div>Latest posts</div></li>
                                <li aria-selected="true" role="option">
                                    <span><span>Remote Work's Impact on Job Markets and Employment</span></span>
                                    <span>
                                        <span title="Members only"><svg></svg></span>
                                        <span>8 May 2024</span>
                                    </span>
                                </li>
                                <li aria-selected="false" role="option">
                                    <span><span>Robotics Renaissance: How Automation is Transforming Industries</span></span>
                                </li>
                                <li aria-selected="false" role="option">
                                    <span><span>Biodiversity Conservation in Fragile Ecosystems</span></span>
                                </li>
                                <li aria-selected="false" role="option">
                                    <span><span>Unveiling the Crisis of Plastic Pollution: Analyzing Its Profound Impact on the Environment</span></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `, {selector: '[data-testid="at-link-popup"]'});
        });

        test('can search for links', async function () {
            await focusEditor(page);
            await page.keyboard.type('@');
            await page.keyboard.type('Emo');

            await assertHTML(page, html`
                <p>
                    <span dir="ltr">
                        <svg></svg>
                        <span data-lexical-text="true">‌</span>
                        <span data-placeholder="" data-lexical-text="true">Emo</span>
                    </span>
                </p>
            `);

            // wait for search to complete
            await expect(page.locator('[data-testid="at-link-results-listOption-label"]')).toContainText(['✨ Emoji autocomplete ✨']);

            await assertHTML(page, html`
                <div>
                    <div>
                        <div>
                            <ul>
                                <li><div>Posts</div></li>
                                <li aria-selected="true" role="option">
                                    <span><span>✨ <span>Emo</span>ji autocomplete ✨</span></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `, {selector: '[data-testid="at-link-popup"]'});
        });

        test('has custom no result options', async function () {
            await focusEditor(page);
            await page.keyboard.type('@');
            await page.keyboard.type('Unknown page');

            await expect(page.locator('[data-testid="at-link-popup"]')).toContainText('No results found');

            await page.keyboard.press('Enter');

            await assertHTML(page, html`
                <p><span data-lexical-text="true">@Unknown page</span></p>
            `);
        });

        test('removes at-linking when backspacing', async function ({browserName}) {
            if (browserName === 'webkit') {
                test.skip();
            }

            await focusEditor(page);
            await page.keyboard.type('@');
            await page.keyboard.type('AB');

            await page.keyboard.press('Backspace');
            await page.keyboard.press('Backspace');
            // we should now have an empty input field with placeholder text
            await assertHTML(page, html`
                <p>
                    <span>
                        <svg></svg>
                        <span data-lexical-text="true">‌</span>
                        <span
                            data-placeholder="Find a post, tag or author"
                            data-lexical-text="true"
                        ></span>
                    </span>
                </p>
            `);

            await page.keyboard.press('Backspace');

            // it should now remove the at-linking entirely leaving only an @
            await assertHTML(page, html`
                <p><span data-lexical-text="true">@</span></p>
            `);
        });

        test('creates a bookmark when at-linking from a line', async function () {
            await focusEditor(page);

            await page.keyboard.type('@');
            await page.keyboard.type('Emo');
            await expect(page.locator('[data-testid="at-link-results-listOption-label"]')).toContainText(['✨ Emoji autocomplete ✨']);
            await page.keyboard.press('Enter');
            // now wait till data-testid="bookmark-container" appears
            await page.waitForSelector('[data-testid="bookmark-container"]');
            await assertHTML(page, html`
                <div data-lexical-decorator="true" contenteditable="false">
                    <div data-kg-card-editing="false" data-kg-card-selected="false" data-kg-card="bookmark">
                        <div>
                            <div>
                                <div>
                                    <div>Ghost: The Creator Economy Platform</div>
                                    <div>
                                        The former of the two songs addresses the issue of negative rumors
                                        in a relationship, while the latter, with a more upbeat pulse, is a
                                        classic club track; the single is highlighted by a hyped bridge.
                                    </div>
                                    <div>
                                        <img alt="" src="https://www.ghost.org/favicon.ico" />
                                        <span>Ghost - The Professional Publishing Platform</span>
                                        <span>Author McAuthory</span>
                                    </div>
                                </div>
                                <div><img alt="" src="https://ghost.org/images/meta/ghost.png" /></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div contenteditable="false" data-lexical-cursor="true"></div>
            `, {ignoreCardToolbarContents: true, ignoreInnerSVG: true});
        });

        test('can paste into at-link node', async function () {
            await focusEditor(page);
            await page.keyboard.type('@');
            await pasteText(page, 'https://ghost.org');
            await expect(page.getByTestId('at-link-results')).toBeVisible();

            await assertHTML(page, html`
                <p>
                    <span dir="ltr">
                        <svg></svg>
                        <span data-lexical-text="true">‌</span>
                        <span data-placeholder="" data-lexical-text="true">https://ghost.org</span>
                    </span>
                </p>
            `);
        });
    });
});
