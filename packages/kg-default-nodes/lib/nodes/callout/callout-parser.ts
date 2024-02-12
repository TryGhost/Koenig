import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createCalloutNode, CalloutNodeDataset} from './CalloutNode';

const getColorTag = (nodeElem: HTMLElement) => {
    const colorClass = nodeElem.classList?.value?.match(/kg-callout-card-(\w+)/);
    return colorClass && colorClass[1];
};

export function parseCalloutNode(): DOMConversionMap | null {
    return {
        div: (nodeElem: HTMLElement): DOMConversion | null => {
            const isKgCalloutCard = nodeElem.classList?.contains('kg-callout-card');
            if (nodeElem.tagName === 'DIV' && isKgCalloutCard) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        const textNode = domNode?.querySelector('.kg-callout-text');
                        const emojiNode = domNode?.querySelector('.kg-callout-emoji');
                        const color = getColorTag(domNode);

                        const payload = {
                            calloutText: textNode && textNode.innerHTML.trim() || '',
                            calloutEmoji: emojiNode && emojiNode.innerHTML.trim() || '',
                            backgroundColor: color
                        } as CalloutNodeDataset;

                        const node = $createCalloutNode(payload);
                        return {node};
                    },
                    priority: 1
                };
            }
            return null;
        }
    };
}
