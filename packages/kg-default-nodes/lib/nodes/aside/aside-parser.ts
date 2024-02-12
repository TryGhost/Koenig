import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createAsideNode} from './AsideNode';

export function parseAsideNode(): DOMConversionMap | null {
    return {
        blockquote: (nodeElem: HTMLElement): DOMConversion | null => {
            const isBigQuote = nodeElem.classList?.contains('kg-blockquote-alt');
            if (nodeElem.tagName === 'BLOCKQUOTE' && isBigQuote) {
                return {
                    conversion(): DOMConversionOutput {
                        const node = $createAsideNode();
                        return {node};
                    },
                    priority: 0
                };
            }

            return null;
        }
    };
}