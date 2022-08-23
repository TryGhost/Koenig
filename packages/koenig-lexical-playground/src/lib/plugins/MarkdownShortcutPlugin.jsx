import {MarkdownShortcutPlugin as LexicalMarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {TRANSFORMERS} from '@lexical/markdown';
import {$createHorizontalRuleNode, $isHorizontalRuleNode} from '../nodes/HorizontalRuleNode';

const HR = {
    export: (node) => {
        return $isHorizontalRuleNode(node) ? '***' : null;
    },
    regExp: /^(---|\*\*\*|___)\s?$/,
    replace: (parentNode, _1, _2, isImport) => {
        const line = $createHorizontalRuleNode();

        // TODO: Get rid of isImport flag
        if (isImport || parentNode.getNextSibling() != null) { // eslint-disable-line
            parentNode.replace(line);
        } else {
            parentNode.insertBefore(line);
        }

        line.selectNext();
    },
    type: 'element'
};
export const DEFAULT_TRANSFORMERS = [HR, ...TRANSFORMERS];

export default function MarkdownShortcutPlugin({transformers = DEFAULT_TRANSFORMERS}) {
    return LexicalMarkdownShortcutPlugin({transformers});
}
