import React from 'react';
import {
    $getSelection,
    COMMAND_PRIORITY_HIGH,
    $isRangeSelection,
    $createNodeSelection,
    $setSelection,
    $isParagraphNode,
    $isNodeSelection
} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {$createAudioNode, AudioNode, INSERT_AUDIO_COMMAND} from '../nodes/AudioNode';

export const AudioPlugin = () => {
    const [editor] = useLexicalComposerContext();

    const setNodeSelection = ({selection, selectedNode, newNode}) => {
        // insert a paragraph if this will be the last card and
        // we're not already on a blank paragraph so we always
        // have a trailing paragraph in the doc
        const selectedIsBlankParagraph = $isParagraphNode(selectedNode) && selectedNode.getTextContent() === '';
        const nextNode = selectedNode.getTopLevelElementOrThrow().getNextSibling();
        if (!selectedIsBlankParagraph && !nextNode) {
            selection.insertParagraph();
        }
        selectedNode
            .getTopLevelElementOrThrow()
            .insertBefore(newNode);
        const nodeSelection = $createNodeSelection();
        nodeSelection.add(newNode.getKey());
        $setSelection(nodeSelection);
    };

    React.useEffect(() => {
        if (!editor.hasNodes([AudioNode])){
            console.error('AudioPlugin: AudioNode not registered'); // eslint-disable-line no-console
            return;
        }
        return mergeRegister(
            editor.registerCommand(
                INSERT_AUDIO_COMMAND,
                async (dataset) => {
                    const selection = $getSelection();

                    let focusNode;
                    if ($isRangeSelection(selection)) {
                        focusNode = selection.focus.getNode();
                    } else if ($isNodeSelection(selection)) {
                        focusNode = selection.getNodes()[0];
                    }

                    if (focusNode !== null) {
                        const audioNode = $createAudioNode(dataset);
                        setNodeSelection({selection, selectedNode: focusNode, newNode: audioNode});
                    }

                    return true;
                },
                COMMAND_PRIORITY_HIGH
            )
        );
    }, [editor]);

    return null;
};

export default AudioPlugin;
