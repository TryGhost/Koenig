import React from 'react';
import {$createHeaderNode, HeaderNode2, INSERT_HEADER_COMMAND} from '../nodes/HeaderNode2';
import {COMMAND_PRIORITY_LOW} from 'lexical';
import {INSERT_CARD_COMMAND} from './KoenigBehaviourPlugin';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export const HeaderPlugin2 = () => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        if (!editor.hasNodes([HeaderNode2])){
            console.error('HeaderPlugin: HeaderNode not registered'); // eslint-disable-line no-console
            return;
        }
        return mergeRegister(
            editor.registerCommand(
                INSERT_HEADER_COMMAND,
                async (dataset) => {
                    const cardNode = $createHeaderNode(dataset);
                    editor.dispatchCommand(INSERT_CARD_COMMAND, {cardNode, openInEditMode: true});

                    return true;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    });

    return null;
};

export default HeaderPlugin2;
