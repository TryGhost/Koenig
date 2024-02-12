import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createHtmlNode, HtmlNodeDataset} from './HtmlNode';

export function parseHtmlNode(): DOMConversionMap | null {
    return {
        '#comment': (nodeElem: HTMLElement): DOMConversion | null => {
            if (nodeElem.nodeType === 8 && nodeElem.nodeValue?.trim().match(/^kg-card-begin:\s?html$/)) {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        const html = [];
                        let nextNode = domNode.nextSibling as HTMLElement;

                        while (nextNode && !isHtmlEndComment(nextNode)) {
                            const currentNode = nextNode as HTMLElement;
                            html.push(currentNode.outerHTML);
                            nextNode = currentNode.nextSibling as HTMLElement;
                            // remove nodes as we go so that they don't go through the parser
                            currentNode.remove();
                        }

                        const payload: HtmlNodeDataset = {html: html.join('\n').trim()};
                        const node = $createHtmlNode(payload);
                        return {node};
                    },
                    priority: 0
                };
            }

            return null;
        },
        table: (nodeElem: HTMLElement): DOMConversion | null => {
            const parentNode = nodeElem.parentNode as HTMLElement;
            if (nodeElem.nodeType === 1 && nodeElem.tagName === 'TABLE' && parentNode?.tagName !== 'TABLE') {
                return {
                    conversion(domNode: HTMLElement): DOMConversionOutput {
                        const payload: HtmlNodeDataset = {html: domNode.outerHTML};
                        const node = $createHtmlNode(payload);
                        return {node};
                    },
                    priority: 0
                };
            }

            return null;
        }
    };
}

function isHtmlEndComment(node: HTMLElement) {
    return node && node.nodeType === 8 && node.nodeValue?.trim().match(/^kg-card-end:\s?html$/);
}
