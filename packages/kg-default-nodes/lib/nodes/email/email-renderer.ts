import {addCreateDocumentOption} from '../../utils/add-create-document-option';
import {removeSpaces, removeCodeWrappersFromHelpers, wrapReplacementStrings} from '../../utils/replacement-strings';
import {renderEmptyContainer} from '../../utils/render-empty-container';
import {EmailNode} from './EmailNode';
import {RendererOptions} from '../../types';
import {KoenigDecoratorRendererOutput} from '../../generate-decorator-node';

export function renderEmailNode(node: EmailNode, options: RendererOptions): KoenigDecoratorRendererOutput | null {
    addCreateDocumentOption(options);
    const document = options.createDocument && options.createDocument();

    if (!document) {
        return null;
    }

    const html = node.html;

    if (!html || options.target !== 'email') {
        return renderEmptyContainer(document);
    }

    const cleanedHtml = wrapReplacementStrings(removeCodeWrappersFromHelpers(removeSpaces(html),document));

    const element = document.createElement('div');
    element.innerHTML = cleanedHtml;

    // `type: 'inner'` will render only the innerHTML of the element
    // @see @tryghost/kg-lexical-html-renderer package
    return {element, type: 'inner'};
}