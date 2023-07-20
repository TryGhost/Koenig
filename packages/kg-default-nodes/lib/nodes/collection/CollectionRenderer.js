import {addCreateDocumentOption} from '../../utils/add-create-document-option';

export function renderCollectionNode(node, options = {}) {
    console.log(`rendering collection node`, node);
    addCreateDocumentOption(options);
    const document = options.createDocument();

    const htmlString = cardTemplate(node);

    const element = document.createElement('div');
    element.innerHTML = htmlString?.trim();

    return {element: element.firstElementChild};
}

function cardTemplate(node) {
    const {collection, postCount, layout, columns, header} = node.getDataset();
    return `<p>collection card</p>`;
}