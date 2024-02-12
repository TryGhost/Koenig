import {DOMConversion, DOMConversionMap, DOMConversionOutput} from 'lexical';
import {$createHorizontalRuleNode} from './HorizontalRuleNode';

export function parseHorizontalRuleNode(): DOMConversionMap | null {
    return {
        hr: (): DOMConversion => ({
            conversion(): DOMConversionOutput {
                const node = $createHorizontalRuleNode();
                return {node};
            },
            priority: 0
        })
    };
}
