import React from 'react';
import {$createAsideNode, $isAsideNode} from '../nodes/AsideNode';
import {$createCodeBlockNode} from '../nodes/CodeBlockNode';
import {$createEmbedNode} from '../nodes/EmbedNode';
import {$createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode} from '@lexical/rich-text';
import {$createLinkNode} from '@lexical/link';
import {
    $createNodeSelection,
    $createParagraphNode,
    $createTextNode,
    $getNodeByKey,
    $getRoot,
    $getSelection,
    $insertNodes,
    $isDecoratorNode,
    $isElementNode,
    $isNodeSelection,
    $isParagraphNode,
    $isRangeSelection,
    $isTextNode,
    $setSelection,
    COMMAND_PRIORITY_LOW,
    DELETE_LINE_COMMAND,
    INSERT_PARAGRAPH_COMMAND,
    KEY_ARROW_DOWN_COMMAND,
    KEY_ARROW_LEFT_COMMAND,
    KEY_ARROW_RIGHT_COMMAND,
    KEY_ARROW_UP_COMMAND,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    KEY_DOWN_COMMAND,
    KEY_ENTER_COMMAND,
    KEY_ESCAPE_COMMAND,
    KEY_MODIFIER_COMMAND,
    KEY_TAB_COMMAND,
    PASTE_COMMAND,
    createCommand
} from 'lexical';
import {$insertAndSelectNode} from '../utils/$insertAndSelectNode';
import {
    $isAtStartOfDocument,
    $isAtTopOfNode,
    $selectDecoratorNode,
    getTopLevelNativeElement
} from '../utils/';
import {$isKoenigCard, ImageNode} from '@tryghost/kg-default-nodes';
import {$isListItemNode, $isListNode, ListNode} from '@lexical/list';
import {$setBlocksType} from '@lexical/selection';
import {MIME_TEXT_HTML, MIME_TEXT_PLAIN, PASTE_MARKDOWN_COMMAND} from './MarkdownPastePlugin.jsx';
import {mergeRegister} from '@lexical/utils';
import {shouldIgnoreEvent} from '../utils/shouldIgnoreEvent';
import {useKoenigSelectedCardContext} from '../context/KoenigSelectedCardContext';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export const INSERT_CARD_COMMAND = createCommand('INSERT_CARD_COMMAND');
export const SELECT_CARD_COMMAND = createCommand('SELECT_CARD_COMMAND');
export const DESELECT_CARD_COMMAND = createCommand('DESELECT_CARD_COMMAND');
export const EDIT_CARD_COMMAND = createCommand('EDIT_CARD_COMMAND');
export const DELETE_CARD_COMMAND = createCommand('DELETE_CARD_COMMAND');
export const PASTE_LINK_COMMAND = createCommand('PASTE_LINK_COMMAND');

const RANGE_TO_ELEMENT_BOUNDARY_THRESHOLD_PX = 10;

function $selectCard(editor, nodeKey, focusEditor = true) {
    const selection = $createNodeSelection();
    selection.add(nodeKey);
    $setSelection(selection);

    // selecting a decorator node does not change the
    // window selection (there's no caret) so we need
    // to manually move focus to the editor element
    if (focusEditor) {
        editor.getRootElement().focus();
    }
}

// remove empty cards when they are deselected
function $deselectCard(editor, nodeKey) {
    const cardNode = $getNodeByKey(nodeKey);
    if (cardNode?.isEmpty?.()) {
        $removeOrReplaceNodeWithParagraph(editor, cardNode);
    }
}

function $removeOrReplaceNodeWithParagraph(editor, node) {
    if ($getRoot().getLastChild().is(node)) {
        const paragraph = $createParagraphNode();
        $getRoot().append(paragraph);
        paragraph.select();
    } else {
        const nextNode = node.getNextSibling();
        if ($isDecoratorNode(nextNode)) {
            $selectDecoratorNode(nextNode);
            // selecting a decorator node does not change the
            // window selection (there's no caret) so we need
            // to manually move focus to the editor element
            editor.getRootElement().focus();
        } else {
            nextNode.selectStart();
        }
    }

    node.remove();
}

