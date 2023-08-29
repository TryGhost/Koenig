import React from 'react';
import {
    $createNodeSelection,
    $getSelection,
    $setSelection,
    BLUR_COMMAND,
    COMMAND_PRIORITY_LOW,
    KEY_ENTER_COMMAND
} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {useKoenigSelectedCardContext} from '../context/KoenigSelectedCardContext';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext.js';

function KoenigNestedEditorPlugin({
    autoFocus,
    focusNext,
    hasSettingsPanel,
    // Enter will focus the next card if this is true
    defaultKoenigEnterBehaviour = false
}) {
    const [editor] = useLexicalComposerContext();
    const {selectedCardKey, isEditingCard} = useKoenigSelectedCardContext();

    // using state here because this component can get re-rendered after the
    // editor's editable state changes so we need to re-focus on re-render
    const [shouldFocus, setShouldFocus] = React.useState(autoFocus);

    React.useEffect(() => {
        // prevent nested editor getting focus when undoing card deletion
        if (!isEditingCard) {
            return;
        }

        if (shouldFocus) {
            editor.focus(() => {
                editor.getRootElement().focus({preventScroll: true});
            });
        }
    }, [shouldFocus, editor, isEditingCard]);

    React.useEffect(() => {
        return mergeRegister(
            // watch for editor becoming editable rather than relying on an `isEditing` prop
            // because the prop will change before the contenteditable becomes editable, meaning
            // we try to focus a non-editable editor which puts focus on the main editor instead
            editor.registerEditableListener((isEditable) => {
                if (!autoFocus) {
                    return;
                }

                if (isEditable) {
                    setShouldFocus(true);
                } else {
                    setShouldFocus(false);
                }
            }),
            editor.registerCommand(
                KEY_ENTER_COMMAND,
                (event) => {
                    // let the parent editor handle the edit mode product
                    if (event.metaKey || event.ctrlKey) {
                        event._fromNested = true;
                        editor._parentEditor?.dispatchCommand(KEY_ENTER_COMMAND, event);
                        return true;
                    }

                    // move focus to the next editor if it exists (e.g. from header to content editor)
                    if (focusNext && !event.shiftKey) {
                        event.preventDefault();
                        focusNext.focus(() => {
                            focusNext.getRootElement().focus({preventScroll: true});
                        });
                        return true;
                    }

                    if (defaultKoenigEnterBehaviour) {
                        // allow shift+enter to create a line break
                        if (event.shiftKey) {
                            return false;
                        }

                        // otherwise, let the parent editor handle the enter key
                        // - with ctrl/cmd+enter toggles edit mode
                        // - or creates paragraph after card and moves cursor
                        event._fromNested = true;
                        editor._parentEditor.dispatchCommand(KEY_ENTER_COMMAND, event);

                        // prevent normal/KoenigBehaviourPlugin enter key behaviour
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                BLUR_COMMAND,
                () => {
                    // when the nested editor is selected, the parent editor clears its selection so we need to
                    //   return parent editor selection to the card when the nested editor loses focus
                    if (hasSettingsPanel && editor._parentEditor) {
                        editor._parentEditor.getEditorState().read(() => {
                            editor._parentEditor.update(() => {
                                if (!$getSelection()) {
                                    const selection = $createNodeSelection();
                                    selection.add(selectedCardKey);
                                    $setSelection(selection);
                                }
                            }, {tag: 'history-merge'}); // don't include an undo history entry for this change of selection
                        });

                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, autoFocus, focusNext, selectedCardKey, hasSettingsPanel]);

    return null;
}

export default KoenigNestedEditorPlugin;
