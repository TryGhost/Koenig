import type {LexicalNode} from 'lexical';

export function parsePaywallNode(PaywallNode: new (data?: Record<string, unknown>) => unknown) {
    return {
        '#comment': (nodeElem: Node) => {
            if (nodeElem.nodeType === 8 && nodeElem.nodeValue?.trim() === 'members-only') {
                return {
                    conversion() {
                        const node = new PaywallNode();
                        return {node: node as LexicalNode};
                    },
                    priority: 0 as const
                };
            }
            return null;
        }
    };
}