function useKoenigBehaviour({editor, containerElem, cursorDidExitAtTop, isNested}) {
    const {
        selectedCardKey,
        setSelectedCardKey,
        isEditingCard,
        setIsEditingCard
    } = useKoenigSelectedCardContext();

    const isShiftPressed = React.useRef(false);

    React.useEffect(() => {
        const keyDown = (event) => {
            isShiftPressed.current = event.shiftKey;
        };

        const keyUp = (event) => {
            isShiftPressed.current = event.shiftKey;
        };

        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);

        return () => {
            document.removeEventListener('keydown', keyDown);
            document.removeEventListener('keyup', keyUp);
        };
    }, []);

    // deselect cards on mousedown outside of the editor container
    React.useEffect(() => {
        const onMousedown = (event) => {
            if (!document.body.contains(event.target)) {
                // The event target is no longer in the DOM
                // This is possible if we have listeners in the capture phase of the event (e.g. dropdowns)
                return;
            }

            if (containerElem.current && !containerElem.current.contains(event.target)) {
                editor.update(() => {
                    const selection = $getSelection();

                    if ($isNodeSelection(selection)) {
                        $setSelection(null);
                    }
                }, {tag: 'history-merge'});
            }
        };

        if (!isNested) {
            window.addEventListener('mousedown', onMousedown);
        }

        return () => {
            window.removeEventListener('mousedown', onMousedown);
        };
    }, [editor, containerElem, isNested]);

    // Override built-in keyboard movement around card (DecoratorNode) boundaries,
    // cards should be selected on up/down and when deleting content around them.
    // Trigger `cursorDidExitAtTop` prop if present and cursor at beginning of doc
    React.useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({editorState, tags}) => {
                // ignore updates triggered by other users or by card node exportJSON calls
                if (tags.has('collaboration') || tags.has('card-export')) {
                    return;
                }

                // ignore selections inside of nested editors otherwise we'll
                // mistakenly deselect the card containing the nested editor
                if (isNested || document.activeElement.closest('[data-lexical-decorator]')) {
                    return;
                }

                // trigger card selection/deselection when selection changes
                const {isCardSelected, cardKey, cardNode} = editorState.read(() => {
                    const selection = $getSelection();

                    const hasCardSelection = $isNodeSelection(selection) &&
                        selection.getNodes().length === 1 &&
                        $isKoenigCard(selection.getNodes()[0]);

                    if (hasCardSelection) {
                        const selectedNode = selection.getNodes()[0];
                        return {isCardSelected: true, cardKey: selectedNode.getKey(), cardNode: selectedNode};
                    } else {
                        return {isCardSelected: false};
                    }
                });

                if (isCardSelected && !selectedCardKey) {
                    setSelectedCardKey(cardKey);
                    setIsEditingCard(false);
                } else if (isCardSelected && selectedCardKey !== cardKey) {
                    editor.update(() => {
                        $deselectCard(editor, selectedCardKey);

                        setSelectedCardKey(cardKey);
                        setIsEditingCard(false);
                    }, {tag: 'history-merge'});
                }

                if (!isCardSelected && selectedCardKey) {
                    editor.update(() => {
                        $deselectCard(editor, selectedCardKey);

                        setSelectedCardKey(null);
                        setIsEditingCard(false);
                    }, {tag: 'history-merge'});
                }

                // we have special-case cards that are inserted via markdown
                // expansions where we can't use editor commands to open in
                // edit mode so we handle that here instead
                if (isCardSelected && cardNode.__openInEditMode) {
                    editor.update(() => {
                        cardNode.clearOpenInEditMode();
                    }, {tag: 'history-merge'});

                    setIsEditingCard(true);
                }
            }),
            editor.registerCommand(
                INSERT_CARD_COMMAND,
                ({cardNode, openInEditMode}) => {
                    let focusNode;

                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        focusNode = selection.focus.getNode();
                    } else if ($isNodeSelection(selection)) {
                        focusNode = selection.getNodes()[0];
                    } else {
                        return false;
                    }

                    if (focusNode !== null) {
                        $insertAndSelectNode({selectedNode: focusNode, newNode: cardNode});

                        setSelectedCardKey(cardNode.getKey());

                        if (openInEditMode) {
                            setIsEditingCard(true);
                        }
                    }

                    return true;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                SELECT_CARD_COMMAND,
                ({cardKey, focusEditor}) => {
                    // already selected, delete if empty as we're exiting edit mode
                    if (selectedCardKey === cardKey && isEditingCard) {
                        const cardNode = $getNodeByKey(cardKey);
                        if (cardNode.isEmpty?.()) {
                            editor.dispatchCommand(DELETE_CARD_COMMAND, {cardKey});
                            return true;
                        }
                    }

                    if (selectedCardKey && selectedCardKey !== cardKey) {
                        $deselectCard(editor, selectedCardKey);
                    }

                    $selectCard(editor, cardKey, focusEditor);

                    setSelectedCardKey(cardKey);
                    setIsEditingCard(false);
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                EDIT_CARD_COMMAND,
                ({cardKey, focusEditor}) => {
                    if (selectedCardKey && selectedCardKey !== cardKey) {
                        $deselectCard(editor, selectedCardKey);
                    }
                    $selectCard(editor, cardKey, focusEditor);

                    setSelectedCardKey(cardKey);

                    const cardNode = $getNodeByKey(cardKey);
                    if (cardNode.hasEditMode?.()) {
                        setIsEditingCard(true);
                    }
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                DESELECT_CARD_COMMAND,
                ({cardKey}) => {
                    $deselectCard(editor, cardKey);

                    setSelectedCardKey(null);
                    setIsEditingCard(false);
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                DELETE_CARD_COMMAND,
                ({cardKey, direction = 'forward'}) => {
                    const cardNode = $getNodeByKey(cardKey);
                    const previousSibling = cardNode.getPreviousSibling();
                    const nextSibling = cardNode.getNextSibling();

                    if (direction === 'backward' && previousSibling) {
                        if (previousSibling.selectEnd) {
                            previousSibling.selectEnd();
                        } else if ($isDecoratorNode(previousSibling)) {
                            const nodeSelection = $createNodeSelection();
                            nodeSelection.add(previousSibling.getKey());
                            $setSelection(nodeSelection);
                        } else {
                            cardNode.selectPrevious();
                        }
                    } else if (nextSibling) {
                        if (nextSibling.selectStart) {
                            nextSibling.selectStart();
                        } else if ($isDecoratorNode(nextSibling)) {
                            const nodeSelection = $createNodeSelection();
                            nodeSelection.add(nextSibling.getKey());
                            $setSelection(nodeSelection);
                        } else {
                            cardNode.selectNext();
                        }
                    } else {
                        // ensure we still have a paragraph if the deleted card was the only node
                        const paragraph = $createParagraphNode();
                        $getRoot().append(paragraph);
                        paragraph.select();
                    }

                    cardNode.remove();

                    // ensure focus moves back to the editor if we lost it by selecting a card
                    editor.getRootElement().focus();

                    return true;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_DOWN_COMMAND,
                (event) => {
                    // Avoid processing custom commands when inside a card's editor.
                    // This also prevents Lexical calling event.preventDefault on
                    // cut/copy/paste events letting the browser/inner editors do their thing
                    if (shouldIgnoreEvent(event)) {
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_ENTER_COMMAND,
                (event) => {
                    // toggle edit mode if a card is selected and ctrl/cmd+enter is pressed
                    if (selectedCardKey && (event.metaKey || event.ctrlKey)) {
                        const cardNode = $getNodeByKey(selectedCardKey);

                        if (cardNode.hasEditMode?.()) {
                            event.preventDefault();

                            // when leaving edit mode, ensure focus moves back to the editor
                            // otherwise focus can be left on removed elements preventing further key events
                            if (isEditingCard) {
                                editor.getRootElement().focus({preventScroll: true});

                                if (cardNode.isEmpty?.()) {
                                    if ($getRoot().getLastChild().is(cardNode)) {
                                        // we don't have anything to select after the card, so create a new paragraph
                                        const paragraph = $createParagraphNode();
                                        $getRoot().append(paragraph);
                                        paragraph.select();
                                    } else {
                                        // select the next paragraph or card
                                        editor.dispatchCommand(KEY_ARROW_DOWN_COMMAND);
                                    }

                                    cardNode.remove();
                                } else {
                                    // re-create the node selection because the focus will place the cursor at
                                    // the beginning of the doc
                                    $selectCard(editor, selectedCardKey);
                                }

                                setIsEditingCard(false);
                            } else {
                                setIsEditingCard(true);
                            }

                            return true;
                        }
                    }

                    // let the browser handle selection when in a card inner element (e.g. nested editor)
                    // NOTE: must come after ctrl/cmd+enter because that always toggles no matter the selection
                    if (!event._fromNested && document.activeElement !== editor.getRootElement()) {
                        return true;
                    }

                    // if a card is selected, insert a new paragraph after it
                    if (!isNested && selectedCardKey) {
                        event.preventDefault();
                        const cardNode = $getNodeByKey(selectedCardKey);
                        const paragraphNode = $createParagraphNode();
                        cardNode.getTopLevelElementOrThrow().insertAfter(paragraphNode);
                        paragraphNode.select();
                        return true;
                    }

                    // code card shortcut
                    if (!isNested) {
                        const selection = $getSelection();
                        const currentNode = selection.getNodes()[0];
                        if ($isTextNode(currentNode)) {
                            const textContent = currentNode.getTextContent();
                            if (textContent.match(/^```(\w{1,10})?/)) {
                                event.preventDefault();
                                const language = textContent.replace(/^```/,'');
                                const replacementNode = currentNode.getTopLevelElement().insertAfter($createCodeBlockNode({language, _openInEditMode: true}));
                                currentNode.getTopLevelElement().remove();

                                // select node when replacing so it immediately renders in editing mode
                                const replacementSelection = $createNodeSelection();
                                replacementSelection.add(replacementNode.getKey());
                                $setSelection(replacementSelection);
                                return true;
                            }
                        }
                    }
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_ARROW_UP_COMMAND,
                (event) => {
                    // stick to default behaviour if a selection is being made
                    if (event?.shiftKey) {
                        return false;
                    }

                    // if we're in a nested editor, we need to move selection back to the parent editor
                    if (event?._fromCaptionEditor) {
                        $selectCard(editor, selectedCardKey);
                    }

                    // avoid processing card behaviours when an inner element has focus (e.g. nested editors)
                    if (document.activeElement !== editor.getRootElement()) {
                        return true;
                    }

                    const selection = $getSelection();

                    if ($isNodeSelection(selection)) {
                        const currentNode = selection.getNodes()[0];
                        const previousSibling = currentNode.getPreviousSibling();

                        if (!previousSibling && cursorDidExitAtTop) {
                            selection.clear();
                            cursorDidExitAtTop();
                            return true;
                        }

                        if ($isDecoratorNode(previousSibling)) {
                            $selectDecoratorNode(previousSibling);
                            return true;
                        }

                        // move cursor to end of previous node
                        event.preventDefault();
                        previousSibling.selectEnd();
                        return true;
                    }

                    if ($isRangeSelection(selection)) {
                        if (selection.isCollapsed()) {
                            const topLevelElement = selection.anchor.getNode().getTopLevelElement();
                            const nativeSelection = window.getSelection();

                            if (cursorDidExitAtTop && $isAtStartOfDocument(selection)) {
                                cursorDidExitAtTop();
                                return true;
                            }

                            // empty paragraphs are odd because the native range won't
                            // have a rect to compare positioning
                            const onEmptyNode =
                                topLevelElement?.getTextContent().trim() === '' &&
                                selection.anchor.offset === 0;

                            const atStartOfElement =
                                selection.anchor.offset === 0 &&
                                selection.focus.offset === 0;

                            if (onEmptyNode || atStartOfElement) {
                                const previousSibling = topLevelElement.getPreviousSibling();
                                if ($isDecoratorNode(previousSibling)) {
                                    $selectDecoratorNode(previousSibling);
                                    return true;
                                }
                            } else {
                                const atTopOfNode = $isAtTopOfNode(nativeSelection, RANGE_TO_ELEMENT_BOUNDARY_THRESHOLD_PX);
                                if (atTopOfNode) {
                                    const previousSibling = topLevelElement.getPreviousSibling();
                                    if ($isDecoratorNode(previousSibling)) {
                                        $selectDecoratorNode(previousSibling);
                                        return true;
                                    }
                                }
                            }
                        }
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_ARROW_DOWN_COMMAND,
                (event) => {
                    // stick to default behaviour if shift key is pressed
                    if (event?.shiftKey) {
                        return false;
                    }

                    // if we're in a nested editor, we need to move selection back to the parent editor
                    if (event?._fromCaptionEditor) {
                        $selectCard(editor, selectedCardKey);
                    }

                    // avoid processing card behaviours when an inner element has focus (e.g. nested editors)
                    if (document.activeElement !== editor.getRootElement()) {
                        return true;
                    }

                    const selection = $getSelection();

                    if ($isNodeSelection(selection)) {
                        const currentNode = selection.getNodes()[0];
                        const nextSibling = currentNode.getNextSibling();

                        // create a new paragraph and select it if selected card is at end of document
                        if (!nextSibling) {
                            const paragraph = $createParagraphNode();
                            currentNode.insertAfter(paragraph);
                            paragraph.select();
                            return true;
                        }

                        // if next sibling is a card, select it (default Lexical behaviour skips over cards)
                        if ($isDecoratorNode(nextSibling)) {
                            $selectDecoratorNode(nextSibling);
                            return true;
                        }

                        // move cursor to end of previous node
                        event?.preventDefault();
                        nextSibling.selectStart();
                        return true;
                    }

                    if ($isRangeSelection(selection)) {
                        if (selection.isCollapsed()) {
                            const topLevelElement = selection.anchor.getNode().getTopLevelElement();
                            const nativeSelection = window.getSelection();
                            const nativeTopLevelElement = getTopLevelNativeElement(nativeSelection.anchorNode);

                            // empty paragraphs are odd because the native range won't
                            // have a rect to compare positioning
                            const onEmptyNode =
                                topLevelElement?.getTextContent().trim() === '' &&
                                selection.anchor.offset === 0;

                            const atEndOfElement =
                                nativeSelection.rangeCount !== 0 &&
                                nativeSelection.anchorNode === nativeTopLevelElement &&
                                nativeSelection.anchorOffset === nativeTopLevelElement.children.length - 1 &&
                                nativeSelection.focusOffset === nativeTopLevelElement.children.length - 1;

                            if (onEmptyNode || atEndOfElement) {
                                const nextSibling = topLevelElement.getNextSibling();
                                if ($isDecoratorNode(nextSibling)) {
                                    $selectDecoratorNode(nextSibling);
                                    return true;
                                }
                            } else {
                                const range = nativeSelection.getRangeAt(0).cloneRange();
                                const rects = range.getClientRects();

                                if (rects.length > 0) {
                                    // rects.length will be 2 if at the start/end of a line and we should default to the new/second line for
                                    //  determining if a card is below the cursor
                                    const rangeRect = rects.length > 1 ? rects[1] : rects[0];
                                    const elemRect = nativeTopLevelElement.getBoundingClientRect();

                                    if (Math.abs(rangeRect.bottom - elemRect.bottom) < RANGE_TO_ELEMENT_BOUNDARY_THRESHOLD_PX) {
                                        const nextSibling = topLevelElement.getNextSibling();
                                        // console.log(`nextSibling`,nextSibling)
                                        if ($isDecoratorNode(nextSibling)) {
                                            $selectDecoratorNode(nextSibling);
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_ARROW_LEFT_COMMAND,
                (event) => {
                    // avoid processing card behaviours when an inner element has focus
                    if (document.activeElement !== editor.getRootElement()) {
                        return true;
                    }

                    const selection = $getSelection();

                    if (cursorDidExitAtTop) {
                        if ($isNodeSelection(selection)) {
                            const currentNode = selection.getNodes()[0];
                            const previousSibling = currentNode.getPreviousSibling();

                            if (!previousSibling) {
                                event.preventDefault();
                                selection.clear();
                                cursorDidExitAtTop?.();
                                return true;
                            }
                        } else if ($isAtStartOfDocument(selection)) {
                            event.preventDefault();
                            cursorDidExitAtTop();
                            return true;
                        }
                    }

                    if (!$isNodeSelection(selection)) {
                        return false;
                    }

                    const firstNode = selection.getNodes()[0];
                    const topLevelElement = firstNode.getTopLevelElement();
                    const previousSibling = topLevelElement.getPreviousSibling();

                    if ($isDecoratorNode(previousSibling)) {
                        event.preventDefault();
                        $selectDecoratorNode(previousSibling);
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_ARROW_RIGHT_COMMAND,
                (event) => {
                    // avoid processing card behaviours when an inner element has focus
                    if (document.activeElement !== editor.getRootElement()) {
                        return true;
                    }

                    const selection = $getSelection();

                    if (!$isNodeSelection(selection)) {
                        return false;
                    }

                    const selectedNodes = selection.getNodes();
                    const lastNode = selectedNodes[selectedNodes.length - 1];
                    const topLevelElement = lastNode.getTopLevelElement();
                    const nextSibling = topLevelElement.getNextSibling();

                    if ($isDecoratorNode(nextSibling)) {
                        event.preventDefault();
                        $selectDecoratorNode(nextSibling);
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_MODIFIER_COMMAND,
                (event) => {
                    const {ctrlKey, metaKey, code, key} = event;
                    const isArrowUp = key === 'ArrowUp' || event.keyCode === 38;
                    const isArrowDown = key === 'ArrowDown' || event.keyCode === 40;

                    if (metaKey && (isArrowUp || isArrowDown)) {
                        const selection = $getSelection();
                        const isNodeSelected = $isNodeSelection(selection);
                        const hasCardAtStart = $isDecoratorNode($getRoot().getFirstChild());
                        const hasCardAtEnd = $isDecoratorNode($getRoot().getLastChild());

                        if (isNodeSelected || hasCardAtStart || hasCardAtEnd) {
                            // meta+down on macos moves cursor to end of document
                            if (isArrowDown) {
                                event.preventDefault();

                                const lastNode = $getRoot().getLastChild();

                                if ($isDecoratorNode(lastNode)) {
                                    $selectDecoratorNode(lastNode);
                                    return true;
                                } else {
                                    lastNode.selectEnd();
                                    return true;
                                }
                            }

                            // meta+up on macos moves cursor to start of document
                            if (isArrowUp) {
                                event.preventDefault();

                                const firstNode = $getRoot().getFirstChild();

                                if ($isDecoratorNode(firstNode)) {
                                    $selectDecoratorNode(firstNode);
                                    return true;
                                } else {
                                    firstNode.selectStart();
                                    return true;
                                }
                            }
                        }
                    }

                    // TODO: does this need ctrlKey too for windows support?
                    if (metaKey && code === 'KeyA') {
                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            const root = $getRoot();
                            const firstNode = root.getFirstChildOrThrow();
                            const lastNode = root.getLastChildOrThrow();

                            if (firstNode && lastNode) {
                                if (!$isDecoratorNode(firstNode) && !firstNode.isEmpty()) {
                                    const firstChild = firstNode.getFirstChild();
                                    if ($isTextNode(firstChild)) {
                                        selection.anchor.set(firstChild.getKey(), 0, 'text');
                                    }
                                } else {
                                    selection.anchor.set('root', 0, 'element');
                                }

                                if (!$isDecoratorNode(lastNode) && !lastNode.isEmpty()) {
                                    const lastChild = lastNode.getLastChild();
                                    if ($isTextNode(lastChild)) {
                                        selection.focus.set(
                                            lastChild.getKey(),
                                            lastChild.getTextContentSize(),
                                            'text',
                                        );
                                    }
                                } else {
                                    selection.focus.set(
                                        'root',
                                        lastNode.getIndexWithinParent() + 1,
                                        'element',
                                    );
                                }
                                event.preventDefault();
                                return true;
                            }
                        }
                    }

                    if (ctrlKey && code === 'KeyQ') {
                        // avoid quit behaviour
                        event.preventDefault();

                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            const firstNode = selection.anchor.getNode().getTopLevelElement();

                            if ($isParagraphNode(firstNode)) {
                                $setBlocksType(selection, () => $createQuoteNode());
                            } else if ($isQuoteNode(firstNode)) {
                                $setBlocksType(selection, () => $createAsideNode());
                            } else if ($isAsideNode(firstNode)) {
                                $setBlocksType(selection, () => $createParagraphNode());
                            }
                        }
                    }

                    if ((metaKey || ctrlKey) && code === 'KeyH') {
                        // avoid hide behaviour
                        event.preventDefault();

                        const selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            const firstNode = selection.anchor.getNode().getTopLevelElement();

                            if ($isParagraphNode(firstNode)) {
                                $setBlocksType(selection, () => $createHeadingNode('h2'));
                            } else if ($isHeadingNode(firstNode)) {
                                const tag = firstNode.getTag();
                                const level = parseInt(tag.slice(1), 10);
                                const newLevel = level + 1;

                                if (newLevel > 6) {
                                    $setBlocksType(selection, () => $createParagraphNode());
                                } else {
                                    $setBlocksType(selection, () => $createHeadingNode(`h${newLevel}`));
                                }
                            }
                        }
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            // backspace when card isn't selected
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                (event) => {
                    // avoid processing card behaviours when an inner element has focus
                    if (document.activeElement !== editor.getRootElement()) {
                        return true;
                    }

                    // delete selected card if we have one
                    if (!isNested && selectedCardKey) {
                        event.preventDefault();
                        editor.dispatchCommand(DELETE_CARD_COMMAND, {cardKey: selectedCardKey, direction: 'backward'});
                        return true;
                    }

                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        if (selection.isCollapsed()) {
                            const anchor = selection.anchor;
                            const anchorNode = anchor.getNode();
                            const topLevelElement = anchorNode.getTopLevelElement();
                            const previousSibling = topLevelElement.getPreviousSibling();

                            const atStartOfElement =
                                selection.anchor.offset === 0 &&
                                selection.focus.offset === 0;

                            // convert empty top level list items to paragraphs
                            if (
                                atStartOfElement &&
                                $isListItemNode(anchorNode) &&
                                anchorNode.getIndent() === 0 &&
                                anchorNode.isEmpty()
                            ) {
                                event.preventDefault();
                                editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND);
                                return true;
                            }

                            // delete empty paragraphs and select card if preceded by card
                            if ($isParagraphNode(anchorNode) && anchorNode.isEmpty() && $isDecoratorNode(previousSibling)) {
                                topLevelElement.remove();
                                $selectDecoratorNode(previousSibling);
                                return true;
                            }

                            // convert populated top level list items to paragraphs when cursor is at beginning
                            if (atStartOfElement && $isListItemNode(anchorNode.getParent())) {
                                const listItemNode = anchorNode.getParent();
                                if (listItemNode.getIndent() === 0) {
                                    event.preventDefault();
                                    const paragraphNode = $createParagraphNode();
                                    paragraphNode.append(...listItemNode.getChildren());
                                    listItemNode.replace(paragraphNode);
                                    return true;
                                }
                            }

                            // delete any previous card keeping caret in place
                            if (atStartOfElement && $isDecoratorNode(previousSibling)) {
                                event.preventDefault();
                                previousSibling.remove();
                                return true;
                            }
                        }
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_DELETE_COMMAND,
                (event) => {
                    // avoid processing card behaviours when an inner element has focus
                    if (document.activeElement !== editor.getRootElement()) {
                        return true;
                    }

                    // delete selected card if we have one
                    if (selectedCardKey) {
                        event.preventDefault();
                        editor.dispatchCommand(DELETE_CARD_COMMAND, {cardKey: selectedCardKey, direction: 'forward'});
                        return true;
                    }

                    // handle card selection around card boundaries
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        if (selection.isCollapsed()) {
                            const anchor = selection.anchor;
                            const anchorNode = anchor.getNode();
                            const topLevelElement = anchorNode.getTopLevelElement();
                            const nextSibling = topLevelElement.getNextSibling();

                            const onEmptyNode =
                                topLevelElement?.getTextContent().trim() === '' &&
                                selection.anchor.offset === 0;

                            if (onEmptyNode && $isDecoratorNode(nextSibling)) {
                                // delete the empty node and select the previous card
                                event.preventDefault();
                                topLevelElement.remove();
                                $selectDecoratorNode(nextSibling);
                                return true;
                            }

                            const atEndOfNode = ((
                                anchor.type === 'element' &&
                                $isElementNode(anchorNode) &&
                                anchor.offset === anchorNode.getChildrenSize()
                            ) || (
                                anchor.type === 'text' &&
                                anchor.offset === anchorNode.getTextContentSize()
                            ));

                            if (atEndOfNode && $isDecoratorNode(nextSibling)) {
                                // delete the card, keeping selection in place
                                event.preventDefault();
                                nextSibling.remove();
                                return true;
                            }
                        }
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                DELETE_LINE_COMMAND,
                (isBackward) => {
                    // delete selected card if it's not a nested editor
                    if (selectedCardKey && document.activeElement === editor.getRootElement() && !isNested) {
                        editor.dispatchCommand(DELETE_CARD_COMMAND, {cardKey: selectedCardKey, direction: isBackward ? 'backward' : 'forward'});
                        return true;
                    }

                    // Avoid deleting a card accidentally:
                    // If a paragraph contains only one line and is next to a card, then by default CMD + Backspace deletes the line + the sibling card
                    // In that case, we avoid using the default `selection.deleteLine()` from Lexical
                    // Instead, we remove the topLevelElement and put the selection on the sibling card
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        if (selection.isCollapsed()) {
                            const anchor = selection.anchor;
                            const anchorNode = anchor.getNode();
                            const topLevelElement = anchorNode.getTopLevelElement();
                            const previousSibling = topLevelElement.getPreviousSibling();
                            const nextSibling = topLevelElement.getNextSibling();
                            const sibling = isBackward ? previousSibling : nextSibling;

                            // Find out if the paragraph contains only one line
                            const nativeSelection = window.getSelection();
                            const isFirstLine = $isAtTopOfNode(nativeSelection, RANGE_TO_ELEMENT_BOUNDARY_THRESHOLD_PX);

                            if ($isDecoratorNode(sibling) && isFirstLine) {
                                topLevelElement.remove();
                                $selectDecoratorNode(sibling);

                                return true;
                            }
                        }
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_TAB_COMMAND,
                (event) => {
                    // avoid processing card behaviours when an inner element has focus
                    if (document.activeElement !== editor.getRootElement()) {
                        return true;
                    }

                    if (event.shiftKey && cursorDidExitAtTop) {
                        const selection = $getSelection();

                        if ($isNodeSelection(selection)) {
                            event.preventDefault();
                            selection.clear();
                            cursorDidExitAtTop();
                            return true;
                        }

                        let nodes;
                        if (selection.isCollapsed()) {
                            const anchorNode = selection.anchor.getNode();
                            nodes = $isTextNode(anchorNode) ? [anchorNode.getParent()] : [anchorNode];
                        } else {
                            nodes = selection.getNodes();
                        }

                        const hasIndentedNode = nodes.some((node) => {
                            return node.getIndent && node.getIndent() > 0;
                        });

                        if (hasIndentedNode) {
                            return false;
                        } else {
                            event.preventDefault();
                            cursorDidExitAtTop();
                            return true;
                        }
                    }

                    // code card shortcut
                    if (!isNested) {
                        const selection = $getSelection();
                        const currentNode = selection.getNodes()[0];
                        if ($isTextNode(currentNode)) {
                            const textContent = currentNode.getTextContent();
                            if (textContent.match(/^```(\w{1,10})?/)) {
                                event.preventDefault();
                                const language = textContent.replace(/^```/,'');
                                const replacementNode = currentNode.getTopLevelElement().insertAfter($createCodeBlockNode({language, _openInEditMode: true}));
                                currentNode.getTopLevelElement().remove();

                                // select node when replacing so it immediately renders in editing mode
                                const replacementSelection = $createNodeSelection();
                                replacementSelection.add(replacementNode.getKey());
                                $setSelection(replacementSelection);
                                return true;
                            }
                        }
                    }
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_ESCAPE_COMMAND,
                (event) => {
                    event.preventDefault();

                    if (selectedCardKey && isEditingCard) {
                        (editor._parentEditor || editor).dispatchCommand(SELECT_CARD_COMMAND, {cardKey: selectedCardKey});
                    }
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                PASTE_COMMAND,
                (clipboard) => {
                    // avoid Koenig behaviours when an inner element (e.g. a card input) has focus and event wasn't triggered from nested editor
                    if (document.activeElement !== editor.getRootElement() && !isNested) {
                        return false;
                    }

                    const text = clipboard?.clipboardData?.getData(MIME_TEXT_PLAIN);
                    const html = clipboard?.clipboardData?.getData(MIME_TEXT_HTML);
                    const linkMatch = text?.match(/^(https?:\/\/[^\s]+)$/); // replace with better regex to include more protocols like mailto, ftp, etc

                    if (linkMatch) {
                        editor.dispatchCommand(PASTE_LINK_COMMAND, {linkMatch});

                        return true;
                    }

                    if (text && !html) {
                        editor.dispatchCommand(PASTE_MARKDOWN_COMMAND, {text, allowBr: true});

                        return true;
                    }
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                PASTE_LINK_COMMAND,
                ({linkMatch}) => {
                    const selection = $getSelection();
                    const selectionContent = selection.getTextContent();
                    const node = selection.anchor.getNode();
                    const nodeContent = node.getTextContent();

                    if (selectionContent.length > 0) {
                        const link = linkMatch[1];
                        if ($isRangeSelection(selection)) {
                            const textNode = selection.extract()[0];
                            const linkNode = $createLinkNode(link);
                            const linkTextNode = $createTextNode(selectionContent);
                            linkTextNode.setFormat(textNode.getFormat());
                            linkNode.append(linkTextNode);
                            textNode.replace(linkNode);
                        }
                        return true;
                    }

                    // if a link is pasted in a populated text node or pasted with Shift pressed, insert a link
                    if (nodeContent.length > 0 || isShiftPressed.current === true) {
                        const link = linkMatch[1];
                        const linkNode = $createLinkNode(link);
                        const linkTextNode = $createTextNode(link);
                        linkNode.append(linkTextNode);

                        // add a space after to avoid the rest of the text being linked when inserting
                        // then immediately remove as we don't want the extra space
                        // TODO: raise Lexical bug?
                        const spaceTextNode = $createTextNode(' ');
                        $insertNodes([linkNode, spaceTextNode]);
                        spaceTextNode.remove();

                        return true;
                    }

                    // if a link is pasted in a blank text node, insert an embed card (may turn into bookmark)
                    if (selectionContent.length === 0 && nodeContent.length === 0) {
                        const url = linkMatch[1];
                        const embedNode = $createEmbedNode({url});
                        editor.dispatchCommand(INSERT_CARD_COMMAND, {cardNode: embedNode, createdWithUrl: true});
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    });

    // merge list nodes of the same type when next to each other
    React.useEffect(() => {
        // not all editors have lists (e.g. caption inputs) and registering a transform
        // for a node that isn't loaded in the editor will throw an error
        if (!editor.hasNodes([ListNode])) {
            return;
        }

        return mergeRegister(
            editor.registerNodeTransform(ListNode, (node) => {
                const nextSibling = node.getNextSibling();

                if ($isListNode(nextSibling) && nextSibling.getListType() === node.getListType()) {
                    node.append(...nextSibling.getChildren());
                    nextSibling.remove();
                }
            })
        );
    }, [editor]);

    React.useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            return;
        }
        return mergeRegister(
            // make sure ImageNode is a top-level node
            editor.registerNodeTransform(ImageNode, (node) => {
                // return if ImageNode is already a top-level node
                if (node.getParent() === $getRoot()) {
                    return;
                }

                let parent = node;
                while (parent.getParent() !== $getRoot()) {
                    parent = parent.getParent();
                }

                parent.insertAfter(node);
            })
        );
    }, [editor]);

    return null;
}

export default function KoenigBehaviourPlugin({containerElem = document.querySelector('.koenig-editor'), cursorDidExitAtTop, isNested}) {
    const [editor] = useLexicalComposerContext();
    return useKoenigBehaviour({editor, containerElem, cursorDidExitAtTop, isNested});
}
