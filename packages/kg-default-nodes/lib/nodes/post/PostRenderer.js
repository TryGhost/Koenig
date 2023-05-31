import {addCreateDocumentOption} from '../../utils/add-create-document-option';
import {renderEmptyContainer} from '../../utils/render-empty-container';

export function renderPostNode(node, options = {}) {
    // Render nothing if no content, or if we're targetting email
    if (!node.content || options.target === 'email') {
        renderEmptyContainer();
    }

    addCreateDocumentOption(options);
    const document = options.createDocument();

    const element = document.createElement('div');
    element.classList.add('kg-card', 'kg-post-card');
    element.innerHTML = node.content;

    return {element};
}