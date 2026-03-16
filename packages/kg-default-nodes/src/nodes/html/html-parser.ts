import type {LexicalNode} from 'lexical';

export function parseHtmlNode(HtmlNode: new (data: Record<string, unknown>) => unknown) {
    return {
        '#comment': (nodeElem: Node) => {
            if (nodeElem.nodeType === 8 && nodeElem.nodeValue?.trim().match(/^kg-card-begin:\s?html$/)) {
                return {
                    conversion(domNode: Node) {
                        const html = [];
                        let nextNode = domNode.nextSibling;

                        while (nextNode && !isHtmlEndComment(nextNode)) {
                            const currentNode = nextNode;
                            html.push((currentNode as Element).outerHTML);
                            nextNode = currentNode.nextSibling;
                            // remove nodes as we go so that they don't go through the parser
                            currentNode.remove();
                        }

                        const payload: Record<string, unknown> = {html: html.join('\n').trim()};
                        const node = new HtmlNode(payload);
                        return {node: node as LexicalNode};
                    },
                    priority: 0 as const
                };
            }

            return null;
        },
        table: (nodeElem: HTMLElement) => {
            if (nodeElem.nodeType === 1 && nodeElem.tagName === 'TABLE' && (nodeElem.parentNode as HTMLElement)?.tagName !== 'TABLE') {
                return {
                    conversion(domNode: HTMLElement) {
                        const payload: Record<string, unknown> = {html: domNode.outerHTML};
                        const node = new HtmlNode(payload);
                        return {node: node as LexicalNode};
                    },
                    priority: 0 as const
                };
            }

            return null;
        }
    };
}

function isHtmlEndComment(node: Node) {
    return node && node.nodeType === 8 && node.nodeValue?.trim().match(/^kg-card-end:\s?html$/);
}
