import React, {useEffect} from 'react';
import {createPortal} from 'react-dom';
import {
    $getSelection,
    $isRangeSelection,
    $isTextNode,
    COMMAND_PRIORITY_LOW,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND
} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {getSelectedNode} from '../utils/getSelectedNode';
import {setFloatingElemPosition} from '../utils/setFloatingElemPosition';
import {getDOMRangeRect} from '../utils/getDOMRangeRect';
import {getScrollParent} from '../utils/getScrollParent';

import {ReactComponent as BoldIcon} from '../assets/icons/kg-bold.svg';
import {ReactComponent as ItalicIcon} from '../assets/icons/kg-italic.svg';

function FloatingFormatToolbar({editor, anchorElem, isBold, isItalic}) {
    const toolbarRef = React.useRef(null);

    const updateFloatingToolbar = React.useCallback(() => {
        const toolbarElement = toolbarRef.current;

        if (!toolbarElement) {
            return;
        }

        const selection = $getSelection();
        const nativeSelection = window.getSelection();
        const rootElement = editor.getRootElement();

        if (
            selection !== null &&
            nativeSelection !== null &&
            !nativeSelection.isCollapsed &&
            rootElement !== null &&
            rootElement.contains(nativeSelection.anchorNode)
        ) {
            const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
            setFloatingElemPosition(rangeRect, toolbarElement, anchorElem);
        }
    }, [editor, anchorElem]);

    React.useEffect(() => {
        const scrollElement = getScrollParent(anchorElem);

        const update = () => {
            editor.getEditorState().read(() => {
                updateFloatingToolbar();
            });
        };

        window.addEventListener('resize', update);
        if (scrollElement) {
            scrollElement.addEventListener('scroll', update);
        }

        return () => {
            window.removeEventListener('resize', update);
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', update);
            }
        };
    }, [editor, updateFloatingToolbar, anchorElem]);

    React.useEffect(() => {
        editor.getEditorState().read(() => {
            updateFloatingToolbar();
        });

        return mergeRegister(
            editor.registerUpdateListener(({editorState}) => {
                editorState.read(() => {
                    updateFloatingToolbar();
                });
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateFloatingToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, updateFloatingToolbar]);

    return (
        <div className="absolute" ref={toolbarRef}>
            <ul className="text-md m-0 flex items-center justify-evenly rounded bg-black px-1 py-0 font-sans font-normal text-white">
                <li className="m-0 flex p-0 first:m-0">
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center"
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                        aria-label="Format text as bold"
                    >
                        <BoldIcon className={isBold ? 'fill-green' : 'fill-white'} />
                    </button>
                </li>
                <li className="m-0 flex p-0 first:m-0">
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center"
                        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                        aria-label="Format text as italics"
                    >
                        <ItalicIcon className={isItalic ? 'fill-green' : 'fill-white'} />
                    </button>
                </li>
            </ul>
        </div>
    );
}

function useFloatingFormatToolbar(editor, anchorElem) {
    const [isText, setIsText] = React.useState(false); // eslint-disable-line
    const [isBold, setIsBold] = React.useState(false); // eslint-disable-line
    const [isItalic, setIsItalic] = React.useState(false); // eslint-disable-line

    const updatePopup = React.useCallback(() => {
        editor.getEditorState().read(() => {
            // Should not to pop up the floating toolbar when using IME input
            if (editor.isComposing()) {
                return;
            }
            const selection = $getSelection();
            const nativeSelection = window.getSelection();
            const rootElement = editor.getRootElement();

            if (
                nativeSelection !== null &&
                (
                    !$isRangeSelection(selection) ||
                    rootElement === null ||
                    !rootElement.contains(nativeSelection.anchorNode)
                )
            ) {
                setIsText(false);
                return;
            }

            if (!$isRangeSelection(selection)) {
                // TODO: what is RangeSelection?
                return;
            }

            const node = getSelectedNode(selection);

            // update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));

            if (selection.getTextContent() !== '') {
                setIsText($isTextNode(node));
            } else {
                setIsText(false);
            }
        });
    }, [editor]);

    useEffect(() => {
        document.addEventListener('selectionchange', updatePopup);
        return () => {
            document.removeEventListener('selectionchange', updatePopup);
        };
    }, [updatePopup]);

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            updatePopup();
        });
    }, [editor, updatePopup]);

    if (!isText) {
        return;
    }

    return createPortal(
        <FloatingFormatToolbar
            editor={editor}
            anchorElem={anchorElem}
            isBold={isBold}
            isItalic={isItalic}
        />,
        anchorElem
    );
}

export default function FloatingFormatToolbarPlugin({anchorElem = document.body}) {
    const [editor] = useLexicalComposerContext();
    return useFloatingFormatToolbar(editor, anchorElem);
}
