import {MarkdownShortcutPlugin as LexicalMarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {TRANSFORMERS} from '@lexical/markdown';
import {$createHorizontalRuleNode, $isHorizontalRuleNode} from '../nodes/HorizontalRuleNode';
import {$isImageNode, $createImageNode} from '../nodes/ImageNode';

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

const IMAGE = {
    export: (node) => {
        if (!$isImageNode(node)) {
            return null;
        }
        return `![${node.getAltText()}](${node.getSrc()})`;
    },
    importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
    regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
    replace: (textNode, match) => {
        const [, altText, src] = match;
        const dataset = {
            alt: altText,
            src: src
        };
        const imageNode = $createImageNode(dataset);
        textNode.replace(imageNode);
    },
    trigger: ')',
    type: 'text-match'
};

export const DEFAULT_TRANSFORMERS = [HR, IMAGE, ...TRANSFORMERS];

export default function MarkdownShortcutPlugin({transformers = DEFAULT_TRANSFORMERS}) {
    return LexicalMarkdownShortcutPlugin({transformers});
}
