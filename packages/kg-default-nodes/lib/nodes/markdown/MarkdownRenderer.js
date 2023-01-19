import markdownHtmlRenderer from '@tryghost/kg-markdown-html-renderer';

export function renderMarkdownNodeToDOM(node, options = {}) {
    /* c8 ignore start */
    if (!options.createDocument) {
        let document = typeof window !== 'undefined' && window.document;

        if (!document) {
            throw new Error('renderMarkdownNodeToDOM() must be passed a `createDocument` function as an option when used in a non-browser environment'); // eslint-disable-line
        }

        options.createDocument = function () {
            return document;
        };
    }
    /* c8 ignore stop */

    const document = options.createDocument();

    const html = markdownHtmlRenderer.render(node.getMarkdown() || '', options);

    const div = document.createElement('div');

    div.innerHTML = html;

    return div;
}
