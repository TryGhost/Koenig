import EmojiPickerPortal from '../components/ui/EmojiPickerPortal';
import React from 'react';
import emojiData from '@emoji-mart/data';
import {$createTextNode, $getSelection, $isRangeSelection} from 'lexical';
import {
    LexicalTypeaheadMenuPlugin,
    useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {SearchIndex, init} from 'emoji-mart';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

init({data: emojiData});

export function EmojiPickerPlugin() {
    const [editor] = useLexicalComposerContext();
    const [queryString, setQueryString] = React.useState(null);
    const [emojis, setEmojis] = React.useState(null);

    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(':', {minLength: 1});

    React.useEffect(() => {
        if (!queryString) {
            setEmojis(null);
        }

        async function searchEmojis() {
            const filteredEmojis = await SearchIndex.search(queryString);
            console.log(filteredEmojis);
            setEmojis(filteredEmojis);
        }

        searchEmojis();
    }, [queryString]);

    const onEmojiSelect = React.useCallback((emoji, event) => {
        editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection) || emoji === null) {
                return;
            }

            selection.insertNodes([$createTextNode(emoji.native)]);

            setEmojis([]); // closes the emoji picker
        });
    }, [editor]);

    return (
        <LexicalTypeaheadMenuPlugin
            menuRenderFn={(
                anchorElementRef
            ) => {
                if (anchorElementRef.current === null || emojis.length === 0) {
                    return null;
                }

                return (
                    <EmojiPickerPortal
                        data={emojis}
                        positionRef={anchorElementRef}
                        searchPosition='none'
                        onEmojiClick={onEmojiSelect}
                    />
                );
            }}
            options={emojis}
            triggerFn={checkForTriggerMatch}
            onQueryChange={setQueryString}
        />
    );
}
