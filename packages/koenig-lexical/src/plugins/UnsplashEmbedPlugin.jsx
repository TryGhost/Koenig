import React from 'react';
import {
    // $getSelection,
    COMMAND_PRIORITY_HIGH
    // $isRangeSelection,
    // $createNodeSelection,
    // $setSelection,
    // $isParagraphNode
} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {INSERT_UNSPLASH_COMMAND} from '../nodes/EmbedNode';

export const UnsplashEmbedPlugin = () => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                INSERT_UNSPLASH_COMMAND,
                async () => {
                    
                }, COMMAND_PRIORITY_HIGH
            )
        );
    }, [editor]);
    return null;
};

export default UnsplashEmbedPlugin;
