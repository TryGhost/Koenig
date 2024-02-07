import {$createAsideNode} from './AsideNode';

export function parseAsideNode() {
    return {
        blockquote: (nodeElem: HTMLElement) => {
            const isBigQuote = nodeElem.classList?.contains('kg-blockquote-alt');
            if (nodeElem.tagName === 'BLOCKQUOTE' && isBigQuote) {
                return {
                    conversion() {
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