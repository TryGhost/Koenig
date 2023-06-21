import {addCreateDocumentOption} from '../../utils/add-create-document-option';

export function renderPaywallNode(_, options = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument();
    const element = document.createElement('div');

    element.innerHTML = '<!--members-only-->';

    // type: 'inner' will render only the innerHTML of the element
    // @see https://github.com/TryGhost/Koenig/blob/e14c008e176f7a1036fe3f3deb924ed69a69191f/packages/kg-lexical-html-renderer/lib/convert-to-html-string.js#L29
    return {element, type: 'inner'};
}
