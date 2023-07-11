import {JSDOM} from 'jsdom';
import {addCreateDocumentOption} from '../../utils/add-create-document-option';

export function renderCalloutNode(node, options = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument();

    const element = document.createElement('div');
    element.classList.add('kg-card', 'kg-callout-card', `kg-callout-card-${node.backgroundColor}`);

    if (node.calloutEmoji) {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('kg-callout-emoji');
        emojiElement.textContent = node.calloutEmoji;
        element.appendChild(emojiElement);
    }

    const textElement = document.createElement('div');
    textElement.classList.add('kg-callout-text');
    
    const dom = new JSDOM(node.calloutText);
    const allowedTags = ['A', 'STRONG', 'EM', 'B', 'I', 'BR'];
    
    const body = dom.window.document.body;
    cleanDOM(body, allowedTags);
    
    textElement.innerHTML = body.innerHTML;
    element.appendChild(textElement);

    return {element};
}

function cleanDOM(node, allowedTags) {
    for (let i = 0; i < node.childNodes.length; i++) {
        let child = node.childNodes[i];
        if (child.nodeType === 1 && !allowedTags.includes(child.tagName)) {
            while (child.firstChild) {
                node.insertBefore(child.firstChild, child);
            }
            node.removeChild(child);
            i -= 1;
        } else {
            cleanDOM(child, allowedTags);
        }
    }
}
