import {addCreateDocumentOption} from '../../utils/add-create-document-option';

export function renderHtmlNodeToDOM(node, options = {}) {
    addCreateDocumentOption(options);

    const document = options.createDocument();

    let html = node.getHtml() || '';

    html = '<!--kg-card-begin: html-->' + html + '<!--kg-card-end: html-->';

    const div = document.createElement('div');

    div.innerHTML = html;

    return {element: div};
}
