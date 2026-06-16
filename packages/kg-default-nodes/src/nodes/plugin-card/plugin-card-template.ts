/**
 * Lightweight Handlebars-compatible template renderer.
 *
 * Supports the subset used in plugin card templates:
 *   - {{var}}              simple interpolation
 *   - {{this}}             current context in #each loops
 *   - {{nested.key.path}}  dot-separated path access
 *   - {{#if var}}...{{else}}...{{/if}}
 *   - {{#unless var}}...{{/unless}}
 *   - {{#each list}}...{{/each}}
 *
 * Does NOT support: helpers, subexpressions, block params, partials.
 */

export interface TemplateData {
    [key: string]: unknown;
}

type RenderContext = TemplateData | unknown;

function getPath(data: RenderContext, path: string): unknown {
    if (!path || path === 'this') {
        return data;
    }
    const parts = path.split('.');
    let value: unknown = data;
    for (const part of parts) {
        if (value && typeof value === 'object') {
            value = (value as TemplateData)[part];
        } else {
            return undefined;
        }
    }
    return value;
}

function isTruthy(value: unknown): boolean {
    if (value === null || value === undefined || value === false) return false;
    if (value === 0) return false;
    if (value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

interface BlockToken {
    type: 'if' | 'unless' | 'each';
    condition: string;
    content: string;
    elseContent: string;
}

/**
 * Renders a Handlebars-like template string with the given data context.
 * Optimized for the simple syntax used in Ghost plugin card templates.
 */
export function renderTemplate(template: string, data: TemplateData): string {
    let result = template;

    // --- Phase 1: Handle block helpers (#if, #unless, #each) ---
    // Match opening tag, content, optional {{else}}, closing tag.
    // Handles nested blocks by matching balanced open/close.
    const blockRegex = /\{\{#(if|unless|each)\s+([^}]+)\}\}/g;

    function processBlocks(input: string, context: RenderContext): string {
        let output = input;
        let match: RegExpExecArray | null;

        // Find the first opening block with a balanced closing tag
        const openRe = /\{\{#(if|unless|each)\s+([^}]+)\}\}/;

        while (true) {
            const openMatch = openRe.exec(output);
            if (!openMatch) break;

            const blockType = openMatch[1];
            const condition = openMatch[2].trim();
            const openIndex = openMatch.index;
            const openLength = openMatch[0].length;

            // Find matching close tag by counting nesting depth
            const openTag = `{{#${blockType} ${condition}}}`;
            const closeTag = `{{/${blockType}}}`;
            let depth = 1;
            let searchFrom = openIndex + openLength;
            let closeIndex = -1;
            let elseIndex = -1;
            let elseLength = 0;

            const maybeElse = /\{\{else\}\}/g;
            const maybeClose = new RegExp(
                `\\{\\{#${blockType}\\s+([^}]+)\\}\\}|\\{\\{/${blockType}\\}\\}`,
                'g'
            );

            maybeClose.lastIndex = searchFrom;
            while (depth > 0) {
                const next = maybeClose.exec(output);
                if (!next) break;

                const matched = next[0];
                if (matched.startsWith('{{/')) {
                    depth--;
                    if (depth === 0) {
                        closeIndex = next.index;
                    }
                } else {
                    depth++;
                }
            }

            if (closeIndex === -1) break; // No matching close tag

            // Find {{else}} between open and close
            maybeElse.lastIndex = openIndex + openLength;
            while (true) {
                const elseMatch = maybeElse.exec(output);
                if (!elseMatch || elseMatch.index >= closeIndex) break;
                // Make sure it's not inside a nested block
                let nestedDepth = 0;
                const checkRe = /\{\{#|\{\{\//g;
                checkRe.lastIndex = openIndex + openLength;
                while (true) {
                    const chk = checkRe.exec(output);
                    if (!chk || chk.index >= elseMatch.index) break;
                    if (chk[0] === '{{#') nestedDepth++;
                    else nestedDepth--;
                }
                if (nestedDepth === 0) {
                    elseIndex = elseMatch.index;
                    elseLength = elseMatch[0].length;
                    break;
                }
                maybeElse.lastIndex = elseMatch.index + 1;
            }

            const before = output.slice(0, openIndex);
            const endClose = closeIndex + closeTag.length;

            let innerContent: string;
            let elseContent = '';

            if (elseIndex !== -1) {
                innerContent = output.slice(openIndex + openLength, elseIndex);
                elseContent = output.slice(elseIndex + elseLength, closeIndex);
            } else {
                innerContent = output.slice(openIndex + openLength, closeIndex);
            }

            // Recursively process nested blocks inside content
            innerContent = processBlocks(innerContent, context);
            elseContent = processBlocks(elseContent, context);

            // Render based on block type
            let replacement = '';
            const value = getPath(context, condition);

            if (blockType === 'if') {
                const useContent = isTruthy(value) ? innerContent : elseContent;
                replacement = useContent.replace(/\{\{this\}\}/g, () => escapeHtml(String(value ?? '')));
                // Replace simple {{var}} interpolations in the processed content
                replacement = interpolateVars(replacement, context);
            } else if (blockType === 'unless') {
                const useContent = !isTruthy(value) ? innerContent : elseContent;
                replacement = useContent.replace(/\{\{this\}\}/g, () => escapeHtml(String(value ?? '')));
                replacement = interpolateVars(replacement, context);
            } else if (blockType === 'each') {
                // Coerce strings to arrays (split by newline — plugin
                // form textareas store multi-value data this way)
                const items = typeof value === 'string'
                    ? value.split('\n').filter((l: string) => l.trim() !== '')
                    : value;
                if (Array.isArray(items)) {
                    replacement = (items as unknown[]).map((item: unknown) => {
                        let itemContent = innerContent;
                        // {{this}} gets the current item
                        itemContent = itemContent.replace(/\{\{this\}\}/g, () => {
                            return escapeHtml(String(item ?? ''));
                        });
                        // {{field}} gets item.field
                        itemContent = interpolateVars(itemContent, item as TemplateData);
                        return itemContent;
                    }).join('');
                } else {
                    replacement = elseContent;
                }
            }

            output = before + replacement + output.slice(endClose);
        }

        return output;
    }

    // Process all blocks recursively
    result = processBlocks(result, data);

    // --- Phase 2: Simple variable interpolation ---
    result = interpolateVars(result, data);

    return result;
}

/**
 * Replace {{var}} and {{nested.path}} patterns in text with data values.
 * Does not handle block helpers (they're already processed).
 */
function interpolateVars(input: string, data: RenderContext): string {
    return input.replace(/\{\{([^#/][^}]*?)\}\}/g, (_match, key: string) => {
        const trimmed = key.trim();
        const value = getPath(data, trimmed);
        if (value === null || value === undefined) {
            return '';
        }
        return escapeHtml(String(value));
    });
}
