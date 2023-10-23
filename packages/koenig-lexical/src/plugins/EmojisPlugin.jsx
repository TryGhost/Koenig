// adapted from facebook/lexical/packages/koenig-lexical/src/plugins/EmojiPlugin.jsx
import {$createEmojiNode, EmojiNode, ExtendedTextNode} from '@tryghost/kg-default-nodes';
import {useEffect} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const emojis = new Map([
    [':)', ['emoji happysmile', '🙂']],
    [':D', ['emoji veryhappysmile', '😀']],
    [':(', ['emoji unhappysmile', '🙁']],
    ['<3', ['emoji heart', '❤']],
    ['🙂', ['emoji happysmile', '🙂']],
    ['😀', ['emoji veryhappysmile', '😀']],
    ['🙁', ['emoji unhappysmile', '🙁']],
    ['❤', ['emoji heart', '❤']]
]);

function findAndTransformEmoji(node) {
    const text = node.getTextContent();

    for (let i = 0; i < text.length; i++) {
        const emojiData = emojis.get(text[i]) || emojis.get(text.slice(i, i + 2));

        if (emojiData !== undefined) {
            const [emojiStyle, emojiText] = emojiData;
            let targetNode;

            if (i === 0) {
                [targetNode] = node.splitText(i + 2);
            } else {
                [, targetNode] = node.splitText(i, i + 2);
            }

            const emojiNode = $createEmojiNode(emojiStyle, emojiText);
            targetNode.replace(emojiNode);
            return emojiNode;
        }
    }

    return null;
}

function textNodeTransform(node) {
    if (!node.isSimpleText()) {
        return;
    }

    node = findAndTransformEmoji(node);
}

function useEmojis(editor) {
    useEffect(() => {
        if (!editor.hasNodes([EmojiNode])) {
            throw new Error('EmojisPlugin: EmojiNode not registered on editor');
        }

        return editor.registerNodeTransform(ExtendedTextNode, textNodeTransform);
    }, [editor]);
}

export default function EmojisPlugin() {
    const [editor] = useLexicalComposerContext();
    useEmojis(editor);
    return null;
}