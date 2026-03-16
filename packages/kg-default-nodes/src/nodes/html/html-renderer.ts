import {addCreateDocumentOption} from '../../utils/add-create-document-option.js';
import {renderEmptyContainer} from '../../utils/render-empty-container.js';
import {renderWithVisibility} from '../../utils/visibility.js';

interface HtmlNodeData {
    html: string;
    visibility?: Record<string, unknown>;
}

interface RenderOptions {
    createDocument?: () => Document;
    dom?: { window: { document: Document } };
    target?: string;
    [key: string]: unknown;
}

export function renderHtmlNode(node: HtmlNodeData, options: RenderOptions = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument!();

    const html = node.html;

    if (!html) {
        return renderEmptyContainer(document);
    }

    const wrappedHtml = `\n<!--kg-card-begin: html-->\n${html}\n<!--kg-card-end: html-->\n`;

    const textarea = document.createElement('textarea');
    textarea.value = wrappedHtml;

    if (node.visibility) {
        const renderOutput = {element: textarea, type: 'value'};
        return renderWithVisibility(renderOutput, node.visibility, options);
    }

    // `type: 'value'` will render the value of the textarea element
    return {element: textarea, type: 'value'};
}
