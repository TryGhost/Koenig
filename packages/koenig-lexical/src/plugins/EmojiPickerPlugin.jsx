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
    const [searchResults, setSearchResults] = React.useState(null);
    const pickerInstance = React.useRef(null);

    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(':', {minLength: 1});

    React.useEffect(() => {
        if (!queryString) {
            pickerInstance.current?.component.setState({searchResults: null, pos: [-1, -1]});
            return;
        }

        async function searchEmojis() {
            const filteredEmojis = await SearchIndex.search(queryString);

            const grid = [];
            grid.setsize = filteredEmojis.length;
            let row = null;

            for (const emoji of filteredEmojis) {
                // 9 = EmojiPickerPortal default perLine
                if (!grid.length || row.length === 9) {
                    row = [];
                    row.__categoryId = 'search';
                    row.__index = grid.length;
                    grid.push(row);
                }

                row.push(emoji);
            }

            console.log(pickerInstance.current);
            pickerInstance.current?.component.setState({searchResults: grid, pos: [0, 0]});
            setSearchResults(grid);
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

            pickerInstance.current?.component.setState({searchResults: null, pos: [-1, -1]});
            setSearchResults(null); // closes the emoji picker
        });
    }, [editor]);

    const setPickerInstance = function (instance) {
        pickerInstance.current = instance;
    };

    return (
        <LexicalTypeaheadMenuPlugin
            menuRenderFn={(
                anchorElementRef
            ) => {
                if (anchorElementRef.current === null || searchResults === null || searchResults.length === 0) {
                    return null;
                }

                return (
                    <EmojiPickerPortal
                        positionRef={anchorElementRef}
                        searchPosition='none'
                        setInstanceRef={setPickerInstance}
                        onEmojiClick={onEmojiSelect}
                    />
                );
            }}
            options={searchResults}
            triggerFn={checkForTriggerMatch}
            onQueryChange={setQueryString}
        />
    );
}
