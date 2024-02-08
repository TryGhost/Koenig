import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createCollectionNode, CollectionNodeDataset} from './CollectionNode';

function getLayout(domNode: HTMLElement) {
    if (domNode.classList.contains('kg-collection-card-list')) {
        return 'list';
    } else { // should have kg-collection-card-grid
        return 'grid';
    }
}

function getColumns(domNode: HTMLElement) {
    if (domNode.classList.contains('columns-1')) {
        return 1;
    }
    if (domNode.classList.contains('columns-2')) {
        return 2;
    }
    if (domNode.classList.contains('columns-3')) {
        return 3;
    }
    if (domNode.classList.contains('columns-4')) {
        return 4;
    }
}

export function collectionParser(): DOMConversionMap | null {
    return {
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            const isCollectionNode = nodeElem.classList?.contains('kg-collection-card');
            if (nodeElem.tagName === 'DIV' && isCollectionNode) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        const postCount = parseInt(domNode.getAttribute('data-kg-collection-limit') || '');
                        const collection = domNode.getAttribute('data-kg-collection-slug');
                        const layout = getLayout(domNode);
                        const header = domNode.querySelector('.kg-collection-card-title')?.textContent || '';
                        const columns = layout === 'list' ? 3 : getColumns(domNode); // default to 3 if switched to grid

                        const payload = {
                            collection,
                            postCount,
                            layout,
                            columns,
                            header
                        } as CollectionNodeDataset;

                        const node = $createCollectionNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}
