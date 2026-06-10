import KoenigComposerContext from '../context/KoenigComposerContext';
import React from 'react';
import throttle from 'lodash/throttle';
import {$getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {utils} from '@tryghost/helpers';

const {countWords} = utils;

// Reports the selection's word count: an integer (0 allowed) while a
// non-collapsed range selection exists, null otherwise.
export const SelectionWordCountPlugin = ({onChange} = {}) => {
    const [editor] = useLexicalComposerContext();
    const {onSelectionWordCountChangeRef, selectionWordCountsRef} = React.useContext(KoenigComposerContext);

    React.useLayoutEffect(() => {
        if (!onChange) {
            return;
        }

        // store onChange in context so that KoenigNestedComposer can render
        // a nested <SelectionWordCountPlugin /> without passing onChange down
        if (!editor._parentEditor) {
            onSelectionWordCountChangeRef.current = onChange;
        }

        // a selection lives in exactly one editor at a time but a plugin
        // instance exists per editor (main + nested caption editors). Each
        // instance writes its own editor's selection count into the shared
        // map and emits the combined value so that the emission order
        // between editor instances doesn't matter
        const counts = selectionWordCountsRef.current;
        let lastEmitted;

        const emitCombined = () => {
            let combined = null;

            for (const count of counts.values()) {
                if (count !== null) {
                    combined = count;
                    break;
                }
            }

            if (combined !== lastEmitted) {
                lastEmitted = combined;
                onChange(combined);
            }
        };

        const updateSelectionCount = () => {
            editor.getEditorState().read(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection) && !selection.isCollapsed()) {
                    counts.set(editor.getKey(), countWords(selection.getTextContent()));
                } else {
                    counts.set(editor.getKey(), null);
                }
            });

            emitCombined();
        };

        updateSelectionCount();

        const throttledUpdate = throttle(updateSelectionCount, 200);

        const cleanupRegister = mergeRegister(
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                throttledUpdate();
                return false;
            }, COMMAND_PRIORITY_LOW),
            editor.registerUpdateListener(() => {
                throttledUpdate();
            })
        );

        return () => {
            throttledUpdate.cancel();
            cleanupRegister();
            counts.delete(editor.getKey());

            if (!editor._parentEditor) {
                onSelectionWordCountChangeRef.current = null;
            }
        };
    }, [editor, onChange, onSelectionWordCountChangeRef, selectionWordCountsRef]);
};

export default SelectionWordCountPlugin;
