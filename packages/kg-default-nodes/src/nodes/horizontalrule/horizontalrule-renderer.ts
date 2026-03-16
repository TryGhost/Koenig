import {addCreateDocumentOption} from '../../utils/add-create-document-option.js';

interface RenderOptions {
    createDocument?: () => Document;
    dom?: { window: { document: Document } };
    [key: string]: unknown;
}

export function renderHorizontalRuleNode(_: unknown, options: RenderOptions = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument!();

    const element = document.createElement('hr');
    return {element};
}