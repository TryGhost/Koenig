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
import {UnsplashSelector} from '../components/ui/file-selectors/UnsplashSelector';
import ModalContainer from '../components/ui/ModalContainer';

export const UnsplashEmbedPlugin = ({container}) => {
    const [editor] = useLexicalComposerContext();
    const [isActive, setIsActive] = React.useState(false);

    React.useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                INSERT_UNSPLASH_COMMAND,
                async () => {
                    setIsActive(!isActive);
                }, COMMAND_PRIORITY_HIGH
            )
        );
    }, [editor, isActive]);

    if (isActive) {
        return (
            <ModalContainer 
                component={<UnsplashSelector toggle={setIsActive} />} 
                container={container} 
            />
        );
    }
    return null;
};

export default UnsplashEmbedPlugin;
