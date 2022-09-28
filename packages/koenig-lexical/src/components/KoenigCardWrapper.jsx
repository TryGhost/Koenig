import React from 'react';
import {mergeRegister} from '@lexical/utils';
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getSelection, $isNodeSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW} from 'lexical';

const KoenigCardWrapperComponent = ({nodeKey, children}) => {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
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
                    console.log(event.target, ref.current, ref.current.contains(event.target));
                    (ref.current.contains(event.target)) ? setSelected(true) : clearSelection();
                    return true;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, isSelected, setSelected, clearSelection, nodeKey]);

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
