import React from 'react';
import {$createParagraphNode, $getRoot, $isDecoratorNode} from 'lexical';
import {$canShowPlaceholder} from '@lexical/text';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$selectDecoratorNode} from '../utils/$selectDecoratorNode';

// used to register a minimal API for controlling the editor from the consuming app
// designed to allow typical behaviours without the consuming app needing to bundle the lexical library
export const ExternalControlPlugin = ({registerAPI}) => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        if (!registerAPI) {
            return;
        }

        const API = {
            // give access to the editor instance so the Lexical API can be used directly if needed
            editorInstance: editor,
            // simplified API methods for typical consumer app actions
            editorIsEmpty() {
                let isEmpty;
                editor.update(() => {
                    isEmpty = $canShowPlaceholder(false, true);
                });
                return isEmpty;
            },
            focusEditor({position = 'bottom'} = {}) {
                const editorFocusOptions = {
                    defaultSelection: position === 'top' ? 'rootStart' : null
                };

                editor.focus(() => {}, editorFocusOptions);

                if (position === 'top') {
                    // Lexical does not automatically select a decorator node
                    editor.update(() => {
                        const root = $getRoot();
                        const firstChild = root.getFirstChild();

                        if ($isDecoratorNode(firstChild)) {
                            $selectDecoratorNode(firstChild);
                            // selecting a decorator node does not change the
                            // window selection (there's no caret) so we need
                            // to manually move focus to the editor element
                            editor.getRootElement().focus();
                        }
                    });
                }
            },
            blurEditor() {
                editor.blur();
            },
            insertParagraphAtTop({focus = true} = {}) {
                editor.update(() => {
                    const paragraphNode = $createParagraphNode();
                    const [firstChild] = $getRoot().getChildren();
                    firstChild.insertBefore(paragraphNode);

                    if (focus) {
                        paragraphNode.selectStart();
                    }
                });
            }
        };

        registerAPI(API);

        return () => {
            registerAPI?.(null);
        };
    }, [editor, registerAPI]);
};
