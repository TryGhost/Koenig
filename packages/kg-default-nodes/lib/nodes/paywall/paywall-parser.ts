import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createPaywallNode} from './PaywallNode';

export function parsePaywallNode(): DOMConversionMap | null {
    return {
        '#comment': (nodeElem: HTMLElement): DOMConversion | null => {
            if (nodeElem.nodeType === 8 && nodeElem.nodeValue?.trim() === 'members-only') {
                return {
                    conversion(): DOMConversionOutput {
                        const node = $createPaywallNode();
                        return {node};
                    },
                    priority: 0
                };
            }
            return null;
        }
    };
}
