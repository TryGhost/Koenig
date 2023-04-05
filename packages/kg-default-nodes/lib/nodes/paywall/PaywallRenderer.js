import {addCreateDocumentOption} from '../../utils/add-create-document-option';

export function renderPaywallNodeToDOM(_, options = {}) {
    addCreateDocumentOption(options);

    const document = options.createDocument();
    const span = document.createElement('span');
    const paywall = document.createComment('members-only');

    span.appendChild(paywall);
    span.setAttribute('hidden', 'true');

    return span;
}
