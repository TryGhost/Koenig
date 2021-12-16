/* global DOMParser, window */
export default function cleanBasicHtml(html = '', _options = {}) {
    const defaults = {};
    const options = Object.assign({}, defaults, _options);

    if (!options.createDocument) {
        const Parser = (typeof DOMParser !== 'undefined' && DOMParser) || (typeof window !== 'undefined' && window.DOMParser);

        if (!Parser) {
            throw new Error('cleanBasicHtml() must be passed a `createDocument` function as an option when used in a non-browser environment');
        }

        options.createDocument = function (docHtml) {
            const parser = new Parser();
            return parser.parseFromString(docHtml, 'text/html');
        };
    }

    let cleanHtml = html;

    if (!options.allowBr || cleanHtml === '<br>') {
        cleanHtml = cleanHtml
            .replace(/<br\s?\/?>/g, ' ');
    }

    cleanHtml = cleanHtml
        .replace(/(\s|&nbsp;){2,}/g, ' ')
        .trim()
        .replace(/^&nbsp;|&nbsp$/g, '')
        .trim();

    // remove any elements that have a blank textContent
    if (cleanHtml) {
        let doc = options.createDocument(cleanHtml);

        doc.body.querySelectorAll('*').forEach((element) => {
            // Treat Zero Width Non-Joiner characters as spaces
            if (!element.textContent.trim().replace(/\u200c+/g, '')) {
                if (options.allowBr && element.tagName === 'BR') {
                    // keep it
                    return;
                }
                if (options.allowBr && element.querySelector('br')) {
                    return element.replaceWith(doc.createElement('br'));
                }
                if (element.textContent.length > 0) {
                    // keep a single space to avoid collapsing spaces
                    let space = doc.createTextNode(' ');
                    return element.replaceWith(space);
                }
                return element.remove();
            }
        });

        cleanHtml = doc.body.innerHTML.trim();
    }

    return cleanHtml;
}
