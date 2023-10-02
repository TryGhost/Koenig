/**
 * Removes consecutive whitespaces and newlines
 * @param {string} html
 * @returns {string}
 */
export function removeSpaces(html) {
    return html.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Wraps replacement strings with %%
 * This helps to prevent conflicts between code samples and our replacement strings
 * Example: {foo} -> %%{foo}%%
 * @param {string} html
 * @returns {string}
 */
export function wrapReplacementStrings(html) {
    return html.replace(/\{(\w*?)(?:,? *"(.*?)")?\}/g, '%%$&%%');
}

/**
 * Removes any <code> wrappers around replacement strings {foo}
 * Example input:  <code><span>{foo}</span></code>
 * Example output:       <span>{foo}</span>
 * @param {string} html
 * @returns {string}
 */
export function removeCodeWrappers(html) {
    return html.replace(/<code\b[^>]*>((.*?){.*?}(.*?))<\/code>/gi, '$1');
}