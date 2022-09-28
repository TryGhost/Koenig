import React from 'react';
import {mergeRegister} from '@lexical/utils';
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getSelection, $isNodeSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW} from 'lexical';

const KoenigCardWrapperComponent = ({nodeKey, children}) => {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey);
    const [selection, setSelection] = React.useState(null);
    const ref = React.useRef(null);

    React.useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({editorState}) => {
                setSelection(editorState.read(() => $getSelection()));
            }),
            editor.registerCommand(
                CLICK_COMMAND,
                (event) => {
                    setSelected(ref.current.contains(event.target));
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, isSelected, setSelected, nodeKey]);

    const isFocused = $isNodeSelection(selection) && isSelected;

    return (
        <div
            className={`relative caret-grey-800 hover:shadow-[0_0_0_1px] hover:shadow-green ${isFocused ? 'shadow-[0_0_0_1px] shadow-green' : ''}`}
            ref={ref}
            data-kg-card
        >
            {children}
        </div>
    );
};

export default KoenigCardWrapperComponent;
