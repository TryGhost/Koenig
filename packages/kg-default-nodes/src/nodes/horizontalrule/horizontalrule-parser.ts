import type {LexicalNode} from 'lexical';

export function parseHorizontalRuleNode(HorizontalRuleNode: new (data?: Record<string, unknown>) => unknown) {
    return {
        hr: () => ({
            conversion() {
                const node = new HorizontalRuleNode();
                return {node: node as LexicalNode};
            },
            priority: 0 as const
        })
    };
}
