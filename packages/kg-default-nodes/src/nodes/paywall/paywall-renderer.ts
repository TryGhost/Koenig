import {addCreateDocumentOption} from '../../utils/add-create-document-option.js';

interface RenderOptions {
    createDocument?: () => Document;
    dom?: { window: { document: Document } };
    [key: string]: unknown;
}

export function renderPaywallNode(_: unknown, options: RenderOptions = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument!();
    const element = document.createElement('div');

    element.innerHTML = '<!--members-only-->';

    // `type: 'inner'` will render only the innerHTML of the element
    // @see @tryghost/kg-lexical-html-renderer package
    return {element, type: 'inner'};
}
