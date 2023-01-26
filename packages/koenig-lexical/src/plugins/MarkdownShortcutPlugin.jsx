import {
    HEADING,
    ORDERED_LIST,
    QUOTE,
    UNORDERED_LIST,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS
} from '@lexical/markdown';
import {MarkdownShortcutPlugin as LexicalMarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {$createHorizontalRuleNode, $isHorizontalRuleNode, HorizontalRuleNode} from '../nodes/HorizontalRuleNode';
import {$isCodeBlockNode, $createCodeBlockNode, CodeBlockNode} from '../nodes/CodeBlockNode';
import {$isImageNode, $createImageNode, ImageNode} from '../nodes/ImageNode';
import {$createNodeSelection, $setSelection} from 'lexical';

export const HR = {
    dependencies: [HorizontalRuleNode],
    export: (node) => {
        return $isHorizontalRuleNode(node) ? '---' : null;
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

export const CODE_BLOCK = {
    dependencies: [CodeBlockNode],
    export: (node) => {
        if (!$isCodeBlockNode(node)) {
            return null;
        }
        const textContent = node.getTextContent();
        return (
            '```' +
            (node.getLanguage() || '') +
            (textContent ? '\n' + textContent : '') +
            '\n' +
            '```'
        );
    },
    regExp: /^```(\w{1,10})?\s/,
    replace: (textNode, match, text) => {
        const language = text[1];
        const codeBlockNode = $createCodeBlockNode({language, _openInEditMode: true});
        const replacementNode = textNode.replace(codeBlockNode);

        // select node when replacing so it immediately renders in editing mode
        const replacementSelection = $createNodeSelection();
        replacementSelection.add(replacementNode.getKey());
        $setSelection(replacementSelection);
    },
    type: 'element'
};

// render imageNode when writing image!
// regex that detects exactly the string 'image!'

export const IMAGE = {
    dependencies: [ImageNode],
    export: (node) => {
        if (!$isImageNode(node)){
            return null;
        } else {
            const {src, alt} = node.dataset;
            return `![${alt}](${src})`;
        }
    },
    regExp: /^image! $/,
    replace: (parentNode, match, text) => {
        const alt = '';
        const src = '';
        const imageNode = $createImageNode({altText: alt, src});
        parentNode.replace(imageNode);
    },
    type: 'element'
};

export const ELEMENT_TRANSFORMERS = [
    HEADING,
    QUOTE,
    UNORDERED_LIST,
    ORDERED_LIST,
    HR,
    CODE_BLOCK,
    IMAGE
];

export const DEFAULT_TRANSFORMERS = [
    ...ELEMENT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_MATCH_TRANSFORMERS
];

export default function MarkdownShortcutPlugin({transformers = DEFAULT_TRANSFORMERS} = {}) {
    return LexicalMarkdownShortcutPlugin({transformers});
}
