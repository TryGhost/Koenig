import React from 'react';
import {$createBookmarkNode, BookmarkNode, INSERT_BOOKMARK_COMMAND} from '../nodes/BookmarkNode';
import {COMMAND_PRIORITY_LOW} from 'lexical';
import {INSERT_CARD_COMMAND} from './KoenigBehaviourPlugin';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export const BookmarkPlugin = () => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        if (!editor.hasNodes([BookmarkNode])){
            console.error('BookmarkPlugin: BookmarkNode not registered'); // eslint-disable-line no-console
            return;
        }
        return mergeRegister(
            editor.registerCommand(
                INSERT_BOOKMARK_COMMAND,
                async (dataset) => {
                    const cardNode = $createBookmarkNode(dataset);
                    editor.dispatchCommand(INSERT_CARD_COMMAND, {cardNode});

                    return true;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor]);

    return null;
};

export default BookmarkPlugin;
