import {
    HEADING,
    ORDERED_LIST,
    QUOTE,
    UNORDERED_LIST,
    BOLD_ITALIC_STAR,
    BOLD_ITALIC_UNDERSCORE,
    BOLD_STAR,
    BOLD_UNDERSCORE,
    INLINE_CODE,
    ITALIC_STAR,
    ITALIC_UNDERSCORE,
    STRIKETHROUGH
    // LINK
} from '@lexical/markdown';
import {$createLinkNode, $isLinkNode, LinkNode} from '@lexical/link';
import {$isTextNode, $createTextNode} from 'lexical';
import {MarkdownShortcutPlugin as LexicalMarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {$createHorizontalRuleNode, $isHorizontalRuleNode, HorizontalRuleNode} from '../nodes/HorizontalRuleNode';
import {$isCodeBlockNode, $createCodeBlockNode, CodeBlockNode} from '../nodes/CodeBlockNode';
import {$isImageNode, $createImageNode, ImageNode} from '../nodes/ImageNode';

// from https://github.com/facebook/lexical/blob/505641fa11ce2955ae94eeb8dcb4a8be14db23b0/packages/lexical-markdown/src/MarkdownTransformers.ts#L321
export const LINK = {
    dependencies: [LinkNode],
    export: (node, exportChildren, exportFormat) => {
        if (!$isLinkNode(node)) {
            return null;
        }
        const linkContent = `[${node.getTextContent()}](${node.getURL()})`;
        const firstChild = node.getFirstChild();
        // Add text styles only if link has single text node inside. If it's more
        // then one we ignore it as markdown does not support nested styles for links
        if (node.getChildrenSize() === 1 && $isTextNode(firstChild)) {
            return exportFormat(firstChild, linkContent);
        } else {
            return linkContent;
        }
    },
    importRegExp: /(?:\[([^[]+)\])(?:\(([^(]+)\))/,
    regExp: /(?:\[([^[]+)\])(?:\(([^(]+)\))$/,
    replace: (textNode, match) => {
        const [, linkText, linkUrl] = match;
        const linkNode = $createLinkNode(linkUrl);
        const linkTextNode = $createTextNode(linkText);
        linkTextNode.setFormat(textNode.getFormat());
        linkNode.append(linkTextNode);
        textNode.replace(linkNode);
    },
    trigger: ')',
    type: 'text-match'
};

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
        const initCode = text[1] || '';
        const language = match[1];
        const codeBlockNode = $createCodeBlockNode(language, initCode);
        textNode.replace(codeBlockNode);
    },
    type: 'element'
};

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
    importRexExp: /\[(.*?)\]\((.*?)\)/,
    regExp: /!\[(.*?)\]\((.*?)\)$/,
    replace: (textNode, match, text) => {
        const [, altText, src] = text;
        const imageNode = $createImageNode({altText, src});
        textNode.replace(imageNode);
    },
    type: 'element'
};

export const ELEMENT_TRANSFORMERS = [
    HR,
    CODE_BLOCK,
    IMAGE,
    LINK
];

export const DEFAULT_TRANSFORMERS = [
    ...ELEMENT_TRANSFORMERS,
    HEADING,
    QUOTE,
    UNORDERED_LIST,
    ORDERED_LIST,
    BOLD_ITALIC_STAR,
    BOLD_ITALIC_UNDERSCORE,
    BOLD_STAR,
    BOLD_UNDERSCORE,
    INLINE_CODE,
    ITALIC_STAR,
    ITALIC_UNDERSCORE,
    STRIKETHROUGH
];

export default function MarkdownShortcutPlugin({transformers = DEFAULT_TRANSFORMERS} = {}) {
    return LexicalMarkdownShortcutPlugin({transformers});
}
