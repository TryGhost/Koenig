import React, {useCallback, useContext} from 'react';
import {HtmlOutputPlugin, KoenigComposableEditor, KoenigComposer, MINIMAL_NODES, MINIMAL_TRANSFORMERS, RestrictContentPlugin} from '../index.js';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$setSelection, BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND, KEY_ENTER_COMMAND} from 'lexical';
import CardContext from '../context/CardContext.jsx';
import {mergeRegister} from '@lexical/utils';

const Placeholder = ({text = 'Type here'}) => {
    return (
        <div className="pointer-events-none absolute top-0 left-0 m-0 min-w-full cursor-text font-sans text-sm font-normal tracking-wide text-grey-500 ">
            {text}
        </div>
    );
};

function CaptionPlugin({parentEditor}) {
    const [editor] = useLexicalComposerContext();
    const {setCaptionHasFocus, captionHasFocus} = useContext(CardContext);

    // focus on caption editor when something is typed while card is selected
    const handleKeyDown = useCallback((event) => {
        // only if key is printable key, focus on editor
        if (!captionHasFocus && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            editor.focus();
        }
    }, [editor, captionHasFocus]);

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown, editor]);

    // handle focus/blur and enter key commands
    React.useEffect(
        () => {
            return mergeRegister(
                editor.registerCommand(
                    FOCUS_COMMAND,
                    () => {
                        setCaptionHasFocus(true);
                        return false;
                    },
                    COMMAND_PRIORITY_LOW
                ),
                editor.registerCommand(
                    BLUR_COMMAND,
                    () => {
                        setCaptionHasFocus(false);
                        editor.update(() => {
                            $setSelection(null);
                        });
                        return false;
                    },
                    COMMAND_PRIORITY_LOW
                ),
                editor.registerCommand(
                    KEY_ENTER_COMMAND,
                    (event) => {
                        parentEditor?.dispatchCommand(KEY_ENTER_COMMAND, event);
                        return false;
                    },
                    COMMAND_PRIORITY_LOW
                )
            );
        },
        [editor, setCaptionHasFocus, mainEditor]
    );

    return null;
}

const KoenigCaptionEditor = ({paragraphs = 1, html, setHtml, placeholderText, readOnly}) => {
    const [parentEditor] = useLexicalComposerContext();
    return (
        <KoenigComposer
            nodes={MINIMAL_NODES}
        >
            <KoenigComposableEditor
                className="koenig-lexical-caption"
                markdownTransformers={MINIMAL_TRANSFORMERS}
                placeholder={<Placeholder text={placeholderText} />}
                readOnly={readOnly}
            >
                <CaptionPlugin parentEditor={parentEditor} />
                <RestrictContentPlugin paragraphs={paragraphs} />
                <HtmlOutputPlugin html={html} setHtml={setHtml} />
            </KoenigComposableEditor>
        </KoenigComposer>
    );
};

export default KoenigCaptionEditor;
