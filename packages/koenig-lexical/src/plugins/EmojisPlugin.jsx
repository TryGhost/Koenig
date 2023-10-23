// adapted from facebook/lexical/packages/koenig-lexical/src/plugins/EmojiPlugin.jsx
import EmojiPickerPortal from '../components/ui/EmojiPickerPortal';
import {$createEmojiNode, EmojiNode, ExtendedTextNode} from '@tryghost/kg-default-nodes';
import {$getSelection, $isRangeSelection, $isTextNode} from 'lexical';
import {getSelectedNode} from '../utils/getSelectedNode';
import {useEffect, useRef, useState} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// TODO: map emojis to the data from the data mart (use search)
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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const positionRef = useRef(null);
    const searchInput = useState();
    // TODO: query the text that's written for a match in the emoji mart data
    // TODO: allow enter to pick the emoji highlighted
    // xxxxx TODO: can we hide the search bar since we're using our input?
    // TODO: maybe refactor the EmojiPickerPortal component to be a bit more generalisable?

    useEffect(() => {
        if (!editor.hasNodes([EmojiNode])) {
            throw new Error('EmojisPlugin: EmojiNode not registered on editor');
        }

        return editor.registerNodeTransform(ExtendedTextNode, textNodeTransform);
    }, [editor]);

    // logic for opening the emoji picker
    useEffect(() => {
        if (showEmojiPicker) {
            return;
        }
        const triggerEmojiPicker = (event) => {
            const {key, isComposing, ctrlKey, metaKey} = event;

            // TODO: change this so that it's only the character after the : that triggers it
            // we only care about / presses when not composing or pressed with modifiers
            if (key !== ':' || isComposing || ctrlKey || metaKey) {
                return;
            }

            // ignore if editor doesn't have focus
            const rootElement = editor.getRootElement();
            if (!rootElement.matches(':focus')) {
                return;
            }

            // potentially valid : press
            editor.getEditorState().read(() => {
                const selection = $getSelection();
                const node = getSelectedNode(selection);

                // skip when text is selected
                // TODO: allow it when the whole node is selected and this is a replacement
                if (!selection.isCollapsed()) {
                    return;
                }
            
                // TODO: limit it opening for:
                //  - text node
                //  - start of paragraph node or listitemnode (could make parent-generic, maybe? with schema...)

                // NOTE: doesn't work at the start of a paragraph node for whatever reason
                if (!$isTextNode(node)) {
                    return;
                }

                positionRef.current = event.target;
                setShowEmojiPicker(true);
            });
        };
        window.addEventListener('keypress', triggerEmojiPicker);
        return () => {
            window.removeEventListener('keypress', triggerEmojiPicker);
        };
    });

    // logic for closing the emoji picker
    useEffect(() => {
        return editor.registerUpdateListener(() => {
            editor.getEditorState().read(() => {
                // don't do anything when using IME input
                if (editor.isComposing()) {
                    return;
                }
                
                const selection = $getSelection();

                if (!$isRangeSelection(selection || !selection?.type === 'text' || !selection?.isCollapsed())) {
                    console.log(`not the right selection`);
                    setShowEmojiPicker(false);
                    return;
                }

                const node = getSelectedNode(selection);

                // TODO: logic for the content in the text node not matching... will want a regex here?
                console.log(`text at selection.focus.offset`,selection.focus.offset,node.getTextContent(),node.getTextContent().charAt(selection.focus.offset));
                if (!node || !$isTextNode(node) || !node.getTextContent().charAt(selection.focus.offset) === ':') {
                    console.log('closing based on whats selected');
                    setShowEmojiPicker(false);
                    return;
                }

                // same logic above using the native selection
                const nativeSelection = window.getSelection();
                const anchorNode = nativeSelection.anchorNode;
                const rootElement = editor.getRootElement();

                if (anchorNode?.nodeType !== Node.TEXT_NODE || !rootElement.contains(anchorNode)) {
                    console.log(`closing based on native selection`);
                    setShowEmojiPicker(false);
                    return;
                }
            });
        });
    }, [editor]);

    // TODO: update the search string based on the text near the cursor

    if (showEmojiPicker) {
        return (
            <EmojiPickerPortal autoFocus={false} positionRef={positionRef} searchPosition={'none'} value={searchInput} />
        );
    }

    return null;
}

export default function EmojisPlugin() {
    const [editor] = useLexicalComposerContext();
    return useEmojis(editor);
}