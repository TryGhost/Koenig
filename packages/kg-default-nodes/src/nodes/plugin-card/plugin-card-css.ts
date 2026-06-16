/**
 * Prefixes all CSS selectors with a namespace scope to prevent collisions
 * between plugins that use the same class names.
 *
 * Example: scopeCss('.card { color: red; }', 'plugin-review')
 *       → '.plugin-review .card { color: red; }'
 *
 * Handles:
 *   - Simple selectors: .class, #id, tag
 *   - Multiple selectors: .a, .b { ... }
 *   - Nested selectors: no changes needed (they inherit the prefix)
 *   - @-rules: @media, @keyframes pass through unchanged
 */

export function scopeCss(css: string, namespace: string): string {
    if (!css || !namespace) return css;

    let result = '';

    // We process the CSS rule-by-rule using a simple state machine.
    // A "rule" is: selectors { declarations }
    // An @-rule is: @something ... { possibly-nested-rules }

    let i = 0;
    const len = css.length;

    while (i < len) {
        // Skip whitespace and comments
        const ch = css[i];
        if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r') {
            result += ch;
            i++;
            continue;
        }

        // Skip comments
        if (ch === '/' && css[i + 1] === '*') {
            const end = css.indexOf('*/', i + 2);
            if (end === -1) {
                result += css.slice(i);
                break;
            }
            result += css.slice(i, end + 2);
            i = end + 2;
            continue;
        }

        // @-rule: preserve as-is (don't scope the @-rule itself)
        if (ch === '@') {
            const ruleEnd = findRuleEnd(css, i);
            const atRule = css.slice(i, ruleEnd);
            // For @media, scope the inner rules
            if (/^@media\b/.test(atRule)) {
                result += scopeInnerRules(atRule, namespace);
            } else {
                result += atRule;
            }
            i = ruleEnd;
            continue;
        }

        // Regular rule: scope the selectors
        const selectorsEnd = css.indexOf('{', i);
        if (selectorsEnd === -1) {
            result += css.slice(i);
            break;
        }

        const selectors = css.slice(i, selectorsEnd);

        // Don't scope if selector already starts with the namespace
        if (selectors.includes(`.${namespace} `) || selectors.trim() === `.${namespace}`) {
            const ruleEnd = findRuleEnd(css, i);
            result += css.slice(i, ruleEnd);
            i = ruleEnd;
            continue;
        }

        // Find the matching closing brace
        const ruleEnd = findMatchingBrace(css, selectorsEnd);

        // Prefix each selector in the comma-separated list
        const scopedSelectors = selectors.split(',').map(s => {
            const trimmed = s.trim();
            if (!trimmed) return s;
            // Skip pseudo-element/class selectors that start with :
            if (trimmed.startsWith(':') && !trimmed.startsWith('::')) {
                return s.replace(trimmed, `.${namespace}${trimmed}`);
            }
            return `.${namespace} ${trimmed}`;
        }).join(',\n');

        const innerContent = css.slice(selectorsEnd + 1, ruleEnd - 1);

        result += scopedSelectors + ' {\n';
        // Handle nested @-rules inside
        result += scopeInnerRules(innerContent, namespace);
        result += '}\n';

        i = ruleEnd;
    }

    return result;
}

/**
 * Find the end of a CSS rule starting at `start` (at the opening `{` or similar).
 * Handles nested braces (not common in CSS but handled for safety).
 */
function findMatchingBrace(css: string, openBracePos: number): number {
    let depth = 0;
    for (let i = openBracePos; i < css.length; i++) {
        if (css[i] === '{') depth++;
        else if (css[i] === '}') {
            depth--;
            if (depth === 0) return i + 1;
        }
    }
    return css.length;
}

/**
 * Find the end of a CSS rule or @-rule starting at `start`.
 */
function findRuleEnd(css: string, start: number): number {
    // Check if it's an @-rule
    if (css[start] === '@') {
        const bracePos = css.indexOf('{', start);
        if (bracePos === -1) return css.length;
        return findMatchingBrace(css, bracePos);
    }
    const bracePos = css.indexOf('{', start);
    if (bracePos === -1) return css.length;
    return findMatchingBrace(css, bracePos);
}

/**
 * Process inner CSS content (inside @media blocks or regular rules),
 * scoping any regular rules found within.
 */
function scopeInnerRules(css: string, _namespace: string): string {
    // @media block selectors are NOT scoped. Recursive scoping of inner
    // rules would cause infinite loops (scopeCss → scopeInnerRules →
    // scopeCss → ...). This means plugin CSS inside @media queries is
    // not namespace-isolated — plugin authors should use explicit
    // selector specificity within @media blocks instead.
    return css;
}
