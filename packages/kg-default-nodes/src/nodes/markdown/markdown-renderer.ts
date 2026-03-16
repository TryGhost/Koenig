import {addCreateDocumentOption} from '../../utils/add-create-document-option.js';
import {render} from '@tryghost/kg-markdown-html-renderer';

interface MarkdownNodeData {
    markdown: string;
}

interface RenderOptions {
    createDocument?: () => Document;
    dom?: { window: { document: Document } };
    target?: string;
    [key: string]: unknown;
}

export function renderMarkdownNode(node: MarkdownNodeData, options: RenderOptions = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument!();

    const html = render(node.markdown || '', options);

    const element = document.createElement('div');
    element.innerHTML = html;

    // `type: 'inner'` will render only the innerHTML of the element
    // @see @tryghost/kg-lexical-html-renderer package
    return {element, type: 'inner'};
}
