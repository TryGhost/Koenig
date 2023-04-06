import React from 'react';
import {COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND} from 'lexical';
import {KoenigComposableEditor, KoenigNestedComposer, MINIMAL_NODES, MINIMAL_TRANSFORMERS, RestrictContentPlugin} from '../index.js';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const Placeholder = ({text = 'Type here', className}) => {
    return (
        <div className={`${className} opacity-50`}>
            {text}
        </div>
    );
};

// TODO: extract shared behaviour into a `KoenigNestedEditorPlugin` component
function CalloutEditorPlugin({autoFocus}) {
    const [editor] = useLexicalComposerContext();

    // using state here because this component can get re-rendered after the
    // editor's editable state changes so we need to re-focus on re-render
    const [shouldFocus, setShouldFocus] = React.useState(autoFocus);

    React.useEffect(() => {
        if (shouldFocus) {
            editor.focus(() => {
                editor.getRootElement().focus({preventScroll: true});
            });
        }
    }, [shouldFocus, editor]);

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
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, autoFocus]);

    return null;
}

const KoenigHeaderEditor = ({
    paragraphs = 1, 
    placeholderText, 
    className, 
    textEditor
}) => {
    return (
        <KoenigNestedComposer
            initialEditor={textEditor}
            initialNodes={MINIMAL_NODES}
        >
            <KoenigComposableEditor
                className={className}
                disableKoenigStyles={true}
                markdownTransformers={MINIMAL_TRANSFORMERS}
                placeholder={<Placeholder className={className} text={placeholderText} />}
            >
                <CalloutEditorPlugin autoFocus={true} />
                <RestrictContentPlugin paragraphs={paragraphs} />
            </KoenigComposableEditor>
        </KoenigNestedComposer>
    );
};

export default KoenigHeaderEditor;
