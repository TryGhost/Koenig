import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createToggleNode, ToggleNodeDataset} from './ToggleNode';

export function parseToggleNode(): DOMConversionMap | null {
    return {
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            const isKgToggleCard = nodeElem.classList?.contains('kg-toggle-card');
            if (nodeElem.tagName === 'DIV' && isKgToggleCard) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput | null {
                        const headingNode = domNode.querySelector('.kg-toggle-heading-text');
                        const heading = headingNode?.textContent || '';

                        const contentNode = domNode.querySelector('.kg-toggle-content');
                        const content = contentNode?.textContent || '';

                        const payload: ToggleNodeDataset = {
                            heading,
                            content
                        };

                        const node = $createToggleNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}